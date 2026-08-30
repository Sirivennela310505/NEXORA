export interface NeetCodeProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  leetcodeUrl: string;
  videoEmbedUrl: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  codeSolutions: {
    python: string;
    typescript: string;
    java: string;
    cpp: string;
  };
}

export interface NeetCodeNode {
  id: string;
  title: string;
  category: string;
  description: string;
  level: number;
  prerequisites: string[]; // parent node IDs
  color: string;
  badgeColor: string;
  problems: NeetCodeProblem[];
}

export interface NeetCodeTrack {
  id: string;
  title: string;
  description: string;
  icon: string;
  nodes: NeetCodeNode[];
}

export const CORE_DSA_TRACK: NeetCodeTrack = {
  id: 'core-dsa',
  title: 'Core DSA & Algorithms',
  description: 'Master data structures, graph traversals, dynamic programming, and algorithmic patterns.',
  icon: '🚀',
  nodes: [
    {
      id: 'arrays-hashing',
      title: 'Arrays & Hashing',
      category: 'Core Data Structures',
      description: 'Hash maps, frequency tables, prefix sums & array manipulation fundamentals.',
      level: 0,
      prerequisites: [],
      color: '#3b82f6',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      problems: [
        {
          id: 'p-contains-dup',
          title: 'Contains Duplicate',
          difficulty: 'Easy',
          category: 'Arrays & Hashing',
          leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/',
          videoEmbedUrl: 'https://www.youtube.com/embed/3OamzN90kPg',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          description: 'Given an integer array nums, return true if any value appears at least twice in the array.',
          codeSolutions: {
            python: `class Solution:\n    def hasDuplicate(self, nums: List[int]) -> bool:\n        seen = set()\n        for num in nums:\n            if num in seen:\n                return True\n            seen.add(num)\n        return False`,
            typescript: `function containsDuplicate(nums: number[]): boolean {\n    const seen = new Set<number>();\n    for (const num of nums) {\n        if (seen.has(num)) return true;\n        seen.add(num);\n    }\n    return false;\n};`,
            java: `class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        Set<Integer> seen = new HashSet<>();\n        for (int num : nums) {\n            if (!seen.add(num)) return true;\n        }\n        return false;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        unordered_set<int> seen;\n        for (int num : nums) {\n            if (seen.count(num)) return true;\n            seen.insert(num);\n        }\n        return false;\n    }\n};`
          }
        },
        {
          id: 'p-valid-anagram',
          title: 'Valid Anagram',
          difficulty: 'Easy',
          category: 'Arrays & Hashing',
          leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/',
          videoEmbedUrl: 'https://www.youtube.com/embed/9UtInBqnCgA',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)',
          description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
          codeSolutions: {
            python: `class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        if len(s) != len(t): return False\n        count = [0] * 26\n        for c1, c2 in zip(s, t):\n            count[ord(c1) - ord('a')] += 1\n            count[ord(c2) - ord('a')] -= 1\n        return all(c == 0 for c in count)`,
            typescript: `function isAnagram(s: string, t: string): boolean {\n    if (s.length !== t.length) return false;\n    const map = new Map<string, number>();\n    for (const c of s) map.set(c, (map.get(c) || 0) + 1);\n    for (const c of t) {\n        if (!map.get(c)) return false;\n        map.set(c, map.get(c)! - 1);\n    }\n    return true;\n};`,
            java: `class Solution {\n    public boolean isAnagram(String s, String t) {\n        if (s.length() != t.length()) return false;\n        int[] count = new int[26];\n        for (int i = 0; i < s.length(); i++) {\n            count[s.charAt(i) - 'a']++;\n            count[t.charAt(i) - 'a']--;\n        }\n        for (int c : count) if (c != 0) return false;\n        return true;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        if (s.size() != t.size()) return false;\n        vector<int> counts(26, 0);\n        for (int i = 0; i < s.size(); i++) {\n            counts[s[i] - 'a']++;\n            counts[t[i] - 'a']--;\n        }\n        for (int c : counts) if (c != 0) return false;\n        return true;\n    }\n};`
          }
        },
        {
          id: 'p-two-sum',
          title: 'Two Sum',
          difficulty: 'Easy',
          category: 'Arrays & Hashing',
          leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
          videoEmbedUrl: 'https://www.youtube.com/embed/KLlXCFG5TnA',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
          codeSolutions: {
            python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        seen = {}\n        for i, n in enumerate(nums):\n            diff = target - n\n            if diff in seen:\n                return [seen[diff], i]\n            seen[n] = i`,
            typescript: `function twoSum(nums: number[], target: number): number[] {\n    const map = new Map<number, number>();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) return [map.get(complement)!, i];\n        map.set(nums[i], i);\n    }\n    return [];\n};`,
            java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) return new int[]{map.get(comp), i};\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}`,
            cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> map;\n        for (int i = 0; i < nums.size(); i++) {\n            int comp = target - nums[i];\n            if (map.count(comp)) return {map[comp], i};\n            map[nums[i]] = i;\n        }\n        return {};\n    }\n};`
          }
        },
        {
          id: 'p-group-anagrams',
          title: 'Group Anagrams',
          difficulty: 'Medium',
          category: 'Arrays & Hashing',
          leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/',
          videoEmbedUrl: 'https://www.youtube.com/embed/vzdNOK2oB2E',
          timeComplexity: 'O(m * n)',
          spaceComplexity: 'O(m * n)',
          description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
          codeSolutions: {
            python: `class Solution:\n    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:\n        res = defaultdict(list)\n        for s in strs:\n            count = [0] * 26\n            for c in s:\n                count[ord(c) - ord('a')] += 1\n            res[tuple(count)].append(s)\n        return list(res.values())`,
            typescript: `function groupAnagrams(strs: string[]): string[][] {\n    const map = new Map<string, string[]>();\n    for (const str of strs) {\n        const key = str.split('').sort().join('');\n        if (!map.has(key)) map.set(key, []);\n        map.get(key)!.push(str);\n    }\n    return Array.from(map.values());\n};`,
            java: `class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        Map<String, List<String>> map = new HashMap<>();\n        for (String s : strs) {\n            char[] ca = s.toCharArray();\n            Arrays.sort(ca);\n            String key = String.valueOf(ca);\n            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);\n        }\n        return new ArrayList<>(map.values());\n    }\n}`,
            cpp: `class Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        unordered_map<string, vector<string>> map;\n        for (const string& s : strs) {\n            string key = s;\n            sort(key.begin(), key.end());\n            map[key].push_back(s);\n        }\n        vector<vector<string>> result;\n        for (auto& pair : map) result.push_back(pair.second);\n        return result;\n    }\n};`
          }
        },
        {
          id: 'p-top-k-frequent',
          title: 'Top K Frequent Elements',
          difficulty: 'Medium',
          category: 'Arrays & Hashing',
          leetcodeUrl: 'https://leetcode.com/problems/top-k-frequent-elements/',
          videoEmbedUrl: 'https://www.youtube.com/embed/YPTqKIgVk-k',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          description: 'Given an integer array nums and an integer k, return the k most frequent elements using bucket sort.',
          codeSolutions: {
            python: `class Solution:\n    def topKFrequent(self, nums: List[int], k: int) -> List[int]:\n        count = Counter(nums)\n        freq = [[] for _ in range(len(nums) + 1)]\n        for n, c in count.items():\n            freq[c].append(n)\n        res = []\n        for i in range(len(freq) - 1, 0, -1):\n            for n in freq[i]:\n                res.append(n)\n                if len(res) == k:\n                    return res`,
            typescript: `function topKFrequent(nums: number[], k: number): number[] {\n    const map = new Map<number, number>();\n    nums.forEach(n => map.set(n, (map.get(n) || 0) + 1));\n    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, k).map(e => e[0]);\n};`,
            java: `class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int n : nums) map.put(n, map.getOrDefault(n, 0) + 1);\n        PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> map.get(a) - map.get(b));\n        for (int n : map.keySet()) {\n            pq.offer(n);\n            if (pq.size() > k) pq.poll();\n        }\n        return pq.stream().mapToInt(i -> i).toArray();\n    }\n}`,
            cpp: `class Solution {\npublic:\n    vector<int> topKFrequent(vector<int>& nums, int k) {\n        unordered_map<int, int> count;\n        for (int n : nums) count[n]++;\n        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;\n        for (auto& [val, freq] : count) {\n            pq.push({freq, val});\n            if (pq.size() > k) pq.pop();\n        }\n        vector<int> res;\n        while (!pq.empty()) {\n            res.push_back(pq.top().second);\n            pq.pop();\n        }\n        return res;\n    }\n};`
          }
        },
        {
          id: 'p-product-array-except-self',
          title: 'Product of Array Except Self',
          difficulty: 'Medium',
          category: 'Arrays & Hashing',
          leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/',
          videoEmbedUrl: 'https://www.youtube.com/embed/bNvIQI2wAjk',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)',
          description: 'Return an array answer such that answer[i] is equal to the product of all elements of nums except nums[i] in O(n) without division.',
          codeSolutions: {
            python: `class Solution:\n    def productExceptSelf(self, nums: List[int]) -> List[int]:\n        res = [1] * len(nums)\n        prefix = 1\n        for i in range(len(nums)):\n            res[i] = prefix\n            prefix *= nums[i]\n        postfix = 1\n        for i in range(len(nums) - 1, -1, -1):\n            res[i] *= postfix\n            postfix *= nums[i]\n        return res`,
            typescript: `function productExceptSelf(nums: number[]): number[] {\n    const res = new Array(nums.length).fill(1);\n    let prefix = 1;\n    for (let i = 0; i < nums.length; i++) {\n        res[i] = prefix;\n        prefix *= nums[i];\n    }\n    let postfix = 1;\n    for (let i = nums.length - 1; i >= 0; i--) {\n        res[i] *= postfix;\n        postfix *= nums[i];\n    }\n    return res;\n};`,
            java: `class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        int[] res = new int[nums.length];\n        int prefix = 1;\n        for (int i = 0; i < nums.length; i++) {\n            res[i] = prefix;\n            prefix *= nums[i];\n        }\n        int postfix = 1;\n        for (int i = nums.length - 1; i >= 0; i--) {\n            res[i] *= postfix;\n            postfix *= nums[i];\n        }\n        return res;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        int n = nums.size();\n        vector<int> res(n, 1);\n        int prefix = 1;\n        for (int i = 0; i < n; i++) {\n            res[i] = prefix;\n            prefix *= nums[i];\n        }\n        int postfix = 1;\n        for (int i = n - 1; i >= 0; i--) {\n            res[i] *= postfix;\n            postfix *= nums[i];\n        }\n        return res;\n    }\n};`
          }
        },
        {
          id: 'p-valid-sudoku',
          title: 'Valid Sudoku',
          difficulty: 'Medium',
          category: 'Arrays & Hashing',
          leetcodeUrl: 'https://leetcode.com/problems/valid-sudoku/',
          videoEmbedUrl: 'https://www.youtube.com/embed/TjFXEUCMqI8',
          timeComplexity: 'O(9^2)',
          spaceComplexity: 'O(9^2)',
          description: 'Determine if a 9 x 9 Sudoku board is valid by checking rows, columns, and 3x3 sub-boxes.',
          codeSolutions: {
            python: `class Solution:\n    def isValidSudoku(self, board: List[List[str]]) -> bool:\n        cols = collections.defaultdict(set)\n        rows = collections.defaultdict(set)\n        squares = collections.defaultdict(set)\n        for r in range(9):\n            for c in range(9):\n                if board[r][c] == ".": continue\n                if (board[r][c] in rows[r] or\n                    board[r][c] in cols[c] or\n                    board[r][c] in squares[(r // 3, c // 3)]):\n                    return False\n                cols[c].add(board[r][c])\n                rows[r].add(board[r][c])\n                squares[(r // 3, c // 3)].add(board[r][c])\n        return True`,
            typescript: `function isValidSudoku(board: string[][]): boolean {\n    const seen = new Set<string>();\n    for (let r = 0; r < 9; r++) {\n        for (let c = 0; c < 9; c++) {\n            const val = board[r][c];\n            if (val === '.') continue;\n            const rowKey = \`\${val} in row \${r}\`;\n            const colKey = \`\${val} in col \${c}\`;\n            const boxKey = \`\${val} in box \${Math.floor(r / 3)}-\${Math.floor(c / 3)}\`;\n            if (seen.has(rowKey) || seen.has(colKey) || seen.has(boxKey)) return false;\n            seen.add(rowKey); seen.add(colKey); seen.add(boxKey);\n        }\n    }\n    return true;\n};`,
            java: `class Solution {\n    public boolean isValidSudoku(char[][] board) {\n        Set<String> seen = new HashSet<>();\n        for (int i = 0; i < 9; i++) {\n            for (int j = 0; j < 9; j++) {\n                char c = board[i][j];\n                if (c != '.') {\n                    if (!seen.add(c + " in row " + i) ||\n                        !seen.add(c + " in col " + j) ||\n                        !seen.add(c + " in box " + i/3 + "-" + j/3)) return false;\n                }\n            }\n        }\n        return true;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    bool isValidSudoku(vector<vector<char>>& board) {\n        unordered_set<string> seen;\n        for (int r = 0; r < 9; r++) {\n            for (int c = 0; c < 9; c++) {\n                if (board[r][c] == '.') continue;\n                string val(1, board[r][c]);\n                if (!seen.insert(val + "r" + to_string(r)).second ||\n                    !seen.insert(val + "c" + to_string(c)).second ||\n                    !seen.insert(val + "b" + to_string(r / 3) + to_string(c / 3)).second) return false;\n            }\n        }\n        return true;\n    }\n};`
          }
        },
        {
          id: 'p-longest-consecutive',
          title: 'Longest Consecutive Sequence',
          difficulty: 'Medium',
          category: 'Arrays & Hashing',
          leetcodeUrl: 'https://leetcode.com/problems/longest-consecutive-sequence/',
          videoEmbedUrl: 'https://www.youtube.com/embed/P6RZZMu_maU',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          description: 'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence in O(n) time.',
          codeSolutions: {
            python: `class Solution:\n    def longestConsecutive(self, nums: List[int]) -> int:\n        numSet = set(nums)\n        longest = 0\n        for n in numSet:\n            if (n - 1) not in numSet:\n                length = 1\n                while (n + length) in numSet:\n                    length += 1\n                longest = max(length, longest)\n        return longest`,
            typescript: `function longestConsecutive(nums: number[]): number {\n    const set = new Set(nums);\n    let longest = 0;\n    for (const num of set) {\n        if (!set.has(num - 1)) {\n            let current = num;\n            let count = 1;\n            while (set.has(current + 1)) {\n                current += 1;\n                count += 1;\n            }\n            longest = Math.max(longest, count);\n        }\n    }\n    return longest;\n};`,
            java: `class Solution {\n    public int longestConsecutive(int[] nums) {\n        Set<Integer> set = new HashSet<>();\n        for (int n : nums) set.add(n);\n        int longest = 0;\n        for (int n : set) {\n            if (!set.contains(n - 1)) {\n                int len = 1;\n                while (set.contains(n + len)) len++;\n                longest = Math.max(longest, len);\n            }\n        }\n        return longest;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int longestConsecutive(vector<int>& nums) {\n        unordered_set<int> s(nums.begin(), nums.end());\n        int longest = 0;\n        for (int n : s) {\n            if (!s.count(n - 1)) {\n                int len = 1;\n                while (s.count(n + len)) len++;\n                longest = max(longest, len);\n            }\n        }\n        return longest;\n    }\n};`
          }
        }
      ]
    },
    {
      id: 'two-pointers',
      title: 'Two Pointers',
      category: 'Algorithms',
      description: 'Opposite-end scans over strings and sorted arrays for pair matching and palindrome verification.',
      level: 1,
      prerequisites: ['arrays-hashing'],
      color: '#10b981',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      problems: [
        {
          id: 'p-valid-palindrome',
          title: 'Valid Palindrome',
          difficulty: 'Easy',
          category: 'Two Pointers',
          leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/',
          videoEmbedUrl: 'https://www.youtube.com/embed/jJXJ16kPFWg',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)',
          description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase and removing non-alphanumeric characters, it reads the same forward and backward.',
          codeSolutions: {
            python: `class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        l, r = 0, len(s) - 1\n        while l < r:\n            while l < r and not s[l].isalnum(): l += 1\n            while l < r and not s[r].isalnum(): r -= 1\n            if s[l].lower() != s[r].lower(): return False\n            l, r = l + 1, r - 1\n        return True`,
            typescript: `function isPalindrome(s: string): boolean {\n    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n    let l = 0, r = cleaned.length - 1;\n    while (l < r) {\n        if (cleaned[l] !== cleaned[r]) return false;\n        l++; r--;\n    }\n    return true;\n};`,
            java: `class Solution {\n    public boolean isPalindrome(String s) {\n        int l = 0, r = s.length() - 1;\n        while (l < r) {\n            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;\n            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;\n            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;\n            l++; r--;\n        }\n        return true;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    bool isPalindrome(string s) {\n        int l = 0, r = s.size() - 1;\n        while (l < r) {\n            while (l < r && !isalnum(s[l])) l++;\n            while (l < r && !isalnum(s[r])) r--;\n            if (tolower(s[l]) != tolower(s[r])) return false;\n            l++; r--;\n        }\n        return true;\n    }\n};`
          }
        },
        {
          id: 'p-3sum',
          title: '3Sum',
          difficulty: 'Medium',
          category: 'Two Pointers',
          leetcodeUrl: 'https://leetcode.com/problems/3sum/',
          videoEmbedUrl: 'https://www.youtube.com/embed/jzZsG8n2R9A',
          timeComplexity: 'O(n^2)',
          spaceComplexity: 'O(1)',
          description: 'Given an integer array nums, return all triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
          codeSolutions: {
            python: `class Solution:\n    def threeSum(self, nums: List[int]) -> List[List[int]]:\n        res = []\n        nums.sort()\n        for i, a in enumerate(nums):\n            if a > 0: break\n            if i > 0 and a == nums[i - 1]: continue\n            l, r = i + 1, len(nums) - 1\n            while l < r:\n                threeSum = a + nums[l] + nums[r]\n                if threeSum > 0: r -= 1\n                elif threeSum < 0: l += 1\n                else:\n                    res.append([a, nums[l], nums[r]])\n                    l += 1; r -= 1\n                    while nums[l] == nums[l - 1] and l < r: l += 1\n        return res`,
            typescript: `function threeSum(nums: number[]): number[][] {\n    const res: number[][] = [];\n    nums.sort((a, b) => a - b);\n    for (let i = 0; i < nums.length - 2; i++) {\n        if (i > 0 && nums[i] === nums[i - 1]) continue;\n        let l = i + 1, r = nums.length - 1;\n        while (l < r) {\n            const sum = nums[i] + nums[l] + nums[r];\n            if (sum === 0) {\n                res.push([nums[i], nums[l], nums[r]]);\n                while (l < r && nums[l] === nums[l + 1]) l++;\n                while (l < r && nums[r] === nums[r - 1]) r--;\n                l++; r--;\n            } else if (sum < 0) l++;\n            else r--;\n        }\n    }\n    return res;\n};`,
            java: `class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        Arrays.sort(nums);\n        List<List<Integer>> res = new ArrayList<>();\n        for (int i = 0; i < nums.length - 2; i++) {\n            if (i > 0 && nums[i] == nums[i - 1]) continue;\n            int l = i + 1, r = nums.length - 1;\n            while (l < r) {\n                int sum = nums[i] + nums[l] + nums[r];\n                if (sum == 0) {\n                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));\n                    while (l < r && nums[l] == nums[l + 1]) l++;\n                    while (l < r && nums[r] == nums[r - 1]) r--;\n                    l++; r--;\n                } else if (sum < 0) l++;\n                else r--;\n            }\n        }\n        return res;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        sort(nums.begin(), nums.end());\n        vector<vector<int>> res;\n        for (int i = 0; i < nums.size(); i++) {\n            if (i > 0 && nums[i] == nums[i - 1]) continue;\n            int l = i + 1, r = nums.size() - 1;\n            while (l < r) {\n                int sum = nums[i] + nums[l] + nums[r];\n                if (sum == 0) {\n                    res.push_back({nums[i], nums[l], nums[r]});\n                    while (l < r && nums[l] == nums[l + 1]) l++;\n                    while (l < r && nums[r] == nums[r - 1]) r--;\n                    l++; r--;\n                } else if (sum < 0) l++;\n                else r--;\n            }\n        }\n        return res;\n    }\n};`
          }
        },
        {
          id: 'p-container-most-water',
          title: 'Container With Most Water',
          difficulty: 'Medium',
          category: 'Two Pointers',
          leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/',
          videoEmbedUrl: 'https://www.youtube.com/embed/UuiTKBwPgAo',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)',
          description: 'Find two lines that together with the x-axis form a container, such that the container contains the most water.',
          codeSolutions: {
            python: `class Solution:\n    def maxArea(self, height: List[int]) -> int:\n        l, r = 0, len(height) - 1\n        max_water = 0\n        while l < r:\n            area = (r - l) * min(height[l], height[r])\n            max_water = max(max_water, area)\n            if height[l] < height[r]: l += 1\n            else: r -= 1\n        return max_water`,
            typescript: `function maxArea(height: number[]): number {\n    let l = 0, r = height.length - 1, maxArea = 0;\n    while (l < r) {\n        const area = Math.min(height[l], height[r]) * (r - l);\n        maxArea = Math.max(maxArea, area);\n        if (height[l] < height[r]) l++;\n        else r--;\n    }\n    return maxArea;\n};`,
            java: `class Solution {\n    public int maxArea(int[] height) {\n        int l = 0, r = height.length - 1, max = 0;\n        while (l < r) {\n            max = Math.max(max, Math.min(height[l], height[r]) * (r - l));\n            if (height[l] < height[r]) l++; else r--;\n        }\n        return max;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        int l = 0, r = height.size() - 1, maxW = 0;\n        while (l < r) {\n            maxW = max(maxW, min(height[l], height[r]) * (r - l));\n            if (height[l] < height[r]) l++; else r--;\n        }\n        return maxW;\n    }\n};`
          }
        },
        {
          id: 'p-trapping-rain-water',
          title: 'Trapping Rain Water',
          difficulty: 'Hard',
          category: 'Two Pointers',
          leetcodeUrl: 'https://leetcode.com/problems/trapping-rain-water/',
          videoEmbedUrl: 'https://www.youtube.com/embed/ZI2z5pq0TqA',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)',
          description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
          codeSolutions: {
            python: `class Solution:\n    def trap(self, height: List[int]) -> int:\n        if not height: return 0\n        l, r = 0, len(height) - 1\n        leftMax, rightMax = height[l], height[r]\n        res = 0\n        while l < r:\n            if leftMax < rightMax:\n                l += 1\n                leftMax = max(leftMax, height[l])\n                res += leftMax - height[l]\n            else:\n                r -= 1\n                rightMax = max(rightMax, height[r])\n                res += rightMax - height[r]\n        return res`,
            typescript: `function trap(height: number[]): number {\n    let l = 0, r = height.length - 1, leftMax = 0, rightMax = 0, res = 0;\n    while (l < r) {\n        if (height[l] < height[r]) {\n            if (height[l] >= leftMax) leftMax = height[l];\n            else res += leftMax - height[l];\n            l++;\n        } else {\n            if (height[r] >= rightMax) rightMax = height[r];\n            else res += rightMax - height[r];\n            r--;\n        }\n    }\n    return res;\n};`,
            java: `class Solution {\n    public int trap(int[] height) {\n        int l = 0, r = height.length - 1, leftMax = 0, rightMax = 0, res = 0;\n        while (l < r) {\n            if (height[l] < height[r]) {\n                if (height[l] >= leftMax) leftMax = height[l];\n                else res += leftMax - height[l];\n                l++;\n            } else {\n                if (height[r] >= rightMax) rightMax = height[r];\n                else res += rightMax - height[r];\n                r--;\n            }\n        }\n        return res;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int trap(vector<int>& height) {\n        int l = 0, r = height.size() - 1, leftMax = 0, rightMax = 0, res = 0;\n        while (l < r) {\n            if (height[l] < height[r]) {\n                leftMax = max(leftMax, height[l]);\n                res += leftMax - height[l++];\n            } else {\n                rightMax = max(rightMax, height[r]);\n                res += rightMax - height[r--];\n            }\n        }\n        return res;\n    }\n};`
          }
        }
      ]
    },
    {
      id: 'stack',
      title: 'Stack & Monotonic Stack',
      category: 'Data Structures',
      description: 'LIFO evaluation, parentheses balancing, Reverse Polish Notation & Next Greater Element patterns.',
      level: 1,
      prerequisites: ['arrays-hashing'],
      color: '#8b5cf6',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      problems: [
        {
          id: 'p-valid-parentheses',
          title: 'Valid Parentheses',
          difficulty: 'Easy',
          category: 'Stack',
          leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/',
          videoEmbedUrl: 'https://www.youtube.com/embed/WTzjTskDFMg',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          description: 'Given a string s containing just characters ()[]{}, determine if the input string is valid.',
          codeSolutions: {
            python: `class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []\n        closeToOpen = {')': '(', ']': '[', '}': '{'}\n        for c in s:\n            if c in closeToOpen:\n                if stack and stack[-1] == closeToOpen[c]:\n                    stack.pop()\n                else:\n                    return False\n            else:\n                stack.append(c)\n        return True if not stack else False`,
            typescript: `function isValid(s: string): boolean {\n    const stack: string[] = [];\n    const pairs: Record<string, string> = { ')': '(', '}': '{', ']': '[' };\n    for (const c of s) {\n        if (c in pairs) {\n            if (stack.pop() !== pairs[c]) return false;\n        } else {\n            stack.push(c);\n        }\n    }\n    return stack.length === 0;\n};`,
            java: `class Solution {\n    public boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}`,
            cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        for (char c : s) {\n            if (c == '(' || c == '{' || c == '[') st.push(c);\n            else {\n                if (st.empty()) return false;\n                if (c == ')' && st.top() != '(') return false;\n                if (c == '}' && st.top() != '{') return false;\n                if (c == ']' && st.top() != '[') return false;\n                st.pop();\n            }\n        }\n        return st.empty();\n    }\n};`
          }
        },
        {
          id: 'p-min-stack',
          title: 'Min Stack',
          difficulty: 'Medium',
          category: 'Stack',
          leetcodeUrl: 'https://leetcode.com/problems/min-stack/',
          videoEmbedUrl: 'https://www.youtube.com/embed/qkLl7nAwDPo',
          timeComplexity: 'O(1)',
          spaceComplexity: 'O(n)',
          description: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant O(1) time.',
          codeSolutions: {
            python: `class MinStack:\n    def __init__(self):\n        self.stack = []\n        self.minStack = []\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        val = min(val, self.minStack[-1] if self.minStack else val)\n        self.minStack.append(val)\n    def pop(self) -> None:\n        self.stack.pop()\n        self.minStack.pop()\n    def top(self) -> int:\n        return self.stack[-1]\n    def getMin(self) -> int:\n        return self.minStack[-1]`,
            typescript: `class MinStack {\n    private stack: number[] = [];\n    private minStack: number[] = [];\n    push(val: number): void {\n        this.stack.push(val);\n        const min = this.minStack.length ? Math.min(val, this.minStack[this.minStack.length - 1]) : val;\n        this.minStack.push(min);\n    }\n    pop(): void { this.stack.pop(); this.minStack.pop(); }\n    top(): number { return this.stack[this.stack.length - 1]; }\n    getMin(): number { return this.minStack[this.minStack.length - 1]; }\n}`,
            java: `class MinStack {\n    private Stack<Integer> stack = new Stack<>();\n    private Stack<Integer> minStack = new Stack<>();\n    public void push(int val) {\n        stack.push(val);\n        if (minStack.isEmpty() || val <= minStack.peek()) minStack.push(val);\n        else minStack.push(minStack.peek());\n    }\n    public void pop() { stack.pop(); minStack.pop(); }\n    public int top() { return stack.peek(); }\n    public int getMin() { return minStack.peek(); }\n}`,
            cpp: `class MinStack {\n    stack<int> s, minS;\npublic:\n    void push(int val) {\n        s.push(val);\n        if (minS.empty() || val <= minS.top()) minS.push(val);\n        else minS.push(minS.top());\n    }\n    void pop() { s.pop(); minS.pop(); }\n    int top() { return s.top(); }\n    int getMin() { return minS.top(); }\n};`
          }
        },
        {
          id: 'p-daily-temperatures',
          title: 'Daily Temperatures',
          difficulty: 'Medium',
          category: 'Stack',
          leetcodeUrl: 'https://leetcode.com/problems/daily-temperatures/',
          videoEmbedUrl: 'https://www.youtube.com/embed/cTBiBSnjO3c',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          description: 'Given an array of integers temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.',
          codeSolutions: {
            python: `class Solution:\n    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:\n        res = [0] * len(temperatures)\n        stack = [] # pair: [temp, index]\n        for i, t in enumerate(temperatures):\n            while stack and t > stack[-1][0]:\n                stackT, stackInd = stack.pop()\n                res[stackInd] = i - stackInd\n            stack.append((t, i))\n        return res`,
            typescript: `function dailyTemperatures(temperatures: number[]): number[] {\n    const res = new Array(temperatures.length).fill(0);\n    const stack: number[] = []; // indices\n    for (let i = 0; i < temperatures.length; i++) {\n        while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n            const prev = stack.pop()!;\n            res[prev] = i - prev;\n        }\n        stack.push(i);\n    }\n    return res;\n};`,
            java: `class Solution {\n    public int[] dailyTemperatures(int[] temps) {\n        int[] res = new int[temps.length];\n        Stack<Integer> stack = new Stack<>();\n        for (int i = 0; i < temps.length; i++) {\n            while (!stack.isEmpty() && temps[i] > temps[stack.peek()]) {\n                int prev = stack.pop();\n                res[prev] = i - prev;\n            }\n            stack.push(i);\n        }\n        return res;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    vector<int> dailyTemperatures(vector<int>& temps) {\n        vector<int> res(temps.size(), 0);\n        stack<int> st;\n        for (int i = 0; i < temps.size(); i++) {\n            while (!st.empty() && temps[i] > temps[st.top()]) {\n                int idx = st.top(); st.pop();\n                res[idx] = i - idx;\n            }\n            st.push(i);\n        }\n        return res;\n    }\n};`
          }
        },
        {
          id: 'p-largest-rectangle-histogram',
          title: 'Largest Rectangle in Histogram',
          difficulty: 'Hard',
          category: 'Stack',
          leetcodeUrl: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
          videoEmbedUrl: 'https://www.youtube.com/embed/zx5SwR13040',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          description: 'Given an array of integers heights representing the histogram bar height where width is 1, return the area of the largest rectangle in the histogram.',
          codeSolutions: {
            python: `class Solution:\n    def largestRectangleArea(self, heights: List[int]) -> int:\n        maxArea = 0\n        stack = [] # pair: (index, height)\n        for i, h in enumerate(heights):\n            start = i\n            while stack and stack[-1][1] > h:\n                index, height = stack.pop()\n                maxArea = max(maxArea, height * (i - index))\n                start = index\n            stack.append((start, h))\n        for i, h in stack:\n            maxArea = max(maxArea, h * (len(heights) - i))\n        return maxArea`,
            typescript: `function largestRectangleArea(heights: number[]): number {\n    const stack: [number, number][] = [];\n    let maxArea = 0;\n    for (let i = 0; i < heights.length; i++) {\n        let start = i;\n        while (stack.length && stack[stack.length - 1][1] > heights[i]) {\n            const [idx, h] = stack.pop()!;\n            maxArea = Math.max(maxArea, h * (i - idx));\n            start = idx;\n        }\n        stack.push([start, heights[i]]);\n    }\n    for (const [i, h] of stack) {\n        maxArea = Math.max(maxArea, h * (heights.length - i));\n    }\n    return maxArea;\n};`,
            java: `class Solution {\n    public int largestRectangleArea(int[] heights) {\n        Stack<Integer> stack = new Stack<>();\n        int maxArea = 0, n = heights.length;\n        for (int i = 0; i <= n; i++) {\n            int h = (i == n) ? 0 : heights[i];\n            while (!stack.isEmpty() && h < heights[stack.peek()]) {\n                int height = heights[stack.pop()];\n                int width = stack.isEmpty() ? i : i - stack.peek() - 1;\n                maxArea = Math.max(maxArea, height * width);\n            }\n            stack.push(i);\n        }\n        return maxArea;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int largestRectangleArea(vector<int>& heights) {\n        stack<int> st;\n        int maxA = 0, n = heights.size();\n        for (int i = 0; i <= n; i++) {\n            int h = (i == n) ? 0 : heights[i];\n            while (!st.empty() && h < heights[st.top()]) {\n                int height = heights[st.top()]; st.pop();\n                int width = st.empty() ? i : i - st.top() - 1;\n                maxA = max(maxA, height * width);\n            }\n            st.push(i);\n        }\n        return maxA;\n    }\n};`
          }
        }
      ]
    },
    {
      id: 'binary-search',
      title: 'Binary Search',
      category: 'Algorithms',
      description: 'Logarithmic search space reduction, rotated arrays, and finding optimal thresholds in O(log n).',
      level: 2,
      prerequisites: ['two-pointers'],
      color: '#06b6d4',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      problems: [
        {
          id: 'p-binary-search',
          title: 'Binary Search',
          difficulty: 'Easy',
          category: 'Binary Search',
          leetcodeUrl: 'https://leetcode.com/problems/binary-search/',
          videoEmbedUrl: 'https://www.youtube.com/embed/s4DPM8ct1pI',
          timeComplexity: 'O(log n)',
          spaceComplexity: 'O(1)',
          description: 'Given an array of integers nums which is sorted in ascending order, search for target in O(log n).',
          codeSolutions: {
            python: `class Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        l, r = 0, len(nums) - 1\n        while l <= r:\n            m = l + ((r - l) // 2)\n            if nums[m] > target: r = m - 1\n            elif nums[m] < target: l = m + 1\n            else: return m\n        return -1`,
            typescript: `function search(nums: number[], target: number): number {\n    let l = 0, r = nums.length - 1;\n    while (l <= r) {\n        const m = Math.floor((l + r) / 2);\n        if (nums[m] === target) return m;\n        if (nums[m] < target) l = m + 1;\n        else r = m - 1;\n    }\n    return -1;\n};`,
            java: `class Solution {\n    public int search(int[] nums, int target) {\n        int l = 0, r = nums.length - 1;\n        while (l <= r) {\n            int m = l + (r - l) / 2;\n            if (nums[m] == target) return m;\n            if (nums[m] < target) l = m + 1;\n            else r = m - 1;\n        }\n        return -1;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int l = 0, r = nums.size() - 1;\n        while (l <= r) {\n            int m = l + (r - l) / 2;\n            if (nums[m] == target) return m;\n            if (nums[m] < target) l = m + 1;\n            else r = m - 1;\n        }\n        return -1;\n    }\n};`
          }
        },
        {
          id: 'p-search-2d-matrix',
          title: 'Search a 2D Matrix',
          difficulty: 'Medium',
          category: 'Binary Search',
          leetcodeUrl: 'https://leetcode.com/problems/search-a-2d-matrix/',
          videoEmbedUrl: 'https://www.youtube.com/embed/Ber2pi2C0j0',
          timeComplexity: 'O(log(m * n))',
          spaceComplexity: 'O(1)',
          description: 'Search for target in an m x n integer matrix where each row is sorted and the first integer of each row is greater than the last integer of the previous row.',
          codeSolutions: {
            python: `class Solution:\n    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:\n        ROWS, COLS = len(matrix), len(matrix[0])\n        l, r = 0, ROWS * COLS - 1\n        while l <= r:\n            m = (l + r) // 2\n            val = matrix[m // COLS][m % COLS]\n            if val == target: return True\n            elif val < target: l = m + 1\n            else: r = m - 1\n        return False`,
            typescript: `function searchMatrix(matrix: number[][], target: number): boolean {\n    const m = matrix.length, n = matrix[0].length;\n    let l = 0, r = m * n - 1;\n    while (l <= r) {\n        const mid = Math.floor((l + r) / 2);\n        const val = matrix[Math.floor(mid / n)][mid % n];\n        if (val === target) return true;\n        if (val < target) l = mid + 1;\n        else r = mid - 1;\n    }\n    return false;\n};`,
            java: `class Solution {\n    public boolean searchMatrix(int[][] matrix, int target) {\n        int m = matrix.length, n = matrix[0].length;\n        int l = 0, r = m * n - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            int val = matrix[mid / n][mid % n];\n            if (val == target) return true;\n            if (val < target) l = mid + 1;\n            else r = mid - 1;\n        }\n        return false;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    bool searchMatrix(vector<vector<int>>& matrix, int target) {\n        int m = matrix.size(), n = matrix[0].size();\n        int l = 0, r = m * n - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            int val = matrix[mid / n][mid % n];\n            if (val == target) return true;\n            if (val < target) l = mid + 1;\n            else r = mid - 1;\n        }\n        return false;\n    }\n};`
          }
        },
        {
          id: 'p-koko-bananas',
          title: 'Koko Eating Bananas',
          difficulty: 'Medium',
          category: 'Binary Search',
          leetcodeUrl: 'https://leetcode.com/problems/koko-eating-bananas/',
          videoEmbedUrl: 'https://www.youtube.com/embed/U2SozAs9RzA',
          timeComplexity: 'O(n * log(max(piles)))',
          spaceComplexity: 'O(1)',
          description: 'Find the minimum integer k such that Koko can eat all the bananas within h hours.',
          codeSolutions: {
            python: `class Solution:\n    def minEatingSpeed(self, piles: List[int], h: int) -> int:\n        l, r = 1, max(piles)\n        res = r\n        while l <= r:\n            k = (l + r) // 2\n            hours = sum(math.ceil(p / k) for p in piles)\n            if hours <= h:\n                res = k\n                r = k - 1\n            else:\n                l = k + 1\n        return res`,
            typescript: `function minEatingSpeed(piles: number[], h: number): number {\n    let l = 1, r = Math.max(...piles), res = r;\n    while (l <= r) {\n        const k = Math.floor((l + r) / 2);\n        const hours = piles.reduce((acc, p) => acc + Math.ceil(p / k), 0);\n        if (hours <= h) {\n            res = k;\n            r = k - 1;\n        } else {\n            l = k + 1;\n        }\n    }\n    return res;\n};`,
            java: `class Solution {\n    public int minEatingSpeed(int[] piles, int h) {\n        int l = 1, r = Arrays.stream(piles).max().getAsInt(), res = r;\n        while (l <= r) {\n            int k = l + (r - l) / 2;\n            long hours = 0;\n            for (int p : piles) hours += (p + k - 1) / k;\n            if (hours <= h) { res = k; r = k - 1; }\n            else l = k + 1;\n        }\n        return res;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int minEatingSpeed(vector<int>& piles, int h) {\n        int l = 1, r = *max_element(piles.begin(), piles.end()), res = r;\n        while (l <= r) {\n            int k = l + (r - l) / 2;\n            long long hours = 0;\n            for (int p : piles) hours += (p + k - 1) / k;\n            if (hours <= h) { res = k; r = k - 1; }\n            else l = k + 1;\n        }\n        return res;\n    }\n};`
          }
        },
        {
          id: 'p-find-min-rotated',
          title: 'Find Minimum in Rotated Sorted Array',
          difficulty: 'Medium',
          category: 'Binary Search',
          leetcodeUrl: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
          videoEmbedUrl: 'https://www.youtube.com/embed/nIVWx4P8210',
          timeComplexity: 'O(log n)',
          spaceComplexity: 'O(1)',
          description: 'Given the sorted rotated array nums of unique elements, return the minimum element of this array in O(log n).',
          codeSolutions: {
            python: `class Solution:\n    def findMin(self, nums: List[int]) -> int:\n        l, r = 0, len(nums) - 1\n        while l < r:\n            m = (l + r) // 2\n            if nums[m] > nums[r]: l = m + 1\n            else: r = m\n        return nums[l]`,
            typescript: `function findMin(nums: number[]): number {\n    let l = 0, r = nums.length - 1;\n    while (l < r) {\n        const m = Math.floor((l + r) / 2);\n        if (nums[m] > nums[r]) l = m + 1;\n        else r = m;\n    }\n    return nums[l];\n};`,
            java: `class Solution {\n    public int findMin(int[] nums) {\n        int l = 0, r = nums.length - 1;\n        while (l < r) {\n            int m = l + (r - l) / 2;\n            if (nums[m] > nums[r]) l = m + 1;\n            else r = m;\n        }\n        return nums[l];\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int findMin(vector<int>& nums) {\n        int l = 0, r = nums.size() - 1;\n        while (l < r) {\n            int m = l + (r - l) / 2;\n            if (nums[m] > nums[r]) l = m + 1;\n            else r = m;\n        }\n        return nums[l];\n    }\n};`
          }
        }
      ]
    },
    {
      id: 'sliding-window',
      title: 'Sliding Window',
      category: 'Algorithms',
      description: 'Continuous subarray optimization, dynamic window expansion & contraction for strings and arrays.',
      level: 2,
      prerequisites: ['two-pointers'],
      color: '#ec4899',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
      problems: [
        {
          id: 'p-best-time-stock',
          title: 'Best Time to Buy and Sell Stock',
          difficulty: 'Easy',
          category: 'Sliding Window',
          leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
          videoEmbedUrl: 'https://www.youtube.com/embed/1pkOgXD63yU',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)',
          description: 'You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.',
          codeSolutions: {
            python: `class Solution:\n    def maxProfit(self, prices: List[int]) -> int:\n        l, r = 0, 1\n        maxP = 0\n        while r < len(prices):\n            if prices[l] < prices[r]:\n                profit = prices[r] - prices[l]\n                maxP = max(maxP, profit)\n            else:\n                l = r\n            r += 1\n        return maxP`,
            typescript: `function maxProfit(prices: number[]): number {\n    let minPrice = Infinity, maxProfit = 0;\n    for (const p of prices) {\n        if (p < minPrice) minPrice = p;\n        else maxProfit = Math.max(maxProfit, p - minPrice);\n    }\n    return maxProfit;\n};`,
            java: `class Solution {\n    public int maxProfit(int[] prices) {\n        int min = Integer.MAX_VALUE, max = 0;\n        for (int p : prices) {\n            if (p < min) min = p;\n            else max = Math.max(max, p - min);\n        }\n        return max;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minP = INT_MAX, maxP = 0;\n        for (int p : prices) {\n            minP = min(minP, p);\n            maxP = max(maxP, p - minP);\n        }\n        return maxP;\n    }\n};`
          }
        },
        {
          id: 'p-longest-substring-without-repeat',
          title: 'Longest Substring Without Repeating Characters',
          difficulty: 'Medium',
          category: 'Sliding Window',
          leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
          videoEmbedUrl: 'https://www.youtube.com/embed/wiGpQwVHdE0',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(min(m, n))',
          description: 'Given a string s, find the length of the longest substring without duplicate characters.',
          codeSolutions: {
            python: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        charSet = set()\n        l = 0\n        res = 0\n        for r in range(len(s)):\n            while s[r] in charSet:\n                charSet.remove(s[l])\n                l += 1\n            charSet.add(s[r])\n            res = max(res, r - l + 1)\n        return res`,
            typescript: `function lengthOfLongestSubstring(s: string): number {\n    const seen = new Set<string>();\n    let l = 0, maxLen = 0;\n    for (let r = 0; r < s.length; r++) {\n        while (seen.has(s[r])) {\n            seen.delete(s[l++]);\n        }\n        seen.add(s[r]);\n        maxLen = Math.max(maxLen, r - l + 1);\n    }\n    return maxLen;\n};`,
            java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Set<Character> seen = new HashSet<>();\n        int l = 0, max = 0;\n        for (int r = 0; r < s.length(); r++) {\n            while (seen.contains(s.charAt(r))) seen.remove(s.charAt(l++));\n            seen.add(s.charAt(r));\n            max = Math.max(max, r - l + 1);\n        }\n        return max;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        unordered_set<char> seen;\n        int l = 0, maxLen = 0;\n        for (int r = 0; r < s.size(); r++) {\n            while (seen.count(s[r])) seen.erase(s[l++]);\n            seen.insert(s[r]);\n            maxLen = max(maxLen, r - l + 1);\n        }\n        return maxLen;\n    }\n};`
          }
        },
        {
          id: 'p-min-window-substring',
          title: 'Minimum Window Substring',
          difficulty: 'Hard',
          category: 'Sliding Window',
          leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/',
          videoEmbedUrl: 'https://www.youtube.com/embed/jSto0O4AJbM',
          timeComplexity: 'O(m + n)',
          spaceComplexity: 'O(m + n)',
          description: 'Given two strings s and t, return the minimum window substring of s such that every character in t (including duplicates) is included in the window.',
          codeSolutions: {
            python: `class Solution:\n    def minWindow(self, s: str, t: str) -> str:\n        if not t or not s: return ""\n        countT, window = {}, {}\n        for c in t: countT[c] = 1 + countT.get(c, 0)\n        have, need = 0, len(countT)\n        res, resLen = [-1, -1], float("infinity")\n        l = 0\n        for r in range(len(s)):\n            c = s[r]\n            window[c] = 1 + window.get(c, 0)\n            if c in countT and window[c] == countT[c]: have += 1\n            while have == need:\n                if (r - l + 1) < resLen:\n                    res = [l, r]; resLen = r - l + 1\n                window[s[l]] -= 1\n                if s[l] in countT and window[s[l]] < countT[s[l]]: have -= 1\n                l += 1\n        l, r = res\n        return s[l : r + 1] if resLen != float("infinity") else ""`,
            typescript: `function minWindow(s: string, t: string): string {\n    const need = new Map<string, number>();\n    for (const c of t) need.set(c, (need.get(c) || 0) + 1);\n    let count = t.length, minLen = Infinity, start = 0, l = 0;\n    for (let r = 0; r < s.length; r++) {\n        if (need.get(s[r])! > 0) count--;\n        need.set(s[r], (need.get(s[r]) || 0) - 1);\n        while (count === 0) {\n            if (r - l + 1 < minLen) {\n                minLen = r - l + 1;\n                start = l;\n            }\n            need.set(s[l], need.get(s[l])! + 1);\n            if (need.get(s[l])! > 0) count++;\n            l++;\n        }\n    }\n    return minLen === Infinity ? "" : s.substring(start, start + minLen);\n};`,
            java: `class Solution {\n    public String minWindow(String s, String t) {\n        int[] map = new int[128];\n        for (char c : t.toCharArray()) map[c]++;\n        int count = t.length(), l = 0, r = 0, minLen = Integer.MAX_VALUE, start = 0;\n        while (r < s.length()) {\n            if (map[s.charAt(r++)]-- > 0) count--;\n            while (count == 0) {\n                if (r - l < minLen) { minLen = r - l; start = l; }\n                if (map[s.charAt(l++)]++ == 0) count++;\n            }\n        }\n        return minLen == Integer.MAX_VALUE ? "" : s.substring(start, start + minLen);\n    }\n}`,
            cpp: `class Solution {\npublic:\n    string minWindow(string s, string t) {\n        vector<int> map(128, 0);\n        for (char c : t) map[c]++;\n        int count = t.size(), l = 0, r = 0, minLen = INT_MAX, start = 0;\n        while (r < s.size()) {\n            if (map[s[r++]]-- > 0) count--;\n            while (count == 0) {\n                if (r - l < minLen) { minLen = r - l; start = l; }\n                if (map[s[l++]]++ == 0) count++;\n            }\n        }\n        return minLen == INT_MAX ? "" : s.substr(start, minLen);\n    }\n};`
          }
        }
      ]
    },
    {
      id: 'linked-list',
      title: 'Linked List',
      category: 'Data Structures',
      description: 'Pointer manipulation, Floyd cycle detection, reversal, merging & fast/slow pointer algorithms.',
      level: 2,
      prerequisites: ['two-pointers'],
      color: '#f59e0b',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      problems: [
        {
          id: 'p-reverse-linked-list',
          title: 'Reverse Linked List',
          difficulty: 'Easy',
          category: 'Linked List',
          leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/',
          videoEmbedUrl: 'https://www.youtube.com/embed/G0_I-ZF0S38',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)',
          description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
          codeSolutions: {
            python: `class Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        prev, curr = None, head\n        while curr:\n            nxt = curr.next\n            curr.next = prev\n            prev = curr\n            curr = nxt\n        return prev`,
            typescript: `function reverseList(head: ListNode | null): ListNode | null {\n    let prev: ListNode | null = null, curr = head;\n    while (curr) {\n        const next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n};`,
            java: `class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null, curr = head;\n        while (curr != null) {\n            ListNode next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        ListNode *prev = nullptr, *curr = head;\n        while (curr) {\n            ListNode* next = curr->next;\n            curr->next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n};`
          }
        },
        {
          id: 'p-merge-two-sorted-lists',
          title: 'Merge Two Sorted Lists',
          difficulty: 'Easy',
          category: 'Linked List',
          leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/',
          videoEmbedUrl: 'https://www.youtube.com/embed/XIdigk956u0',
          timeComplexity: 'O(n + m)',
          spaceComplexity: 'O(1)',
          description: 'Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.',
          codeSolutions: {
            python: `class Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        dummy = ListNode()\n        tail = dummy\n        while list1 and list2:\n            if list1.val < list2.val:\n                tail.next = list1\n                list1 = list1.next\n            else:\n                tail.next = list2\n                list2 = list2.next\n            tail = tail.next\n        if list1: tail.next = list1\n        elif list2: tail.next = list2\n        return dummy.next`,
            typescript: `function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {\n    const dummy = new ListNode();\n    let tail = dummy;\n    while (list1 && list2) {\n        if (list1.val < list2.val) { tail.next = list1; list1 = list1.next; }\n        else { tail.next = list2; list2 = list2.next; }\n        tail = tail.next;\n    }\n    tail.next = list1 || list2;\n    return dummy.next;\n};`,
            java: `class Solution {\n    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {\n        ListNode dummy = new ListNode(0), tail = dummy;\n        while (l1 != null && l2 != null) {\n            if (l1.val < l2.val) { tail.next = l1; l1 = l1.next; }\n            else { tail.next = l2; l2 = l2.next; }\n            tail = tail.next;\n        }\n        tail.next = (l1 != null) ? l1 : l2;\n        return dummy.next;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n        ListNode dummy(0); ListNode* tail = &dummy;\n        while (l1 && l2) {\n            if (l1->val < l2->val) { tail->next = l1; l1 = l1->next; }\n            else { tail->next = l2; l2 = l2->next; }\n            tail = tail->next;\n        }\n        tail->next = l1 ? l1 : l2;\n        return dummy.next;\n    }\n};`
          }
        },
        {
          id: 'p-lru-cache',
          title: 'LRU Cache',
          difficulty: 'Medium',
          category: 'Linked List',
          leetcodeUrl: 'https://leetcode.com/problems/lru-cache/',
          videoEmbedUrl: 'https://www.youtube.com/embed/7ABFKPK2hD4',
          timeComplexity: 'O(1)',
          spaceComplexity: 'O(capacity)',
          description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) get and put.',
          codeSolutions: {
            python: `class Node:\n    def __init__(self, key, val):\n        self.key, self.val = key, val\n        self.prev = self.next = None\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.cap = capacity\n        self.cache = {}\n        self.left, self.right = Node(0, 0), Node(0, 0)\n        self.left.next, self.right.prev = self.right, self.left\n    def remove(self, node):\n        prev, nxt = node.prev, node.next\n        prev.next, nxt.prev = nxt, prev\n    def insert(self, node):\n        prev, nxt = self.right.prev, self.right\n        prev.next = nxt.prev = node\n        node.next, node.prev = nxt, prev\n    def get(self, key: int) -> int:\n        if key in self.cache:\n            self.remove(self.cache[key])\n            self.insert(self.cache[key])\n            return self.cache[key].val\n        return -1\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.remove(self.cache[key])\n        self.cache[key] = Node(key, value)\n        self.insert(self.cache[key])\n        if len(self.cache) > self.cap:\n            lru = self.left.next\n            self.remove(lru)\n            del self.cache[lru.key]`,
            typescript: `class LRUCache {\n    private cap: number;\n    private map = new Map<number, number>();\n    constructor(capacity: number) { this.cap = capacity; }\n    get(key: number): number {\n        if (!this.map.has(key)) return -1;\n        const val = this.map.get(key)!;\n        this.map.delete(key);\n        this.map.set(key, val);\n        return val;\n    }\n    put(key: number, value: number): void {\n        if (this.map.has(key)) this.map.delete(key);\n        this.map.set(key, value);\n        if (this.map.size > this.cap) {\n            const first = this.map.keys().next().value;\n            this.map.delete(first);\n        }\n    }\n}`,
            java: `class LRUCache extends LinkedHashMap<Integer, Integer> {\n    private int capacity;\n    public LRUCache(int capacity) {\n        super(capacity, 0.75f, true);\n        this.capacity = capacity;\n    }\n    public int get(int key) { return super.getOrDefault(key, -1); }\n    public void put(int key, int value) { super.put(key, value); }\n    @Override\n    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {\n        return size() > capacity;\n    }\n}`,
            cpp: `class LRUCache {\n    int cap;\n    list<pair<int, int>> l;\n    unordered_map<int, list<pair<int, int>>::iterator> m;\npublic:\n    LRUCache(int capacity) : cap(capacity) {}\n    int get(int key) {\n        if (m.find(key) == m.end()) return -1;\n        l.splice(l.begin(), l, m[key]);\n        return m[key]->second;\n    }\n    void put(int key, int value) {\n        if (m.find(key) != m.end()) {\n            l.splice(l.begin(), l, m[key]);\n            m[key]->second = value;\n            return;\n        }\n        if (l.size() == cap) {\n            int k = l.back().first;\n            l.pop_back(); m.erase(k);\n        }\n        l.push_front({key, value});\n        m[key] = l.begin();\n    }\n};`
          }
        }
      ]
    },
    {
      id: 'trees',
      title: 'Trees & BST',
      category: 'Data Structures',
      description: 'DFS & BFS traversals, BST validation, Lowest Common Ancestor, and recursive divide-and-conquer.',
      level: 3,
      prerequisites: ['binary-search', 'sliding-window', 'linked-list', 'stack'],
      color: '#14b8a6',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
      problems: [
        {
          id: 'p-invert-binary-tree',
          title: 'Invert Binary Tree',
          difficulty: 'Easy',
          category: 'Trees',
          leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/',
          videoEmbedUrl: 'https://www.youtube.com/embed/OnSn2XEQ4MY',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(h)',
          description: 'Given the root of a binary tree, invert the tree, and return its root.',
          codeSolutions: {
            python: `class Solution:\n    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:\n        if not root: return None\n        tmp = root.left\n        root.left = root.right\n        root.right = tmp\n        self.invertTree(root.left)\n        self.invertTree(root.right)\n        return root`,
            typescript: `function invertTree(root: TreeNode | null): TreeNode | null {\n    if (!root) return null;\n    const tmp = root.left;\n    root.left = invertTree(root.right);\n    root.right = invertTree(tmp);\n    return root;\n};`,
            java: `class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        if (root == null) return null;\n        TreeNode left = invertTree(root.left);\n        TreeNode right = invertTree(root.right);\n        root.left = right;\n        root.right = left;\n        return root;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        if (!root) return nullptr;\n        swap(root->left, root->right);\n        invertTree(root->left);\n        invertTree(root->right);\n        return root;\n    }\n};`
          }
        },
        {
          id: 'p-max-depth-binary-tree',
          title: 'Maximum Depth of Binary Tree',
          difficulty: 'Easy',
          category: 'Trees',
          leetcodeUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
          videoEmbedUrl: 'https://www.youtube.com/embed/hTM3phJS6GE',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(h)',
          description: 'Given the root of a binary tree, return its maximum depth (the number of nodes along the longest path).',
          codeSolutions: {
            python: `class Solution:\n    def maxDepth(self, root: Optional[TreeNode]) -> int:\n        if not root: return 0\n        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))`,
            typescript: `function maxDepth(root: TreeNode | null): number {\n    if (!root) return 0;\n    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n};`,
            java: `class Solution {\n    public int maxDepth(TreeNode root) {\n        if (root == null) return 0;\n        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        if (!root) return 0;\n        return 1 + max(maxDepth(root->left), maxDepth(root->right));\n    }\n};`
          }
        },
        {
          id: 'p-lowest-common-ancestor-bst',
          title: 'Lowest Common Ancestor of a BST',
          difficulty: 'Medium',
          category: 'Trees',
          leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
          videoEmbedUrl: 'https://www.youtube.com/embed/gs2LMfuOR9k',
          timeComplexity: 'O(h)',
          spaceComplexity: 'O(1)',
          description: 'Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes p and q.',
          codeSolutions: {
            python: `class Solution:\n    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':\n        cur = root\n        while cur:\n            if p.val > cur.val and q.val > cur.val:\n                cur = cur.right\n            elif p.val < cur.val and q.val < cur.val:\n                cur = cur.left\n            else:\n                return cur`,
            typescript: `function lowestCommonAncestor(root: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {\n    let cur = root;\n    while (cur && p && q) {\n        if (p.val > cur.val && q.val > cur.val) cur = cur.right;\n        else if (p.val < cur.val && q.val < cur.val) cur = cur.left;\n        else return cur;\n    }\n    return null;\n};`,
            java: `class Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        TreeNode cur = root;\n        while (cur != null) {\n            if (p.val > cur.val && q.val > cur.val) cur = cur.right;\n            else if (p.val < cur.val && q.val < cur.val) cur = cur.left;\n            else return cur;\n        }\n        return null;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n        TreeNode* cur = root;\n        while (cur) {\n            if (p->val > cur->val && q->val > cur->val) cur = cur->right;\n            else if (p->val < cur->val && q->val < cur->val) cur = cur->left;\n            else return cur;\n        }\n        return nullptr;\n    }\n};`
          }
        }
      ]
    },
    {
      id: 'tries',
      title: 'Tries (Prefix Trees)',
      category: 'Data Structures',
      description: 'Prefix lookups, word dictionaries, autocomplete engines, and wildcard pattern matching.',
      level: 4,
      prerequisites: ['trees'],
      color: '#0284c7',
      badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      problems: [
        {
          id: 'p-implement-trie',
          title: 'Implement Trie (Prefix Tree)',
          difficulty: 'Medium',
          category: 'Tries',
          leetcodeUrl: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
          videoEmbedUrl: 'https://www.youtube.com/embed/oobqoCJlHA0',
          timeComplexity: 'O(length)',
          spaceComplexity: 'O(total characters)',
          description: 'A trie or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.',
          codeSolutions: {
            python: `class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.endOfWord = False\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n    def insert(self, word: str) -> None:\n        cur = self.root\n        for c in word:\n            if c not in cur.children:\n                cur.children[c] = TrieNode()\n            cur = cur.children[c]\n        cur.endOfWord = True\n    def search(self, word: str) -> bool:\n        cur = self.root\n        for c in word:\n            if c not in cur.children: return False\n            cur = cur.children[c]\n        return cur.endOfWord\n    def startsWith(self, prefix: str) -> bool:\n        cur = self.root\n        for c in prefix:\n            if c not in cur.children: return False\n            cur = cur.children[c]\n        return True`,
            typescript: `class TrieNode {\n    children: Map<string, TrieNode> = new Map();\n    isEnd: boolean = false;\n}\nclass Trie {\n    root = new TrieNode();\n    insert(word: string): void {\n        let cur = this.root;\n        for (const c of word) {\n            if (!cur.children.has(c)) cur.children.set(c, new TrieNode());\n            cur = cur.children.get(c)!;\n        }\n        cur.isEnd = true;\n    }\n    search(word: string): boolean {\n        let cur = this.root;\n        for (const c of word) {\n            if (!cur.children.has(c)) return false;\n            cur = cur.children.get(c)!;\n        }\n        return cur.isEnd;\n    }\n    startsWith(prefix: string): boolean {\n        let cur = this.root;\n        for (const c of prefix) {\n            if (!cur.children.has(c)) return false;\n            cur = cur.children.get(c)!;\n        }\n        return true;\n    }\n}`,
            java: `class Trie {\n    class Node { Node[] next = new Node[26]; boolean isEnd; }\n    private Node root = new Node();\n    public void insert(String word) {\n        Node cur = root;\n        for (char c : word.toCharArray()) {\n            if (cur.next[c - 'a'] == null) cur.next[c - 'a'] = new Node();\n            cur = cur.next[c - 'a'];\n        }\n        cur.isEnd = true;\n    }\n    public boolean search(String word) {\n        Node cur = root;\n        for (char c : word.toCharArray()) {\n            if (cur.next[c - 'a'] == null) return false;\n            cur = cur.next[c - 'a'];\n        }\n        return cur.isEnd;\n    }\n    public boolean startsWith(String prefix) {\n        Node cur = root;\n        for (char c : prefix.toCharArray()) {\n            if (cur.next[c - 'a'] == null) return false;\n            cur = cur.next[c - 'a'];\n        }\n        return true;\n    }\n}`,
            cpp: `class Trie {\n    struct Node { Node* next[26] = {}; bool isEnd = false; };\n    Node* root = new Node();\npublic:\n    void insert(string word) {\n        Node* cur = root;\n        for (char c : word) {\n            if (!cur->next[c - 'a']) cur->next[c - 'a'] = new Node();\n            cur = cur->next[c - 'a'];\n        }\n        cur->isEnd = true;\n    }\n    bool search(string word) {\n        Node* cur = root;\n        for (char c : word) {\n            if (!cur->next[c - 'a']) return false;\n            cur = cur->next[c - 'a'];\n        }\n        return cur->isEnd;\n    }\n    bool startsWith(string prefix) {\n        Node* cur = root;\n        for (char c : prefix) {\n            if (!cur->next[c - 'a']) return false;\n            cur = cur->next[c - 'a'];\n        }\n        return true;\n    }\n};`
          }
        }
      ]
    },
    {
      id: 'heap-priority-queue',
      title: 'Heap / Priority Queue',
      category: 'Data Structures',
      description: 'Min-heaps, max-heaps, streaming median maintenance, and K-way merge algorithms.',
      level: 4,
      prerequisites: ['trees'],
      color: '#e11d48',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      problems: [
        {
          id: 'p-kth-largest-stream',
          title: 'Kth Largest Element in a Stream',
          difficulty: 'Easy',
          category: 'Heap',
          leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/',
          videoEmbedUrl: 'https://www.youtube.com/embed/hOjcdrqMoQ8',
          timeComplexity: 'O(m * log k)',
          spaceComplexity: 'O(k)',
          description: 'Design a class to find the kth largest element in a stream.',
          codeSolutions: {
            python: `class KthLargest:\n    def __init__(self, k: int, nums: List[int]):\n        self.minHeap, self.k = nums, k\n        heapq.heapify(self.minHeap)\n        while len(self.minHeap) > k:\n            heapq.heappop(self.minHeap)\n    def add(self, val: int) -> int:\n        heapq.heappush(self.minHeap, val)\n        if len(self.minHeap) > self.k:\n            heapq.heappop(self.minHeap)\n        return self.minHeap[0]`,
            typescript: `class KthLargest {\n    private k: number;\n    private heap: number[];\n    constructor(k: number, nums: number[]) {\n        this.k = k;\n        this.heap = nums.sort((a, b) => b - a).slice(0, k);\n    }\n    add(val: number): number {\n        this.heap.push(val);\n        this.heap.sort((a, b) => b - a);\n        if (this.heap.length > this.k) this.heap.pop();\n        return this.heap[this.heap.length - 1];\n    }\n}`,
            java: `class KthLargest {\n    private PriorityQueue<Integer> pq;\n    private int k;\n    public KthLargest(int k, int[] nums) {\n        this.k = k;\n        pq = new PriorityQueue<>(k);\n        for (int n : nums) add(n);\n    }\n    public int add(int val) {\n        pq.offer(val);\n        if (pq.size() > k) pq.poll();\n        return pq.peek();\n    }\n}`,
            cpp: `class KthLargest {\n    priority_queue<int, vector<int>, greater<int>> pq;\n    int k;\npublic:\n    KthLargest(int k, vector<int>& nums) : k(k) {\n        for (int n : nums) add(n);\n    }\n    int add(int val) {\n        pq.push(val);\n        if (pq.size() > k) pq.pop();\n        return pq.top();\n    }\n};`
          }
        },
        {
          id: 'p-find-median-data-stream',
          title: 'Find Median from Data Stream',
          difficulty: 'Hard',
          category: 'Heap',
          leetcodeUrl: 'https://leetcode.com/problems/find-median-from-data-stream/',
          videoEmbedUrl: 'https://www.youtube.com/embed/itmhHWaHupI',
          timeComplexity: 'O(log n) add, O(1) find',
          spaceComplexity: 'O(n)',
          description: 'The median is the middle value in an ordered integer list. Implement the MedianFinder class using two heaps (small max-heap and large min-heap).',
          codeSolutions: {
            python: `class MedianFinder:\n    def __init__(self):\n        self.small, self.large = [], []\n    def addNum(self, num: int) -> None:\n        heapq.heappush(self.small, -1 * num)\n        if self.small and self.large and (-1 * self.small[0]) > self.large[0]:\n            val = -1 * heapq.heappop(self.small)\n            heapq.heappush(self.large, val)\n        if len(self.small) > len(self.large) + 1:\n            val = -1 * heapq.heappop(self.small)\n            heapq.heappush(self.large, val)\n        if len(self.large) > len(self.small) + 1:\n            val = heapq.heappop(self.large)\n            heapq.heappush(self.small, -1 * val)\n    def findMedian(self) -> float:\n        if len(self.small) > len(self.large):\n            return -1 * self.small[0]\n        if len(self.large) > len(self.small):\n            return self.large[0]\n        return (-1 * self.small[0] + self.large[0]) / 2`,
            typescript: `// Dual heap implementation in TypeScript\nclass MedianFinder {\n    private nums: number[] = [];\n    addNum(num: number): void {\n        let l = 0, r = this.nums.length;\n        while (l < r) {\n            const m = Math.floor((l + r) / 2);\n            if (this.nums[m] < num) l = m + 1;\n            else r = m;\n        }\n        this.nums.splice(l, 0, num);\n    }\n    findMedian(): number {\n        const mid = Math.floor(this.nums.length / 2);\n        return this.nums.length % 2 === 1 ? this.nums[mid] : (this.nums[mid - 1] + this.nums[mid]) / 2;\n    }\n}`,
            java: `class MedianFinder {\n    private PriorityQueue<Integer> small = new PriorityQueue<>(Collections.reverseOrder());\n    private PriorityQueue<Integer> large = new PriorityQueue<>();\n    public void addNum(int num) {\n        small.offer(num);\n        large.offer(small.poll());\n        if (small.size() < large.size()) small.offer(large.poll());\n    }\n    public double findMedian() {\n        return small.size() > large.size() ? small.peek() : (small.peek() + large.peek()) / 2.0;\n    }\n}`,
            cpp: `class MedianFinder {\n    priority_queue<int> small;\n    priority_queue<int, vector<int>, greater<int>> large;\npublic:\n    void addNum(int num) {\n        small.push(num);\n        large.push(small.top()); small.pop();\n        if (small.size() < large.size()) {\n            small.push(large.top()); large.pop();\n        }\n    }\n    double findMedian() {\n        return small.size() > large.size() ? small.top() : (small.top() + large.top()) / 2.0;\n    }\n};`
          }
        }
      ]
    },
    {
      id: 'backtracking',
      title: 'Backtracking',
      category: 'Algorithms',
      description: 'Combinatorial state space trees, subsets, permutations, N-Queens & pruning algorithms.',
      level: 4,
      prerequisites: ['trees'],
      color: '#f97316',
      badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      problems: [
        {
          id: 'p-subsets',
          title: 'Subsets',
          difficulty: 'Medium',
          category: 'Backtracking',
          leetcodeUrl: 'https://leetcode.com/problems/subsets/',
          videoEmbedUrl: 'https://www.youtube.com/embed/REOH22Xwdlk',
          timeComplexity: 'O(n * 2^n)',
          spaceComplexity: 'O(n)',
          description: 'Given an integer array nums of unique elements, return all possible subsets (the power set).',
          codeSolutions: {
            python: `class Solution:\n    def subsets(self, nums: List[int]) -> List[List[int]]:\n        res = []\n        subset = []\n        def dfs(i):\n            if i >= len(nums):\n                res.append(subset.copy())\n                return\n            subset.append(nums[i])\n            dfs(i + 1)\n            subset.pop()\n            dfs(i + 1)\n        dfs(0)\n        return res`,
            typescript: `function subsets(nums: number[]): number[][] {\n    const res: number[][] = [];\n    const subset: number[] = [];\n    function dfs(i: number) {\n        if (i >= nums.length) { res.push([...subset]); return; }\n        subset.push(nums[i]);\n        dfs(i + 1);\n        subset.pop();\n        dfs(i + 1);\n    }\n    dfs(0);\n    return res;\n};`,
            java: `class Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        List<List<Integer>> res = new ArrayList<>();\n        backtrack(0, nums, new ArrayList<>(), res);\n        return res;\n    }\n    private void backtrack(int start, int[] nums, List<Integer> curr, List<List<Integer>> res) {\n        res.add(new ArrayList<>(curr));\n        for (int i = start; i < nums.length; i++) {\n            curr.add(nums[i]);\n            backtrack(i + 1, nums, curr, res);\n            curr.remove(curr.size() - 1);\n        }\n    }\n}`,
            cpp: `class Solution {\npublic:\n    vector<vector<int>> subsets(vector<int>& nums) {\n        vector<vector<int>> res;\n        vector<int> curr;\n        function<void(int)> dfs = [&](int i) {\n            if (i >= nums.size()) { res.push_back(curr); return; }\n            curr.push_back(nums[i]);\n            dfs(i + 1);\n            curr.pop_back();\n            dfs(i + 1);\n        };\n        dfs(0);\n        return res;\n    }\n};`
          }
        },
        {
          id: 'p-combination-sum',
          title: 'Combination Sum',
          difficulty: 'Medium',
          category: 'Backtracking',
          leetcodeUrl: 'https://leetcode.com/problems/combination-sum/',
          videoEmbedUrl: 'https://www.youtube.com/embed/GBKI9VSKdGg',
          timeComplexity: 'O(2^(target/min))',
          spaceComplexity: 'O(target/min)',
          description: 'Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations where the chosen numbers sum to target.',
          codeSolutions: {
            python: `class Solution:\n    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:\n        res = []\n        def dfs(i, cur, total):\n            if total == target:\n                res.append(cur.copy())\n                return\n            if i >= len(candidates) or total > target:\n                return\n            cur.append(candidates[i])\n            dfs(i, cur, total + candidates[i])\n            cur.pop()\n            dfs(i + 1, cur, total)\n        dfs(0, [], 0)\n        return res`,
            typescript: `function combinationSum(candidates: number[], target: number): number[][] {\n    const res: number[][] = [];\n    function dfs(i: number, cur: number[], sum: number) {\n        if (sum === target) { res.push([...cur]); return; }\n        if (i >= candidates.length || sum > target) return;\n        cur.push(candidates[i]);\n        dfs(i, cur, sum + candidates[i]);\n        cur.pop();\n        dfs(i + 1, cur, sum);\n    }\n    dfs(0, [], 0);\n    return res;\n};`,
            java: `class Solution {\n    public List<List<Integer>> combinationSum(int[] candidates, int target) {\n        List<List<Integer>> res = new ArrayList<>();\n        dfs(0, candidates, target, new ArrayList<>(), res);\n        return res;\n    }\n    private void dfs(int i, int[] c, int target, List<Integer> cur, List<List<Integer>> res) {\n        if (target == 0) { res.add(new ArrayList<>(cur)); return; }\n        if (i >= c.length || target < 0) return;\n        cur.add(c[i]);\n        dfs(i, c, target - c[i], cur, res);\n        cur.remove(cur.size() - 1);\n        dfs(i + 1, c, target, cur, res);\n    }\n}`,
            cpp: `class Solution {\npublic:\n    vector<vector<int>> combinationSum(vector<int>& c, int target) {\n        vector<vector<int>> res;\n        vector<int> cur;\n        function<void(int, int)> dfs = [&](int i, int remain) {\n            if (remain == 0) { res.push_back(cur); return; }\n            if (i >= c.size() || remain < 0) return;\n            cur.push_back(c[i]);\n            dfs(i, remain - c[i]);\n            cur.pop_back();\n            dfs(i + 1, remain);\n        };\n        dfs(0, target);\n        return res;\n    }\n};`
          }
        }
      ]
    },
    {
      id: 'graphs',
      title: 'Graphs',
      category: 'Data Structures',
      description: 'Adjacency list BFS/DFS, connected components, topological sorting, and cycle detection.',
      level: 5,
      prerequisites: ['backtracking'],
      color: '#6366f1',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      problems: [
        {
          id: 'p-number-of-islands',
          title: 'Number of Islands',
          difficulty: 'Medium',
          category: 'Graphs',
          leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/',
          videoEmbedUrl: 'https://www.youtube.com/embed/pV2kpPD66nE',
          timeComplexity: 'O(m * n)',
          spaceComplexity: 'O(m * n)',
          description: 'Given an m x n 2D binary grid grid which represents a map of 1s (land) and 0s (water), return the number of islands.',
          codeSolutions: {
            python: `class Solution:\n    def numIslands(self, grid: List[List[str]]) -> int:\n        if not grid: return 0\n        rows, cols = len(grid), len(grid[0])\n        islands = 0\n        def dfs(r, c):\n            if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != '1':\n                return\n            grid[r][c] = '0'\n            dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)\n        for r in range(rows):\n            for c in range(cols):\n                if grid[r][c] == '1':\n                    dfs(r, c)\n                    islands += 1\n        return islands`,
            typescript: `function numIslands(grid: string[][]): number {\n    const m = grid.length, n = grid[0].length;\n    let count = 0;\n    function dfs(r: number, c: number) {\n        if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] !== '1') return;\n        grid[r][c] = '0';\n        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);\n    }\n    for (let r = 0; r < m; r++) {\n        for (let c = 0; c < n; c++) {\n            if (grid[r][c] === '1') { count++; dfs(r, c); }\n        }\n    }\n    return count;\n};`,
            java: `class Solution {\n    public int numIslands(char[][] grid) {\n        int count = 0;\n        for (int i = 0; i < grid.length; i++) {\n            for (int j = 0; j < grid[0].length; j++) {\n                if (grid[i][j] == '1') {\n                    dfs(grid, i, j);\n                    count++;\n                }\n            }\n        }\n        return count;\n    }\n    private void dfs(char[][] grid, int r, int c) {\n        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] != '1') return;\n        grid[r][c] = '0';\n        dfs(grid, r+1, c); dfs(grid, r-1, c); dfs(grid, r, c+1); dfs(grid, r, c-1);\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        int count = 0;\n        int m = grid.size(), n = grid[0].size();\n        function<void(int, int)> dfs = [&](int r, int c) {\n            if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] != '1') return;\n            grid[r][c] = '0';\n            dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1);\n        };\n        for (int i = 0; i < m; i++) {\n            for (int j = 0; j < n; j++) {\n                if (grid[i][j] == '1') { dfs(i, j); count++; }\n            }\n        }\n        return count;\n    }\n};`
          }
        },
        {
          id: 'p-course-schedule',
          title: 'Course Schedule',
          difficulty: 'Medium',
          category: 'Graphs',
          leetcodeUrl: 'https://leetcode.com/problems/course-schedule/',
          videoEmbedUrl: 'https://www.youtube.com/embed/EgI5nU9etnU',
          timeComplexity: 'O(V + E)',
          spaceComplexity: 'O(V + E)',
          description: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. Determine if you can finish all courses using topological sorting or cycle detection.',
          codeSolutions: {
            python: `class Solution:\n    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:\n        preMap = {i: [] for i in range(numCourses)}\n        for crs, pre in prerequisites:\n            preMap[crs].append(pre)\n        visiting = set()\n        def dfs(crs):\n            if crs in visiting: return False\n            if preMap[crs] == []: return True\n            visiting.add(crs)\n            for pre in preMap[crs]:\n                if not dfs(pre): return False\n            visiting.remove(crs)\n            preMap[crs] = []\n            return True\n        for c in range(numCourses):\n            if not dfs(c): return False\n        return True`,
            typescript: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {\n    const adj = Array.from({ length: numCourses }, () => [] as number[]);\n    const inDegree = new Array(numCourses).fill(0);\n    for (const [course, pre] of prerequisites) {\n        adj[pre].push(course);\n        inDegree[course]++;\n    }\n    const queue: number[] = [];\n    for (let i = 0; i < numCourses; i++) {\n        if (inDegree[i] === 0) queue.push(i);\n    }\n    let count = 0;\n    while (queue.length) {\n        const curr = queue.shift()!;\n        count++;\n        for (const next of adj[curr]) {\n            inDegree[next]--;\n            if (inDegree[next] === 0) queue.push(next);\n        }\n    }\n    return count === numCourses;\n};`,
            java: `class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        List<Integer>[] adj = new ArrayList[numCourses];\n        int[] inDegree = new int[numCourses];\n        for (int i = 0; i < numCourses; i++) adj[i] = new ArrayList<>();\n        for (int[] p : prerequisites) {\n            adj[p[1]].add(p[0]);\n            inDegree[p[0]]++;\n        }\n        Queue<Integer> q = new LinkedList<>();\n        for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.offer(i);\n        int count = 0;\n        while (!q.isEmpty()) {\n            int curr = q.poll(); count++;\n            for (int next : adj[curr]) {\n                if (--inDegree[next] == 0) q.offer(next);\n            }\n        }\n        return count == numCourses;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n        vector<vector<int>> adj(numCourses);\n        vector<int> inDegree(numCourses, 0);\n        for (auto& p : prerequisites) {\n            adj[p[1]].push_back(p[0]);\n            inDegree[p[0]]++;\n        }\n        queue<int> q;\n        for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.push(i);\n        int count = 0;\n        while (!q.empty()) {\n            int curr = q.front(); q.pop(); count++;\n            for (int next : adj[curr]) {\n                if (--inDegree[next] == 0) q.push(next);\n            }\n        }\n        return count == numCourses;\n    }\n};`
          }
        }
      ]
    },
    {
      id: '1d-dp',
      title: '1-D Dynamic Programming',
      category: 'Algorithms',
      description: 'Memoization & tabulation, state transitions, Climbing Stairs, Coin Change, and Longest Increasing Subsequence.',
      level: 5,
      prerequisites: ['backtracking'],
      color: '#a855f7',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      problems: [
        {
          id: 'p-climbing-stairs',
          title: 'Climbing Stairs',
          difficulty: 'Easy',
          category: '1-D DP',
          leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/',
          videoEmbedUrl: 'https://www.youtube.com/embed/Y0lT9Fck7qI',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)',
          description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
          codeSolutions: {
            python: `class Solution:\n    def climbStairs(self, n: int) -> int:\n        one, two = 1, 1\n        for i in range(n - 1):\n            temp = one\n            one = one + two\n            two = temp\n        return one`,
            typescript: `function climbStairs(n: number): number {\n    let a = 1, b = 1;\n    for (let i = 2; i <= n; i++) {\n        const temp = a + b;\n        a = b;\n        b = temp;\n    }\n    return b;\n};`,
            java: `class Solution {\n    public int climbStairs(int n) {\n        int a = 1, b = 1;\n        for (int i = 2; i <= n; i++) {\n            int temp = a + b;\n            a = b;\n            b = temp;\n        }\n        return b;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int climbStairs(int n) {\n        int a = 1, b = 1;\n        for (int i = 2; i <= n; i++) {\n            int temp = a + b;\n            a = b;\n            b = temp;\n        }\n        return b;\n    }\n};`
          }
        },
        {
          id: 'p-coin-change',
          title: 'Coin Change',
          difficulty: 'Medium',
          category: '1-D DP',
          leetcodeUrl: 'https://leetcode.com/problems/coin-change/',
          videoEmbedUrl: 'https://www.youtube.com/embed/H9bfqozJoqs',
          timeComplexity: 'O(amount * coins.length)',
          spaceComplexity: 'O(amount)',
          description: 'You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins that you need to make up that amount.',
          codeSolutions: {
            python: `class Solution:\n    def coinChange(self, coins: List[int], amount: int) -> int:\n        dp = [amount + 1] * (amount + 1)\n        dp[0] = 0\n        for a in range(1, amount + 1):\n            for c in coins:\n                if a - c >= 0:\n                    dp[a] = min(dp[a], 1 + dp[a - c])\n        return dp[amount] if dp[amount] != amount + 1 else -1`,
            typescript: `function coinChange(coins: number[], amount: number): number {\n    const dp = new Array(amount + 1).fill(amount + 1);\n    dp[0] = 0;\n    for (let a = 1; a <= amount; a++) {\n        for (const c of coins) {\n            if (a - c >= 0) dp[a] = Math.min(dp[a], 1 + dp[a - c]);\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n};`,
            java: `class Solution {\n    public int coinChange(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int a = 1; a <= amount; a++) {\n            for (int c : coins) {\n                if (a - c >= 0) dp[a] = Math.min(dp[a], 1 + dp[a - c]);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        vector<int> dp(amount + 1, amount + 1);\n        dp[0] = 0;\n        for (int a = 1; a <= amount; a++) {\n            for (int c : coins) {\n                if (a - c >= 0) dp[a] = min(dp[a], 1 + dp[a - c]);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n};`
          }
        }
      ]
    },
    {
      id: 'intervals',
      title: 'Intervals',
      category: 'Algorithms',
      description: 'Overlap detection, interval merging, meeting room scheduling & sweep-line algorithms.',
      level: 5,
      prerequisites: ['heap-priority-queue'],
      color: '#38bdf8',
      badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      problems: [
        {
          id: 'p-insert-interval',
          title: 'Insert Interval',
          difficulty: 'Medium',
          category: 'Intervals',
          leetcodeUrl: 'https://leetcode.com/problems/insert-interval/',
          videoEmbedUrl: 'https://www.youtube.com/embed/A8NUOmlwOlM',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          description: 'Insert newInterval into intervals such that intervals is still sorted in ascending order by start and intervals still does not have any overlapping intervals.',
          codeSolutions: {
            python: `class Solution:\n    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:\n        res = []\n        for i in range(len(intervals)):\n            if newInterval[1] < intervals[i][0]:\n                res.append(newInterval)\n                return res + intervals[i:]\n            elif newInterval[0] > intervals[i][1]:\n                res.append(intervals[i])\n            else:\n                newInterval = [\n                    min(newInterval[0], intervals[i][0]),\n                    max(newInterval[1], intervals[i][1])\n                ]\n        res.append(newInterval)\n        return res`,
            typescript: `function insert(intervals: number[][], newInterval: number[]): number[][] {\n    const res: number[][] = [];\n    for (let i = 0; i < intervals.length; i++) {\n        if (newInterval[1] < intervals[i][0]) {\n            res.push(newInterval);\n            return res.concat(intervals.slice(i));\n        } else if (newInterval[0] > intervals[i][1]) {\n            res.push(intervals[i]);\n        } else {\n            newInterval = [\n                Math.min(newInterval[0], intervals[i][0]),\n                Math.max(newInterval[1], intervals[i][1])\n            ];\n        }\n    }\n    res.push(newInterval);\n    return res;\n};`,
            java: `class Solution {\n    public int[][] insert(int[][] intervals, int[] newInterval) {\n        List<int[]> res = new ArrayList<>();\n        for (int[] slot : intervals) {\n            if (newInterval[1] < slot[0]) {\n                res.add(newInterval);\n                newInterval = slot;\n            } else if (newInterval[0] > slot[1]) {\n                res.add(slot);\n            } else {\n                newInterval[0] = Math.min(newInterval[0], slot[0]);\n                newInterval[1] = Math.max(newInterval[1], slot[1]);\n            }\n        }\n        res.add(newInterval);\n        return res.toArray(new int[res.size()][]);\n    }\n}`,
            cpp: `class Solution {\npublic:\n    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {\n        vector<vector<int>> res;\n        for (int i = 0; i < intervals.size(); i++) {\n            if (newInterval[1] < intervals[i][0]) {\n                res.push_back(newInterval);\n                for (int j = i; j < intervals.size(); j++) res.push_back(intervals[j]);\n                return res;\n            } else if (newInterval[0] > intervals[i][1]) {\n                res.push_back(intervals[i]);\n            } else {\n                newInterval[0] = min(newInterval[0], intervals[i][0]);\n                newInterval[1] = max(newInterval[1], intervals[i][1]);\n            }\n        }\n        res.push_back(newInterval);\n        return res;\n    }\n};`
          }
        },
        {
          id: 'p-merge-intervals',
          title: 'Merge Intervals',
          difficulty: 'Medium',
          category: 'Intervals',
          leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/',
          videoEmbedUrl: 'https://www.youtube.com/embed/44H3cEC2fFM',
          timeComplexity: 'O(n log n)',
          spaceComplexity: 'O(n)',
          description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals.',
          codeSolutions: {
            python: `class Solution:\n    def merge(self, intervals: List[List[int]]) -> List[List[int]]:\n        intervals.sort(key=lambda i: i[0])\n        output = [intervals[0]]\n        for start, end in intervals[1:]:\n            lastEnd = output[-1][1]\n            if start <= lastEnd:\n                output[-1][1] = max(lastEnd, end)\n            else:\n                output.append([start, end])\n        return output`,
            typescript: `function merge(intervals: number[][]): number[][] {\n    intervals.sort((a, b) => a[0] - b[0]);\n    const res = [intervals[0]];\n    for (let i = 1; i < intervals.length; i++) {\n        const last = res[res.length - 1];\n        if (intervals[i][0] <= last[1]) {\n            last[1] = Math.max(last[1], intervals[i][1]);\n        } else {\n            res.push(intervals[i]);\n        }\n    }\n    return res;\n};`,
            java: `class Solution {\n    public int[][] merge(int[][] intervals) {\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        List<int[]> merged = new ArrayList<>();\n        int[] prev = intervals[0];\n        merged.add(prev);\n        for (int[] curr : intervals) {\n            if (curr[0] <= prev[1]) prev[1] = Math.max(prev[1], curr[1]);\n            else { prev = curr; merged.add(prev); }\n        }\n        return merged.toArray(new int[merged.size()][]);\n    }\n}`,
            cpp: `class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        sort(intervals.begin(), intervals.end());\n        vector<vector<int>> res = {intervals[0]};\n        for (int i = 1; i < intervals.size(); i++) {\n            if (intervals[i][0] <= res.back()[1]) res.back()[1] = max(res.back()[1], intervals[i][1]);\n            else res.push_back(intervals[i]);\n        }\n        return res;\n    }\n};`
          }
        }
      ]
    },
    {
      id: 'greedy',
      title: 'Greedy',
      category: 'Algorithms',
      description: 'Locally optimal choice strategies, Jump Game, Gas Station, and Hand of Straights.',
      level: 6,
      prerequisites: ['intervals'],
      color: '#facc15',
      badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      problems: [
        {
          id: 'p-jump-game',
          title: 'Jump Game',
          difficulty: 'Medium',
          category: 'Greedy',
          leetcodeUrl: 'https://leetcode.com/problems/jump-game/',
          videoEmbedUrl: 'https://www.youtube.com/embed/Yan0cv2cLy8',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)',
          description: 'You are given an integer array nums. You are initially positioned at the array\'s first index, and each element in the array represents your maximum jump length. Return true if you can reach the last index.',
          codeSolutions: {
            python: `class Solution:\n    def canJump(self, nums: List[int]) -> bool:\n        goal = len(nums) - 1\n        for i in range(len(nums) - 2, -1, -1):\n            if i + nums[i] >= goal:\n                goal = i\n        return goal == 0`,
            typescript: `function canJump(nums: number[]): boolean {\n    let goal = nums.length - 1;\n    for (let i = nums.length - 2; i >= 0; i--) {\n        if (i + nums[i] >= goal) goal = i;\n    }\n    return goal === 0;\n};`,
            java: `class Solution {\n    public boolean canJump(int[] nums) {\n        int goal = nums.length - 1;\n        for (int i = nums.length - 2; i >= 0; i--) {\n            if (i + nums[i] >= goal) goal = i;\n        }\n        return goal == 0;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    bool canJump(vector<int>& nums) {\n        int goal = nums.size() - 1;\n        for (int i = nums.size() - 2; i >= 0; i--) {\n            if (i + nums[i] >= goal) goal = i;\n        }\n        return goal == 0;\n    }\n};`
          }
        }
      ]
    },
    {
      id: 'advanced-graphs',
      title: 'Advanced Graphs',
      category: 'Algorithms',
      description: 'Dijkstra shortest path, Prim / Kruskal Minimum Spanning Tree, and Alien Dictionary.',
      level: 6,
      prerequisites: ['graphs', 'tries'],
      color: '#4f46e5',
      badgeColor: 'bg-indigo-600/10 text-indigo-300 border-indigo-500/30',
      problems: [
        {
          id: 'p-network-delay-time',
          title: 'Network Delay Time (Dijkstra)',
          difficulty: 'Medium',
          category: 'Advanced Graphs',
          leetcodeUrl: 'https://leetcode.com/problems/network-delay-time/',
          videoEmbedUrl: 'https://www.youtube.com/embed/EaphyqKU4PQ',
          timeComplexity: 'O(E log V)',
          spaceComplexity: 'O(V + E)',
          description: 'You are given a network of n nodes, labeled from 1 to n. Return the minimum time it takes for all the n nodes to receive the signal using Dijkstra algorithm.',
          codeSolutions: {
            python: `class Solution:\n    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:\n        edges = collections.defaultdict(list)\n        for u, v, w in times:\n            edges[u].append((v, w))\n        minHeap = [(0, k)]\n        visit = set()\n        t = 0\n        while minHeap:\n            w1, n1 = heapq.heappop(minHeap)\n            if n1 in visit: continue\n            visit.add(n1)\n            t = w1\n            for n2, w2 in edges[n1]:\n                if n2 not in visit:\n                    heapq.heappush(minHeap, (w1 + w2, n2))\n        return t if len(visit) == n else -1`,
            typescript: `function networkDelayTime(times: number[][], n: number, k: number): number {\n    const dist = new Array(n + 1).fill(Infinity);\n    dist[k] = 0;\n    for (let i = 0; i < n - 1; i++) {\n        for (const [u, v, w] of times) {\n            if (dist[u] !== Infinity && dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w;\n            }\n        }\n    }\n    let maxTime = 0;\n    for (let i = 1; i <= n; i++) {\n        if (dist[i] === Infinity) return -1;\n        maxTime = Math.max(maxTime, dist[i]);\n    }\n    return maxTime;\n};`,
            java: `class Solution {\n    public int networkDelayTime(int[][] times, int n, int k) {\n        Map<Integer, List<int[]>> graph = new HashMap<>();\n        for (int[] t : times) graph.computeIfAbsent(t[0], x -> new ArrayList<>()).add(new int[]{t[1], t[2]});\n        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);\n        pq.offer(new int[]{k, 0});\n        Map<Integer, Integer> dist = new HashMap<>();\n        while (!pq.isEmpty()) {\n            int[] cur = pq.poll();\n            int node = cur[0], d = cur[1];\n            if (dist.containsKey(node)) continue;\n            dist.put(node, d);\n            if (graph.containsKey(node)) {\n                for (int[] next : graph.get(node)) {\n                    if (!dist.containsKey(next[0])) pq.offer(new int[]{next[0], d + next[1]});\n                }\n            }\n        }\n        if (dist.size() != n) return -1;\n        return Collections.max(dist.values());\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int networkDelayTime(vector<vector<int>>& times, int n, int k) {\n        vector<vector<pair<int, int>>> adj(n + 1);\n        for (auto& t : times) adj[t[0]].push_back({t[1], t[2]});\n        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;\n        pq.push({0, k});\n        vector<int> dist(n + 1, INT_MAX);\n        dist[k] = 0;\n        while (!pq.empty()) {\n            auto [d, u] = pq.top(); pq.pop();\n            if (d > dist[u]) continue;\n            for (auto& [v, w] : adj[u]) {\n                if (dist[u] + w < dist[v]) {\n                    dist[v] = dist[u] + w;\n                    pq.push({dist[v], v});\n                }\n            }\n        }\n        int maxD = 0;\n        for (int i = 1; i <= n; i++) {\n            if (dist[i] == INT_MAX) return -1;\n            maxD = max(maxD, dist[i]);\n        }\n        return maxD;\n    }\n};`
          }
        }
      ]
    },
    {
      id: '2d-dp',
      title: '2-D Dynamic Programming',
      category: 'Algorithms',
      description: 'Grid paths, Longest Common Subsequence, Edit Distance, and 0/1 Knapsack variations.',
      level: 6,
      prerequisites: ['1d-dp', 'greedy'],
      color: '#d946ef',
      badgeColor: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30',
      problems: [
        {
          id: 'p-unique-paths',
          title: 'Unique Paths',
          difficulty: 'Medium',
          category: '2-D DP',
          leetcodeUrl: 'https://leetcode.com/problems/unique-paths/',
          videoEmbedUrl: 'https://www.youtube.com/embed/IlEsdxuD4lY',
          timeComplexity: 'O(m * n)',
          spaceComplexity: 'O(n)',
          description: 'A robot is located at the top-left corner of a m x n grid. The robot can only move down or right. How many possible unique paths are there to the bottom-right corner?',
          codeSolutions: {
            python: `class Solution:\n    def uniquePaths(self, m: int, n: int) -> int:\n        row = [1] * n\n        for i in range(m - 1):\n            newRow = [1] * n\n            for j in range(n - 2, -1, -1):\n                newRow[j] = newRow[j + 1] + row[j]\n            row = newRow\n        return row[0]`,
            typescript: `function uniquePaths(m: number, n: number): number {\n    const dp = new Array(n).fill(1);\n    for (let r = 1; r < m; r++) {\n        for (let c = 1; c < n; c++) {\n            dp[c] += dp[c - 1];\n        }\n    }\n    return dp[n - 1];\n};`,
            java: `class Solution {\n    public int uniquePaths(int m, int n) {\n        int[] dp = new int[n];\n        Arrays.fill(dp, 1);\n        for (int r = 1; r < m; r++) {\n            for (int c = 1; c < n; c++) {\n                dp[c] += dp[c - 1];\n            }\n        }\n        return dp[n - 1];\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int uniquePaths(int m, int n) {\n        vector<int> dp(n, 1);\n        for (int r = 1; r < m; r++) {\n            for (int c = 1; c < n; c++) {\n                dp[c] += dp[c - 1];\n            }\n        }\n        return dp[n - 1];\n    }\n};`
          }
        },
        {
          id: 'p-longest-common-subsequence',
          title: 'Longest Common Subsequence',
          difficulty: 'Medium',
          category: '2-D DP',
          leetcodeUrl: 'https://leetcode.com/problems/longest-common-subsequence/',
          videoEmbedUrl: 'https://www.youtube.com/embed/Ua0GhsJCEWM',
          timeComplexity: 'O(m * n)',
          spaceComplexity: 'O(m * n)',
          description: 'Given two strings text1 and text2, return the length of their longest common subsequence.',
          codeSolutions: {
            python: `class Solution:\n    def longestCommonSubsequence(self, text1: str, text2: str) -> int:\n        dp = [[0 for j in range(len(text2) + 1)] for i in range(len(text1) + 1)]\n        for i in range(len(text1) - 1, -1, -1):\n            for j in range(len(text2) - 1, -1, -1):\n                if text1[i] == text2[j]:\n                    dp[i][j] = 1 + dp[i + 1][j + 1]\n                else:\n                    dp[i][j] = max(dp[i + 1][j], dp[i][j + 1])\n        return dp[0][0]`,
            typescript: `function longestCommonSubsequence(text1: string, text2: string): number {\n    const m = text1.length, n = text2.length;\n    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n    for (let i = 1; i <= m; i++) {\n        for (let j = 1; j <= n; j++) {\n            if (text1[i - 1] === text2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];\n            else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n        }\n    }\n    return dp[m][n];\n};`,
            java: `class Solution {\n    public int longestCommonSubsequence(String text1, String text2) {\n        int m = text1.length(), n = text2.length();\n        int[][] dp = new int[m + 1][n + 1];\n        for (int i = 1; i <= m; i++) {\n            for (int j = 1; j <= n; j++) {\n                if (text1.charAt(i - 1) == text2.charAt(j - 1)) dp[i][j] = 1 + dp[i - 1][j - 1];\n                else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n            }\n        }\n        return dp[m][n];\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int longestCommonSubsequence(string text1, string text2) {\n        int m = text1.size(), n = text2.size();\n        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));\n        for (int i = 1; i <= m; i++) {\n            for (int j = 1; j <= n; j++) {\n                if (text1[i - 1] == text2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];\n                else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);\n            }\n        }\n        return dp[m][n];\n    }\n};`
          }
        }
      ]
    },
    {
      id: 'bit-manipulation',
      title: 'Bit Manipulation',
      category: 'Core Concepts',
      description: 'XOR tricks, two complement, bitwise shifts, counting bits, and mask representations.',
      level: 7,
      prerequisites: ['advanced-graphs'],
      color: '#065f46',
      badgeColor: 'bg-emerald-800/20 text-emerald-300 border-emerald-500/30',
      problems: [
        {
          id: 'p-single-number',
          title: 'Single Number',
          difficulty: 'Easy',
          category: 'Bit Manipulation',
          leetcodeUrl: 'https://leetcode.com/problems/single-number/',
          videoEmbedUrl: 'https://www.youtube.com/embed/qMPX1AOa83k',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)',
          description: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one using XOR.',
          codeSolutions: {
            python: `class Solution:\n    def singleNumber(self, nums: List[int]) -> int:\n        res = 0\n        for n in nums:\n            res = n ^ res\n        return res`,
            typescript: `function singleNumber(nums: number[]): number {\n    return nums.reduce((acc, num) => acc ^ num, 0);\n};`,
            java: `class Solution {\n    public int singleNumber(int[] nums) {\n        int res = 0;\n        for (int n : nums) res ^= n;\n        return res;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        int res = 0;\n        for (int n : nums) res ^= n;\n        return res;\n    }\n};`
          }
        },
        {
          id: 'p-number-of-1-bits',
          title: 'Number of 1 Bits (Hamming Weight)',
          difficulty: 'Easy',
          category: 'Bit Manipulation',
          leetcodeUrl: 'https://leetcode.com/problems/number-of-1-bits/',
          videoEmbedUrl: 'https://www.youtube.com/embed/5Km3utixwZs',
          timeComplexity: 'O(1)',
          spaceComplexity: 'O(1)',
          description: 'Write a function that takes the binary representation of a positive integer and returns the number of set bits (Brian Kernighan algorithm).',
          codeSolutions: {
            python: `class Solution:\n    def hammingWeight(self, n: int) -> int:\n        res = 0\n        while n:\n            n &= (n - 1)\n            res += 1\n        return res`,
            typescript: `function hammingWeight(n: number): number {\n    let count = 0;\n    while (n !== 0) {\n        n &= (n - 1);\n        count++;\n    }\n    return count;\n};`,
            java: `class Solution {\n    public int hammingWeight(int n) {\n        int count = 0;\n        while (n != 0) {\n            n &= (n - 1);\n            count++;\n        }\n        return count;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int hammingWeight(uint32_t n) {\n        int count = 0;\n        while (n) {\n            n &= (n - 1);\n            count++;\n        }\n        return count;\n    }\n};`
          }
        }
      ]
    },
    {
      id: 'math-geometry',
      title: 'Math & Geometry',
      category: 'Core Concepts',
      description: 'Matrix rotations, Spiral Matrix, Fast Power, and GCD / Sieve of Eratosthenes.',
      level: 7,
      prerequisites: ['2d-dp'],
      color: '#0284c7',
      badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      problems: [
        {
          id: 'p-rotate-image',
          title: 'Rotate Image (90° Matrix)',
          difficulty: 'Medium',
          category: 'Math & Geometry',
          leetcodeUrl: 'https://leetcode.com/problems/rotate-image/',
          videoEmbedUrl: 'https://www.youtube.com/embed/fMSJSS7EvUw',
          timeComplexity: 'O(n^2)',
          spaceComplexity: 'O(1)',
          description: 'You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise) in-place.',
          codeSolutions: {
            python: `class Solution:\n    def rotate(self, matrix: List[List[int]]) -> None:\n        l, r = 0, len(matrix) - 1\n        while l < r:\n            for i in range(r - l):\n                top, bottom = l, r\n                topLeft = matrix[top][l + i]\n                matrix[top][l + i] = matrix[bottom - i][l]\n                matrix[bottom - i][l] = matrix[bottom][r - i]\n                matrix[bottom][r - i] = matrix[top + i][r]\n                matrix[top + i][r] = topLeft\n            r -= 1; l += 1`,
            typescript: `function rotate(matrix: number[][]): void {\n    const n = matrix.length;\n    for (let i = 0; i < n; i++) {\n        for (let j = i + 1; j < n; j++) {\n            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];\n        }\n    }\n    for (let i = 0; i < n; i++) {\n        matrix[i].reverse();\n    }\n};`,
            java: `class Solution {\n    public void rotate(int[][] matrix) {\n        int n = matrix.length;\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                int temp = matrix[i][j];\n                matrix[i][j] = matrix[j][i];\n                matrix[j][i] = temp;\n            }\n        }\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < n / 2; j++) {\n                int temp = matrix[i][j];\n                matrix[i][j] = matrix[i][n - 1 - j];\n                matrix[i][n - 1 - j] = temp;\n            }\n        }\n    }\n}`,
            cpp: `class Solution {\npublic:\n    void rotate(vector<vector<int>>& matrix) {\n        int n = matrix.size();\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                swap(matrix[i][j], matrix[j][i]);\n            }\n        }\n        for (int i = 0; i < n; i++) {\n            reverse(matrix[i].begin(), matrix[i].end());\n        }\n    }\n};`
          }
        },
        {
          id: 'p-spiral-matrix',
          title: 'Spiral Matrix',
          difficulty: 'Medium',
          category: 'Math & Geometry',
          leetcodeUrl: 'https://leetcode.com/problems/spiral-matrix/',
          videoEmbedUrl: 'https://www.youtube.com/embed/BJnMZNwUk1M',
          timeComplexity: 'O(m * n)',
          spaceComplexity: 'O(1)',
          description: 'Given an m x n matrix, return all elements of the matrix in spiral order.',
          codeSolutions: {
            python: `class Solution:\n    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:\n        res = []\n        left, right = 0, len(matrix[0])\n        top, bottom = 0, len(matrix)\n        while left < right and top < bottom:\n            for i in range(left, right): res.append(matrix[top][i])\n            top += 1\n            for i in range(top, bottom): res.append(matrix[i][right - 1])\n            right -= 1\n            if not (left < right and top < bottom): break\n            for i in range(right - 1, left - 1, -1): res.append(matrix[bottom - 1][i])\n            bottom -= 1\n            for i in range(bottom - 1, top - 1, -1): res.append(matrix[i][left])\n            left += 1\n        return res`,
            typescript: `function spiralOrder(matrix: number[][]): number[] {\n    const res: number[] = [];\n    let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;\n    while (top <= bottom && left <= right) {\n        for (let i = left; i <= right; i++) res.push(matrix[top][i]);\n        top++;\n        for (let i = top; i <= bottom; i++) res.push(matrix[i][right]);\n        right--;\n        if (top <= bottom) {\n            for (let i = right; i >= left; i--) res.push(matrix[bottom][i]);\n            bottom--;\n        }\n        if (left <= right) {\n            for (let i = bottom; i >= top; i--) res.push(matrix[i][left]);\n            left++;\n        }\n    }\n    return res;\n};`,
            java: `class Solution {\n    public List<Integer> spiralOrder(int[][] matrix) {\n        List<Integer> res = new ArrayList<>();\n        int top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;\n        while (top <= bottom && left <= right) {\n            for (int i = left; i <= right; i++) res.add(matrix[top][i]);\n            top++;\n            for (int i = top; i <= bottom; i++) res.add(matrix[i][right]);\n            right--;\n            if (top <= bottom) {\n                for (int i = right; i >= left; i--) res.add(matrix[bottom][i]);\n                bottom--;\n            }\n            if (left <= right) {\n                for (int i = bottom; i >= top; i--) res.add(matrix[i][left]);\n                left++;\n            }\n        }\n        return res;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    vector<int> spiralOrder(vector<vector<int>>& matrix) {\n        vector<int> res;\n        int top = 0, bottom = matrix.size() - 1, left = 0, right = matrix[0].size() - 1;\n        while (top <= bottom && left <= right) {\n            for (int i = left; i <= right; i++) res.push_back(matrix[top][i]);\n            top++;\n            for (int i = top; i <= bottom; i++) res.push_back(matrix[i][right]);\n            right--;\n            if (top <= bottom) {\n                for (int i = right; i >= left; i--) res.push_back(matrix[bottom][i]);\n                bottom--;\n            }\n            if (left <= right) {\n                for (int i = bottom; i >= top; i--) res.push_back(matrix[i][left]);\n                left++;\n            }\n        }\n        return res;\n    }\n};`
          }
        }
      ]
    }
  ]
};

export const SYSTEM_DESIGN_TRACK: NeetCodeTrack = {
  id: 'system-design',
  title: 'System Design & Distributed Systems',
  description: 'Scalability, microservices, load balancing, caching, databases & real-world high-scale architectures.',
  icon: '🏗️',
  nodes: [
    {
      id: 'sd-networking',
      title: 'Networking & HTTP/HTTPS Protocols',
      category: 'Foundations',
      description: 'TCP 3-way handshake, DNS resolution, HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC), WebSockets, and gRPC.',
      level: 0,
      prerequisites: [],
      color: '#3b82f6',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      problems: [
        {
          id: 'sd-p-tcp-udp',
          title: 'TCP vs UDP vs QUIC Protocol Analysis',
          difficulty: 'Medium',
          category: 'Networking',
          leetcodeUrl: 'https://en.wikipedia.org/wiki/Transmission_Control_Protocol',
          videoEmbedUrl: 'https://www.youtube.com/embed/PpsEaqJV_A0',
          timeComplexity: 'O(1)',
          spaceComplexity: 'O(1)',
          description: 'Compare reliability, latency, congestion control algorithms (BBR, CUBIC), and packet headers in distributed services.',
          codeSolutions: {
            python: `# Python socket benchmark example\nimport socket\ndef check_tcp_latency(host, port):\n    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n    s.settimeout(2.0)\n    s.connect((host, port))\n    s.close()`,
            typescript: `// Node.js HTTP/2 multiplexing server snippet\nimport http2 from 'http2';\nconst server = http2.createSecureServer({});`,
            java: `// Socket channel Java snippet\nSocketChannel channel = SocketChannel.open();`,
            cpp: `// POSIX socket endpoint in C++\nint sock = socket(AF_INET, SOCK_STREAM, 0);`
          }
        }
      ]
    },
    {
      id: 'sd-load-balancing',
      title: 'Load Balancing & Reverse Proxies',
      category: 'Scaling & Routing',
      description: 'Round-robin, least connections, consistent hashing rings, NGINX, HAProxy & AWS ALB/NLB architectures.',
      level: 1,
      prerequisites: ['sd-networking'],
      color: '#10b981',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      problems: [
        {
          id: 'sd-p-consistent-hashing',
          title: 'Consistent Hashing Ring Implementation',
          difficulty: 'Hard',
          category: 'Load Balancing',
          leetcodeUrl: 'https://en.wikipedia.org/wiki/Consistent_hashing',
          videoEmbedUrl: 'https://www.youtube.com/embed/zaRkONvyGr8',
          timeComplexity: 'O(log N) lookup',
          spaceComplexity: 'O(N * V)',
          description: 'Design and implement a consistent hashing ring with virtual nodes to distribute traffic evenly across changing cache nodes.',
          codeSolutions: {
            python: `import bisect\nimport hashlib\nclass ConsistentHashRing:\n    def __init__(self, replicas=100):\n        self.replicas = replicas\n        self.ring = []\n        self.node_map = {}\n    def add_node(self, node):\n        for i in range(self.replicas):\n            h = int(hashlib.md5(f"{node}:{i}".encode()).hexdigest(), 16)\n            bisect.insort(self.ring, h)\n            self.node_map[h] = node\n    def get_node(self, key):\n        if not self.ring: return None\n        h = int(hashlib.md5(key.encode()).hexdigest(), 16)\n        idx = bisect.bisect_right(self.ring, h)\n        if idx == len(self.ring): idx = 0\n        return self.node_map[self.ring[idx]]`,
            typescript: `// TypeScript Consistent Hashing Ring with Virtual Nodes\nclass ConsistentHashRing {\n    private ring: number[] = [];\n    private map = new Map<number, string>();\n    add(node: string, replicas = 50) {\n        // map virtual hashes onto sorted binary ring\n    }\n}`,
            java: `public class ConsistentHashRing {\n    private final TreeMap<Long, String> circle = new TreeMap<>();\n}`,
            cpp: `class ConsistentHashRing {\n    std::map<uint32_t, std::string> ring;\n};`
          }
        }
      ]
    },
    {
      id: 'sd-caching',
      title: 'Distributed Caching (Redis & Memcached)',
      category: 'Performance',
      description: 'Cache-aside, write-through, write-back, cache stampede (thundering herd), cache penetration & Bloom filters.',
      level: 1,
      prerequisites: ['sd-networking'],
      color: '#f59e0b',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      problems: [
        {
          id: 'sd-p-bloom-filter',
          title: 'Bloom Filter for Cache Penetration Prevention',
          difficulty: 'Medium',
          category: 'Caching',
          leetcodeUrl: 'https://en.wikipedia.org/wiki/Bloom_filter',
          videoEmbedUrl: 'https://www.youtube.com/embed/heEDL1OGuEo',
          timeComplexity: 'O(k) hash lookups',
          spaceComplexity: 'O(m) bits',
          description: 'Implement a space-efficient probabilistic data structure to quickly test set membership without hitting database.',
          codeSolutions: {
            python: `class BloomFilter:\n    def __init__(self, size=10000, hash_count=5):\n        self.size = size\n        self.hash_count = hash_count\n        self.bit_array = [0] * size\n    def add(self, item):\n        for i in range(self.hash_count):\n            idx = hash(f"{item}-{i}") % self.size\n            self.bit_array[idx] = 1\n    def check(self, item):\n        for i in range(self.hash_count):\n            idx = hash(f"{item}-{i}") % self.size\n            if self.bit_array[idx] == 0: return False\n        return True`,
            typescript: `class BloomFilter {\n    private bits = new Uint8Array(1024);\n}`,
            java: `class BloomFilter { private BitSet bitset = new BitSet(); }`,
            cpp: `class BloomFilter { std::vector<bool> bits; };`
          }
        }
      ]
    },
    {
      id: 'sd-databases',
      title: 'Databases: SQL vs NoSQL, Sharding & Replication',
      category: 'Data Layer',
      description: 'ACID transactions, B-Tree vs LSM-Tree storage engines, Write-Ahead Logs (WAL), Raft consensus & Horizontal Sharding.',
      level: 2,
      prerequisites: ['sd-load-balancing', 'sd-caching'],
      color: '#8b5cf6',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      problems: [
        {
          id: 'sd-p-db-sharding',
          title: 'Horizontal Sharding & Partition Key Strategy',
          difficulty: 'Hard',
          category: 'Databases',
          leetcodeUrl: 'https://en.wikipedia.org/wiki/Shard_(database_architecture)',
          videoEmbedUrl: 'https://www.youtube.com/embed/5faMjKuB9bc',
          timeComplexity: 'O(1) shard routing',
          spaceComplexity: 'O(S * N)',
          description: 'Design an automated sharding proxy that routes user read/write queries based on tenant or geographic hash.',
          codeSolutions: {
            python: `def get_shard_id(user_id: str, total_shards: int = 16) -> int:\n    import hashlib\n    return int(hashlib.sha256(user_id.encode()).hexdigest(), 16) % total_shards`,
            typescript: `function getShard(userId: string, totalShards = 16): number {\n    let hash = 0;\n    for (let i = 0; i < userId.length; i++) hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;\n    return hash % totalShards;\n}`,
            java: `public int getShard(String userId, int shards) { return Math.abs(userId.hashCode()) % shards; }`,
            cpp: `int getShard(const std::string& userId, int shards) { return std::hash<std::string>{}(userId) % shards; }`
          }
        }
      ]
    },
    {
      id: 'sd-message-queues',
      title: 'Message Brokers (Kafka, RabbitMQ & Event-Driven)',
      category: 'Async Processing',
      description: 'Partition logs, offset commits, dead-letter queues, idempotent consumers, exactly-once semantics & backpressure.',
      level: 2,
      prerequisites: ['sd-load-balancing'],
      color: '#ec4899',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
      problems: [
        {
          id: 'sd-p-rate-limiter',
          title: 'Design a Distributed Rate Limiter (Token Bucket / Sliding Window)',
          difficulty: 'Medium',
          category: 'System Design',
          leetcodeUrl: 'https://en.wikipedia.org/wiki/Token_bucket',
          videoEmbedUrl: 'https://www.youtube.com/embed/9CI_u5VqKkM',
          timeComplexity: 'O(1)',
          spaceComplexity: 'O(U) users in Redis',
          description: 'Design a distributed rate limiting middleware preventing API abuse using Redis sliding window log.',
          codeSolutions: {
            python: `import time\nclass TokenBucketRateLimiter:\n    def __init__(self, capacity: int, refill_rate: float):\n        self.capacity = capacity\n        self.tokens = capacity\n        self.refill_rate = refill_rate\n        self.last_refill = time.time()\n    def allow_request(self) -> bool:\n        now = time.time()\n        elapsed = now - self.last_refill\n        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)\n        self.last_refill = now\n        if self.tokens >= 1:\n            self.tokens -= 1\n            return True\n        return False`,
            typescript: `class TokenBucket {\n    private tokens: number;\n    private last: number = Date.now();\n    constructor(private cap: number, private rate: number) { this.tokens = cap; }\n    allow(): boolean {\n        const now = Date.now();\n        this.tokens = Math.min(this.cap, this.tokens + ((now - this.last)/1000) * this.rate);\n        this.last = now;\n        if (this.tokens >= 1) { this.tokens -= 1; return true; }\n        return false;\n    }\n}`,
            java: `public class TokenBucketRateLimiter { /* Java token bucket implementation */ }`,
            cpp: `class TokenBucket { /* C++ chrono token bucket */ };`
          }
        }
      ]
    },
    {
      id: 'sd-large-scale-apps',
      title: 'Real-World Architectures (YouTube, Twitter, Uber)',
      category: 'Capstone Architecture',
      description: 'End-to-end design of massive scale apps: Video transcoding pipelines, news feed generation & geospatial quad-trees.',
      level: 3,
      prerequisites: ['sd-databases', 'sd-message-queues'],
      color: '#ef4444',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      problems: [
        {
          id: 'sd-p-design-twitter',
          title: 'Design Twitter / X News Feed System',
          difficulty: 'Hard',
          category: 'System Design',
          leetcodeUrl: 'https://leetcode.com/problems/design-twitter/',
          videoEmbedUrl: 'https://www.youtube.com/embed/pNichitDD2E',
          timeComplexity: 'Fan-out on write vs Fan-out on read analysis',
          spaceComplexity: 'O(Users * FeedSize)',
          description: 'Design a scalable real-time feed delivery system handling celebrity fan-out and million-follower timelines.',
          codeSolutions: {
            python: `import heapq\nclass Twitter:\n    def __init__(self):\n        self.count = 0\n        self.tweetMap = defaultdict(list) # userId -> list of [count, tweetId]\n        self.followMap = defaultdict(set) # userId -> set of followeeIds\n    def postTweet(self, userId: int, tweetId: int) -> None:\n        self.tweetMap[userId].append([self.count, tweetId])\n        self.count -= 1\n    def getNewsFeed(self, userId: int) -> List[int]:\n        res = []\n        minHeap = []\n        self.followMap[userId].add(userId)\n        for followeeId in self.followMap[userId]:\n            if followeeId in self.tweetMap:\n                index = len(self.tweetMap[followeeId]) - 1\n                count, tweetId = self.tweetMap[followeeId][index]\n                minHeap.append([count, tweetId, followeeId, index - 1])\n        heapq.heapify(minHeap)\n        while minHeap and len(res) < 10:\n            count, tweetId, followeeId, index = heapq.heappop(minHeap)\n            res.append(tweetId)\n            if index >= 0:\n                count, tweetId = self.tweetMap[followeeId][index]\n                heapq.heappush(minHeap, [count, tweetId, followeeId, index - 1])\n        return res`,
            typescript: `// TypeScript Priority Queue Twitter timeline implementation`,
            java: `class Twitter { /* Java feed engine with PriorityQueue */ }`,
            cpp: `class Twitter { /* C++ Twitter implementation */ };`
          }
        }
      ]
    }
  ]
};

export const ALL_TRACKS: NeetCodeTrack[] = [
  CORE_DSA_TRACK,
  SYSTEM_DESIGN_TRACK
];
