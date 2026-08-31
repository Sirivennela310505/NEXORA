/**
 * NEXORA — Gemini AI Service
 * Dynamically generates goal-specific challenges, roadmap milestones,
 * diagnostic questions, and live conversational AI answers using Google Gemini API.
 * Supports dynamic API key configuration and fallback models.
 */
import type { Milestone, DiagnosticQuestion, UserProfile } from './types';

const STORAGE_KEY_GEMINI = 'nexora_gemini_api_key';

export function getGeminiApiKey(): string {
  const customKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_GEMINI) : '';
  if (customKey && customKey.trim().length > 5) return customKey.trim();
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  if (envKey && envKey !== 'your_gemini_api_key_here' && envKey.trim().length > 5) {
    return envKey.trim();
  }
  return '';
}

export function setGeminiApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (!key || key.trim() === '') {
      localStorage.removeItem(STORAGE_KEY_GEMINI);
    } else {
      localStorage.setItem(STORAGE_KEY_GEMINI, key.trim());
    }
  }
}

export function isGeminiConfigured(): boolean {
  const key = getGeminiApiKey();
  return Boolean(key && key.length > 10 && key !== 'your_gemini_api_key_here');
}

export async function testGeminiConnection(keyToTest?: string): Promise<{ success: boolean; message: string }> {
  const apiKey = keyToTest || getGeminiApiKey();
  if (!apiKey) {
    return { success: false, message: 'No Gemini API key provided.' };
  }

  const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hello, reply with "OK"' }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 20 }
        })
      });
      if (res.ok) {
        return { success: true, message: `Successfully connected to Google Gemini (${model})!` };
      }
    } catch {
      // try next
    }
  }
  return { success: false, message: 'Could not connect. Please verify your Gemini API key.' };
}

async function callGemini(prompt: string, maxTokens = 2048): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) throw new Error('No API key configured');

  const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: maxTokens }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } else {
        const errText = await res.text().catch(() => '');
        lastError = new Error(`Gemini ${model} ${res.status}: ${errText}`);
      }
    } catch (e: any) {
      lastError = e;
    }
  }

  throw lastError || new Error('All Gemini models failed');
}

/**
 * Live multi-turn chat with Google Gemini tailored for student learning,
 * roadmaps, code explanations, and doubt clearing.
 */
export async function callGeminiChat(
  userMessage: string,
  profile: UserProfile,
  chatHistory: { sender: 'user' | 'assistant'; content: string }[] = []
): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) throw new Error('No API key configured');

  const completedMilestones = profile.activeRoadmap?.filter(m => m.status === 'completed').map(m => m.title).join(', ') || 'None yet';
  const inProgressMilestones = profile.activeRoadmap?.filter(m => m.status === 'in_progress' || m.status === 'unlocked').map(m => m.title).join(', ') || 'Foundations';
  const topSkills = profile.skills?.map(s => `${s.skillName} (${s.currentMastery || 0}%)`).slice(0, 6).join(', ') || 'General';

  const systemInstruction = `You are NEXORA AI, an expert, enthusiastic, and direct personal AI Learning & Career Navigator for student "${profile.fullName}".
Student Profile Context:
- Target Goal: "${profile.goalTitle}" (${profile.goalCategory})
- Education Level: "${profile.educationLevel}"
- Daily Availability: ${profile.dailyAvailabilityMinutes || 90} minutes/day
- Current Active Milestones: ${inProgressMilestones}
- Completed Milestones: ${completedMilestones}
- Current Skills & Mastery: ${topSkills}
- Learning Preference: ${profile.learningPreference || 'Mixed'}

Guidelines:
1. ALWAYS answer the student's exact question or request directly, thoroughly, and helpfully. If they ask about Java, Python, C++, Web Dev, DSA, roadmaps, concepts, errors, exam tips, or doubts, provide accurate, structured, high-yield answers.
2. If they ask for a roadmap or guide (e.g. "focus on java first", "give java roadmap"), provide a clear, phased, actionable breakdown with key topics, estimated time, and hands-on milestones.
3. If they ask a conceptual doubt or code problem, provide clear intuitive explanations with well-formatted code snippets, edge cases, and best practices.
4. Format your output in clean Markdown using bold titles, bullet points, and code blocks with language tags (e.g. \`\`\`java).
5. Maintain a supportive, motivating tone and end with 1-2 actionable next steps or interactive practice suggestions.`;

  // Build multi-turn context
  const contents: any[] = [];
  
  // Format past turns (limit to last 6 for token efficiency)
  const recentHistory = chatHistory.slice(-6);
  for (const h of recentHistory) {
    contents.push({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }]
    });
  }

  // Append current user message with system context if first turn or injected
  const currentUserText = contents.length === 0 
    ? `${systemInstruction}\n\nStudent asks: "${userMessage}"`
    : userMessage;

  contents.push({
    role: 'user',
    parts: [{ text: currentUserText }]
  });

  const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } else {
        // Fallback payload format for endpoints that don't support top-level systemInstruction
        const fallbackRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${systemInstruction}\n\n${userMessage}` }] }
            ],
            generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
          })
        });
        if (fallbackRes.ok) {
          const fbData = await fallbackRes.json();
          const fbText = fbData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (fbText) return fbText;
        }
      }
    } catch (e: any) {
      lastError = e;
    }
  }

  throw lastError || new Error('Failed to generate AI response from Gemini');
}

function parseJSON<T>(raw: string): T | null {
  try {
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned) as T;
  } catch { return null; }
}

/** Generate 6 goal-specific challenge options */
export async function generateChallengesForGoal(
  goal: string,
  educationLevel: string
): Promise<string[]> {
  const prompt = `You are a learning coach. A student's goal is: "${goal}", education level: "${educationLevel}".
List exactly 6 highly specific learning challenges they will face pursuing this goal. 
Make them very specific to this exact goal domain (not generic platitudes).
Return ONLY a JSON array of 6 strings, no other text:
["Challenge 1", "Challenge 2", "Challenge 3", "Challenge 4", "Challenge 5", "Challenge 6"]`;
  try {
    const raw = await callGemini(prompt, 1024);
    const parsed = parseJSON<string[]>(raw);
    if (Array.isArray(parsed) && parsed.length >= 4) return parsed.slice(0, 6);
  } catch (e) { console.warn('Gemini challenges fallback:', e); }
  return [
    `Mastering core fundamentals of ${goal}`,
    'Staying consistent with daily structured practice',
    'Building real-world projects from scratch',
    'Understanding advanced concepts without hand-holding',
    'Preparing for technical assessments and interviews',
    'Finding high-quality, curated learning resources'
  ];
}

/** Generate 8 ordered roadmap milestones for any goal */
export async function generateRoadmapMilestones(
  goal: string,
  educationLevel: string,
  dailyMinutes: number
): Promise<Milestone[]> {
  const prompt = `You are a curriculum expert. Create a learning roadmap for:
Goal: "${goal}", Education: "${educationLevel}", Daily time: ${dailyMinutes} mins/day.

Return exactly 8 milestone objects as a JSON array. Each object:
{
  "id": "unique-kebab-slug",
  "phaseNumber": 1,
  "phaseTitle": "Phase Title",
  "title": "Milestone Title",
  "description": "2 sentence description of what learner masters here",
  "skillId": "skill-slug",
  "category": "Foundation",
  "estimatedHours": 12,
  "status": "locked",
  "prerequisiteMilestoneIds": [],
  "resources": [],
  "practiceProblemsCount": 8,
  "diagnosticQuestionCount": 10,
  "isRemediation": false
}
category must be one of: "Foundation","Core","Practice","Project","Career"
First milestone status="unlocked", rest="locked". Return ONLY the JSON array.`;
  try {
    const raw = await callGemini(prompt, 2048);
    const parsed = parseJSON<Partial<Milestone>[]>(raw);
    if (Array.isArray(parsed) && parsed.length >= 4) {
      return parsed.map((m, i) => ({
        id: m.id || `ai-ms-${i}`,
        phaseNumber: m.phaseNumber || Math.ceil((i + 1) / 3),
        phaseTitle: m.phaseTitle || `Phase ${Math.ceil((i + 1) / 3)}`,
        title: m.title || `Step ${i + 1}: ${goal}`,
        description: m.description || `Build skills for ${goal}`,
        skillId: m.skillId || `ai-skill-${i}`,
        category: (m.category as Milestone['category']) || 'Core',
        estimatedHours: m.estimatedHours || 12,
        status: (i === 0 ? 'unlocked' : 'locked') as Milestone['status'],
        prerequisiteMilestoneIds: m.prerequisiteMilestoneIds || [],
        resources: [],
        practiceProblemsCount: m.practiceProblemsCount || 8,
        diagnosticQuestionCount: 10,
        isRemediation: false
      })) as Milestone[];
    }
  } catch (e) { console.warn('Gemini roadmap fallback:', e); }
  return generateFallbackRoadmap(goal);
}

function generateFallbackRoadmap(goal: string): Milestone[] {
  const phases = [
    { t: 'Foundations', cat: 'Foundation' as const, h: 12 },
    { t: 'Core Concepts', cat: 'Core' as const, h: 18 },
    { t: 'Hands-on Practice', cat: 'Practice' as const, h: 20 },
    { t: 'Advanced Topics', cat: 'Core' as const, h: 18 },
    { t: 'Real-World Project', cat: 'Project' as const, h: 25 },
    { t: 'Career Readiness', cat: 'Career' as const, h: 12 }
  ];
  return phases.map((p, i) => ({
    id: `fb-${i}`,
    phaseNumber: i + 1,
    phaseTitle: `Phase ${i + 1}: ${p.t}`,
    title: `${p.t} for ${goal}`,
    description: `Master ${p.t.toLowerCase()} concepts required for ${goal}. Build practical skills through structured exercises.`,
    skillId: `fb-skill-${i}`,
    category: p.cat,
    estimatedHours: p.h,
    status: (i === 0 ? 'unlocked' : 'locked') as Milestone['status'],
    prerequisiteMilestoneIds: i > 0 ? [`fb-${i - 1}`] : [],
    resources: [],
    practiceProblemsCount: 8,
    diagnosticQuestionCount: 10,
    isRemediation: false
  }));
}

/** Generate diagnostic MCQ questions for a specific topic */
export async function generateDiagnosticQuestions(
  goal: string,
  topic: string,
  skillId: string,
  count = 10
): Promise<DiagnosticQuestion[]> {
  const prompt = `You are an expert educator. Create ${count} multiple-choice diagnostic questions for:
Goal: "${goal}", Topic: "${topic}".
Make questions test real, specific knowledge of this topic.
Return ONLY a JSON array:
[{
  "id": "q1",
  "skillId": "${skillId}",
  "question": "Question text?",
  "options": ["A", "B", "C", "D"],
  "correctOptionIndex": 0,
  "explanation": "Why this is correct",
  "difficulty": "Intermediate"
}]
difficulty: "Beginner"|"Intermediate"|"Advanced". Mix: 3 easy, 5 medium, 2 hard. Return ONLY JSON array.`;
  try {
    const raw = await callGemini(prompt, 2048);
    const parsed = parseJSON<Partial<DiagnosticQuestion>[]>(raw);
    if (Array.isArray(parsed) && parsed.length >= 4) {
      return parsed.slice(0, count).map((q, i) => ({
        id: q.id || `ai-q-${skillId}-${i}`,
        skillId,
        question: q.question || `Question ${i + 1} about ${topic}?`,
        options: Array.isArray(q.options) && q.options.length === 4
          ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
        correctOptionIndex: typeof q.correctOptionIndex === 'number' ? q.correctOptionIndex : 0,
        explanation: q.explanation || 'Review course material for this topic.',
        difficulty: (q.difficulty as DiagnosticQuestion['difficulty']) || 'Intermediate'
      })) as DiagnosticQuestion[];
    }
  } catch (e) { console.warn('Gemini questions fallback:', e); }
  return [];
}
