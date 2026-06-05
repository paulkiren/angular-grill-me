/**
 * Live coverage matrix — computed from actual question data.
 * Run: npx ts-node -e "import('./src/app/data/coverage-matrix').then(m => m.printCoverageMatrix())"
 * Or import coverageMatrix in a spec to assert minimum coverage thresholds.
 *
 * Never edit the numbers here manually — they are derived from the question files.
 */
import { Question, BloomLevel } from '../models/interview.models';
import { allQuestions, allTopics } from './questions/index';

export type DifficultyLevel = 'Junior' | 'Mid' | 'Senior';

export interface ConceptAreaTarget {
  id: string;
  label: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  mvpTarget: number;      // minimum questions for a credible assessment
  v1Target: number;       // full coverage goal
  roadmapPhase: string;
}

// Source of truth for what coverage SHOULD look like.
// Update targets here as the roadmap evolves — never update question counts by hand.
export const conceptAreaTargets: ConceptAreaTarget[] = [
  { id: 'signals',            label: 'Signals & Reactivity',           priority: 'Critical', mvpTarget: 10, v1Target: 18, roadmapPhase: 'v0.2.0' },
  { id: 'change-detection',   label: 'Change Detection & Performance', priority: 'Critical', mvpTarget: 8,  v1Target: 15, roadmapPhase: 'v0.2.0' },
  { id: 'di',                 label: 'Dependency Injection',           priority: 'Critical', mvpTarget: 10, v1Target: 18, roadmapPhase: 'v0.2.0' },
  { id: 'rxjs',               label: 'RxJS & Reactive Streams',        priority: 'Critical', mvpTarget: 10, v1Target: 18, roadmapPhase: 'v0.2.0' },
  { id: 'routing',            label: 'Routing & Navigation',           priority: 'Critical', mvpTarget: 8,  v1Target: 15, roadmapPhase: 'v0.2.0' },
  { id: 'forms',              label: 'Reactive Forms',                 priority: 'Critical', mvpTarget: 8,  v1Target: 15, roadmapPhase: 'v0.2.0' },
  { id: 'http',               label: 'HTTP & Interceptors',            priority: 'High',     mvpTarget: 6,  v1Target: 12, roadmapPhase: 'v0.2.0' },
  { id: 'standalone',         label: 'Standalone Architecture',        priority: 'High',     mvpTarget: 4,  v1Target: 8,  roadmapPhase: 'v0.2.0' },
  { id: 'directives-pipes',   label: 'Directives & Pipes',            priority: 'High',     mvpTarget: 6,  v1Target: 12, roadmapPhase: 'v0.3.0' },
  { id: 'component-arch',     label: 'Component Architecture',        priority: 'High',     mvpTarget: 6,  v1Target: 12, roadmapPhase: 'v0.3.0' },
  { id: 'testing',            label: 'Testing',                       priority: 'High',     mvpTarget: 6,  v1Target: 12, roadmapPhase: 'v0.3.0' },
  { id: 'ssr',                label: 'SSR & Hydration',               priority: 'Medium',   mvpTarget: 4,  v1Target: 8,  roadmapPhase: 'v0.3.0' },
  { id: 'build',              label: 'Build & Optimization',          priority: 'Medium',   mvpTarget: 4,  v1Target: 8,  roadmapPhase: 'v0.3.0' },
  { id: 'angular-evolution',  label: 'Angular Evolution & Architecture', priority: 'Medium', mvpTarget: 6, v1Target: 10, roadmapPhase: 'v0.3.0' },
  { id: 'angular-migration',  label: 'Angular Migration Strategy',    priority: 'Medium',   mvpTarget: 4,  v1Target: 8,  roadmapPhase: 'v0.3.0' },
  { id: 'a11y-i18n',         label: 'Accessibility & i18n',          priority: 'Low',      mvpTarget: 2,  v1Target: 6,  roadmapPhase: 'v0.4.0' },
];

export interface CoverageRow {
  area: ConceptAreaTarget;
  total: number;
  byDifficulty: Record<DifficultyLevel, number>;
  byBloom: Record<BloomLevel, number>;
  assessmentEligible: number;
  gapToMvp: number;
  gapToV1: number;
  bloomLevelsCovered: number; // how many distinct Bloom levels have at least 1 question
}

export function computeCoverageMatrix(questions: Question[] = allQuestions): CoverageRow[] {
  return conceptAreaTargets.map(area => {
    const qs = questions.filter(q => q.topic === area.id);

    const byDifficulty: Record<DifficultyLevel, number> = { Junior: 0, Mid: 0, Senior: 0 };
    const byBloom: Record<BloomLevel, number> = {
      remember: 0, understand: 0, apply: 0, analyze: 0, evaluate: 0, create: 0
    };

    for (const q of qs) {
      byDifficulty[q.difficulty]++;
      if (q.bloomLevel) byBloom[q.bloomLevel]++;
    }

    const bloomLevelsCovered = Object.values(byBloom).filter(n => n > 0).length;

    return {
      area,
      total: qs.length,
      byDifficulty,
      byBloom,
      assessmentEligible: qs.filter(q => q.assessmentEligible).length,
      gapToMvp: Math.max(0, area.mvpTarget - qs.length),
      gapToV1: Math.max(0, area.v1Target - qs.length),
      bloomLevelsCovered,
    };
  });
}

export function printCoverageMatrix(): void {
  const matrix = computeCoverageMatrix();
  const totalQuestions = allQuestions.length;
  const totalTopics = allTopics.length;

  console.log('\n=== Angular Grill-Me Coverage Matrix ===\n');
  console.log(`Total questions: ${totalQuestions}  |  Topics with content: ${totalTopics}\n`);

  const header = 'Concept Area'.padEnd(34) + 'Pri'.padEnd(10) + 'Have'.padEnd(7) + 'MVP'.padEnd(6) + 'Gap'.padEnd(7) + 'Bloom lvls'.padEnd(12) + 'J/M/S'.padEnd(10) + 'Phase';
  console.log(header);
  console.log('-'.repeat(header.length));

  for (const row of matrix) {
    const { area, total, byDifficulty, bloomLevelsCovered, gapToMvp } = row;
    const status = total === 0 ? '🔴' : gapToMvp > 0 ? '🟡' : '🟢';
    const jms = `${byDifficulty.Junior}/${byDifficulty.Mid}/${byDifficulty.Senior}`;
    console.log(
      `${status} ${area.label.padEnd(32)}${area.priority.padEnd(10)}${String(total).padEnd(7)}${String(area.mvpTarget).padEnd(6)}${String(gapToMvp).padEnd(7)}${String(bloomLevelsCovered) + '/6'.padEnd(12)}${jms.padEnd(10)}${area.roadmapPhase}`
    );
  }

  const critical = matrix.filter(r => r.area.priority === 'Critical');
  const criticalCovered = critical.filter(r => r.gapToMvp === 0).length;
  console.log(`\nCritical areas at MVP coverage: ${criticalCovered}/${critical.length}`);

  const zeroCoverage = matrix.filter(r => r.total === 0);
  if (zeroCoverage.length > 0) {
    console.log(`\n⚠️  Zero-coverage areas (${zeroCoverage.length}): ${zeroCoverage.map(r => r.area.label).join(', ')}`);
  }
}
