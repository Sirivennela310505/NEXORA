import React, { useState } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  Search, 
  Clock
} from 'lucide-react';
import type { UserProfile } from '../../engine/types';

interface FreeResourcesCatalogViewProps {
  profile: UserProfile;
}

interface CuratedResourceItem {
  id: string;
  title: string;
  provider: string;
  category: '10th' | 'inter_jee' | 'btech_swe' | 'projects' | 'general';
  categoryLabel: string;
  type: 'Video' | 'Course' | 'Practice' | 'Blueprint' | 'Documentation';
  url: string;
  duration: string;
  whyRecommended: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const EXTENDED_RESOURCE_CATALOG: CuratedResourceItem[] = [
  // ================= 1. CLASS 10 RESOURCES =================
  {
    id: 'res-10-1',
    title: 'Class 10 Trigonometry & Polynomials — Full NCERT Masterclass',
    provider: 'Khan Academy / NCERT',
    category: '10th',
    categoryLabel: 'Class 10th Math',
    type: 'Video',
    url: 'https://www.youtube.com/watch?v=pubRerXQx84',
    duration: '4.5 Hours',
    whyRecommended: 'Complete conceptual breakdown of trigonometric ratios, identities, and quadratic polynomials with board exam practice problems.',
    difficulty: 'Beginner'
  },
  {
    id: 'res-10-2',
    title: 'Light, Reflection & Electricity — Complete Physics Foundation',
    provider: 'Physics Wallah Foundation',
    category: '10th',
    categoryLabel: 'Class 10th Science',
    type: 'Video',
    url: 'https://www.youtube.com/watch?v=3RkH4qj72Qc',
    duration: '3.8 Hours',
    whyRecommended: 'Ray diagrams, Ohm’s law, circuit analysis, and formula sheets tailored for 95%+ board exam scoring.',
    difficulty: 'Beginner'
  },
  {
    id: 'res-10-3',
    title: 'Chemical Reactions, Acids & Bases — NCERT Board Question Bank',
    provider: 'CBSE Official / NCERT',
    category: '10th',
    categoryLabel: 'Class 10th Chemistry',
    type: 'Practice',
    url: 'https://ncert.nic.in/textbook.php',
    duration: '2.5 Hours',
    whyRecommended: 'Balanced chemical equations, redox reactions, and sample 5-mark question drills.',
    difficulty: 'Beginner'
  },

  // ================= 2. INTERMEDIATE / JEE / NEET =================
  {
    id: 'res-jee-disha-1',
    title: 'Disha Publications — 45 Years JEE Advanced Chapterwise Solved Papers (1978-2023)',
    provider: 'Disha Publications Reference',
    category: 'inter_jee',
    categoryLabel: 'JEE Standard Books',
    type: 'Blueprint',
    url: 'https://dishapublication.com/collections/iit-jee-books',
    duration: 'Full Syllabus',
    whyRecommended: 'Essential 45-year PYQ book series with 100% detailed step-by-step solutions for Physics, Chemistry, and Mathematics.',
    difficulty: 'Advanced'
  },
  {
    id: 'res-jee-disha-2',
    title: 'Disha Publications — 144 JEE Main Online & Offline Physics & Chem Master Tests',
    provider: 'Disha Publications',
    category: 'inter_jee',
    categoryLabel: 'JEE Test Series Book',
    type: 'Practice',
    url: 'https://dishapublication.com/collections/iit-jee-books',
    duration: '120 Tests',
    whyRecommended: 'Topic-wise mock tests and speed boosters with negative-marking analysis for JEE Main rank maximization.',
    difficulty: 'Intermediate'
  },
  {
    id: 'res-jee-hcv',
    title: 'Concepts of Physics (Vol 1 & Vol 2) — Dr. H.C. Verma',
    provider: 'HC Verma Foundation / Bharati Bhawan',
    category: 'inter_jee',
    categoryLabel: 'JEE Standard Physics',
    type: 'Documentation',
    url: 'https://conceptsofphysics.com',
    duration: 'Complete Core',
    whyRecommended: 'The gold standard for crystal-clear physical intuition, thought questions, and rigorous numerical exercises.',
    difficulty: 'Intermediate'
  },
  {
    id: 'res-jee-1',
    title: 'JEE Calculus & Differential Equations — Deep Concept Series',
    provider: 'Mohit Tyagi (Competishun)',
    category: 'inter_jee',
    categoryLabel: 'JEE Mathematics',
    type: 'Course',
    url: 'https://www.youtube.com/c/MohitTyagi',
    duration: '18 Hours',
    whyRecommended: 'Comprehensive JEE Advanced calculus coverage from limits, continuity to definite integrals and differential equations.',
    difficulty: 'Advanced'
  },
  {
    id: 'res-jee-2',
    title: 'Mechanics & Rotational Dynamics — Visual Physics Walkthrough',
    provider: 'Physics Galaxy / Ashish Arora',
    category: 'inter_jee',
    categoryLabel: 'JEE Physics',
    type: 'Video',
    url: 'https://www.physicsgalaxy.com',
    duration: '14 Hours',
    whyRecommended: 'Rigid body dynamics, center of mass, and torque with real-time multi-concept problem illustrations.',
    difficulty: 'Advanced'
  },
  {
    id: 'res-jee-3',
    title: 'Organic Reaction Mechanisms & Electrophiles — NCERT to Advanced',
    provider: 'Unacademy JEE / Khan Academy',
    category: 'inter_jee',
    categoryLabel: 'JEE Chemistry',
    type: 'Practice',
    url: 'https://www.youtube.com/watch?v=1uM90a5m04Q',
    duration: '8 Hours',
    whyRecommended: 'SN1, SN2, E1, E2 reaction mechanisms, named reactions, and isomerism problem sets.',
    difficulty: 'Intermediate'
  },

  // ================= 3. B.TECH / SWE & INTERNSHIPS =================
  {
    id: 'res-swe-1',
    title: 'Core Data Structures & Algorithms — Complete Placement Roadmap',
    provider: 'NeetCode / Striver A2Z',
    category: 'btech_swe',
    categoryLabel: 'DSA Mastery',
    type: 'Course',
    url: 'https://neetcode.io/practice',
    duration: '35 Hours',
    whyRecommended: 'High-yield problem patterns: Two Pointers, Sliding Window, Trees, Graphs, and Dynamic Programming with multi-language code.',
    difficulty: 'Intermediate'
  },
  {
    id: 'res-swe-2',
    title: 'High-Scale System Design & API Architecture for Internships',
    provider: 'ByteByteGo / Alex Xu',
    category: 'btech_swe',
    categoryLabel: 'System Design',
    type: 'Blueprint',
    url: 'https://bytebytego.com',
    duration: '12 Hours',
    whyRecommended: 'Load balancing, database sharding, caching strategies, rate limiting, and microservices architecture.',
    difficulty: 'Advanced'
  },
  {
    id: 'res-swe-3',
    title: 'Tech Internship Hunting Guide & Resume ATS Optimizer',
    provider: 'Tech Interview Handbook',
    category: 'btech_swe',
    categoryLabel: 'Career & Internships',
    type: 'Documentation',
    url: 'https://www.techinterviewhandbook.org',
    duration: '3 Hours',
    whyRecommended: 'Proven resume formats, cold outreach templates, and behavioral interview STAR frameworks for campus and off-campus drives.',
    difficulty: 'Beginner'
  },

  // ================= 4. PROJECT BUILDER BLUEPRINTS =================
  {
    id: 'res-proj-1',
    title: 'Full-Stack SaaS Architecture Blueprint — Idea to Production',
    provider: 'Full Stack Open (Univ of Helsinki)',
    category: 'projects',
    categoryLabel: 'Project Blueprint',
    type: 'Blueprint',
    url: 'https://fullstackopen.com/en/',
    duration: '20 Hours',
    whyRecommended: 'Build an end-to-end full-stack application with React/Next.js, Node/Express, PostgreSQL, JWT Auth, and Docker containerization.',
    difficulty: 'Intermediate'
  },
  {
    id: 'res-proj-2',
    title: 'AI Agent & RAG Pipeline Project — End-to-End Implementation',
    provider: 'LangChain & FreeCodeCamp',
    category: 'projects',
    categoryLabel: 'AI Project',
    type: 'Video',
    url: 'https://www.youtube.com/watch?v=Lgnk_g2vPqE',
    duration: '6 Hours',
    whyRecommended: 'Step-by-step tutorial building a document search engine with vector embeddings, Pinecone, and OpenAI/Gemini API integration.',
    difficulty: 'Advanced'
  },
  {
    id: 'res-proj-3',
    title: 'Production Deployment Guide (Vercel, Render & GitHub Actions CI/CD)',
    provider: 'Vercel / GitHub Docs',
    category: 'projects',
    categoryLabel: 'DevOps & Deployment',
    type: 'Documentation',
    url: 'https://vercel.com/docs',
    duration: '2.5 Hours',
    whyRecommended: 'Automate testing, environment variable management, and zero-downtime deployments for your portfolio projects.',
    difficulty: 'Beginner'
  }
];

export const FreeResourcesCatalogView: React.FC<FreeResourcesCatalogViewProps> = ({ profile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Default category tab based on user's education level & goal
  const defaultCategory = React.useMemo(() => {
    if (profile.educationLevel === 'Class 10') return '10th';
    if (profile.educationLevel === 'Class 12' || profile.goalCategory === 'jee' || profile.goalCategory === 'neet') return 'inter_jee';
    if (profile.goalCategory === 'career_switch') return 'projects';
    return 'btech_swe';
  }, [profile]);

  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredResources = EXTENDED_RESOURCE_CATALOG.filter(r => {
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesType = selectedType === 'all' || r.type.toLowerCase() === selectedType.toLowerCase();
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.whyRecommended.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 text-slate-100 selection:bg-brand-500 selection:text-white">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/[0.1] backdrop-blur-md space-y-4 shadow-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            100% Free & Verified Curriculum
          </span>
          <span className="text-xs text-slate-400">Zero Paywalls • Matched to Your Goal</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-cyan-400" />
          <span>Curated Free Resources & Curricula</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          High-yield learning materials matched to your <strong>{profile.goalTitle}</strong> milestones — verified video masterclasses, project blueprints, and practice question banks.
        </p>

        {/* Category Tabs */}
        <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-white/[0.08]">
          {[
            { id: 'btech_swe', label: '💻 B.Tech & SWE Internships', desc: 'DSA, System Design & Drives' },
            { id: 'inter_jee', label: '🎓 Intermediate / JEE / NEET', desc: 'Physics, Chemistry & Calculus' },
            { id: '10th', label: '📚 Class 10th Board Mastery', desc: 'NCERT Math & Science' },
            { id: 'projects', label: '🚀 Project Blueprints & Portfolio', desc: 'SaaS, Full-Stack & AI' },
            { id: 'all', label: '🔍 View All Resources', desc: 'Browse Everything' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                  : 'bg-black border border-white/[0.08] text-slate-300 hover:border-white/[0.2]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by topic, provider, or keyword (e.g. NeetCode, Calculus, Vercel, NCERT)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black border border-white/[0.1] text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto shrink-0 pb-1 sm:pb-0">
            {['all', 'Video', 'Course', 'Practice', 'Blueprint', 'Documentation'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all capitalize whitespace-nowrap ${
                  selectedType === type
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'bg-black border border-white/[0.08] text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="p-6 rounded-3xl bg-zinc-950 border border-white/[0.08] flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all hover:scale-[1.01] shadow-xl group text-left"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                  {res.categoryLabel}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {res.duration}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                {res.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                {res.whyRecommended}
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                By <strong className="text-slate-300">{res.provider}</strong>
              </span>

              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-black hover:bg-zinc-900 text-xs font-bold text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition-all flex items-center gap-1.5"
              >
                <span>Access Free Resource</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
