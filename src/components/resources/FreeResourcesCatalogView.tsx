import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  Search, 
  Clock,
  Play,
  CheckCircle2,
  Sparkles,
  Globe,
  Flame,
  Filter,
  GraduationCap,
  Code2,
  FileCode2,
  BookMarked,
  Layers
} from 'lucide-react';
import type { UserProfile } from '../../engine/types';

const YoutubeIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

interface FreeResourcesCatalogViewProps {
  profile: UserProfile;
}

interface CuratedResourceItem {
  id: string;
  title: string;
  provider: string;
  category: '10th' | 'inter_jee' | 'btech_swe' | 'datascience_ai' | 'projects' | 'general';
  categoryLabel: string;
  type: 'Video' | 'Course' | 'Practice' | 'Blueprint' | 'Documentation';
  url: string;
  duration: string;
  whyRecommended: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  isFeatured?: boolean;
}

const EXTENDED_RESOURCE_CATALOG: CuratedResourceItem[] = [
  // ================= 1. B.TECH / SWE & INTERNSHIPS (VIDEOS & COURSES) =================
  {
    id: 'res-swe-yt-1',
    title: 'Striver A2Z DSA Course & Sheet — Complete Placement Masterclass',
    provider: 'take U forward (Striver / YouTube)',
    category: 'btech_swe',
    categoryLabel: 'DSA & Coding Drives',
    type: 'Video',
    url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz',
    duration: '450+ Videos • Free',
    whyRecommended: 'The #1 gold-standard DSA roadmap covering Arrays, Linked Lists, Binary Trees, Graphs, DP, and Bit Manipulation with C++, Java, and Python solutions.',
    difficulty: 'Intermediate',
    tags: ['DSA', 'LeetCode', 'C++', 'Java', 'Placements', 'YouTube'],
    isFeatured: true
  },
  {
    id: 'res-swe-yt-2',
    title: 'NeetCode 150 Blind LeetCode Patterns & Algorithms Walkthrough',
    provider: 'NeetCode (YouTube)',
    category: 'btech_swe',
    categoryLabel: 'Interview DSA',
    type: 'Video',
    url: 'https://www.youtube.com/c/NeetCode',
    duration: '150 Problems • 40 Hours',
    whyRecommended: 'Clean, intuitive visual explanations for top FAANG coding interview problems: Sliding Window, Two Pointers, Backtracking, and Dynamic Programming.',
    difficulty: 'Intermediate',
    tags: ['Algorithms', 'FAANG', 'Python', 'Interview', 'YouTube'],
    isFeatured: true
  },
  {
    id: 'res-swe-yt-3',
    title: 'Complete Java + Data Structures & Algorithms Bootcamp 2025',
    provider: 'Kunal Kushwaha (YouTube / Community Classroom)',
    category: 'btech_swe',
    categoryLabel: 'Java & Algorithms',
    type: 'Video',
    url: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7KPgonM8lZ43wCP',
    duration: '60+ Hours • Free',
    whyRecommended: 'Zero-to-hero Java programming, recursion, binary search, sorting algorithms, OOPs, trees, and interview practice questions.',
    difficulty: 'Beginner',
    tags: ['Java', 'Bootcamp', 'Open Source', 'YouTube']
  },
  {
    id: 'res-swe-yt-4',
    title: 'Chai aur Code — Full Stack JavaScript, React & Node.js Masterclass',
    provider: 'Hitesh Choudhary (YouTube)',
    category: 'btech_swe',
    categoryLabel: 'Web Development',
    type: 'Video',
    url: 'https://www.youtube.com/@chaiaurcode',
    duration: '40+ Hours',
    whyRecommended: 'Industry-level practical full-stack development covering Modern ES6+, DOM Manipulation, React 19, Redux Toolkit, Backend APIs, and Authentication.',
    difficulty: 'Beginner',
    tags: ['JavaScript', 'React', 'Node.js', 'Frontend', 'YouTube']
  },
  {
    id: 'res-swe-yt-5',
    title: 'System Design for Beginners & Large Scale Architecture',
    provider: 'Gaurav Sen & ByteByteGo (YouTube)',
    category: 'btech_swe',
    categoryLabel: 'System Design',
    type: 'Video',
    url: 'https://www.youtube.com/c/GauravSensei',
    duration: '15 Hours',
    whyRecommended: 'Visual breakdown of load balancers, caching (Redis), horizontal scaling, database sharding, microservices, and message queues (Kafka).',
    difficulty: 'Advanced',
    tags: ['System Design', 'Backend', 'Architecture', 'YouTube']
  },
  {
    id: 'res-swe-yt-6',
    title: 'Operating Systems & DBMS Core Engineering Complete Playlist',
    provider: 'Gate Smashers (Varun Singla / YouTube)',
    category: 'btech_swe',
    categoryLabel: 'CS Fundamentals',
    type: 'Video',
    url: 'https://www.youtube.com/c/GateSmashers',
    duration: '25 Hours',
    whyRecommended: 'High-speed conceptual clarity on CPU scheduling, memory management, paging, deadlocks, SQL normal forms (1NF-BCNF), and ACID transactions for technical rounds.',
    difficulty: 'Beginner',
    tags: ['Operating Systems', 'DBMS', 'SQL', 'Gate', 'YouTube']
  },
  {
    id: 'res-swe-course-1',
    title: 'Harvard CS50x: Introduction to Computer Science',
    provider: 'Harvard University / edX',
    category: 'btech_swe',
    categoryLabel: 'Computer Science Core',
    type: 'Course',
    url: 'https://cs50.harvard.edu/x/',
    duration: '12 Weeks • Free Certificate Option',
    whyRecommended: 'David J. Malan’s legendary introduction to computation, C, Python, SQL, HTML/CSS/JavaScript, data structures, and algorithmic thinking.',
    difficulty: 'Beginner',
    tags: ['Harvard', 'C', 'Python', 'Algorithms', 'Course']
  },
  {
    id: 'res-swe-course-2',
    title: 'The Odin Project — Full Stack JavaScript Path',
    provider: 'The Odin Project Community',
    category: 'btech_swe',
    categoryLabel: 'Full Stack Curriculum',
    type: 'Course',
    url: 'https://www.theodinproject.com',
    duration: 'Self-Paced (300+ Hours)',
    whyRecommended: 'Completely free open-source curriculum guiding you through building real portfolio projects using Git, JavaScript, Node.js, and React.',
    difficulty: 'Intermediate',
    tags: ['Web Dev', 'Projects', 'Portfolio', 'Course']
  },
  {
    id: 'res-swe-prac-1',
    title: 'NeetCode.io Interactive Practice & Roadmaps',
    provider: 'NeetCode.io',
    category: 'btech_swe',
    categoryLabel: 'Interactive Coding',
    type: 'Practice',
    url: 'https://neetcode.io/practice',
    duration: '350+ Curated Problems',
    whyRecommended: 'Track your coding progress across structured tiers: NeetCode 75, NeetCode 150, and NeetCode All with instant video solutions.',
    difficulty: 'Intermediate',
    tags: ['LeetCode', 'DSA', 'Practice']
  },
  {
    id: 'res-swe-doc-1',
    title: 'Tech Interview Handbook & Resume Guidelines',
    provider: 'Yangshun Tay (Meta Staff Engineer)',
    category: 'btech_swe',
    categoryLabel: 'Career & Resume',
    type: 'Documentation',
    url: 'https://www.techinterviewhandbook.org',
    duration: 'Comprehensive Reference',
    whyRecommended: 'Curated cheat sheets, behavioral STAR answer frameworks, salary negotiation guides, and ATS-friendly resume templates.',
    difficulty: 'Beginner',
    tags: ['Resume', 'Internship', 'Interview Prep']
  },

  // ================= 2. DATA SCIENCE, AI & MACHINE LEARNING =================
  {
    id: 'res-ai-yt-1',
    title: 'Complete Machine Learning & Deep Learning Playlist with Code',
    provider: 'Krish Naik (YouTube)',
    category: 'datascience_ai',
    categoryLabel: 'Machine Learning',
    type: 'Video',
    url: 'https://www.youtube.com/user/krishnaik06',
    duration: '50+ Hours',
    whyRecommended: 'From mathematics of Linear Regression, Decision Trees to PyTorch, CNNs, Transformers, and MLOps deployment with Docker.',
    difficulty: 'Intermediate',
    tags: ['Machine Learning', 'Python', 'PyTorch', 'YouTube'],
    isFeatured: true
  },
  {
    id: 'res-ai-yt-2',
    title: 'Neural Networks: Zero to Hero & GPT from Scratch',
    provider: 'Andrej Karpathy (former Tesla AI / OpenAI / YouTube)',
    category: 'datascience_ai',
    categoryLabel: 'Deep Learning & LLMs',
    type: 'Video',
    url: 'https://www.youtube.com/c/AndrejKarpathy',
    duration: '15 Hours',
    whyRecommended: 'Build micrograd, autograd engines, and a Generative Pretrained Transformer (GPT) language model from scratch in raw Python.',
    difficulty: 'Advanced',
    tags: ['Deep Learning', 'LLMs', 'Transformers', 'YouTube'],
    isFeatured: true
  },
  {
    id: 'res-ai-yt-3',
    title: 'Python for Data Science, Pandas & NumPy 6-Hour Masterclass',
    provider: 'freeCodeCamp (YouTube)',
    category: 'datascience_ai',
    categoryLabel: 'Data Analysis',
    type: 'Video',
    url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
    duration: '6 Hours',
    whyRecommended: 'Hands-on data cleaning, exploratory data analysis (EDA), Matplotlib/Seaborn visualizations, and real-world dataset manipulation.',
    difficulty: 'Beginner',
    tags: ['Python', 'Pandas', 'NumPy', 'Data Analysis', 'YouTube']
  },
  {
    id: 'res-ai-course-1',
    title: 'Kaggle Micro-Courses: Machine Learning, Deep Learning & SQL',
    provider: 'Kaggle (Google)',
    category: 'datascience_ai',
    categoryLabel: 'Hands-on AI Lab',
    type: 'Course',
    url: 'https://www.kaggle.com/learn',
    duration: '30 Hours',
    whyRecommended: 'Bite-sized, interactive Jupyter notebooks with free GPU access to practice modeling on real-world datasets.',
    difficulty: 'Beginner',
    tags: ['Kaggle', 'Jupyter', 'Data Science']
  },
  {
    id: 'res-ai-bp-1',
    title: 'Production RAG & AI Agent Pipeline Architecture Blueprint',
    provider: 'LangChain & FreeCodeCamp',
    category: 'datascience_ai',
    categoryLabel: 'AI Blueprint',
    type: 'Blueprint',
    url: 'https://www.youtube.com/watch?v=Lgnk_g2vPqE',
    duration: '8 Hours',
    whyRecommended: 'Complete architecture for building vector search engines with Pinecone, Gemini/OpenAI API, document chunking, and memory retrieval.',
    difficulty: 'Advanced',
    tags: ['RAG', 'LangChain', 'AI Agents', 'Blueprint']
  },

  // ================= 3. INTERMEDIATE / JEE / NEET =================
  {
    id: 'res-jee-yt-1',
    title: 'JEE Mathematics Calculus & Coordinate Geometry Full Lectures',
    provider: 'Mohit Tyagi (Competishun / YouTube)',
    category: 'inter_jee',
    categoryLabel: 'JEE Mathematics',
    type: 'Video',
    url: 'https://www.youtube.com/c/MohitTyagi',
    duration: '100+ Hours • Free',
    whyRecommended: 'Exhaustive classroom lectures for JEE Advanced from basic functions to differential equations, matrices, and 3D vectors.',
    difficulty: 'Advanced',
    tags: ['Math', 'Calculus', 'JEE Advanced', 'YouTube'],
    isFeatured: true
  },
  {
    id: 'res-jee-yt-2',
    title: 'Physics Galaxy Visual Physics Concept Videos (Ashish Arora)',
    provider: 'Physics Galaxy (YouTube)',
    category: 'inter_jee',
    categoryLabel: 'JEE Physics',
    type: 'Video',
    url: 'https://www.youtube.com/c/physicsgalaxy74',
    duration: '60+ Hours',
    whyRecommended: 'Clear visual simulations of mechanics, electromagnetism, modern physics, and wave optics with multi-step numerical derivations.',
    difficulty: 'Intermediate',
    tags: ['Physics', 'Mechanics', 'JEE Main', 'YouTube'],
    isFeatured: true
  },
  {
    id: 'res-jee-yt-3',
    title: 'Physics Wallah Class 11 & 12 Complete JEE/NEET Physics Series',
    provider: 'Physics Wallah (Alakh Pandey / YouTube)',
    category: 'inter_jee',
    categoryLabel: 'Physics Core',
    type: 'Video',
    url: 'https://www.youtube.com/c/PhysicsWallah',
    duration: '80+ Hours',
    whyRecommended: 'High-energy, intuitive derivations of Newton’s Laws, Electrostatics, Magnetism, and Thermodynamics tailored for Indian competitive exams.',
    difficulty: 'Beginner',
    tags: ['Physics', 'NEET', 'JEE', 'YouTube']
  },
  {
    id: 'res-jee-yt-4',
    title: 'Pankaj Sir Organic Chemistry Reaction Mechanisms & Named Reactions',
    provider: 'Pankaj Sir Chemistry (YouTube)',
    category: 'inter_jee',
    categoryLabel: 'Chemistry Masterclass',
    type: 'Video',
    url: 'https://www.youtube.com/c/PankajsirChemistry',
    duration: '35 Hours',
    whyRecommended: 'Complete breakdown of GOC, reaction intermediates (carbocations), SN1/SN2/E1/E2, named reactions, and conversion tricks.',
    difficulty: 'Intermediate',
    tags: ['Chemistry', 'Organic Chemistry', 'YouTube']
  },
  {
    id: 'res-neet-yt-1',
    title: 'NEET Biology Line-by-Line NCERT Decoded Series',
    provider: 'Dr. Anand Mani / Unacademy NEET (YouTube)',
    category: 'inter_jee',
    categoryLabel: 'NEET Biology',
    type: 'Video',
    url: 'https://www.youtube.com/c/DrAnandManiBiology',
    duration: '45 Hours',
    whyRecommended: 'Every diagram, table, and line of NCERT Botany & Zoology thoroughly highlighted and explained to target a 360/360 in NEET Biology.',
    difficulty: 'Intermediate',
    tags: ['Biology', 'NEET', 'NCERT', 'YouTube']
  },
  {
    id: 'res-jee-disha-bp',
    title: 'Disha Publications 45 Years JEE Advanced Chapterwise Solved Papers (1978-2024)',
    provider: 'Disha Publications Reference Series',
    category: 'inter_jee',
    categoryLabel: 'JEE Standard PYQ Bank',
    type: 'Blueprint',
    url: 'https://dishapublication.com/collections/iit-jee-books',
    duration: '45-Year Archive',
    whyRecommended: 'The gold standard 45-year PYQ series with 100% authentic step-by-step solutions for Physics, Chemistry, and Mathematics.',
    difficulty: 'Advanced',
    tags: ['Books', 'PYQ', 'Disha Publications']
  },
  {
    id: 'res-jee-doc-1',
    title: 'Concepts of Physics (Vol 1 & Vol 2) by Dr. H.C. Verma',
    provider: 'Bharati Bhawan / HC Verma Foundation',
    category: 'inter_jee',
    categoryLabel: 'Physics Reference Book',
    type: 'Documentation',
    url: 'https://conceptsofphysics.com',
    duration: 'Complete Core Textbook',
    whyRecommended: 'Essential conceptual reading with thought-provoking questions and numerical exercises for physics intuition.',
    difficulty: 'Intermediate',
    tags: ['Physics', 'HC Verma', 'Reference']
  },
  {
    id: 'res-jee-prac-1',
    title: 'Marks App — Free NTA JEE Main & Advanced Chapter-wise PYQ Practice',
    provider: 'MathonGo (Marks App)',
    category: 'inter_jee',
    categoryLabel: 'Test & PYQ Engine',
    type: 'Practice',
    url: 'https://web.getmarks.app',
    duration: '10,000+ Questions',
    whyRecommended: 'Filter questions by year (2019-2025), chapter, and difficulty with timer tests and accuracy analytics.',
    difficulty: 'Intermediate',
    tags: ['Mock Tests', 'JEE', 'Practice']
  },

  // ================= 4. CLASS 10TH BOARD MASTERY =================
  {
    id: 'res-10-yt-1',
    title: 'Class 10 NCERT Math Complete One-Shot Revisions & Board Formulas',
    provider: 'Dear Sir (YouTube)',
    category: '10th',
    categoryLabel: 'Class 10th Math',
    type: 'Video',
    url: 'https://www.youtube.com/c/DearSir1',
    duration: '12 Hours',
    whyRecommended: 'Fast-paced, crystal-clear conceptual videos for Trigonometry, Real Numbers, Quadratic Equations, Triangles, and Statistics.',
    difficulty: 'Beginner',
    tags: ['Math', 'Class 10', 'Board Exams', 'YouTube'],
    isFeatured: true
  },
  {
    id: 'res-10-yt-2',
    title: 'Class 10 Science: Physics, Chemistry & Biology Full Board Marathon',
    provider: 'Physics Wallah Foundation (YouTube)',
    category: '10th',
    categoryLabel: 'Class 10th Science',
    type: 'Video',
    url: 'https://www.youtube.com/playlist?list=PL2b2wLhJ4qBw0_wFqV3_uT-zX89u6L_0B',
    duration: '18 Hours',
    whyRecommended: 'Ray diagrams, Ohm’s Law, Chemical Reactions, Carbon and its Compounds, and Life Processes with sample 5-mark answer writing drills.',
    difficulty: 'Beginner',
    tags: ['Science', 'Physics', 'Chemistry', 'Class 10', 'YouTube'],
    isFeatured: true
  },
  {
    id: 'res-10-yt-3',
    title: 'Khan Academy Class 10th NCERT Animated Problem Walkthroughs',
    provider: 'Khan Academy India (YouTube)',
    category: '10th',
    categoryLabel: 'Visual NCERT Math & Science',
    type: 'Video',
    url: 'https://www.youtube.com/c/KhanAcademyIndia',
    duration: '20 Hours',
    whyRecommended: 'Visual intuitive models for surface areas, probability, circle theorems, and magnetic effects of electric current.',
    difficulty: 'Beginner',
    tags: ['Khan Academy', 'Animations', 'NCERT', 'YouTube']
  },
  {
    id: 'res-10-prac-1',
    title: 'NCERT Official Digital Textbooks & Exemplar Question Bank',
    provider: 'NCERT Official (Govt of India)',
    category: '10th',
    categoryLabel: 'Board Question Bank',
    type: 'Practice',
    url: 'https://ncert.nic.in/textbook.php',
    duration: 'Complete Syllabus',
    whyRecommended: 'Official e-books and high-yield exemplar questions for standard 10th board preparation.',
    difficulty: 'Beginner',
    tags: ['NCERT', 'CBSE', 'Books']
  },

  // ================= 5. PROJECT BLUEPRINTS & PORTFOLIO BUILDERS =================
  {
    id: 'res-proj-yt-1',
    title: 'Build & Deploy a Full-Stack Modern SaaS Platform (Next.js 14, Tailwind, Stripe)',
    provider: 'JavaScript Mastery (YouTube)',
    category: 'projects',
    categoryLabel: 'SaaS Project Blueprint',
    type: 'Video',
    url: 'https://www.youtube.com/c/JavaScriptMastery',
    duration: '8 Hours',
    whyRecommended: 'Production-ready code structure with Next.js App Router, Server Actions, TypeScript, Clerk Authentication, and MongoDB/Prisma database.',
    difficulty: 'Intermediate',
    tags: ['Next.js', 'React', 'TypeScript', 'SaaS', 'YouTube'],
    isFeatured: true
  },
  {
    id: 'res-proj-yt-2',
    title: '50 Projects in 50 Days — HTML, CSS & Modern JavaScript',
    provider: 'Traversy Media & Brad Traversy (YouTube)',
    category: 'projects',
    categoryLabel: 'Frontend Mini Projects',
    type: 'Video',
    url: 'https://www.youtube.com/watch?v=dtKciwk_si4',
    duration: '8 Hours',
    whyRecommended: 'Rapidly level up frontend UI skills by building 50 distinct interactive widgets, animations, modals, and landing pages.',
    difficulty: 'Beginner',
    tags: ['HTML', 'CSS', 'JavaScript', 'UI', 'YouTube']
  },
  {
    id: 'res-proj-course-1',
    title: 'Full Stack Open — University of Helsinki Deep Dive',
    provider: 'University of Helsinki',
    category: 'projects',
    categoryLabel: 'Enterprise Full Stack',
    type: 'Course',
    url: 'https://fullstackopen.com/en/',
    duration: 'Comprehensive (12 Parts)',
    whyRecommended: 'Modern web development with React, Redux, Node.js, Express, MongoDB, GraphQL, TypeScript, and CI/CD with real automated grading.',
    difficulty: 'Advanced',
    tags: ['Full Stack', 'GraphQL', 'Docker', 'Course']
  },
  {
    id: 'res-proj-bp-1',
    title: 'Production Deployment & Cloud Architecture Guide',
    provider: 'Vercel, Render & GitHub Actions Documentation',
    category: 'projects',
    categoryLabel: 'DevOps & Deployment',
    type: 'Blueprint',
    url: 'https://vercel.com/docs',
    duration: 'Practical Guides',
    whyRecommended: 'Guides on configuring custom domains, SSL, automated CI/CD preview deployments, and environment variables.',
    difficulty: 'Beginner',
    tags: ['DevOps', 'Deployment', 'Vercel', 'GitHub']
  }
];

export const FreeResourcesCatalogView: React.FC<FreeResourcesCatalogViewProps> = ({ profile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Detect smart default category based on user profile
  const defaultCategory = useMemo(() => {
    const gl = (profile.goalTitle || '').toLowerCase();
    const cat = (profile.goalCategory || '').toLowerCase();
    const edu = (profile.educationLevel || '').toLowerCase();

    if (edu.includes('10') || gl.includes('10th') || gl.includes('board')) return '10th';
    if (gl.includes('jee') || gl.includes('neet') || gl.includes('intermediate') || cat === 'jee' || cat === 'neet') return 'inter_jee';
    if (gl.includes('ai') || gl.includes('data science') || gl.includes('machine learning') || gl.includes('ml')) return 'datascience_ai';
    if (gl.includes('project') || gl.includes('saas') || gl.includes('full stack')) return 'projects';
    return 'btech_swe';
  }, [profile]);

  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredResources = useMemo(() => {
    return EXTENDED_RESOURCE_CATALOG.filter(r => {
      const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
      const matchesType = selectedType === 'all' || r.type.toLowerCase() === selectedType.toLowerCase();
      
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        r.title.toLowerCase().includes(q) ||
        r.provider.toLowerCase().includes(q) ||
        r.whyRecommended.toLowerCase().includes(q) ||
        r.categoryLabel.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q))
      );

      return matchesCategory && matchesType && matchesSearch;
    });
  }, [selectedCategory, selectedType, searchQuery]);

  // Dynamic search query string based on user's goal or search
  const currentTopicSearch = searchQuery.trim() || profile.goalTitle || 'Software Engineering DSA and Web Development';
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(currentTopicSearch + ' free full course tutorial')}`;
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(currentTopicSearch + ' free resources roadmap tutorial github')}`;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 text-slate-100 selection:bg-brand-500 selection:text-white">
      
      {/* Hero Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/[0.1] backdrop-blur-md space-y-5 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% Free & Verified Curricula
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Zero Paywalls • YouTube, Google, Harvard & NeetCode
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-cyan-400" />
            <span>Curated Free Resources & Video Courses</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            High-yield learning materials matched to your <strong>{profile.goalTitle}</strong> milestones — verified YouTube video playlists, open-source textbooks, coding practice banks, and project architecture blueprints.
          </p>
        </div>

        {/* Category Navigation Tabs */}
        <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-white/[0.08] relative z-10">
          {[
            { id: 'btech_swe', label: 'B.Tech & SWE Internships', icon: Code2 },
            { id: 'datascience_ai', label: 'Data Science & AI / ML', icon: Sparkles },
            { id: 'inter_jee', label: 'Intermediate / JEE / NEET', icon: GraduationCap },
            { id: '10th', label: 'Class 10th Board Mastery', icon: BookMarked },
            { id: 'projects', label: 'Project Blueprints & Portfolio', icon: FileCode2 },
            { id: 'all', label: 'View All Resources', icon: Layers }
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25 font-extrabold scale-[1.02]'
                    : 'bg-black border border-white/[0.08] text-slate-300 hover:border-white/[0.2] hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-cyan-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar & Type Filter Badges */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 relative z-10">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by topic, channel, keyword (e.g. Striver, NeetCode, Calculus, Python, React)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black border border-white/[0.1] text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto shrink-0 pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Resources' },
              { id: 'Video', label: '🎥 Videos' },
              { id: 'Course', label: '🎓 Courses' },
              { id: 'Practice', label: '⚡ Practice' },
              { id: 'Blueprint', label: '📐 Blueprints' },
              { id: 'Documentation', label: '📖 Docs & Books' }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedType === type.id
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'bg-black border border-white/[0.08] text-slate-400 hover:text-slate-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Direct YouTube & Google Search Hub for Custom Goals */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Need more on <strong>"{currentTopicSearch}"</strong>?</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={youtubeSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <YoutubeIcon className="w-3.5 h-3.5" />
              <span>Search YouTube Playlists</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={googleSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Search Google & GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>

      {/* Result Count Banner */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-400">
        <div>
          Showing <strong className="text-white">{filteredResources.length}</strong> verified resources in <span className="text-cyan-400 font-semibold">{selectedCategory.toUpperCase()}</span>
        </div>
        {selectedType !== 'all' && (
          <button 
            onClick={() => setSelectedType('all')} 
            className="text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>Clear "{selectedType}" filter</span>
          </button>
        )}
      </div>

      {/* Resource Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className={`p-6 rounded-3xl bg-zinc-950 border transition-all hover:scale-[1.01] shadow-xl group text-left flex flex-col justify-between space-y-4 ${
                res.isFeatured 
                  ? 'border-cyan-500/30 hover:border-cyan-400/70 bg-gradient-to-b from-zinc-950 to-cyan-950/20' 
                  : 'border-white/[0.08] hover:border-cyan-500/40'
              }`}
            >
              <div className="space-y-3">
                
                {/* Top Badge Bar */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                      {res.categoryLabel}
                    </span>
                    
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                      res.type === 'Video' 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                        : res.type === 'Course'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : res.type === 'Practice'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {res.type === 'Video' && <Play className="w-2.5 h-2.5 fill-current" />}
                      {res.type}
                    </span>

                    {res.isFeatured && (
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20 flex items-center gap-1">
                        ★ TOP PICK
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {res.duration}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                  {res.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  {res.whyRecommended}
                </p>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {res.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500 font-medium truncate">
                  Provided by <strong className="text-slate-300">{res.provider}</strong>
                </span>

                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                    res.type === 'Video'
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20'
                  }`}
                >
                  {res.type === 'Video' ? (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch Free on YouTube</span>
                    </>
                  ) : (
                    <>
                      <span>Open Free Resource</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </>
                  )}
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty Filter Fallback with Instant Search Options */
        <div className="p-12 text-center rounded-3xl bg-zinc-950 border border-white/[0.08] space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-slate-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No resources match your exact filter</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try resetting your filters or search YouTube & Google directly for full free video courses on "{currentTopicSearch}".
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedType('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              Reset All Filters
            </button>
            <a
              href={youtubeSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500 flex items-center gap-1.5 transition-colors"
            >
              <YoutubeIcon className="w-4 h-4" />
              <span>Search "{currentTopicSearch}" on YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

    </div>
  );
};
