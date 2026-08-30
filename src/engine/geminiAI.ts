/**
 * NEXORA — Gemini AI Service
 * Dynamically generates goal-specific challenges, roadmap milestones,
 * and diagnostic questions for ANY user goal using Gemini 1.5 Flash API.
 * Falls back gracefully if no API key is set.
 */
import type { Milestone, DiagnosticQuestion } from './types';

const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('No API key');
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
    })
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

function parseJSON<T>(raw: string): T | null {
  try {
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned) as T;
  } catch { return null; }
}

export function isGeminiConfigured(): boolean {
  return Boolean(GEMINI_API_KEY && GEMINI_API_KEY.length > 10);
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
    const raw = await callGemini(prompt);
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

/** Generate 8-12 ordered roadmap milestones for any goal */
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
    const raw = await callGemini(prompt);
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
    const raw = await callGemini(prompt);
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
