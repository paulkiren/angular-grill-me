import { Injectable } from '@angular/core';
import { Question, EvaluationResult, RubricMatcher } from '../models/interview.models';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  /**
   * Main entry point to evaluate candidate answers
   */
  public async evaluateAnswer(
    question: Question,
    candidateAnswer: string,
    geminiApiKey?: string
  ): Promise<EvaluationResult> {
    if (!candidateAnswer || candidateAnswer.trim().length < 5) {
      return {
        score: 0,
        feedback: 'Answer was too short or empty. Please provide a descriptive response to be graded.',
        strengths: [],
        weaknesses: ['Empty answer.'],
        suggestions: ['Formulate a response explaining the concepts behind the question.']
      };
    }

    if (geminiApiKey && geminiApiKey.trim().length > 10) {
      try {
        return await this.evaluateWithGemini(question, candidateAnswer, geminiApiKey);
      } catch (error) {
        console.error('Gemini API evaluation failed, falling back to local expert engine:', error);
      }
    }

    // Fallback: Local dynamic expert evaluation engine
    return this.evaluateOffline(question, candidateAnswer);
  }

  /**
   * Offline evaluation using dynamically loaded question-specific rubrics
   */
  private evaluateOffline(question: Question, answer: string): EvaluationResult {
    // Read the question's own rubric matchers
    const matchers: RubricMatcher[] = [];
    
    if (question.rubricMatchers && question.rubricMatchers.length > 0) {
      matchers.push(...question.rubricMatchers);
    } else {
      // MASTERPIECE FALLBACK: Generate matches dynamically from the static rubrics array
      // if no explicit regex matchers are provided. Highly future-proof!
      question.rubrics.forEach(term => {
        const escaped = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        matchers.push({
          pattern: escaped,
          term,
          label: `Mentioned essential concept: '${term}'`
        });
      });
    }

    const matchedItems: string[] = [];
    const missedItems: string[] = [];
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const suggestions: string[] = [];

    // Analyze rubrics matching dynamically
    matchers.forEach(m => {
      const regex = new RegExp(m.pattern, 'i');
      if (regex.test(answer)) {
        matchedItems.push(m.term);
        strengths.push(m.label);
      } else {
        missedItems.push(m.term);
        weaknesses.push(`Missing key concept: '${m.term}'.`);
      }
    });

    // Score calculation
    // Base score determined by matched rubrics
    const totalRubrics = matchers.length;
    const rubricScore = totalRubrics > 0 ? (matchedItems.length / totalRubrics) * 75 : 40;

    // Length and depth score (up to 25 points)
    const wordsCount = answer.trim().split(/\s+/).length;
    let lengthScore = 0;
    if (wordsCount > 40) lengthScore = 25;
    else if (wordsCount > 20) lengthScore = 15;
    else if (wordsCount > 8) lengthScore = 5;

    const rawScore = Math.min(100, Math.round(rubricScore + lengthScore));

    // Constructing constructive suggestion and feedback
    let feedback = '';
    if (rawScore >= 85) {
      feedback = `Excellent answer! You demonstrated a strong, comprehensive understanding of '${question.title}'. Your response covers key architectural components correctly.`;
    } else if (rawScore >= 60) {
      feedback = `Good answer, but has room for improvement. You hit several core concepts of '${question.title}', but missed some key structural details.`;
    } else {
      feedback = `Your answer touches on some aspects of '${question.title}' but lacks the depth and key terminology required for a professional front-end developer interview.`;
    }

    // Generate suggestions based on missed rubrics
    if (missedItems.length > 0) {
      suggestions.push(`Make sure to explicitly mention and define: ${missedItems.join(', ')}.`);
      if (question.id === 'rx-1') {
        suggestions.push('Explain BehaviorSubject requiring an initial value, and replaying it to late subscribers.');
      } else if (question.id === 'rx-2') {
        suggestions.push('Detail the cancellation behavior of switchMap when a new outer emission occurs.');
      } else if (question.id === 'sig-1') {
        suggestions.push('Highlight the difference between fine-grained signal changes vs heavy observable event streams.');
      }
    } else {
      suggestions.push('Great job! To go even further, provide a quick code snippet demonstrating this in production.');
    }

    return {
      score: rawScore,
      feedback,
      strengths: strengths.length > 0 ? strengths : ['Basic attempt at answering.'],
      weaknesses: weaknesses.length > 0 ? weaknesses : ['No critical conceptual misses identified.'],
      suggestions
    };
  }

  /**
   * Real-time Gemini Generative AI evaluation
   */
  private async evaluateWithGemini(
    question: Question,
    answer: string,
    apiKey: string
  ): Promise<EvaluationResult> {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const prompt = `
You are a highly experienced Senior Principal Frontend Engineer and Technical Architect interviewing candidates for an Angular Frontend Developer position.
Evaluate the candidate's answer for accuracy, technical depth, architectural understanding, and professional terminology.

Question Topic: ${question.topic}
Question Title: ${question.title}
Question Text: ${question.questionText}
Essential Rubrics (must hit these ideas): ${question.rubrics.join(', ')}
Ideal Sample Answer: "${question.sampleAnswer}"

Candidate's Answer: "${answer}"

Provide a detailed evaluation structured STRICTLY as a JSON object matching this schema:
{
  "score": number (an integer from 0 to 100 representing their proficiency),
  "feedback": "string (a warm, professional, highly technical critique summarizing their response)",
  "strengths": ["string", "string", ... (2-3 specific technical points they answered correctly)],
  "weaknesses": ["string", "string", ... (2-3 specific technical points they got wrong, missed, or explained weakly)],
  "suggestions": ["string", "string", ... (2-3 highly actionable tips or study items to improve their answer)]
}

Ensure your response is pure, valid JSON with absolutely NO markdown formatting or surrounding backticks.
`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API responded with status ${response.status}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean any accidental markdown code fences
    const cleanJsonText = textResponse
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const evaluation: EvaluationResult = JSON.parse(cleanJsonText);
    return evaluation;
  }
}
