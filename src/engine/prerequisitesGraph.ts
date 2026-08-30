import type { LearningResource, SkillNode } from './types';

export const DOMAIN_SKILL_NODES: Record<string, SkillNode[]> = {
  // CLASS 10 SECONDARY SCHOOL (100% PURE CLASS 10 MATHEMATICS & SCIENCE)
  class10: [
    {
      id: 'c10-math-real-polynomials',
      name: 'Real Numbers & Polynomials',
      category: 'Mathematics',
      domain: 'class10',
      description: 'Fundamental Theorem of Arithmetic, irrationality proofs, zeroes of polynomials & quadratic factorisation.',
      prerequisites: [],
      targetMasteryForGoal: 85,
    },
    {
      id: 'c10-math-linear-quadratics',
      name: 'Linear & Quadratic Equations',
      category: 'Mathematics',
      domain: 'class10',
      description: 'Pair of linear equations in two variables, discriminant analysis, nature of roots & quadratic formula.',
      prerequisites: ['c10-math-real-polynomials'],
      targetMasteryForGoal: 85,
    },
    {
      id: 'c10-math-ap-progression',
      name: 'Arithmetic Progressions (AP)',
      category: 'Mathematics',
      domain: 'class10',
      description: 'Common difference, nth term formula (an = a + (n-1)d), and sum of first n terms (Sn).',
      prerequisites: ['c10-math-linear-quadratics'],
      targetMasteryForGoal: 80,
    },
    {
      id: 'c10-math-trigonometry',
      name: 'Introduction to Trigonometry',
      category: 'Mathematics',
      domain: 'class10',
      description: 'Trigonometric ratios (sin, cos, tan), standard angle table (0°-90°), identities & heights and distances.',
      prerequisites: ['c10-math-linear-quadratics'],
      targetMasteryForGoal: 85,
    },
    {
      id: 'c10-math-coordinate-geometry',
      name: 'Coordinate Geometry & Triangles',
      category: 'Mathematics',
      domain: 'class10',
      description: 'Distance formula, section formula for internal division, and basic proportionality theorem (BPT).',
      prerequisites: ['c10-math-real-polynomials'],
      targetMasteryForGoal: 80,
    },
    {
      id: 'c10-sci-chemical-reactions',
      name: 'Chemical Reactions & Equations',
      category: 'Science (Chemistry)',
      domain: 'class10',
      description: 'Balancing chemical equations, combination, decomposition, displacement, and redox reactions.',
      prerequisites: [],
      targetMasteryForGoal: 85,
    },
    {
      id: 'c10-sci-acids-bases-metals',
      name: 'Acids, Bases, Salts & Metals',
      category: 'Science (Chemistry)',
      domain: 'class10',
      description: 'pH scale, neutralization, chlor-alkali process, metal reactivity series & ionic bonding.',
      prerequisites: ['c10-sci-chemical-reactions'],
      targetMasteryForGoal: 80,
    },
    {
      id: 'c10-sci-carbon-compounds',
      name: 'Carbon and its Compounds',
      category: 'Science (Chemistry)',
      domain: 'class10',
      description: 'Covalent bonding in carbon, versatile nature, homologous series, functional groups & soaps.',
      prerequisites: ['c10-sci-acids-bases-metals'],
      targetMasteryForGoal: 85,
    },
    {
      id: 'c10-sci-light-reflection',
      name: 'Light: Reflection & Refraction',
      category: 'Science (Physics)',
      domain: 'class10',
      description: 'Spherical mirrors, mirror formula, magnification, Snell law, lens formula & power of lens.',
      prerequisites: [],
      targetMasteryForGoal: 85,
    },
    {
      id: 'c10-sci-electricity-magnetism',
      name: 'Electricity & Magnetic Effects',
      category: 'Science (Physics)',
      domain: 'class10',
      description: 'Ohm law, series and parallel resistance combinations, electric power & Fleming left-hand rule.',
      prerequisites: ['c10-sci-light-reflection'],
      targetMasteryForGoal: 85,
    }
  ],

  // B.TECH / SDE (NEETCODE-STYLE DSA & SYSTEMS DAG)
  swe: [
    {
      id: 'swe-dsa-arrays-hashing',
      name: 'Arrays & Hashing',
      category: 'Data Structures',
      domain: 'swe',
      description: 'Hash maps, frequency counting, prefix sums, and array manipulation (Contains Duplicate, Two Sum, Group Anagrams).',
      prerequisites: [],
      targetMasteryForGoal: 85,
    },
    {
      id: 'swe-dsa-two-pointers',
      name: 'Two Pointers',
      category: 'Algorithms',
      domain: 'swe',
      description: 'Opposite-end scans over strings and sorted arrays (Valid Palindrome, 3Sum, Container With Most Water).',
      prerequisites: ['swe-dsa-arrays-hashing'],
      targetMasteryForGoal: 85,
    },
    {
      id: 'swe-dsa-stack',
      name: 'Stack & Monotonic Stack',
      category: 'Data Structures',
      domain: 'swe',
      description: 'LIFO order, matching parentheses, reverse Polish notation, and monotonic next greater elements.',
      prerequisites: ['swe-dsa-arrays-hashing'],
      targetMasteryForGoal: 80,
    },
    {
      id: 'swe-dsa-sliding-window',
      name: 'Sliding Window',
      category: 'Algorithms',
      domain: 'swe',
      description: 'Dynamic length window expansion, longest substring without repeats, and minimum window substring.',
      prerequisites: ['swe-dsa-two-pointers'],
      targetMasteryForGoal: 80,
    },
    {
      id: 'swe-dsa-binary-search',
      name: 'Binary Search',
      category: 'Algorithms',
      domain: 'swe',
      description: 'Sorted search, rotated sorted arrays, search in 2D matrix, and finding peak element in O(log n).',
      prerequisites: ['swe-dsa-two-pointers'],
      targetMasteryForGoal: 85,
    },
    {
      id: 'swe-dsa-linked-list',
      name: 'Linked List',
      category: 'Data Structures',
      domain: 'swe',
      description: 'Node pointers, reversals, cycle detection (Floyd tortoise/hare), merge k-sorted lists & LRU cache.',
      prerequisites: ['swe-dsa-two-pointers'],
      targetMasteryForGoal: 80,
    },
    {
      id: 'swe-dsa-trees',
      name: 'Trees & Binary Search Trees',
      category: 'Data Structures',
      domain: 'swe',
      description: 'Inorder/Preorder/Postorder DFS, level-order BFS, lowest common ancestor, diameter & BST validation.',
      prerequisites: ['swe-dsa-binary-search', 'swe-dsa-linked-list'],
      targetMasteryForGoal: 80,
    },
    {
      id: 'swe-dsa-heaps-tries',
      name: 'Heaps & Tries',
      category: 'Advanced DSA',
      domain: 'swe',
      description: 'Priority queues, Top K Frequent elements, prefix trees & autocomplete indexing.',
      prerequisites: ['swe-dsa-trees'],
      targetMasteryForGoal: 75,
    },
    {
      id: 'swe-dsa-graphs-dp',
      name: 'Graphs & Dynamic Programming',
      category: 'Advanced DSA',
      domain: 'swe',
      description: 'Topological sort, Dijkstra shortest path, memoization & 1D/2D DP (Climbing Stairs, Coin Change, LCS).',
      prerequisites: ['swe-dsa-trees'],
      targetMasteryForGoal: 75,
    },
    {
      id: 'swe-backend-sql-apis',
      name: 'Databases, REST APIs & Systems',
      category: 'Backend',
      domain: 'swe',
      description: 'SQL Joins, B-Tree Indexing, REST API design, JWT auth, and production Docker containerization.',
      prerequisites: ['swe-dsa-arrays-hashing'],
      targetMasteryForGoal: 80,
    }
  ],

  // JAVA BACKEND DEVELOPER (SPRING BOOT & MICROSERVICES)
  java_backend: [
    {
      id: 'java-core-jvm',
      name: 'Core Java, OOP & JVM Architecture',
      category: 'Core Language',
      domain: 'java_backend',
      description: 'OOP Principles, Memory Model (Heap/Stack), Garbage Collection, Exception Handling & Multithreading.',
      prerequisites: [],
      targetMasteryForGoal: 85,
    },
    {
      id: 'java-collections-streams',
      name: 'Java Collections Framework & Streams API',
      category: 'Core Language',
      domain: 'java_backend',
      description: 'HashMap, ConcurrentHashMap, ArrayList, LinkedList, Functional Interfaces, Lambdas & Parallel Streams.',
      prerequisites: ['java-core-jvm'],
      targetMasteryForGoal: 85,
    },
    {
      id: 'java-spring-boot-core',
      name: 'Spring Boot & RESTful Microservices',
      category: 'Framework',
      domain: 'java_backend',
      description: 'Dependency Injection, Inversion of Control (IoC), Spring MVC, REST Controllers & Validation.',
      prerequisites: ['java-collections-streams'],
      targetMasteryForGoal: 80,
    },
    {
      id: 'java-jpa-hibernate',
      name: 'Spring Data JPA & Hibernate ORM',
      category: 'Database & ORM',
      domain: 'java_backend',
      description: 'Entity Relationships (@OneToMany, @ManyToMany), Transaction Management (@Transactional), N+1 Problem & QueryDSL.',
      prerequisites: ['java-spring-boot-core'],
      targetMasteryForGoal: 80,
    },
    {
      id: 'java-microservices-kafka',
      name: 'Microservices, Docker & Apache Kafka',
      category: 'Distributed Systems',
      domain: 'java_backend',
      description: 'Service Discovery (Eureka), API Gateway, Distributed Tracing, Event-Driven Messaging with Kafka & Dockerization.',
      prerequisites: ['java-jpa-hibernate'],
      targetMasteryForGoal: 75,
    }
  ],

  // AI & MACHINE LEARNING / LLM PIPELINES
  ai_ml: [
    {
      id: 'aiml-math-python',
      name: 'Python for AI & Linear Algebra Foundations',
      category: 'Foundations',
      domain: 'ai_ml',
      description: 'NumPy vectorized math, Matrix decompositions (SVD/Eigenvalues), Pandas DataFrames & Exploratory Data Analysis.',
      prerequisites: [],
      targetMasteryForGoal: 85,
    },
    {
      id: 'aiml-classical-ml',
      name: 'Supervised & Unsupervised Machine Learning',
      category: 'Machine Learning',
      domain: 'ai_ml',
      description: 'Linear/Logistic Regression, Random Forests, XGBoost, Cross-Validation, ROC-AUC, and Feature Engineering.',
      prerequisites: ['aiml-math-python'],
      targetMasteryForGoal: 80,
    },
    {
      id: 'aiml-deeplearning-pytorch',
      name: 'Deep Learning & PyTorch Architecture',
      category: 'Deep Learning',
      domain: 'ai_ml',
      description: 'Backpropagation, Neural Network layers, CNNs for vision, RNNs/Transformers & PyTorch training loops.',
      prerequisites: ['aiml-classical-ml'],
      targetMasteryForGoal: 80,
    },
    {
      id: 'aiml-llm-rag',
      name: 'Generative AI, LangChain & Vector RAG',
      category: 'Generative AI',
      domain: 'ai_ml',
      description: 'Transformer Attention mechanism, Prompt Engineering, LangChain / LlamaIndex, Vector DBs (Pinecone/Chroma) & Fine-Tuning.',
      prerequisites: ['aiml-deeplearning-pytorch'],
      targetMasteryForGoal: 75,
    }
  ],

  // JEE MAIN & ADVANCED (CLASS 11/12 HIGH-LEVEL EXAM PATHWAY)
  jee: [
    {
      id: 'jee-math-algebra',
      name: 'Quadratic Equations & Complex Numbers',
      category: 'Mathematics',
      domain: 'jee',
      description: 'Roots of quadratics, factor theorem, inequalities, sign schemes & Euler complex representation.',
      prerequisites: [],
      targetMasteryForGoal: 85,
    },
    {
      id: 'jee-math-trig-coord',
      name: 'Trigonometry & Coordinate Geometry',
      category: 'Mathematics',
      domain: 'jee',
      description: 'Straight lines, circles, parabola, ellipse, hyperbola, trigonometric identities and transformations.',
      prerequisites: ['jee-math-algebra'],
      targetMasteryForGoal: 80,
    },
    {
      id: 'jee-math-calculus',
      name: 'Differential & Integral Calculus',
      category: 'Mathematics',
      domain: 'jee',
      description: 'Limits, continuity, derivatives, tangents & normals, definite integrals, and area under curves.',
      prerequisites: ['jee-math-trig-coord'],
      targetMasteryForGoal: 85,
    },
    {
      id: 'jee-phy-kinematics-mechanics',
      name: 'Kinematics & Newton Laws of Motion',
      category: 'Physics',
      domain: 'jee',
      description: 'Vectors, 1D/2D projectile motion, friction, work-energy theorem, and circular motion.',
      prerequisites: [],
      targetMasteryForGoal: 85,
    },
    {
      id: 'jee-phy-thermo-waves',
      name: 'Thermodynamics, SHM & Waves',
      category: 'Physics',
      domain: 'jee',
      description: 'First & second laws of thermodynamics, kinetic theory of gases, simple harmonic motion, and Doppler effect.',
      prerequisites: ['jee-phy-kinematics-mechanics'],
      targetMasteryForGoal: 80,
    },
    {
      id: 'jee-chem-atomic-bonding',
      name: 'Atomic Structure & Chemical Bonding',
      category: 'Chemistry',
      domain: 'jee',
      description: 'Bohr model, quantum numbers, hybridization, VSEPR theory, and molecular orbital theory.',
      prerequisites: [],
      targetMasteryForGoal: 85,
    },
    {
      id: 'jee-chem-organic-foundations',
      name: 'Organic Reaction Mechanisms & GOC',
      category: 'Chemistry',
      domain: 'jee',
      description: 'Inductive/Mesomeric effects, carbocations, nucleophilic substitution, and hydrocarbons.',
      prerequisites: ['jee-chem-atomic-bonding'],
      targetMasteryForGoal: 80,
    }
  ]
};

// VERIFIED RESOURCE CATALOG WITH EMBEDDED VIDEO FORMAT
export const VERIFIED_RESOURCE_CATALOG: Record<string, LearningResource[]> = {
  // CLASS 10 VIDEOS
  'c10-math-real-polynomials': [
    {
      id: 'res-c10-real-numbers-yt',
      title: 'Class 10 Real Numbers & Euclid Lemma Full Masterclass',
      provider: 'Khan Academy / NCERT Official',
      type: 'Video',
      difficulty: 'Beginner',
      durationMinutes: 45,
      url: 'https://www.youtube.com/watch?v=7hR8XpLqE-A',
      videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/7hR8XpLqE-A',
      isFree: true,
      whyRecommended: 'Complete concept breakdown of Fundamental Theorem of Arithmetic and irrationality proofs with board exam questions.'
    },
    {
      id: 'res-c10-polynomials-yt',
      title: 'Polynomials & Geometric Meaning of Zeroes',
      provider: 'Khan Academy',
      type: 'Video',
      difficulty: 'Beginner',
      durationMinutes: 35,
      url: 'https://www.youtube.com/watch?v=8lJ_j8qL9X0',
      videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/8lJ_j8qL9X0',
      isFree: true,
      whyRecommended: 'Visual breakdown of parabolic graphs, number of zeroes, and relationship between zeroes and coefficients.'
    }
  ],
  'c10-math-linear-quadratics': [
    {
      id: 'res-c10-quadratics-video',
      title: 'Quadratic Equations: Splitting the Middle Term & Formula',
      provider: 'Khan Academy',
      type: 'Video',
      difficulty: 'Beginner',
      durationMinutes: 40,
      url: 'https://www.youtube.com/watch?v=i7idZfS8t8w',
      videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/i7idZfS8t8w',
      isFree: true,
      whyRecommended: 'Step-by-step discriminant analysis (D > 0, D = 0, D < 0) and high-yield word problems.'
    }
  ],
  'c10-math-trigonometry': [
    {
      id: 'res-c10-trig-video',
      title: 'Trigonometry Ratios, Identities & Values (0°-90°)',
      provider: 'Khan Academy / Unacademy',
      type: 'Video',
      difficulty: 'Intermediate',
      durationMinutes: 50,
      url: 'https://www.youtube.com/watch?v=PUB0TaZ7bhA',
      videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/PUB0TaZ7bhA',
      isFree: true,
      whyRecommended: 'Visual tricks to remember trigonometric ratios (sin, cos, tan) and prove standard trigonometric identities.'
    }
  ],
  'c10-sci-chemical-reactions': [
    {
      id: 'res-c10-chem-reactions-video',
      title: 'Chemical Reactions & Balancing Equations in 20 Minutes',
      provider: 'Khan Academy Science',
      type: 'Video',
      difficulty: 'Beginner',
      durationMinutes: 30,
      url: 'https://www.youtube.com/watch?v=2Juem0lcifE',
      videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/2Juem0lcifE',
      isFree: true,
      whyRecommended: 'Hands-on visual animations of displacement, combination, and redox oxidation-reduction reactions.'
    }
  ],
  'c10-sci-light-reflection': [
    {
      id: 'res-c10-light-optics-video',
      title: 'Light: Reflection, Refraction & Ray Diagrams Visualized',
      provider: 'Khan Academy Physics',
      type: 'Video',
      difficulty: 'Beginner',
      durationMinutes: 45,
      url: 'https://www.youtube.com/watch?v=FjCgY3pC6Y8',
      videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/FjCgY3pC6Y8',
      isFree: true,
      whyRecommended: 'Master all 6 concave mirror ray diagrams and convex lens refraction rules effortlessly.'
    }
  ],

  // B.TECH SWE / NEETCODE VIDEOS
  'swe-dsa-arrays-hashing': [
    {
      id: 'res-neetcode-arrays-hashing',
      title: 'Arrays & Hashing in 15 Minutes — NeetCode Guide',
      provider: 'NeetCode',
      type: 'Video',
      difficulty: 'Beginner',
      durationMinutes: 20,
      url: 'https://www.youtube.com/watch?v=70px_P9iV50',
      videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/70px_P9iV50',
      isFree: true,
      whyRecommended: 'Visual mental models for O(1) hash map lookups, Contains Duplicate, Two Sum, and Anagram grouping.'
    },
    {
      id: 'res-neetcode-twosum-video',
      title: 'Two Sum — Optimal One-Pass Hash Map Explained',
      provider: 'NeetCode',
      type: 'Video',
      difficulty: 'Beginner',
      durationMinutes: 12,
      url: 'https://www.youtube.com/watch?v=KLlXCFG5TnA',
      videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/KLlXCFG5TnA',
      isFree: true,
      whyRecommended: 'Line-by-line algorithm walkthrough transforming O(n²) brute force into O(n) hash map lookup.'
    }
  ],
  'swe-dsa-two-pointers': [
    {
      id: 'res-neetcode-twopointers-video',
      title: 'Two Pointers Pattern Explained with 3 LeetCode Problems',
      provider: 'NeetCode',
      type: 'Video',
      difficulty: 'Intermediate',
      durationMinutes: 25,
      url: 'https://www.youtube.com/watch?v=qnH_3q_2004',
      videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/qnH_3q_2004',
      isFree: true,
      whyRecommended: 'Learn when to use converging vs same-direction pointers on sorted structures.'
    }
  ],
  'swe-dsa-stack': [
    {
      id: 'res-neetcode-stack-video',
      title: 'Valid Parentheses & Monotonic Stack Deep Dive',
      provider: 'NeetCode',
      type: 'Video',
      difficulty: 'Intermediate',
      durationMinutes: 18,
      url: 'https://www.youtube.com/watch?v=WTzjTskDFMg',
      videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/WTzjTskDFMg',
      isFree: true,
      whyRecommended: 'Clean bracket-matching stack logic and monotonic next greater element pattern.'
    }
  ],
  'swe-dsa-binary-search': [
    {
      id: 'res-neetcode-binsearch-video',
      title: 'Binary Search Masterclass & Rotated Array Search',
      provider: 'NeetCode',
      type: 'Video',
      difficulty: 'Intermediate',
      durationMinutes: 22,
      url: 'https://www.youtube.com/watch?v=s4DPM8ct1pI',
      videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/s4DPM8ct1pI',
      isFree: true,
      whyRecommended: 'Never get off-by-one errors again with the standard lower-bound and upper-bound binary search template.'
    }
  ],
  'swe-dsa-trees': [
    {
      id: 'res-neetcode-trees-video',
      title: 'Binary Tree Traversals (DFS vs BFS) Visualized',
      provider: 'NeetCode / MIT OCW',
      type: 'Video',
      difficulty: 'Intermediate',
      durationMinutes: 30,
      url: 'https://www.youtube.com/watch?v=fAAZixBzIAI',
      videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/fAAZixBzIAI',
      isFree: true,
      whyRecommended: 'Master recursion mental models on Invert Binary Tree, Max Depth, and Lowest Common Ancestor.'
    }
  ],

  // JEE VIDEOS
  'jee-math-algebra': [
    {
      id: 'res-jee-quadratics-video',
      title: 'Quadratic Equations & Sign Schemes for JEE Advanced',
      provider: 'Khan Academy / Unacademy JEE',
      type: 'Video',
      difficulty: 'Intermediate',
      durationMinutes: 55,
      url: 'https://www.youtube.com/watch?v=J3o0f6A3F4c',
      videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/J3o0f6A3F4c',
      isFree: true,
      whyRecommended: 'Covers wavy-curve method, range of rational expressions, and location of roots.'
    }
  ],
  'jee-phy-kinematics-mechanics': [
    {
      id: 'res-jee-kinematics-video',
      title: 'Kinematics 1D & 2D Projectile Motion Masterclass',
      provider: 'Physics Galaxy / MIT OCW',
      type: 'Video',
      difficulty: 'Intermediate',
      durationMinutes: 60,
      url: 'https://www.youtube.com/watch?v=8V-a7d-8-yQ',
      videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/8V-a7d-8-yQ',
      isFree: true,
      whyRecommended: 'Vector resolution, relative motion, projectile on inclined plane, and shortest distance derivations.'
    }
  ]
};
