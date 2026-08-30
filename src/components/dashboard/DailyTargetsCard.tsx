import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Flame, 
  Plus, 
  Target, 
  Clock, 
  ArrowRight
} from 'lucide-react';
import type { NextBestAction, UserProfile } from '../../engine/types';

interface DailyTargetsCardProps {
  profile: UserProfile;
  nba: NextBestAction;
  onNavigate: (tabId: string, payload?: any) => void;
  onUpdateProfile: (updated: UserProfile) => void;
}

interface DailyTask {
  id: string;
  title: string;
  durationMinutes: number;
  completed: boolean;
  category: 'core' | 'practice' | 'review' | 'custom';
  actionTab?: string;
  actionPayload?: any;
}

export const DailyTargetsCard: React.FC<DailyTargetsCardProps> = ({
  profile,
  nba,
  onNavigate,
}) => {
  const activeMilestone = profile.activeRoadmap.find(m => m.status === 'in_progress' || m.status === 'unlocked');
  const dailyTime = profile.dailyAvailabilityMinutes || 90;

  // Initialize daily targets based on active Next Best Action & Milestone
  const [tasks, setTasks] = useState<DailyTask[]>([
    {
      id: 'dt-1',
      title: `Core Focus: ${nba.title}`,
      durationMinutes: nba.durationEstimateMinutes,
      completed: false,
      category: 'core',
      actionTab: nba.type === 'assessment' ? 'assessments' : 'roadmap',
      actionPayload: { milestoneId: nba.milestoneId }
    },
    {
      id: 'dt-2',
      title: `Targeted Practice: 5 Problems on ${activeMilestone?.title || 'Active Topic'}`,
      durationMinutes: Math.min(30, Math.round(dailyTime * 0.3)),
      completed: false,
      category: 'practice',
      actionTab: 'roadmap',
      actionPayload: { milestoneId: activeMilestone?.id }
    },
    {
      id: 'dt-3',
      title: `Quick Recap: Diagnostic Checkpoint Review`,
      durationMinutes: 15,
      completed: false,
      category: 'review',
      actionTab: 'assessments',
      actionPayload: { skillId: activeMilestone?.skillId }
    }
  ]);

  const [newTaskInput, setNewTaskInput] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const toggleTask = (taskId: string) => {
    setTasks(prev => {
      const next = prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
      const nowCompleted = next.filter(t => t.completed).length;
      if (nowCompleted === next.length && next.length > 0) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 4000);
      }
      return next;
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;

    const newTask: DailyTask = {
      id: `custom-task-${Date.now()}`,
      title: newTaskInput.trim(),
      durationMinutes: 20,
      completed: false,
      category: 'custom'
    };

    setTasks(prev => [...prev, newTask]);
    setNewTaskInput('');
    setShowAddForm(false);
  };

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-zinc-950 border border-white/[0.1] backdrop-blur-md space-y-6 relative overflow-hidden shadow-2xl">
      
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-black/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 text-center animate-fade-in border border-emerald-500/30">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-3xl mb-3 shadow-lg shadow-emerald-500/30 animate-bounce">
            🎉
          </div>
          <h3 className="text-xl font-bold text-white">Daily Target Completed!</h3>
          <p className="text-xs text-slate-300 mt-1 max-w-sm">
            Awesome consistency! You completed all scheduled learning targets for today toward <strong>{profile.goalTitle}</strong>.
          </p>
          <button
            onClick={() => setShowCelebration(false)}
            className="mt-4 px-5 py-2 rounded-xl bg-cyan-500 text-black text-xs font-bold shadow-md hover:bg-cyan-400 transition-colors"
          >
            Continue Learning
          </button>
        </div>
      )}

      {/* Header with Streak & Progress Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              <span>Today's Actionable Targets</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>Day 1 Sprints</span>
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Daily Learning Checklist ({completedCount}/{totalCount} Completed)
          </h2>
        </div>

        {/* Circular / Pill progress */}
        <div className="flex items-center gap-3 bg-black px-4 py-2 rounded-2xl border border-white/[0.08] shrink-0">
          <div className="text-right">
            <div className="text-xs font-bold text-white">{percentComplete}% Done</div>
            <div className="text-[10px] text-slate-400">Target: {dailyTime} mins</div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-cyan-500/40 flex items-center justify-center relative">
            <span className="text-xs font-bold text-cyan-400">{completedCount}</span>
          </div>
        </div>
      </div>

      {/* Interactive To-Do List */}
      <div className="space-y-2.5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
              task.completed
                ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                : 'bg-black border-white/[0.08] text-white hover:border-white/[0.2]'
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                type="button"
                onClick={() => toggleTask(task.id)}
                className="shrink-0 transition-transform active:scale-90"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600 hover:text-brand-400 transition-colors" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <span className={`text-xs sm:text-sm font-medium block truncate ${
                  task.completed ? 'line-through text-slate-500' : 'text-slate-200'
                }`}>
                  {task.title}
                </span>
                <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>~{task.durationMinutes} mins</span>
                  {task.category === 'core' && (
                    <span className="text-brand-400 font-semibold ml-1">• High-Leverage</span>
                  )}
                </span>
              </div>
            </div>

            {task.actionTab && !task.completed && (
              <button
                type="button"
                onClick={() => onNavigate(task.actionTab!, task.actionPayload)}
                className="px-3 py-1.5 rounded-lg bg-brand-600/20 hover:bg-brand-600/40 border border-brand-500/30 text-xs font-semibold text-brand-300 transition-colors flex items-center gap-1 shrink-0"
              >
                <span>Start</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Custom Task Form */}
      {showAddForm ? (
        <form onSubmit={handleAddTask} className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={newTaskInput}
            onChange={(e) => setNewTaskInput(e.target.value)}
            placeholder="e.g. Review 10 physics numericals, Solve 3 LeetCode problems..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition-colors"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(false)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1.5 transition-colors pt-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Study Task</span>
        </button>
      )}

    </div>
  );
};
