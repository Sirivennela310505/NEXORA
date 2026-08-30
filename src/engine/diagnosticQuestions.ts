import type { DiagnosticQuestion } from './types';

export const DIAGNOSTIC_QUESTIONS_DB: DiagnosticQuestion[] = [
  // ==========================================
  // 1. JEE: QUADRATIC EQUATIONS & COMPLEX NUMBERS (jee-math-algebra) — 10 Questions
  // ==========================================
  {
    id: 'q-jee-alg-1',
    skillId: 'jee-math-algebra',
    question: 'If α and β are roots of ax² + bx + c = 0, what is the value of (α² + β²)?',
    options: ['(b² - 2ac) / a²', '(b² + 2ac) / a²', '(b - 2ac) / a', 'b² / a²'],
    correctOptionIndex: 0,
    explanation: 'α² + β² = (α + β)² - 2αβ = (-b/a)² - 2(c/a) = (b² - 2ac) / a².',
    difficulty: 'Beginner'
  },
  {
    id: 'q-jee-alg-2',
    skillId: 'jee-math-algebra',
    question: 'For what condition on discriminant D does the quadratic expression ax² + bx + c have the same sign as "a" for all real values of x?',
    options: ['D < 0', 'D > 0', 'D = 0', 'D ≥ 0'],
    correctOptionIndex: 0,
    explanation: 'When D < 0, the parabola never crosses the x-axis, remaining entirely above (if a>0) or entirely below (if a<0).',
    difficulty: 'Intermediate'
  },
  {
    id: 'q-jee-alg-3',
    skillId: 'jee-math-algebra',
    question: 'What is the modulus and principal argument of the complex number z = -1 + i√3?',
    options: ['|z| = 2, arg(z) = 2π/3', '|z| = 2, arg(z) = π/3', '|z| = 4, arg(z) = 2π/3', '|z| = 2, arg(z) = -2π/3'],
    correctOptionIndex: 0,
    explanation: '|z| = √((-1)² + (√3)²) = 2. Since z lies in Quadrant II, arg(z) = π - tan⁻¹(√3/1) = π - π/3 = 2π/3.',
    difficulty: 'Intermediate'
  },
  {
    id: 'q-jee-alg-4',
    skillId: 'jee-math-algebra',
    question: 'If ω is a non-real cube root of unity (ω³ = 1), what is the value of 1 + ω + ω²?',
    options: ['0', '1', '-1', '3'],
    correctOptionIndex: 0,
    explanation: 'The sum of all cube roots of unity 1 + ω + ω² is identically equal to 0.',
    difficulty: 'Beginner'
  },
  {
    id: 'q-jee-alg-5',
    skillId: 'jee-math-algebra',
    question: 'If both roots of x² - 2kx + k² + k - 5 = 0 are less than 5, which inequality must k satisfy?',
    options: ['k < 4 and D ≥ 0', 'k > 5', 'k = 0', 'k > 10'],
    correctOptionIndex: 0,
    explanation: 'Location of roots requires: 1) D ≥ 0 (k ≤ 5), 2) -b/2a < 5 (k < 5), 3) f(5) > 0 (25 - 10k + k² + k - 5 > 0 -> (k-4)(k-5) > 0 => k < 4).',
    difficulty: 'Advanced'
  },
  {
    id: 'q-jee-alg-6',
    skillId: 'jee-math-algebra',
    question: 'What is the value of |z₁ + z₂|² + |z₁ - z₂|² for any two complex numbers z₁ and z₂?',
    options: ['2(|z₁|² + |z₂|²)', '|z₁|² + |z₂|²', '4|z₁||z₂|', '2(|z₁|² - |z₂|²)'],
    correctOptionIndex: 0,
    explanation: 'By the Parallelogram Law of complex numbers: |z₁ + z₂|² + |z₁ - z₂|² = 2(|z₁|² + |z₂|²).',
    difficulty: 'Intermediate'
  },
  {
    id: 'q-jee-alg-7',
    skillId: 'jee-math-algebra',
    question: 'If x² + px + q = 0 and x² + qx + p = 0 have a common root (p ≠ q), what is the value of (p + q)?',
    options: ['-1', '1', '0', '2'],
    correctOptionIndex: 0,
    explanation: 'Subtracting equations gives (p-q)x + (q-p) = 0 => (p-q)(x-1) = 0 => common root x = 1. Substituting x=1 gives 1 + p + q = 0 => p + q = -1.',
    difficulty: 'Intermediate'
  },
  {
    id: 'q-jee-alg-8',
    skillId: 'jee-math-algebra',
    question: 'What geometric shape does the locus of z satisfy for |z - z₁| = |z - z₂| in the Argand plane?',
    options: ['Perpendicular bisector of line joining z₁ and z₂', 'Circle passing through z₁ and z₂', 'Ellipse with foci at z₁ and z₂', 'Parabola'],
    correctOptionIndex: 0,
    explanation: 'The locus of points equidistant from z₁ and z₂ is the perpendicular bisector of the segment connecting them.',
    difficulty: 'Beginner'
  },
  {
    id: 'q-jee-alg-9',
    skillId: 'jee-math-algebra',
    question: 'What is the number of real solutions of the equation e^x - x = 0?',
    options: ['0', '1', '2', 'Infinite'],
    correctOptionIndex: 0,
    explanation: 'Since e^x > x for all real x (min value of e^x - x occurs at x=0 where f(0)=1 > 0), there are 0 real solutions.',
    difficulty: 'Intermediate'
  },
  {
    id: 'q-jee-alg-10',
    skillId: 'jee-math-algebra',
    question: 'By De Moivre Theorem, what is (cos θ + i sin θ)^n equal to for any integer n?',
    options: ['cos(nθ) + i sin(nθ)', 'n(cos θ + i sin θ)', 'cos^n(θ) + i sin^n(θ)', 'cos(θ/n) + i sin(θ/n)'],
    correctOptionIndex: 0,
    explanation: 'De Moivre Theorem states (cos θ + i sin θ)^n = cos(nθ) + i sin(nθ).',
    difficulty: 'Beginner'
  },

  // ==========================================
  // 2. JEE: CALCULUS (jee-math-calculus) — 10 Questions
  // ==========================================
  {
    id: 'q-calc-1',
    skillId: 'jee-math-calculus',
    question: 'What is the limit of (sin x) / x as x approaches 0?',
    options: ['0', '1', 'Infinity', 'Does not exist'],
    correctOptionIndex: 1,
    explanation: 'Using L’Hôpital’s rule (0/0 form) or Taylor expansion, lim(x->0) [cos x / 1] = 1.',
    difficulty: 'Beginner'
  },
  {
    id: 'q-calc-2',
    skillId: 'jee-math-calculus',
    question: 'What is the derivative of f(x) = ln(sec x + tan x) with respect to x?',
    options: ['sec x', 'tan x', 'sec² x', 'sec x tan x'],
    correctOptionIndex: 0,
    explanation: 'd/dx[ln(sec x + tan x)] = (sec x tan x + sec² x)/(sec x + tan x) = sec x(tan x + sec x)/(sec x + tan x) = sec x.',
    difficulty: 'Intermediate'
  },
  {
    id: 'q-calc-3',
    skillId: 'jee-math-calculus',
    question: 'If a function f(x) is continuous on [a, b] and differentiable on (a, b) with f(a) = f(b), which theorem guarantees at least one point c where f’(c) = 0?',
    options: ["Rolle's Theorem", "Lagrange's Mean Value Theorem", "Cauchy's Theorem", "Sandwich Theorem"],
    correctOptionIndex: 0,
    explanation: "Rolle's Theorem states that if f(a) = f(b), the tangent slope f'(c) must be zero somewhere in (a, b).",
    difficulty: 'Beginner'
  },
  {
    id: 'q-calc-4',
    skillId: 'jee-math-calculus',
    question: 'What is the value of the definite integral ∫ from -1 to 1 of x³ * cos(x) dx?',
    options: ['0', '1', '2', 'π/2'],
    correctOptionIndex: 0,
    explanation: 'The integrand f(x) = x³ cos(x) is an odd function. Any odd function integrated from -a to a is identically 0.',
    difficulty: 'Intermediate'
  },
  {
    id: 'q-calc-5',
    skillId: 'jee-math-calculus',
    question: 'For what value of x does f(x) = x³ - 3x² + 6 have a point of inflection?',
    options: ['x = 0', 'x = 1', 'x = 2', 'x = 3'],
    correctOptionIndex: 1,
    explanation: "f'(x) = 3x² - 6x, and f''(x) = 6x - 6 = 0 gives x = 1.",
    difficulty: 'Intermediate'
  },
  {
    id: 'q-calc-6',
    skillId: 'jee-math-calculus',
    question: 'What is the integrating factor (I.F.) for the linear differential equation dy/dx + P(x)y = Q(x)?',
    options: ['e^(∫ P(x) dx)', '∫ P(x) dx', 'e^(∫ Q(x) dx)', 'ln(P(x))'],
    correctOptionIndex: 0,
    explanation: 'The integrating factor is e^(∫ P(x) dx).',
    difficulty: 'Intermediate'
  },
  {
    id: 'q-calc-7',
    skillId: 'jee-math-calculus',
    question: 'Evaluate lim (x -> ∞) of (1 + 1/x)^x.',
    options: ['1', 'e', '0', 'Infinity'],
    correctOptionIndex: 1,
    explanation: 'Standard definition of Euler constant e ≈ 2.71828.',
    difficulty: 'Beginner'
  },
  {
    id: 'q-calc-8',
    skillId: 'jee-math-calculus',
    question: 'What is the area bounded by the parabola y² = 4ax and its latus rectum x = a?',
    options: ['(8/3) a²', '(4/3) a²', '(16/3) a²', '2 a²'],
    correctOptionIndex: 0,
    explanation: 'Area = 2 * ∫ from 0 to a of 2√(ax) dx = 4√a * [(2/3) x^(3/2)] = (8/3) a².',
    difficulty: 'Advanced'
  },
  {
    id: 'q-calc-9',
    skillId: 'jee-math-calculus',
    question: 'What is the derivative of e^(x²) with respect to x?',
    options: ['2x * e^(x²)', 'e^(x²)', 'x * e^(x²)', '2 * e^(x²)'],
    correctOptionIndex: 0,
    explanation: 'By the chain rule, d/dx[e^(x²)] = e^(x²) * 2x.',
    difficulty: 'Beginner'
  },
  {
    id: 'q-calc-10',
    skillId: 'jee-math-calculus',
    question: 'What is the antiderivative ∫ (1 / √(a² - x²)) dx?',
    options: ['sin⁻¹(x/a) + C', 'tan⁻¹(x/a) + C', 'sec⁻¹(x/a) + C', 'ln|x + √(a²-x²)| + C'],
    correctOptionIndex: 0,
    explanation: 'Standard trigonometric inverse form is sin⁻¹(x/a) + C.',
    difficulty: 'Beginner'
  },

  // ==========================================
  // 3. JEE: KINEMATICS & MECHANICS (jee-phy-kinematics-mechanics) — 10 Questions
  // ==========================================
  {
    id: 'q-phy-1',
    skillId: 'jee-phy-kinematics-mechanics',
    question: 'A projectile is launched with velocity u at angle θ to the horizontal. What is its horizontal range R?',
    options: ['(u² sin 2θ) / g', '(u² sin² θ) / 2g', '(2u sin θ) / g', '(u² cos 2θ) / g'],
    correctOptionIndex: 0,
    explanation: 'Horizontal Range R = u_x * T = (u cos θ) * (2u sin θ / g) = (u² sin 2θ) / g.',
    difficulty: 'Beginner'
  },
  {
    id: 'q-phy-2',
    skillId: 'jee-phy-kinematics-mechanics',
    question: 'In uniform circular motion of radius r with constant speed v, what is the direction and magnitude of acceleration?',
    options: ['v²/r directed towards the center', 'v²/r directed tangentially', 'zero acceleration', '2v²/r outwards'],
    correctOptionIndex: 0,
    explanation: 'Centripetal acceleration is always radially inwards with magnitude a_c = v²/r.',
    difficulty: 'Beginner'
  },
  {
    id: 'q-phy-3',
    skillId: 'jee-phy-kinematics-mechanics',
    question: 'According to the Work-Energy Theorem, the net work done by all forces on a particle equals:',
    options: ['Change in kinetic energy (ΔKE)', 'Change in potential energy (ΔPE)', 'Total mechanical energy', 'Zero always'],
    correctOptionIndex: 0,
    explanation: 'W_net = ΔK = K_final - K_initial for all conservative and non-conservative forces.',
    difficulty: 'Beginner'
  },
  {
    id: 'q-phy-4',
    skillId: 'jee-phy-kinematics-mechanics',
    question: 'What is the moment of inertia of a uniform solid cylinder of mass M and radius R about its longitudinal axis?',
    options: ['(1/2) M R²', 'M R²', '(2/5) M R²', '(2/3) M R²'],
    correctOptionIndex: 0,
    explanation: 'For a solid cylinder, integrating dm * r² yields I = (1/2) M R².',
    difficulty: 'Intermediate'
  },
  {
    id: 'q-phy-5',
    skillId: 'jee-phy-kinematics-mechanics',
    question: 'When is the total angular momentum L of a system conserved about an origin?',
    options: ['When external torque τ_ext = 0', 'When net external force F_ext = 0', 'When kinetic energy is constant', 'Always'],
    correctOptionIndex: 0,
    explanation: 'Since dL/dt = τ_ext, L remains constant when external torque is zero.',
    difficulty: 'Intermediate'
  },
  {
    id: 'q-phy-6',
    skillId: 'jee-phy-kinematics-mechanics',
    question: 'What is the maximum static friction force f_s between two surfaces with normal force N and coefficient μ_s?',
    options: ['f_s = μ_s * N', 'f_s = μ_k * N', 'f_s = N / μ_s', 'f_s = μ_s * g'],
    correctOptionIndex: 0,
    explanation: 'Limiting static friction is f_s(max) = μ_s * N.',
    difficulty: 'Beginner'
  },
  {
    id: 'q-phy-7',
    skillId: 'jee-phy-kinematics-mechanics',
    question: 'For a 1D elastic collision between two equal masses m₁ = m₂, what happens to their velocities after collision?',
    options: ['They completely interchange their velocities', 'Both come to rest', 'They stick together', 'Velocities remain identical'],
    correctOptionIndex: 0,
    explanation: 'For elastic collision (e=1) with equal masses, conservation of momentum and energy proves v₁ = u₂ and v₂ = u₁.',
    difficulty: 'Intermediate'
  },
  {
    id: 'q-phy-8',
    skillId: 'jee-phy-kinematics-mechanics',
    question: 'What is the escape velocity from Earth’s surface (mass M, radius R)?',
    options: ['√(2GM/R)', '√(GM/R)', '2√(GM/R)', '√(GM/2R)'],
    correctOptionIndex: 0,
    explanation: 'Setting Total Energy = 0: (1/2)mv² - GMm/R = 0 => v_e = √(2GM/R) ≈ 11.2 km/s.',
    difficulty: 'Beginner'
  },
  {
    id: 'q-phy-9',
    skillId: 'jee-phy-kinematics-mechanics',
    question: 'A particle moves with position x(t) = 3t² - 6t + 2. At what time t is the particle momentarily at rest?',
    options: ['t = 1 s', 't = 2 s', 't = 0.5 s', 't = 3 s'],
    correctOptionIndex: 0,
    explanation: 'Velocity v(t) = dx/dt = 6t - 6 = 0 => t = 1 s.',
    difficulty: 'Beginner'
  },
  {
    id: 'q-phy-10',
    skillId: 'jee-phy-kinematics-mechanics',
    question: 'What is the condition for pure rolling without slipping of a wheel of radius R moving with center-of-mass velocity v_cm and angular velocity ω?',
    options: ['v_cm = R * ω', 'v_cm = 2 R * ω', 'v_cm = R * ω / 2', 'v_cm = 0'],
    correctOptionIndex: 0,
    explanation: 'At the point of contact with ground, relative velocity is zero: v_contact = v_cm - Rω = 0 => v_cm = Rω.',
    difficulty: 'Intermediate'
  },

  // ==========================================
  // 4. CLASS 10: LINEAR & QUADRATIC EQUATIONS (c10-math-linear-quadratics) — 10 Questions
  // ==========================================
  {
    id: 'q-c10-lq-1',
    skillId: 'c10-math-linear-quadratics',
    question: 'For quadratic equation ax² + bx + c = 0, what condition on D = b² - 4ac guarantees two equal real roots?',
    options: ['D = 0', 'D > 0', 'D < 0', 'D ≥ 1'],
    correctOptionIndex: 0,
    explanation: 'When D = 0, x = -b/(2a), giving two identical real roots.',
    difficulty: 'Beginner'
  },
  {
    id: 'q-c10-lq-2',
    skillId: 'c10-math-linear-quadratics',
    question: 'If a pair of linear equations a₁x + b₁y + c₁ = 0 and a₂x + b₂y + c₂ = 0 has a unique solution, what must be true?',
    options: ['a₁/a₂ ≠ b₁/b₂', 'a₁/a₂ = b₁/b₂ = c₁/c₂', 'a₁/a₂ = b₁/b₂ ≠ c₁/c₂', 'a₁a₂ = b₁b₂'],
    correctOptionIndex: 0,
    explanation: 'Lines intersect at a single unique point if and only if slopes differ: a₁/a₂ ≠ b₁/b₂.',
    difficulty: 'Beginner'
  },
  {
    id: 'q-c10-lq-3',
    skillId: 'c10-math-linear-quadratics',
    question: 'Find the roots of the quadratic equation 2x² - 5x + 3 = 0.',
    options: ['1 and 3/2', '-1 and -3/2', '2 and 3', '1/2 and 3'],
    correctOptionIndex: 0,
    explanation: '2x² - 2x - 3x + 3 = 2x(x-1) - 3(x-1) = (2x-3)(x-1) = 0 => x = 1, 3/2.',
    difficulty: 'Beginner'
  },
  {
    id: 'q-c10-lq-4',
    skillId: 'c10-math-linear-quadratics',
    question: 'If lines representing linear equations are parallel, how many solutions does the system have?',
    options: ['No solution (inconsistent)', 'Infinitely many solutions', 'Exactly 1 solution', 'Exactly 2 solutions'],
    correctOptionIndex: 0,
    explanation: 'Parallel lines never intersect, so there is no common solution.',
    difficulty: 'Beginner'
  },
  {
    id: 'q-c10-lq-5',
    skillId: 'c10-math-linear-quadratics',
    question: 'What is the sum of roots of 3x² + 9x - 12 = 0?',
    options: ['-3', '3', '-4', '4'],
    correctOptionIndex: 0,
    explanation: 'Sum of roots = -b/a = -9/3 = -3.',
    difficulty: 'Beginner'
  },
  {
    id: 'q-c10-lq-6',
    skillId: 'c10-math-linear-quadratics',
    question: 'If one root of kx² - 14x + 8 = 0 is 2, what is the value of k?',
    options: ['k = 5', 'k = 3', 'k = 4', 'k = 2'],
    correctOptionIndex: 0,
    explanation: 'Substitute x = 2: k(2)² - 14(2) + 8 = 0 => 4k - 28 + 8 = 0 => 4k = 20 => k = 5.',
    difficulty: 'Intermediate'
  },
  {
    id: 'q-c10-lq-7',
    skillId: 'c10-math-linear-quadratics',
    question: 'What is the discriminant of the quadratic equation 2x² - 4x + 3 = 0?',
    options: ['-8 (No real roots)', '8 (Real roots)', '0 (Equal roots)', '4'],
    correctOptionIndex: 0,
    explanation: 'D = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8 < 0.',
    difficulty: 'Beginner'
  },
  {
    id: 'q-c10-lq-8',
    skillId: 'c10-math-linear-quadratics',
    question: 'Two numbers sum to 27 and their product is 182. What are the numbers?',
    options: ['13 and 14', '12 and 15', '10 and 17', '11 and 16'],
    correctOptionIndex: 0,
    explanation: 'x(27 - x) = 182 => x² - 27x + 182 = 0 => (x - 13)(x - 14) = 0 => 13 and 14.',
    difficulty: 'Intermediate'
  },
  {
    id: 'q-c10-lq-9',
    skillId: 'c10-math-linear-quadratics',
    question: 'If a₁/a₂ = b₁/b₂ = c₁/c₂ for a system of linear equations, what is the geometric relationship of the lines?',
    options: ['Coincident lines (infinitely many solutions)', 'Parallel lines (no solution)', 'Intersecting lines (unique solution)', 'Perpendicular lines'],
    correctOptionIndex: 0,
    explanation: 'Coincident lines lie on top of each other, sharing all infinite points.',
    difficulty: 'Beginner'
  },
  {
    id: 'q-c10-lq-10',
    skillId: 'c10-math-linear-quadratics',
    question: 'Which method uses the formula x = (-b ± √(b² - 4ac)) / (2a)?',
    options: ['Quadratic Formula (Sridharacharya Method)', 'Substitution Method', 'Elimination Method', 'Cross-multiplication'],
    correctOptionIndex: 0,
    explanation: 'This is the standard Quadratic Formula derived by Sridharacharya.',
    difficulty: 'Beginner'
  },

  // ==========================================
  // 5. B.TECH SWE: ARRAYS & HASHING (swe-dsa-arrays-hashing) — 10 Questions
  // ==========================================
  {
    id: 'q-sw-ah-1',
    skillId: 'swe-dsa-arrays-hashing',
    question: 'What is the average time complexity of insertion and lookup in a Hash Table?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
    correctOptionIndex: 0,
    explanation: 'With a uniform hash function, insertion and lookup are O(1) on average.',
    difficulty: 'Beginner'
  },
  {
    id: 'q-sw-ah-2',
    skillId: 'swe-dsa-arrays-hashing',
    question: 'How does Separate Chaining resolve hash collisions in a hash map?',
    options: [
      'Stores colliding keys in a linked list or tree at that bucket index',
      'Overwrites the existing value',
      'Doubles array size immediately',
      'Throws an exception'
    ],
    correctOptionIndex: 0,
    explanation: 'Colliding elements are chained in a bucket linked list or balanced tree.',
    difficulty: 'Intermediate'
  },
  {
    id: 'q-sw-ah-3',
    skillId: 'swe-dsa-arrays-hashing',
    question: 'Which algorithm solves Two Sum on an unsorted array in O(N) time?',
    options: [
      'Hash Map tracking the complement (target - current)',
      'Nested loops comparing all pairs O(N²)',
      'Binary Search on unsorted array',
      'QuickSort then linear scan'
    ],
    correctOptionIndex: 0,
    explanation: 'A Hash Map checks if complement exists in O(1) time per element.',
    difficulty: 'Intermediate'
  },
  {
    id: 'q-sw-ah-4',
    skillId: 'swe-dsa-arrays-hashing',
    question: 'What is the worst-case lookup complexity in a hash table when all keys collide into the same bucket?',
    options: ['O(N)', 'O(1)', 'O(log N)', 'O(N²)'],
    correctOptionIndex: 0,
    explanation: 'Degrades to linear search across the N chained elements in that bucket.',
    difficulty: 'Beginner'
  },
  {
    id: 'q-sw-ah-5',
    skillId: 'swe-dsa-arrays-hashing',
    question: 'What is the load factor threshold (e.g. 0.75 in Java HashMap) used for?',
    options: [
      'Threshold of entries/capacity at which the table capacity doubles and rehashes',
      'Maximum RAM allocation limit',
      'Garbage collector trigger',
      'Key encryption salt'
    ],
    correctOptionIndex: 0,
    explanation: 'When entries exceed capacity * loadFactor, resizing and rehashing occurs.',
    difficulty: 'Intermediate'
  },
  {
    id: 'q-sw-ah-6',
    skillId: 'swe-dsa-arrays-hashing',
    question: 'How can you group anagrams from a list of strings in O(N * K log K) or O(N * K) time?',
    options: [
      'Use sorted string or character count frequency tuple as Hash Map key',
      'Compare every pair with nested loops',
      'Convert strings to integers and sum them',
      'Use a single stack'
    ],
    correctOptionIndex: 0,
    explanation: 'Anagrams share identical character counts or sorted character representations.',
    difficulty: 'Intermediate'
  },
  {
    id: 'q-sw-ah-7',
    skillId: 'swe-dsa-arrays-hashing',
    question: 'Why must hash map keys be immutable in Java and Python?',
    options: [
      'If key fields mutate, their hash code changes and they cannot be retrieved from the bucket',
      'Mutable keys take more memory',
      'Compiler restricts mutable objects',
      'To prevent deadlocks'
    ],
    correctOptionIndex: 0,
    explanation: 'Mutating a key changes its hash code, making .get() check the wrong bucket.',
    difficulty: 'Advanced'
  },
  {
    id: 'q-sw-ah-8',
    skillId: 'swe-dsa-arrays-hashing',
    question: 'What is the Prefix Sum technique primarily used for on static arrays?',
    options: [
      'O(1) range sum queries after O(N) precomputation',
      'Sorting in O(N) time',
      'Finding the median in O(1) time',
      'Binary searching strings'
    ],
    correctOptionIndex: 0,
    explanation: 'Prefix sum array allows rangeSum(L, R) = prefix[R] - prefix[L-1] in O(1) time.',
    difficulty: 'Beginner'
  },
  {
    id: 'q-sw-ah-9',
    skillId: 'swe-dsa-arrays-hashing',
    question: 'What is the time complexity to find the Top K Frequent Elements using a Min-Heap of size K?',
    options: ['O(N log K)', 'O(N²)', 'O(K log N)', 'O(N log N)'],
    correctOptionIndex: 0,
    explanation: 'Counting frequencies takes O(N), and pushing into a size-K min-heap takes O(N log K).',
    difficulty: 'Intermediate'
  },
  {
    id: 'q-sw-ah-10',
    skillId: 'swe-dsa-arrays-hashing',
    question: 'What is the purpose of Consistent Hashing in distributed databases?',
    options: [
      'Minimizes key remapping when nodes are added or removed from a cluster',
      'Sorts database columns in parallel',
      'Encrypts network packets',
      'Compresses JSON responses'
    ],
    correctOptionIndex: 0,
    explanation: 'Consistent hashing ring maps keys to nodes so only K/N keys need relocation on cluster scaling.',
    difficulty: 'Advanced'
  }
];
