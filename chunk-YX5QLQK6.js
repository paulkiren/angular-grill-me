import{I as v}from"./chunk-Z33DUSZN.js";var b=class p{async evaluateAnswer(e,t,s){if(!t||t.trim().length<5)return{score:0,feedback:"Answer was too short or empty. Please provide a descriptive response to be graded.",strengths:[],weaknesses:["Empty answer."],suggestions:["Formulate a response explaining the concepts behind the question."]};if(s&&s.trim().length>10)try{return await this.evaluateWithGemini(e,t,s)}catch(a){console.error("Gemini API evaluation failed, falling back to local expert engine:",a)}return this.evaluateOffline(e,t)}evaluateOffline(e,t){let s=[];e.rubricMatchers&&e.rubricMatchers.length>0?s.push(...e.rubricMatchers):e.rubrics.forEach(n=>{let m=n.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&");s.push({pattern:m,term:n,label:`Mentioned essential concept: '${n}'`})});let a=[],o=[],r=[],c=[],i=[];s.forEach(n=>{new RegExp(n.pattern,"i").test(t)?(a.push(n.term),r.push(n.label)):(o.push(n.term),c.push(`Missing key concept: '${n.term}'.`))});let l=s.length,f=l>0?a.length/l*75:40,g=t.trim().split(/\s+/).length,h=0;g>40?h=25:g>20?h=15:g>8&&(h=5);let d=Math.min(100,Math.round(f+h)),u="";return d>=85?u=`Excellent answer! You demonstrated a strong, comprehensive understanding of '${e.title}'. Your response covers key architectural components correctly.`:d>=60?u=`Good answer, but has room for improvement. You hit several core concepts of '${e.title}', but missed some key structural details.`:u=`Your answer touches on some aspects of '${e.title}' but lacks the depth and key terminology required for a professional front-end developer interview.`,o.length>0?(i.push(`Make sure to explicitly mention and define: ${o.join(", ")}.`),e.id==="rx-1"?i.push("Explain BehaviorSubject requiring an initial value, and replaying it to late subscribers."):e.id==="rx-2"?i.push("Detail the cancellation behavior of switchMap when a new outer emission occurs."):e.id==="sig-1"&&i.push("Highlight the difference between fine-grained signal changes vs heavy observable event streams.")):i.push("Great job! To go even further, provide a quick code snippet demonstrating this in production."),{score:d,feedback:u,strengths:r.length>0?r:["Basic attempt at answering."],weaknesses:c.length>0?c:["No critical conceptual misses identified."],suggestions:i}}async evaluateWithGemini(e,t,s){let a=`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${s}`,o=`
You are a highly experienced Senior Principal Frontend Engineer and Technical Architect interviewing candidates for an Angular Frontend Developer position.
Evaluate the candidate's answer for accuracy, technical depth, architectural understanding, and professional terminology.

Question Topic: ${e.topic}
Question Title: ${e.title}
Question Text: ${e.questionText}
Essential Rubrics (must hit these ideas): ${e.rubrics.join(", ")}
Ideal Sample Answer: "${e.sampleAnswer}"

Candidate's Answer: "${t}"

Provide a detailed evaluation structured STRICTLY as a JSON object matching this schema:
{
  "score": number (an integer from 0 to 100 representing their proficiency),
  "feedback": "string (a warm, professional, highly technical critique summarizing their response)",
  "strengths": ["string", "string", ... (2-3 specific technical points they answered correctly)],
  "weaknesses": ["string", "string", ... (2-3 specific technical points they got wrong, missed, or explained weakly)],
  "suggestions": ["string", "string", ... (2-3 highly actionable tips or study items to improve their answer)]
}

Ensure your response is pure, valid JSON with absolutely NO markdown formatting or surrounding backticks.
`,r=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:o}]}]})});if(!r.ok)throw new Error(`Gemini API responded with status ${r.status}`);let l=((await r.json()).candidates?.[0]?.content?.parts?.[0]?.text||"").replace(/```json/gi,"").replace(/```/g,"").trim();return JSON.parse(l)}static \u0275fac=function(t){return new(t||p)};static \u0275prov=v({token:p,factory:p.\u0275fac,providedIn:"root"})};export{b as a};
