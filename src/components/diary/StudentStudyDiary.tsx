import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Calendar, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  Edit3, 
  Flame,
  Sparkles,
  Trophy,
  Save
} from 'lucide-react';
import type { UserProfile } from '../../engine/types';

interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  completedTopic: string;
  timeSpentMinutes: number;
  mood: '🔥 Motivated' | '⚡ Productive' | '🧠 Challenging' | '🎯 Focused';
  tags: string[];
}

interface StudentStudyDiaryProps {
  profile: UserProfile;
}

export const StudentStudyDiary: React.FC<StudentStudyDiaryProps> = ({ profile }) => {
  const storageKey = `nexora_diary_${profile.id}`;
  const streakKey = `nexora_streak_${profile.id}`;

  const [streakCount, setStreakCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(streakKey);
      return saved ? Number(saved) : 1;
    } catch {
      return 1;
    }
  });

  const [markedToday, setMarkedToday] = useState<boolean>(() => {
    try {
      const todayStr = new Date().toDateString();
      const lastMarked = localStorage.getItem(`nexora_last_marked_${profile.id}`);
      return lastMarked === todayStr;
    } catch {
      return false;
    }
  });

  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }

    const isClass10 = profile.educationLevel === 'Class 10';
    const isJEE = profile.goalCategory === 'jee' || profile.educationLevel === 'Class 12';

    return [
      {
        id: 'diary-sample-1',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        title: isClass10 
          ? 'Class 10: Quadratic Equations & Board Practice Drills' 
          : isJEE 
          ? 'JEE: Calculus Differential Limits & PYQ Problems' 
          : 'B.Tech SWE: Solved Two-Pointer & Sliding Window Problems',
        content: isClass10
          ? 'Completed 15 NCERT problem drills on quadratic formulas and discriminant methods. Verified all solutions with step-by-step notes.'
          : isJEE
          ? 'Reviewed standard limit forms and L’Hôpital’s rule. Completed 10 previous year JEE Advanced questions.'
          : 'Solved 4 medium LeetCode array problems using two pointers. Documented edge cases with negative values.',
        completedTopic: isClass10 ? 'Quadratic Equations' : isJEE ? 'Calculus Limits' : 'Two Pointers & Arrays',
        timeSpentMinutes: profile.dailyAvailabilityMinutes || 60,
        mood: '🔥 Motivated',
        tags: ['Day 1', 'Focus Milestone', profile.goalCategory.toUpperCase()]
      }
    ];
  });

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newTime, setNewTime] = useState(60);
  const [newMood, setNewMood] = useState<DiaryEntry['mood']>('⚡ Productive');
  const [showAddModal, setShowAddModal] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(entries));
      localStorage.setItem(streakKey, streakCount.toString());
    } catch {
      // ignore
    }
  }, [entries, streakCount, storageKey, streakKey]);

  const handleMarkTodayDone = () => {
    const todayStr = new Date().toDateString();
    if (markedToday) return;

    const newStreak = streakCount + 1;
    setStreakCount(newStreak);
    setMarkedToday(true);
    try {
      localStorage.setItem(`nexora_last_marked_${profile.id}`, todayStr);
      localStorage.setItem(streakKey, newStreak.toString());
    } catch {}

    const todayEntry: DiaryEntry = {
      id: `diary-auto-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      title: `Completed Day ${newStreak} Daily Learning Sprint!`,
      content: `Marked daily goals as accomplished. Completed target practice set for ${profile.goalTitle}. Keep the momentum going!`,
      completedTopic: profile.goalTitle,
      timeSpentMinutes: profile.dailyAvailabilityMinutes || 60,
      mood: '🔥 Motivated',
      tags: ['Daily Completion', `Day ${newStreak}`, 'Streak Milestone']
    };

    setEntries([todayEntry, ...entries]);
    setCelebrationMessage(`🔥 Streak Extended to ${newStreak} Days! Great job completing today's work.`);
    setTimeout(() => setCelebrationMessage(null), 5000);
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newEntry: DiaryEntry = {
      id: `diary-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      title: newTitle.trim(),
      content: newContent.trim(),
      completedTopic: newTopic.trim() || 'Daily Learning Milestone',
      timeSpentMinutes: Number(newTime) || 60,
      mood: newMood,
      tags: ['Study Log', profile.goalCategory.toUpperCase()]
    };

    setEntries([newEntry, ...entries]);
    setNewTitle('');
    setNewContent('');
    setNewTopic('');
    setShowAddModal(false);
    setCelebrationMessage('Notes successfully recorded in your notebook!');
    setTimeout(() => setCelebrationMessage(null), 3000);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const totalMinutesStudied = entries.reduce((sum, e) => sum + e.timeSpentMinutes, 0);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 text-slate-100 selection:bg-brand-500 selection:text-white">
      
      {/* Toast Alert */}
      {celebrationMessage && (
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 text-cyan-200 text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-2xl backdrop-blur-md animate-bounce-short">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>{celebrationMessage}</span>
        </div>
      )}

      {/* Header Banner & Streak Tracker */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/[0.1] backdrop-blur-md space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                Personal Study Notebook
              </span>
              <span className="text-xs text-slate-400">Track Progress & Notes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-cyan-400" />
              <span>Daily Study Diary & Reflections</span>
            </h1>
          </div>

          {/* Daily Work Mark Button */}
          <button
            onClick={handleMarkTodayDone}
            disabled={markedToday}
            className={`px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 shadow-xl ${
              markedToday
                ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/30 cursor-default'
                : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-black shadow-emerald-500/20 animate-pulse'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{markedToday ? "✓ Marked Today's Work Complete" : "Mark I Completed Today's Work!"}</span>
          </button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          
          <div className="p-4 rounded-2xl bg-black border border-white/[0.08] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Current Study Streak</div>
              <div className="text-xl font-black text-white">{streakCount} Days</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black border border-white/[0.08] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Total Logged Time</div>
              <div className="text-xl font-black text-white">{Math.round(totalMinutesStudied / 60)} Hours</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black border border-white/[0.08] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Completed Entries</div>
              <div className="text-xl font-black text-white">{entries.length} Logs</div>
            </div>
          </div>

        </div>

        {/* Action Button to Add Custom Entry */}
        <div className="flex justify-end pt-2 border-t border-white/[0.06]">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/[0.1] text-xs font-bold text-slate-200 flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Write Study Notes</span>
          </button>
        </div>

      </div>

      {/* Write Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-zinc-950 border border-white/[0.1] rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl text-left">
            
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-cyan-400" />
                <span>Log Study Session Notes</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Topic or Concept Studied</label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={e => setNewTopic(e.target.value)}
                  placeholder="e.g. Sliding Window / Quadratic Equations / System Design"
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/[0.1] text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Session Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Mastered 5 hard problems on trees"
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/[0.1] text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Key Takeaways & Notes</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="What did you learn today? Any formulas, trick cases, or algorithms you discovered?"
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/[0.1] text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Time Spent (Minutes)</label>
                  <input
                    type="number"
                    value={newTime}
                    onChange={e => setNewTime(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl bg-black border border-white/[0.1] text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Session Mood</label>
                  <select
                    value={newMood}
                    onChange={e => setNewMood(e.target.value as any)}
                    className="w-full px-4 py-2 rounded-xl bg-black border border-white/[0.1] text-xs text-white"
                  >
                    <option value="🔥 Motivated">🔥 Motivated</option>
                    <option value="⚡ Productive">⚡ Productive</option>
                    <option value="🧠 Challenging">🧠 Challenging</option>
                    <option value="🎯 Focused">🎯 Focused</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-black border border-white/[0.1] text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Entry</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Diary Entries List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider text-left">
          Past Journal Entries
        </h3>

        {entries.map((entry) => (
          <div
            key={entry.id}
            className="p-6 rounded-3xl bg-zinc-950 border border-white/[0.08] space-y-4 text-left shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{entry.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {entry.completedTopic}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  {entry.date}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {entry.timeSpentMinutes} mins
                </span>
                <span>{entry.mood}</span>
                <button
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="p-1 rounded hover:bg-zinc-900 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Delete Entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {entry.content}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {entry.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black border border-white/[0.06] text-slate-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
