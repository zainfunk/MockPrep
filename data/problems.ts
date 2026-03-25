export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  hints: string[];
  starterCode: string;
  companies?: string[];
}

const _difficultyOrder: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 };

const _allProblems: Problem[] = [
  // ─── EASY ───────────────────────────────────────────────────────────────────

  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'easy',
    category: 'Arrays',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    hints: [
      'A brute force approach would be O(n²). Can you do better?',
      'Think about what information you need to store as you iterate.',
      'A hash map can give you O(1) lookups.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'LinkedIn', 'Uber'],
  },

  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    category: 'Strings',
    description: `Given a string \`s\` containing just the characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\` and \`]\`, determine if the input string is valid.

An input string is valid if:
- Open brackets must be closed by the same type of brackets.
- Open brackets must be closed in the correct order.
- Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: 'true',
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
      },
      {
        input: 's = "(]"',
        output: 'false',
      },
      {
        input: 's = "([)]"',
        output: 'false',
      },
      {
        input: 's = "{[]}"',
        output: 'true',
      },
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      "s consists of parentheses only '()[]{}'",
    ],
    hints: [
      'Think about what data structure maintains order and lets you check the most recent element easily.',
      'A stack is perfect here — push opening brackets, pop and check when you see a closing bracket.',
      'At the end, the stack must be empty for the string to be valid.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Meta', 'Microsoft', 'Amazon', 'Google', 'Netflix'],
  },

  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'easy',
    category: 'Linked Lists',
    description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.`,
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]',
      },
      {
        input: 'head = [1,2]',
        output: '[2,1]',
      },
      {
        input: 'head = []',
        output: '[]',
      },
    ],
    constraints: [
      'The number of nodes in the list is in the range [0, 5000].',
      '-5000 <= Node.val <= 5000',
    ],
    hints: [
      'You need to change the direction of every pointer.',
      'Keep track of the previous node as you traverse — you need it to reverse each pointer.',
      'Can you do this both iteratively and recursively?',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Meta', 'Amazon', 'Microsoft', 'Google'],
  },

  {
    id: 'best-time-to-buy-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'easy',
    category: 'Arrays',
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`th day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.`,
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.',
      },
      {
        input: 'prices = [7,6,4,3,1]',
        output: '0',
        explanation: 'In this case, no transactions are done and the max profit = 0.',
      },
    ],
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4',
    ],
    hints: [
      'You must buy before you sell — so you can only look forward from each buy day.',
      'Think about tracking the minimum price seen so far as you iterate.',
      'At each step, the best profit is the current price minus the minimum price seen so far.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft'],
  },

  {
    id: 'maximum-subarray',
    title: 'Maximum Subarray',
    difficulty: 'easy',
    category: 'Dynamic Programming',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.`,
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.',
      },
      {
        input: 'nums = [1]',
        output: '1',
      },
      {
        input: 'nums = [5,4,-1,7,8]',
        output: '23',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
    ],
    hints: [
      'A brute-force approach checking all subarrays is O(n²). Can you do it in O(n)?',
      "Kadane's algorithm: at each position, decide whether to extend the previous subarray or start fresh.",
      'If the current running sum becomes negative, it is better to start a new subarray from the next element.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Microsoft', 'Meta', 'Google'],
  },

  {
    id: 'palindrome-number',
    title: 'Palindrome Number',
    difficulty: 'easy',
    category: 'Math',
    description: `Given an integer \`x\`, return \`true\` if \`x\` is a palindrome, and \`false\` otherwise.

A palindrome reads the same forward and backward.`,
    examples: [
      {
        input: 'x = 121',
        output: 'true',
        explanation: '121 reads as 121 from left to right and from right to left.',
      },
      {
        input: 'x = -121',
        output: 'false',
        explanation: 'From left to right, it reads -121. From right to left, it reads 121-. Therefore it is not a palindrome.',
      },
      {
        input: 'x = 10',
        output: 'false',
        explanation: 'Reads 01 from right to left. Therefore it is not a palindrome.',
      },
    ],
    constraints: [
      '-2^31 <= x <= 2^31 - 1',
    ],
    hints: [
      'Negative numbers are never palindromes. What about numbers ending in 0?',
      'You could convert to a string and check — but can you solve it without string conversion?',
      'Try reversing only the second half of the number and comparing it to the first half.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Microsoft', 'Meta', 'Amazon'],
  },

  {
    id: 'merge-two-sorted-lists',
    title: 'Merge Two Sorted Lists',
    difficulty: 'easy',
    category: 'Linked Lists',
    description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.

Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.`,
    examples: [
      {
        input: 'list1 = [1,2,4], list2 = [1,3,4]',
        output: '[1,1,2,3,4,4]',
      },
      {
        input: 'list1 = [], list2 = []',
        output: '[]',
      },
      {
        input: 'list1 = [], list2 = [0]',
        output: '[0]',
      },
    ],
    constraints: [
      'The number of nodes in both lists is in the range [0, 50].',
      '-100 <= Node.val <= 100',
      'Both list1 and list2 are sorted in non-decreasing order.',
    ],
    hints: [
      'Use a dummy head node to simplify edge cases at the beginning of the merged list.',
      'Compare the current nodes of both lists and advance the pointer of the smaller one.',
      'After one list is exhausted, attach the remaining nodes of the other list.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft'],
  },

  {
    id: 'valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'easy',
    category: 'Strings',
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.`,
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: 'true',
      },
      {
        input: 's = "rat", t = "car"',
        output: 'false',
      },
    ],
    constraints: [
      '1 <= s.length, t.length <= 5 * 10^4',
      's and t consist of lowercase English letters.',
    ],
    hints: [
      'If the lengths differ, they cannot be anagrams.',
      'Sorting both strings and comparing is a simple O(n log n) approach.',
      'Use a hash map to count character frequencies in s, then decrement for each character in t — all counts should reach zero.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Google', 'Amazon', 'Microsoft', 'Meta'],
  },

  {
    id: 'contains-duplicate',
    title: 'Contains Duplicate',
    difficulty: 'easy',
    category: 'Arrays',
    description: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.`,
    examples: [
      {
        input: 'nums = [1,2,3,1]',
        output: 'true',
      },
      {
        input: 'nums = [1,2,3,4]',
        output: 'false',
      },
      {
        input: 'nums = [1,1,1,3,3,4,3,2,4,2]',
        output: 'true',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^9 <= nums[i] <= 10^9',
    ],
    hints: [
      'A brute force approach compares every pair — O(n²). Can you do better?',
      'Sorting first lets you find duplicates in O(n log n) by checking adjacent elements.',
      'A hash set gives you O(n) time: insert each number and check if it was already there.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Google', 'Amazon', 'Microsoft', 'Meta', 'LinkedIn'],
  },

  // ─── MEDIUM ──────────────────────────────────────────────────────────────────

  {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
    category: 'Strings',
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.',
      },
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.',
    ],
    hints: [
      'Think about using a sliding window approach.',
      'How can you efficiently track which characters are in your current window?',
      'When you find a duplicate, where should your window start?',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Google', 'Amazon', 'Microsoft', 'Netflix', 'Meta', 'Apple'],
  },

  {
    id: '3sum',
    title: '3Sum',
    difficulty: 'medium',
    category: 'Arrays',
    description: `Given an integer array \`nums\`, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
    examples: [
      {
        input: 'nums = [-1,0,1,2,-1,-4]',
        output: '[[-1,-1,2],[-1,0,1]]',
        explanation:
          'nums[0] + nums[1] + nums[2] = -1 + 0 + 1 = 0. nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0. The distinct triplets are [-1,0,1] and [-1,-1,2].',
      },
      {
        input: 'nums = [0,1,1]',
        output: '[]',
        explanation: 'The only possible triplet does not sum up to 0.',
      },
      {
        input: 'nums = [0,0,0]',
        output: '[[0,0,0]]',
        explanation: 'The only possible triplet sums up to 0.',
      },
    ],
    constraints: [
      '3 <= nums.length <= 3000',
      '-10^5 <= nums[i] <= 10^5',
    ],
    hints: [
      'Sorting the array first makes it much easier to avoid duplicates.',
      'Fix one number and use a two-pointer approach to find the other two.',
      'After sorting, skip duplicate values at each pointer position to avoid duplicate triplets.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'LinkedIn'],
  },

  {
    id: 'container-with-most-water',
    title: 'Container With Most Water',
    difficulty: 'medium',
    category: 'Arrays',
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i\`th line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.

Note: You may not slant the container.`,
    examples: [
      {
        input: 'height = [1,8,6,2,5,4,8,3,7]',
        output: '49',
        explanation:
          'The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49.',
      },
      {
        input: 'height = [1,1]',
        output: '1',
      },
    ],
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4',
    ],
    hints: [
      'The area is determined by the shorter of the two lines and the distance between them.',
      'A two-pointer approach starting from both ends works well here.',
      'Moving the pointer at the shorter line inward is always the right greedy choice — why?',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Google', 'Amazon', 'Microsoft', 'Meta'],
  },

  {
    id: 'longest-palindromic-substring',
    title: 'Longest Palindromic Substring',
    difficulty: 'medium',
    category: 'Strings',
    description: `Given a string \`s\`, return the longest palindromic substring in \`s\`.`,
    examples: [
      {
        input: 's = "babad"',
        output: '"bab"',
        explanation: '"aba" is also a valid answer.',
      },
      {
        input: 's = "cbbd"',
        output: '"bb"',
      },
    ],
    constraints: [
      '1 <= s.length <= 1000',
      's consist of only digits and English letters.',
    ],
    hints: [
      'A palindrome expands symmetrically around its center.',
      'For each character (and each pair of characters), try expanding outward while the characters match.',
      'There are 2n-1 possible centers for a string of length n — why?',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Google', 'Amazon', 'Microsoft', 'Meta'],
  },

  {
    id: 'word-search',
    title: 'Word Search',
    difficulty: 'medium',
    category: 'Backtracking',
    description: `Given an \`m x n\` grid of characters \`board\` and a string \`word\`, return \`true\` if \`word\` exists in the grid.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.`,
    examples: [
      {
        input:
          'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
        output: 'true',
      },
      {
        input:
          'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"',
        output: 'true',
      },
      {
        input:
          'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"',
        output: 'false',
      },
    ],
    constraints: [
      'm == board.length',
      'n = board[i].length',
      '1 <= m, n <= 6',
      '1 <= word.length <= 15',
      'board and word consists of only lowercase and uppercase English letters.',
    ],
    hints: [
      'Use DFS with backtracking starting from each cell that matches the first character.',
      'Mark cells as visited before recursing and unmark them when you backtrack.',
      'Your base case is when you have matched all characters in the word.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Meta', 'Microsoft', 'Google'],
  },

  {
    id: 'coin-change',
    title: 'Coin Change',
    difficulty: 'medium',
    category: 'Dynamic Programming',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      {
        input: 'coins = [1,5,11], amount = 11',
        output: '1',
        explanation: '11 = 11',
      },
      {
        input: 'coins = [2], amount = 3',
        output: '-1',
      },
      {
        input: 'coins = [1], amount = 0',
        output: '0',
      },
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4',
    ],
    hints: [
      'Think about building up solutions from smaller sub-problems.',
      'Define dp[i] as the minimum number of coins needed to make amount i.',
      'For each amount, try subtracting each coin and take the minimum result.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Google', 'Microsoft', 'Meta', 'Apple'],
  },

  {
    id: 'binary-tree-level-order-traversal',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'medium',
    category: 'Trees',
    description: `Given the \`root\` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).`,
    examples: [
      {
        input: 'root = [3,9,20,null,null,15,7]',
        output: '[[3],[9,20],[15,7]]',
      },
      {
        input: 'root = [1]',
        output: '[[1]]',
      },
      {
        input: 'root = []',
        output: '[]',
      },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 2000].',
      '-1000 <= Node.val <= 1000',
    ],
    hints: [
      'BFS (breadth-first search) naturally visits nodes level by level.',
      'Use a queue. At each level, process all nodes currently in the queue before moving to the next level.',
      'Track how many nodes are at the current level so you know when one level ends and the next begins.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Meta', 'Microsoft', 'Google'],
  },

  {
    id: 'product-of-array-except-self',
    title: 'Product of Array Except Self',
    difficulty: 'medium',
    category: 'Arrays',
    description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.

The product of any prefix or suffix of \`nums\` is **guaranteed** to fit in a 32-bit integer.

You must write an algorithm that runs in \`O(n)\` time and without using the division operation.`,
    examples: [
      {
        input: 'nums = [1,2,3,4]',
        output: '[24,12,8,6]',
      },
      {
        input: 'nums = [-1,1,0,-3,3]',
        output: '[0,0,9,0,0]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^5',
      '-30 <= nums[i] <= 30',
      'The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.',
    ],
    hints: [
      'For each index i, the answer is (product of all elements to the left) × (product of all elements to the right).',
      'Compute a prefix products array and a suffix products array.',
      'Can you do it with O(1) extra space by computing one pass left-to-right, then one pass right-to-left?',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft'],
  },

  {
    id: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'medium',
    category: 'Graphs',
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    examples: [
      {
        input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: '1',
      },
      {
        input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: '3',
      },
    ],
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      "grid[i][j] is '0' or '1'.",
    ],
    hints: [
      'Treat this as a graph problem where each land cell is a node connected to adjacent land cells.',
      'DFS or BFS from each unvisited land cell marks the entire island — increment a counter each time you start a new search.',
      'Modify the grid in-place (mark visited cells as \'0\') to avoid using extra space for a visited array.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Google', 'Meta', 'Amazon', 'Uber', 'LinkedIn', 'Microsoft'],
  },

  {
    id: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'medium',
    category: 'Arrays & Hashing',
    description: `Given an array of strings \`strs\`, group the anagrams together. You can return the answer in **any order**.

An **anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.`,
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
      },
      {
        input: 'strs = [""]',
        output: '[[""]]',
      },
      {
        input: 'strs = ["a"]',
        output: '[["a"]]',
      },
    ],
    constraints: [
      '1 <= strs.length <= 10^4',
      '0 <= strs[i].length <= 100',
      'strs[i] consists of lowercase English letters.',
    ],
    hints: [
      'Two strings are anagrams if and only if their sorted characters are identical.',
      'Use a hash map where the key is the sorted version of each string.',
      'All strings that map to the same sorted key belong to the same anagram group.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple'],
  },

  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'medium',
    category: 'Arrays',
    description: `Given an array of \`intervals\` where \`intervals[i] = [starti, endi]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].',
      },
      {
        input: 'intervals = [[1,4],[4,5]]',
        output: '[[1,5]]',
        explanation: 'Intervals [1,4] and [4,5] are considered overlapping.',
      },
    ],
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= starti <= endi <= 10^4',
    ],
    hints: [
      'Sorting by start time makes it easy to process intervals in order.',
      'After sorting, two intervals overlap if the start of the next is less than or equal to the end of the current.',
      'When merging, extend the end of the current interval to the maximum of both ends.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Google', 'Amazon', 'Meta', 'Netflix', 'Airbnb'],
  },

  {
    id: 'letter-combinations',
    title: 'Letter Combinations of a Phone Number',
    difficulty: 'medium',
    category: 'Backtracking',
    description: `Given a string containing digits from \`2-9\` inclusive, return all possible letter combinations that the number could represent. Return the answer in **any order**.

A mapping of digits to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.

2 → abc, 3 → def, 4 → ghi, 5 → jkl, 6 → mno, 7 → pqrs, 8 → tuv, 9 → wxyz`,
    examples: [
      {
        input: 'digits = "23"',
        output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]',
      },
      {
        input: 'digits = ""',
        output: '[]',
      },
      {
        input: 'digits = "2"',
        output: '["a","b","c"]',
      },
    ],
    constraints: [
      '0 <= digits.length <= 4',
      "digits[i] is a digit in the range ['2', '9'].",
    ],
    hints: [
      'Map each digit to its corresponding letters (the phone keypad mapping).',
      'Use backtracking — at each step, choose one letter for the current digit and recurse on the remaining digits.',
      'The base case is when you have processed all digits — add the current combination to the result.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Meta', 'Google', 'Amazon', 'Apple'],
  },

  {
    id: 'house-robber',
    title: 'House Robber',
    difficulty: 'medium',
    category: 'Dynamic Programming',
    description: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and **it will automatically contact the police if two adjacent houses were broken into on the same night**.

Given an integer array \`nums\` representing the amount of money of each house, return the maximum amount of money you can rob tonight **without alerting the police**.`,
    examples: [
      {
        input: 'nums = [1,2,3,1]',
        output: '4',
        explanation: 'Rob house 1 (money = 1) and then rob house 3 (money = 3). Total = 1 + 3 = 4.',
      },
      {
        input: 'nums = [2,7,9,3,1]',
        output: '12',
        explanation: 'Rob house 1, 3, and 5 (money = 2 + 9 + 1 = 12).',
      },
    ],
    constraints: [
      '1 <= nums.length <= 100',
      '0 <= nums[i] <= 400',
    ],
    hints: [
      'At each house you have two choices: rob it (and skip the previous) or skip it.',
      'Define dp[i] as the max amount you can rob from the first i houses.',
      'dp[i] = max(dp[i-2] + nums[i], dp[i-1]) — you only need the previous two values.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple'],
  },

  {
    id: 'word-break',
    title: 'Word Break',
    difficulty: 'medium',
    category: 'Dynamic Programming',
    description: `Given a string \`s\` and a dictionary of strings \`wordDict\`, return \`true\` if \`s\` can be segmented into a space-separated sequence of one or more dictionary words.

Note that the same word in the dictionary may be reused multiple times in the segmentation.`,
    examples: [
      {
        input: 's = "leetcode", wordDict = ["leet","code"]',
        output: 'true',
        explanation: 'Return true because "leetcode" can be segmented as "leet code".',
      },
      {
        input: 's = "applepenapple", wordDict = ["apple","pen"]',
        output: 'true',
        explanation: 'Return true because "applepenapple" can be segmented as "apple pen apple".',
      },
      {
        input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]',
        output: 'false',
      },
    ],
    constraints: [
      '1 <= s.length <= 300',
      '1 <= wordDict.length <= 1000',
      '1 <= wordDict[i].length <= 20',
      's and wordDict[i] consist of only lowercase English letters.',
      'All the strings of wordDict are unique.',
    ],
    hints: [
      'Define dp[i] as whether the substring s[0..i-1] can be segmented using the dictionary.',
      'For each position i, check all j < i where dp[j] is true and s[j..i-1] is a dictionary word.',
      'Convert wordDict to a set for O(1) lookups, and start with dp[0] = true (empty string is always valid).',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple'],
  },

  // ─── HARD ────────────────────────────────────────────────────────────────────

  {
    id: 'merge-k-sorted-lists',
    title: 'Merge K Sorted Lists',
    difficulty: 'hard',
    category: 'Linked Lists',
    description: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.`,
    examples: [
      {
        input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        output: '[1,1,2,3,4,4,5,6]',
        explanation:
          'The linked-lists are:\n1->4->5\n1->3->4\n2->6\nMerging them into one sorted list:\n1->1->2->3->4->4->5->6',
      },
      {
        input: 'lists = []',
        output: '[]',
      },
      {
        input: 'lists = [[]]',
        output: '[]',
      },
    ],
    constraints: [
      'k == lists.length',
      '0 <= k <= 10^4',
      '0 <= lists[i].length <= 500',
      '-10^4 <= lists[i][j] <= 10^4',
      'lists[i] is sorted in ascending order.',
      'The sum of lists[i].length will not exceed 10^4.',
    ],
    hints: [
      'Think about how you would merge two sorted lists first.',
      'Can you extend that to k lists efficiently?',
      'A min-heap (priority queue) can help you always find the smallest current element.',
      'Divide and conquer is another approach — merge lists pairwise.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Meta', 'Google', 'Amazon', 'Microsoft', 'Apple'],
  },

  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'hard',
    category: 'Arrays',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation:
          'The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.',
      },
      {
        input: 'height = [4,2,0,3,2,5]',
        output: '9',
      },
    ],
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5',
    ],
    hints: [
      'For each position, the water trapped is min(maxLeft, maxRight) - height[i].',
      'Precomputing maxLeft and maxRight arrays gives an O(n) solution with O(n) space.',
      'A two-pointer approach lets you do it in O(1) extra space — can you figure out why it works?',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Microsoft', 'Meta', 'Google'],
  },

  {
    id: 'n-queens',
    title: 'N-Queens',
    difficulty: 'hard',
    category: 'Backtracking',
    description: `The **n-queens** puzzle is the problem of placing \`n\` queens on an \`n x n\` chessboard such that no two queens attack each other.

Given an integer \`n\`, return all distinct solutions to the n-queens puzzle. You may return the answer in **any order**.

Each solution contains a distinct board configuration of the n-queens' placement, where \`'Q'\` and \`'.'\` both indicate a queen and an empty space, respectively.`,
    examples: [
      {
        input: 'n = 4',
        output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]',
        explanation: 'There exist two distinct solutions to the 4-queens puzzle.',
      },
      {
        input: 'n = 1',
        output: '[["Q"]]',
      },
    ],
    constraints: ['1 <= n <= 9'],
    hints: [
      'Place queens row by row. For each row, try placing the queen in each column.',
      'Track which columns, and which diagonals are already occupied.',
      'Two cells (r1, c1) and (r2, c2) are on the same diagonal if |r1-r2| == |c1-c2|.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Google', 'Microsoft'],
  },

  {
    id: 'word-ladder',
    title: 'Word Ladder',
    difficulty: 'hard',
    category: 'Graphs',
    description: `A **transformation sequence** from word \`beginWord\` to word \`endWord\` using a dictionary \`wordList\` is a sequence of words \`beginWord -> s1 -> s2 -> ... -> sk\` such that:

- Every adjacent pair of words differs by a single letter.
- Every \`si\` for \`1 <= i <= k\` is in \`wordList\`. Note that \`beginWord\` does not need to be in \`wordList\`.
- \`sk == endWord\`

Given two words, \`beginWord\` and \`endWord\`, and a dictionary \`wordList\`, return the **number of words** in the shortest transformation sequence from \`beginWord\` to \`endWord\`, or \`0\` if no such sequence exists.`,
    examples: [
      {
        input:
          'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
        output: '5',
        explanation:
          'One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long.',
      },
      {
        input:
          'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]',
        output: '0',
        explanation:
          'The endWord "cog" is not in wordList, therefore there is no valid transformation sequence.',
      },
    ],
    constraints: [
      '1 <= beginWord.length <= 10',
      'endWord.length == beginWord.length',
      '1 <= wordList.length <= 5000',
      'wordList[i].length == beginWord.length',
      'beginWord, endWord, and wordList[i] consist of lowercase English letters.',
      'beginWord != endWord',
      'All the words in wordList are unique.',
    ],
    hints: [
      'Model this as a graph problem where each word is a node and edges connect words that differ by one letter.',
      'BFS gives you the shortest path in an unweighted graph.',
      'To find neighbors efficiently, try replacing each character with every letter a-z and check if it is in the wordList set.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Google', 'LinkedIn', 'Amazon'],
  },

  {
    id: 'median-of-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'hard',
    category: 'Arrays',
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the **median** of the two sorted arrays.

The overall run time complexity should be \`O(log (m+n))\`.`,
    examples: [
      {
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.00000',
        explanation: 'merged array = [1,2,3] and median is 2.',
      },
      {
        input: 'nums1 = [1,2], nums2 = [3,4]',
        output: '2.50000',
        explanation: 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.',
      },
    ],
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 <= m <= 1000',
      '0 <= n <= 1000',
      '1 <= m + n <= 2000',
      '-10^6 <= nums1[i], nums2[i] <= 10^6',
    ],
    hints: [
      'A naive merge and find would be O(m+n). The O(log(m+n)) constraint requires binary search.',
      'Think about partitioning both arrays such that the left half of all elements is less than the right half.',
      'Binary search on the smaller array to find the correct partition point.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple'],
  },

  {
    id: 'lru-cache',
    title: 'LRU Cache',
    difficulty: 'hard',
    category: 'Design',
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\` Initialize the LRU cache with **positive** size \`capacity\`.
- \`int get(int key)\` Return the value of the \`key\` if the key exists, otherwise return \`-1\`.
- \`void put(int key, int value)\` Update the value of the \`key\` if the \`key\` exists. Otherwise, add the \`key-value\` pair to the cache. If the number of keys exceeds the \`capacity\` from this operation, **evict** the least recently used key.

The functions \`get\` and \`put\` must each run in \`O(1)\` average time complexity.`,
    examples: [
      {
        input: '["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]',
        output: '[null,null,null,1,null,-1,null,-1,3,4]',
        explanation: 'LRUCache with capacity 2. After put(1,1), put(2,2), get(1)=1. After put(3,3), key 2 is evicted (LRU). get(2)=-1. After put(4,4), key 1 is evicted. get(1)=-1, get(3)=3, get(4)=4.',
      },
    ],
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls will be made to get and put.',
    ],
    hints: [
      'A hash map alone gives O(1) access but cannot track usage order.',
      'A doubly linked list maintains order and supports O(1) insertion and removal with node references.',
      'Combine both: the hash map stores key → node, the linked list orders nodes by recency. On every get/put, move the accessed node to the front.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Google', 'Amazon', 'Meta', 'Netflix', 'Microsoft', 'LinkedIn'],
  },

  {
    id: 'serialize-deserialize-bt',
    title: 'Serialize and Deserialize Binary Tree',
    difficulty: 'hard',
    category: 'Trees',
    description: `Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.

Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.`,
    examples: [
      {
        input: 'root = [1,2,3,null,null,4,5]',
        output: '[1,2,3,null,null,4,5]',
        explanation: 'The tree is serialized to a string, then deserialized back to the original tree.',
      },
      {
        input: 'root = []',
        output: '[]',
      },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 10^4].',
      '-1000 <= Node.val <= 1000',
    ],
    hints: [
      'Preorder DFS traversal works well — serialize left subtree before right, using a null marker for missing nodes.',
      'During deserialization, consume the serialized tokens in the same preorder sequence to rebuild the tree.',
      'BFS (level-order) is another valid approach — encode each level including null placeholders.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Google', 'Amazon', 'Meta', 'Netflix', 'LinkedIn'],
  },

  // ─── EASY (NEW) ─────────────────────────────────────────────────────────────

  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'easy',
    category: 'Dynamic Programming',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    examples: [
      {
        input: 'n = 2',
        output: '2',
        explanation: 'There are two ways to climb to the top: 1 step + 1 step, or 2 steps.',
      },
      {
        input: 'n = 3',
        output: '3',
        explanation: '1+1+1, 1+2, 2+1.',
      },
    ],
    constraints: ['1 <= n <= 45'],
    hints: [
      'Try small cases: how many ways for n=1, n=2, n=3?',
      'Notice that to reach step n you must come from step n-1 or step n-2.',
      'This is essentially the Fibonacci sequence.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Google', 'Apple', 'Adobe', 'Microsoft'],
  },

  {
    id: 'missing-number',
    title: 'Missing Number',
    difficulty: 'easy',
    category: 'Math',
    description: `Given an array \`nums\` containing \`n\` distinct numbers in the range \`[0, n]\`, return the only number in the range that is missing from the array.`,
    examples: [
      {
        input: 'nums = [3,0,1]',
        output: '2',
        explanation: 'n = 3, so the range is [0,3]. 2 is missing.',
      },
      {
        input: 'nums = [0,1]',
        output: '2',
        explanation: 'n = 2, so the range is [0,2]. 2 is missing.',
      },
      {
        input: 'nums = [9,6,4,2,3,5,7,0,1]',
        output: '8',
      },
    ],
    constraints: [
      'n == nums.length',
      '1 <= n <= 10^4',
      '0 <= nums[i] <= n',
      'All the numbers of nums are unique.',
    ],
    hints: [
      'The expected sum of 0..n is n*(n+1)/2.',
      'Subtract the actual sum from the expected sum.',
      'XOR approach also works: XOR all indices and all values.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Microsoft', 'Amazon', 'Bloomberg'],
  },

  {
    id: 'majority-element',
    title: 'Majority Element',
    difficulty: 'easy',
    category: 'Arrays',
    description: `Given an array \`nums\` of size \`n\`, return the majority element.

The majority element is the element that appears more than \`⌊n / 2⌋\` times. You may assume that the majority element always exists in the array.`,
    examples: [
      {
        input: 'nums = [3,2,3]',
        output: '3',
      },
      {
        input: 'nums = [2,2,1,1,1,2,2]',
        output: '2',
      },
    ],
    constraints: ['n == nums.length', '1 <= n <= 5 * 10^4', '-10^9 <= nums[i] <= 10^9'],
    hints: [
      'A hash map counting frequencies is O(n) time and space.',
      'Can you solve it in O(1) space?',
      'Look up the Boyer-Moore Voting Algorithm.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Google', 'Apple', 'Yahoo'],
  },

  {
    id: 'move-zeroes',
    title: 'Move Zeroes',
    difficulty: 'easy',
    category: 'Arrays',
    description: `Given an integer array \`nums\`, move all \`0\`s to the end of it while maintaining the relative order of the non-zero elements.

**Note** that you must do this in-place without making a copy of the array.`,
    examples: [
      {
        input: 'nums = [0,1,0,3,12]',
        output: '[1,3,12,0,0]',
      },
      {
        input: 'nums = [0]',
        output: '[0]',
      },
    ],
    constraints: ['1 <= nums.length <= 10^4', '-2^31 <= nums[i] <= 2^31 - 1'],
    hints: [
      'Use a two-pointer approach: one pointer tracks the next position to place a non-zero.',
      'Iterate through the array; whenever you see a non-zero, swap it with the slow pointer position.',
      'After the loop, all non-zeros are in order at the front; zeros fill the tail.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Meta', 'Apple', 'Bloomberg'],
  },

  {
    id: 'single-number',
    title: 'Single Number',
    difficulty: 'easy',
    category: 'Arrays & Hashing',
    description: `Given a non-empty array of integers \`nums\`, every element appears twice except for one. Find that single one.

You must implement a solution with a linear runtime complexity and use only constant extra space.`,
    examples: [
      {
        input: 'nums = [2,2,1]',
        output: '1',
      },
      {
        input: 'nums = [4,1,2,1,2]',
        output: '4',
      },
      {
        input: 'nums = [1]',
        output: '1',
      },
    ],
    constraints: ['1 <= nums.length <= 3 * 10^4', '-3 * 10^4 <= nums[i] <= 3 * 10^4', 'Each element in the array appears twice except for one element which appears only once.'],
    hints: [
      'A hash set works but uses O(n) space — can you beat that?',
      'Think about bitwise operations.',
      'XOR of a number with itself is 0; XOR of a number with 0 is the number itself.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Apple', 'Google', 'Adobe'],
  },

  {
    id: 'linked-list-cycle',
    title: 'Linked List Cycle',
    difficulty: 'easy',
    category: 'Linked Lists',
    description: `Given \`head\`, the head of a linked list, determine if the linked list has a cycle in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the \`next\` pointer. Return \`true\` if there is a cycle in the linked list, otherwise return \`false\`.`,
    examples: [
      {
        input: 'head = [3,2,0,-4], pos = 1',
        output: 'true',
        explanation: 'There is a cycle: tail connects to node at index 1.',
      },
      {
        input: 'head = [1,2], pos = 0',
        output: 'true',
      },
      {
        input: 'head = [1], pos = -1',
        output: 'false',
      },
    ],
    constraints: [
      'The number of nodes in the list is in the range [0, 10^4].',
      '-10^5 <= Node.val <= 10^5',
      'pos is -1 or a valid index in the linked list.',
    ],
    hints: [
      'A hash set of visited nodes works in O(n) time and space.',
      'Can you detect the cycle in O(1) space?',
      "Floyd's cycle detection: use a slow pointer (1 step) and a fast pointer (2 steps). If they meet, there's a cycle.",
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Google', 'Microsoft', 'Bloomberg'],
  },

  {
    id: 'invert-binary-tree',
    title: 'Invert Binary Tree',
    difficulty: 'easy',
    category: 'Trees',
    description: `Given the \`root\` of a binary tree, invert the tree, and return its root.`,
    examples: [
      {
        input: 'root = [4,2,7,1,3,6,9]',
        output: '[4,7,2,9,6,3,1]',
      },
      {
        input: 'root = [2,1,3]',
        output: '[2,3,1]',
      },
      {
        input: 'root = []',
        output: '[]',
      },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 <= Node.val <= 100',
    ],
    hints: [
      'Think recursively: inverting a tree means swapping its left and right subtrees, then inverting each subtree.',
      'Base case: a null node is already inverted.',
      'You can also do this iteratively using a queue (BFS).',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Google', 'Amazon', 'Apple'],
  },

  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'easy',
    category: 'Arrays',
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    examples: [
      {
        input: 'nums = [-1,0,3,5,9,12], target = 9',
        output: '4',
        explanation: '9 exists in nums and its index is 4.',
      },
      {
        input: 'nums = [-1,0,3,5,9,12], target = 2',
        output: '-1',
        explanation: '2 does not exist in nums so return -1.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All the integers in nums are unique.',
      'nums is sorted in ascending order.',
    ],
    hints: [
      'Maintain a left and right boundary. Check the midpoint each iteration.',
      'If mid equals target, return mid. If mid is too small, move left up. If too large, move right down.',
      'Be careful with the mid calculation to avoid integer overflow: mid = left + (right - left) // 2.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Google', 'Meta', 'Amazon', 'Microsoft'],
  },

  {
    id: 'remove-duplicates-sorted-array',
    title: 'Remove Duplicates from Sorted Array',
    difficulty: 'easy',
    category: 'Arrays',
    description: `Given an integer array \`nums\` sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same. Then return the number of unique elements.

Consider the number of unique elements of \`nums\` to be \`k\`. To get accepted, you need to do the following:
- Modify the array \`nums\` such that the first \`k\` elements of \`nums\` contain the unique elements in the order they were present in \`nums\` initially.
- Return \`k\`.`,
    examples: [
      {
        input: 'nums = [1,1,2]',
        output: '2, nums = [1,2,_]',
        explanation: 'Your function should return k = 2, with the first two elements of nums being 1 and 2.',
      },
      {
        input: 'nums = [0,0,1,1,1,2,2,3,3,4]',
        output: '5, nums = [0,1,2,3,4,_,_,_,_,_]',
      },
    ],
    constraints: [
      '1 <= nums.length <= 3 * 10^4',
      '-100 <= nums[i] <= 100',
      'nums is sorted in non-decreasing order.',
    ],
    hints: [
      'Use two pointers: a slow pointer k tracking the write position, and a fast pointer scanning ahead.',
      'When nums[fast] != nums[slow], write nums[fast] to nums[k] and increment k.',
      'Since the array is sorted, duplicates are always adjacent.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Microsoft', 'Amazon', 'Bloomberg'],
  },

  {
    id: 'fizz-buzz',
    title: 'Fizz Buzz',
    difficulty: 'easy',
    category: 'Math',
    description: `Given an integer \`n\`, return a string array \`answer\` (1-indexed) where:
- \`answer[i] == "FizzBuzz"\` if \`i\` is divisible by 3 and 5.
- \`answer[i] == "Fizz"\` if \`i\` is divisible by 3.
- \`answer[i] == "Buzz"\` if \`i\` is divisible by 5.
- \`answer[i] == i\` (as a string) if none of the above conditions are true.`,
    examples: [
      {
        input: 'n = 3',
        output: '["1","2","Fizz"]',
      },
      {
        input: 'n = 5',
        output: '["1","2","Fizz","4","Buzz"]',
      },
      {
        input: 'n = 15',
        output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]',
      },
    ],
    constraints: ['1 <= n <= 10^4'],
    hints: [
      'Check divisibility by 15 first (both 3 and 5), then 3, then 5.',
      'Alternatively, build the string by concatenating "Fizz" and/or "Buzz" conditionally.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Microsoft', 'Adobe'],
  },

  // ─── MEDIUM (NEW) ───────────────────────────────────────────────────────────

  {
    id: 'find-minimum-rotated-sorted-array',
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'medium',
    category: 'Arrays',
    description: `Suppose an array of length \`n\` sorted in ascending order is rotated between \`1\` and \`n\` times. Given the sorted rotated array \`nums\` of unique elements, return the minimum element of this array.

You must write an algorithm that runs in \`O(log n)\` time.`,
    examples: [
      {
        input: 'nums = [3,4,5,1,2]',
        output: '1',
        explanation: 'The original array was [1,2,3,4,5] rotated 3 times.',
      },
      {
        input: 'nums = [4,5,6,7,0,1,2]',
        output: '0',
      },
      {
        input: 'nums = [11,13,15,17]',
        output: '11',
        explanation: 'The array was not rotated (or rotated 4 times).',
      },
    ],
    constraints: ['n == nums.length', '1 <= n <= 5000', '-5000 <= nums[i] <= 5000', 'All the integers of nums are unique.', 'nums is sorted and rotated between 1 and n times.'],
    hints: [
      'Binary search: compare the midpoint to the rightmost element.',
      'If nums[mid] > nums[right], the minimum is in the right half.',
      'Otherwise the minimum is in the left half (including mid).',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Microsoft', 'LinkedIn', 'Adobe'],
  },

  {
    id: 'spiral-matrix',
    title: 'Spiral Matrix',
    difficulty: 'medium',
    category: 'Arrays',
    description: `Given an \`m x n\` matrix, return all elements of the matrix in spiral order.`,
    examples: [
      {
        input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
        output: '[1,2,3,6,9,8,7,4,5]',
      },
      {
        input: 'matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]',
        output: '[1,2,3,4,8,12,11,10,9,5,6,7]',
      },
    ],
    constraints: [
      'm == matrix.length',
      'n == matrix[i].length',
      '1 <= m, n <= 10',
      '-100 <= matrix[i][j] <= 100',
    ],
    hints: [
      'Simulate the spiral by maintaining four boundaries: top, bottom, left, right.',
      'Traverse right across the top, then down the right side, then left across the bottom, then up the left side. Shrink boundaries after each pass.',
      'Stop when the boundaries cross.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Microsoft', 'Google', 'Apple'],
  },

  {
    id: 'rotate-image',
    title: 'Rotate Image',
    difficulty: 'medium',
    category: 'Arrays',
    description: `You are given an \`n x n\` 2D matrix representing an image, rotate the image by 90 degrees (clockwise).

You have to rotate the image **in-place**, which means you have to modify the input 2D matrix directly. **DO NOT** allocate another 2D matrix and do the rotation.`,
    examples: [
      {
        input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
        output: '[[7,4,1],[8,5,2],[9,6,3]]',
      },
      {
        input: 'matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]',
        output: '[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]',
      },
    ],
    constraints: ['n == matrix.length == matrix[i].length', '1 <= n <= 20', '-1000 <= matrix[i][j] <= 1000'],
    hints: [
      'A 90-degree clockwise rotation can be decomposed into two simpler operations.',
      'First transpose the matrix (swap matrix[i][j] with matrix[j][i]).',
      'Then reverse each row.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Microsoft', 'Apple', 'Uber'],
  },

  {
    id: 'search-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'medium',
    category: 'Arrays',
    description: `There is an integer array \`nums\` sorted in ascending order (with distinct values). Prior to being passed to your function, \`nums\` is possibly rotated at an unknown pivot index \`k\`.

Given the array \`nums\` after the possible rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    examples: [
      {
        input: 'nums = [4,5,6,7,0,1,2], target = 0',
        output: '4',
      },
      {
        input: 'nums = [4,5,6,7,0,1,2], target = 3',
        output: '-1',
      },
      {
        input: 'nums = [1], target = 0',
        output: '-1',
      },
    ],
    constraints: ['1 <= nums.length <= 5000', '-10^4 <= nums[i] <= 10^4', 'All values of nums are unique.', 'nums is an ascending array that is possibly rotated.', '-10^4 <= target <= 10^4'],
    hints: [
      'At any mid point, at least one half of the array must be sorted.',
      'Determine which half is sorted, then check if target falls within that sorted half.',
      'Narrow the search to the appropriate half each iteration.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Microsoft', 'LinkedIn', 'Apple'],
  },

  {
    id: 'jump-game',
    title: 'Jump Game',
    difficulty: 'medium',
    category: 'Arrays',
    description: `You are given an integer array \`nums\`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.

Return \`true\` if you can reach the last index, or \`false\` otherwise.`,
    examples: [
      {
        input: 'nums = [2,3,1,1,4]',
        output: 'true',
        explanation: 'Jump 1 step from index 0 to 1, then 3 steps to the last index.',
      },
      {
        input: 'nums = [3,2,1,0,4]',
        output: 'false',
        explanation: 'You will always arrive at index 3, and its max jump is 0.',
      },
    ],
    constraints: ['1 <= nums.length <= 10^4', '0 <= nums[i] <= 10^5'],
    hints: [
      'Track the farthest index you can reach as you scan left to right.',
      'If the current index ever exceeds the farthest reachable index, you are stuck.',
      'Update farthest = max(farthest, i + nums[i]) at each step.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Google', 'Bloomberg'],
  },

  {
    id: 'longest-consecutive-sequence',
    title: 'Longest Consecutive Sequence',
    difficulty: 'medium',
    category: 'Arrays & Hashing',
    description: `Given an unsorted array of integers \`nums\`, return the length of the longest consecutive elements sequence.

You must write an algorithm that runs in \`O(n)\` time.`,
    examples: [
      {
        input: 'nums = [100,4,200,1,3,2]',
        output: '4',
        explanation: 'The longest consecutive sequence is [1, 2, 3, 4]. Therefore its length is 4.',
      },
      {
        input: 'nums = [0,3,7,2,5,8,4,6,0,1]',
        output: '9',
      },
    ],
    constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    hints: [
      'Insert all numbers into a hash set for O(1) lookups.',
      'A number is the start of a sequence only if num-1 is not in the set.',
      'From each sequence start, count upward as long as consecutive numbers exist in the set.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Google', 'Meta', 'Amazon', 'Airbnb'],
  },

  {
    id: 'decode-ways',
    title: 'Decode Ways',
    difficulty: 'medium',
    category: 'Dynamic Programming',
    description: `A message containing letters from \`A-Z\` can be encoded into numbers using the mapping: 'A' → "1", 'B' → "2", ..., 'Z' → "26".

To decode an encoded message, all the digits must be grouped then mapped back into letters using the reverse of the mapping above. There may be multiple ways to decode a message.

Given a string \`s\` containing only digits, return the number of ways to decode it.`,
    examples: [
      {
        input: 's = "12"',
        output: '2',
        explanation: '"12" could be decoded as "AB" (1 2) or "L" (12).',
      },
      {
        input: 's = "226"',
        output: '3',
        explanation: '"226" could be decoded as "BZ" (2 26), "VF" (22 6), or "BBF" (2 2 6).',
      },
      {
        input: 's = "06"',
        output: '0',
        explanation: '"06" cannot be mapped to "F" because of the leading zero.',
      },
    ],
    constraints: ['1 <= s.length <= 100', 's contains only digits and may contain leading zeros.'],
    hints: [
      'Define dp[i] as the number of ways to decode the first i characters.',
      'A single digit at position i is valid if it is not \'0\'.',
      'A two-digit number ending at i is valid if it forms a value between 10 and 26.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Meta', 'Microsoft'],
  },

  {
    id: 'unique-paths',
    title: 'Unique Paths',
    difficulty: 'medium',
    category: 'Dynamic Programming',
    description: `There is a robot on an \`m x n\` grid. The robot is initially located at the top-left corner (i.e., \`grid[0][0]\`). The robot tries to move to the bottom-right corner (i.e., \`grid[m - 1][n - 1]\`). The robot can only move either down or right at any point in time.

Given the two integers \`m\` and \`n\`, return the number of possible unique paths that the robot can take to reach the bottom-right corner.`,
    examples: [
      {
        input: 'm = 3, n = 7',
        output: '28',
      },
      {
        input: 'm = 3, n = 2',
        output: '3',
        explanation: 'Right→Down→Down, Down→Right→Down, Down→Down→Right.',
      },
    ],
    constraints: ['1 <= m, n <= 100'],
    hints: [
      'dp[i][j] = number of ways to reach cell (i, j).',
      'Every cell in the first row and first column has exactly 1 path.',
      'For all other cells: dp[i][j] = dp[i-1][j] + dp[i][j-1].',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Google', 'Microsoft', 'Bloomberg'],
  },

  {
    id: 'maximum-product-subarray',
    title: 'Maximum Product Subarray',
    difficulty: 'medium',
    category: 'Dynamic Programming',
    description: `Given an integer array \`nums\`, find a subarray that has the largest product, and return the product.

The test cases are generated so that the answer will fit in a 32-bit integer.`,
    examples: [
      {
        input: 'nums = [2,3,-2,4]',
        output: '6',
        explanation: '[2,3] has the largest product 6.',
      },
      {
        input: 'nums = [-2,0,-1]',
        output: '0',
        explanation: 'The result cannot be 2, because [-2,-1] is not a subarray.',
      },
    ],
    constraints: ['1 <= nums.length <= 2 * 10^4', '-10 <= nums[i] <= 10', 'The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.'],
    hints: [
      'Unlike maximum sum subarray, negatives matter here — multiplying two negatives gives a positive.',
      'Track both the current maximum and current minimum product ending at each position.',
      'When you hit a negative, the max and min swap.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Google', 'LinkedIn'],
  },

  {
    id: 'binary-tree-right-side-view',
    title: 'Binary Tree Right Side View',
    difficulty: 'medium',
    category: 'Trees',
    description: `Given the \`root\` of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.`,
    examples: [
      {
        input: 'root = [1,2,3,null,5,null,4]',
        output: '[1,3,4]',
      },
      {
        input: 'root = [1,null,3]',
        output: '[1,3]',
      },
      {
        input: 'root = []',
        output: '[]',
      },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 <= Node.val <= 100',
    ],
    hints: [
      'BFS level-order traversal: at each level, record the last node.',
      'Alternatively, DFS visiting right child before left, tracking depth — the first node seen at each depth is the rightmost.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Meta', 'Bloomberg'],
  },

  {
    id: 'validate-bst',
    title: 'Validate Binary Search Tree',
    difficulty: 'medium',
    category: 'Trees',
    description: `Given the \`root\` of a binary tree, determine if it is a valid binary search tree (BST).

A valid BST is defined as follows:
- The left subtree of a node contains only nodes with keys **less than** the node's key.
- The right subtree of a node contains only nodes with keys **greater than** the node's key.
- Both the left and right subtrees must also be binary search trees.`,
    examples: [
      {
        input: 'root = [2,1,3]',
        output: 'true',
      },
      {
        input: 'root = [5,1,4,null,null,3,6]',
        output: 'false',
        explanation: "The root node's value is 5 but its right child's value is 4.",
      },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [1, 10^4].',
      '-2^31 <= Node.val <= 2^31 - 1',
    ],
    hints: [
      'Pass down valid (min, max) bounds at each recursive call.',
      'A node is valid only if min < node.val < max.',
      'Going left tightens the upper bound; going right tightens the lower bound.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Bloomberg', 'Microsoft', 'Adobe'],
  },

  {
    id: 'kth-largest-element',
    title: 'Kth Largest Element in an Array',
    difficulty: 'medium',
    category: 'Arrays',
    description: `Given an integer array \`nums\` and an integer \`k\`, return the \`kth\` largest element in the array.

Note that it is the \`kth\` largest element in the sorted order, not the \`kth\` distinct element.

Can you solve it without sorting?`,
    examples: [
      {
        input: 'nums = [3,2,1,5,6,4], k = 2',
        output: '5',
      },
      {
        input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4',
        output: '4',
      },
    ],
    constraints: ['1 <= k <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    hints: [
      'A min-heap of size k keeps the k largest elements seen so far; its root is the kth largest.',
      'Quickselect achieves O(n) average time — partition around a pivot like quicksort but only recurse into one side.',
      'After partitioning, if the pivot ends up at position n-k you have your answer.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Meta', 'Apple', 'Google'],
  },

  {
    id: 'pacific-atlantic-water-flow',
    title: 'Pacific Atlantic Water Flow',
    difficulty: 'medium',
    category: 'Graphs',
    description: `There is an \`m x n\` rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges.

The island is partitioned into a grid of square cells. You are given an \`m x n\` integer matrix \`heights\` where \`heights[r][c]\` represents the height above sea level of the cell at coordinate \`(r, c)\`.

The island receives a lot of rain, and the rain water can flow to neighboring cells directly north, south, east, and west if the neighboring cell's height is less than or equal to the current cell's height. Water can flow from any cell adjacent to an ocean into the ocean.

Return a 2D list of grid coordinates \`result\` where \`result[i] = [ri, ci]\` denotes that rain water can flow from cell \`(ri, ci)\` to both the Pacific and Atlantic oceans.`,
    examples: [
      {
        input: 'heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]',
        output: '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]',
      },
      {
        input: 'heights = [[1]]',
        output: '[[0,0]]',
      },
    ],
    constraints: [
      'm == heights.length',
      'n == heights[i].length',
      '1 <= m, n <= 200',
      '0 <= heights[i][j] <= 10^5',
    ],
    hints: [
      'Instead of flowing water down, reverse the problem: BFS/DFS from each ocean uphill.',
      'Find all cells reachable from the Pacific (top/left borders) and all reachable from the Atlantic (bottom/right borders).',
      'The answer is the intersection of the two reachable sets.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Google', 'Amazon'],
  },

  {
    id: 'course-schedule',
    title: 'Course Schedule',
    difficulty: 'medium',
    category: 'Graphs',
    description: `There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [ai, bi]\` indicates that you must take course \`bi\` first if you want to take course \`ai\`.

Return \`true\` if you can finish all courses. Otherwise, return \`false\`.`,
    examples: [
      {
        input: 'numCourses = 2, prerequisites = [[1,0]]',
        output: 'true',
        explanation: 'Take course 0 first, then course 1.',
      },
      {
        input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]',
        output: 'false',
        explanation: 'There is a cycle: course 0 depends on 1, and 1 depends on 0.',
      },
    ],
    constraints: [
      '1 <= numCourses <= 2000',
      '0 <= prerequisites.length <= 5000',
      'prerequisites[i].length == 2',
      '0 <= ai, bi < numCourses',
      'All the pairs prerequisites[i] are unique.',
    ],
    hints: [
      'Model courses as nodes and prerequisites as directed edges. The question becomes: does the graph have a cycle?',
      'DFS with three states — unvisited, in-progress, done — detects cycles: if you reach an in-progress node, there is a cycle.',
      'Alternatively, use Kahn\'s algorithm (topological sort via BFS with in-degree counts).',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Airbnb', 'Google', 'Uber', 'Amazon'],
  },

  // ─── HARD (NEW) ─────────────────────────────────────────────────────────────

  {
    id: 'minimum-window-substring',
    title: 'Minimum Window Substring',
    difficulty: 'hard',
    category: 'Strings',
    description: `Given two strings \`s\` and \`t\` of lengths \`m\` and \`n\` respectively, return the minimum window substring of \`s\` such that every character in \`t\` (including duplicates) is included in the window. If there is no such substring, return the empty string \`""\`.

The testcases will be generated such that the answer is unique.`,
    examples: [
      {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        output: '"BANC"',
        explanation: 'The minimum window substring "BANC" includes "A", "B", and "C" from string t.',
      },
      {
        input: 's = "a", t = "a"',
        output: '"a"',
      },
      {
        input: 's = "a", t = "aa"',
        output: '""',
      },
    ],
    constraints: [
      'm == s.length',
      'n == t.length',
      '1 <= m, n <= 10^5',
      's and t consist of uppercase and lowercase English letters.',
    ],
    hints: [
      'Use a sliding window with two pointers and frequency maps for the current window and the target.',
      'Track how many distinct characters in t are currently satisfied (count matches the required frequency).',
      'Expand the right pointer until the window is valid, then contract the left pointer to minimize it.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Meta', 'Google', 'LinkedIn', 'Uber'],
  },

  {
    id: 'edit-distance',
    title: 'Edit Distance',
    difficulty: 'hard',
    category: 'Dynamic Programming',
    description: `Given two strings \`word1\` and \`word2\`, return the minimum number of operations required to convert \`word1\` to \`word2\`.

You have the following three operations permitted on a word:
- Insert a character
- Delete a character
- Replace a character`,
    examples: [
      {
        input: 'word1 = "horse", word2 = "ros"',
        output: '3',
        explanation: 'horse → rorse (replace h with r) → rose (remove r) → ros (remove e).',
      },
      {
        input: 'word1 = "intention", word2 = "execution"',
        output: '5',
      },
    ],
    constraints: [
      '0 <= word1.length, word2.length <= 500',
      'word1 and word2 consist of lowercase English letters.',
    ],
    hints: [
      'Define dp[i][j] as the minimum edits to convert word1[0..i] to word2[0..j].',
      'If the characters match, dp[i][j] = dp[i-1][j-1].',
      'Otherwise, dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) — delete, insert, or replace.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Google', 'Microsoft', 'Uber'],
  },

  {
    id: 'sliding-window-maximum',
    title: 'Sliding Window Maximum',
    difficulty: 'hard',
    category: 'Arrays',
    description: `You are given an array of integers \`nums\`, there is a sliding window of size \`k\` which is moving from the very left of the array to the very right. You can only see the \`k\` numbers in the window. Each time the sliding window moves right by one position.

Return the max sliding window.`,
    examples: [
      {
        input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
        output: '[3,3,5,5,6,7]',
        explanation: 'Window [1,3,-1] → max 3; [3,-1,-3] → 3; [-1,-3,5] → 5; [-3,5,3] → 5; [5,3,6] → 6; [3,6,7] → 7.',
      },
      {
        input: 'nums = [1], k = 1',
        output: '[1]',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
      '1 <= k <= nums.length',
    ],
    hints: [
      'A brute force O(nk) solution is too slow. You need O(n).',
      'Use a monotonic deque (double-ended queue) that stores indices.',
      'Maintain the deque in decreasing order: before adding index i, pop from the back all indices with smaller values. Pop from the front when they fall outside the window.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Google', 'Citadel'],
  },

  {
    id: 'regular-expression-matching',
    title: 'Regular Expression Matching',
    difficulty: 'hard',
    category: 'Dynamic Programming',
    description: `Given an input string \`s\` and a pattern \`p\`, implement regular expression matching with support for \`.\` and \`*\` where:
- \`.\` matches any single character.
- \`*\` matches zero or more of the preceding element.

The matching should cover the entire input string (not partial).`,
    examples: [
      {
        input: 's = "aa", p = "a"',
        output: 'false',
        explanation: '"a" does not match the entire string "aa".',
      },
      {
        input: 's = "aa", p = "a*"',
        output: 'true',
        explanation: '"a*" means zero or more a\'s.',
      },
      {
        input: 's = "ab", p = ".*"',
        output: 'true',
        explanation: '".*" means zero or more of any character.',
      },
    ],
    constraints: [
      '1 <= s.length <= 20',
      '1 <= p.length <= 20',
      's contains only lowercase English letters.',
      'p contains only lowercase English letters, \'.\', and \'*\'.',
      'It is guaranteed for each occurrence of \'*\', there will be a previous valid character to match.',
    ],
    hints: [
      'Define dp[i][j] = true if s[0..i) matches p[0..j).',
      'If p[j-1] is not \'*\': dp[i][j] = dp[i-1][j-1] and (s[i-1] == p[j-1] or p[j-1] == \'.\').',
      "If p[j-1] is '*': either use zero occurrences (dp[i][j-2]) or one-or-more (dp[i-1][j] when characters match).",
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Meta', 'Google', 'Microsoft'],
  },

  {
    id: 'course-schedule-ii',
    title: 'Course Schedule II',
    difficulty: 'hard',
    category: 'Graphs',
    description: `There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [ai, bi]\` indicates that you must take course \`bi\` first if you want to take course \`ai\`.

Return the ordering of courses you should take to finish all courses. If there are many valid answers, return any of them. If it is impossible to finish all courses, return an empty array.`,
    examples: [
      {
        input: 'numCourses = 2, prerequisites = [[1,0]]',
        output: '[0,1]',
      },
      {
        input: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]',
        output: '[0,2,1,3]',
        explanation: 'There are other valid orderings, e.g. [0,1,2,3].',
      },
      {
        input: 'numCourses = 1, prerequisites = []',
        output: '[0]',
      },
    ],
    constraints: [
      '1 <= numCourses <= 2000',
      '0 <= prerequisites.length <= numCourses * (numCourses - 1)',
      'prerequisites[i].length == 2',
      '0 <= ai, bi < numCourses',
      'ai != bi',
      'All the pairs [ai, bi] are distinct.',
    ],
    hints: [
      'This is a topological sort problem.',
      "DFS approach: perform a post-order DFS on the graph. Nodes are appended after all their dependencies are processed. Reverse the result. Detect cycles with a 'visiting' state.",
      "BFS/Kahn's: start with nodes of in-degree 0, process them, reduce neighbor in-degrees, add newly zero-in-degree nodes to the queue.",
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Airbnb', 'Google', 'Uber', 'Amazon', 'Zenefits'],
  },

  {
    id: 'word-search-ii',
    title: 'Word Search II',
    difficulty: 'hard',
    category: 'Backtracking',
    description: `Given an \`m x n\` board of characters and a list of strings \`words\`, return all words on the board.

Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.`,
    examples: [
      {
        input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]',
        output: '["eat","oath"]',
      },
      {
        input: 'board = [["a","b"],["c","d"]], words = ["abcb"]',
        output: '[]',
      },
    ],
    constraints: [
      'm == board.length',
      'n == board[i].length',
      '1 <= m, n <= 12',
      'board[i][j] is a lowercase English letter.',
      '1 <= words.length <= 3 * 10^4',
      '1 <= words[i].length <= 10',
      'words[i] consists of lowercase English letters.',
      'All the strings in words are unique.',
    ],
    hints: [
      'Build a Trie from all the words to enable shared prefix pruning.',
      'Run DFS from every cell; traverse the Trie alongside the board.',
      'Mark cells as visited during DFS and unmark on backtrack. Remove found words from the Trie to avoid duplicates.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Microsoft', 'Airbnb'],
  },

  {
    id: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    difficulty: 'medium',
    category: 'Dynamic Programming',
    description: `Given an integer array \`nums\`, return the length of the longest strictly increasing subsequence.`,
    examples: [
      {
        input: 'nums = [10,9,2,5,3,7,101,18]',
        output: '4',
        explanation: 'The longest increasing subsequence is [2,3,7,101], therefore the length is 4.',
      },
      {
        input: 'nums = [0,1,0,3,2,3]',
        output: '4',
      },
      {
        input: 'nums = [7,7,7,7,7,7,7]',
        output: '1',
      },
    ],
    constraints: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],
    hints: [
      'O(n²) DP: dp[i] = length of longest increasing subsequence ending at index i.',
      'For each i, check all j < i where nums[j] < nums[i]; dp[i] = max(dp[j]) + 1.',
      'O(n log n) solution: maintain a list tails where tails[k] is the smallest tail element for all increasing subsequences of length k+1. Use binary search to update it.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Google', 'Microsoft'],
  },

  {
    id: 'subsets',
    title: 'Subsets',
    difficulty: 'medium',
    category: 'Backtracking',
    description: `Given an integer array \`nums\` of unique elements, return all possible subsets (the power set).

The solution set must not contain duplicate subsets. Return the solution in any order.`,
    examples: [
      {
        input: 'nums = [1,2,3]',
        output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]',
      },
      {
        input: 'nums = [0]',
        output: '[[],[0]]',
      },
    ],
    constraints: ['1 <= nums.length <= 10', '-10 <= nums[i] <= 10', 'All the numbers of nums are unique.'],
    hints: [
      'Backtracking: at each step decide whether to include the current element or not.',
      'Iterative approach: start with [[]], and for each number add it to all existing subsets.',
      'Bit manipulation: for n elements there are 2^n subsets; each subset corresponds to an n-bit mask.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Google', 'Apple', 'Meta'],
  },

  {
    id: 'combination-sum',
    title: 'Combination Sum',
    difficulty: 'medium',
    category: 'Backtracking',
    description: `Given an array of distinct integers \`candidates\` and a target integer \`target\`, return a list of all unique combinations of \`candidates\` where the chosen numbers sum to \`target\`. You may return the combinations in any order.

The same number may be chosen from \`candidates\` an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.`,
    examples: [
      {
        input: 'candidates = [2,3,6,7], target = 7',
        output: '[[2,2,3],[7]]',
      },
      {
        input: 'candidates = [2,3,5], target = 8',
        output: '[[2,2,2,2],[2,3,3],[3,5]]',
      },
      {
        input: 'candidates = [2], target = 1',
        output: '[]',
      },
    ],
    constraints: [
      '1 <= candidates.length <= 30',
      '2 <= candidates[i] <= 40',
      'All elements of candidates are distinct.',
      '1 <= target <= 40',
    ],
    hints: [
      'Use backtracking: at each step, try picking each candidate (from current index onward to avoid duplicate combinations).',
      'Subtract the chosen candidate from the remaining target and recurse.',
      'Base cases: remaining == 0 (found a valid combo) or remaining < 0 (prune).',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Snap', 'Adobe'],
  },

  {
    id: 'permutations',
    title: 'Permutations',
    difficulty: 'medium',
    category: 'Backtracking',
    description: `Given an array \`nums\` of distinct integers, return all the possible permutations. You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [1,2,3]',
        output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]',
      },
      {
        input: 'nums = [0,1]',
        output: '[[0,1],[1,0]]',
      },
      {
        input: 'nums = [1]',
        output: '[[1]]',
      },
    ],
    constraints: ['1 <= nums.length <= 6', '-10 <= nums[i] <= 10', 'All the integers of nums are unique.'],
    hints: [
      'Backtracking: maintain a list of remaining choices and build the permutation step by step.',
      'At each depth, try each remaining number, add it to the current path, recurse, then remove it (backtrack).',
      'Alternatively, swap elements in-place: swap nums[start] with each nums[i], recurse on nums[start+1:], then swap back.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['LinkedIn', 'Amazon', 'Microsoft'],
  },

  {
    id: 'diameter-of-binary-tree',
    title: 'Diameter of Binary Tree',
    difficulty: 'easy',
    category: 'Trees',
    description: `Given the \`root\` of a binary tree, return the length of the diameter of the tree.

The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.

The length of a path between two nodes is represented by the number of edges between them.`,
    examples: [
      {
        input: 'root = [1,2,3,4,5]',
        output: '3',
        explanation: '3 is the length of the path [4,2,1,3] or [5,2,1,3].',
      },
      {
        input: 'root = [1,2]',
        output: '1',
      },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [1, 10^4].',
      '-100 <= Node.val <= 100',
    ],
    hints: [
      'For each node, the diameter passing through it is the height of its left subtree plus the height of its right subtree.',
      'DFS: compute height recursively, and update a global max diameter at each node.',
      'Height of a null node is -1 (so a single node has height 0).',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Google', 'Amazon', 'Facebook'],
  },

  {
    id: 'lowest-common-ancestor',
    title: 'Lowest Common Ancestor of a BST',
    difficulty: 'medium',
    category: 'Trees',
    description: `Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.

According to the definition of LCA on Wikipedia: "The lowest common ancestor is defined between two nodes \`p\` and \`q\` as the lowest node in \`T\` that has both \`p\` and \`q\` as descendants (where we allow a node to be a descendant of itself)."`,
    examples: [
      {
        input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8',
        output: '6',
        explanation: 'The LCA of nodes 2 and 8 is 6.',
      },
      {
        input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4',
        output: '2',
        explanation: 'The LCA of nodes 2 and 4 is 2, since a node can be a descendant of itself.',
      },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [2, 10^5].',
      '-10^9 <= Node.val <= 10^9',
      'All Node.val are unique.',
      'p != q',
      'p and q will exist in the BST.',
    ],
    hints: [
      'Exploit the BST property: for a node with value v, left subtree has values < v and right subtree has values > v.',
      'If both p and q are less than the current node, the LCA is in the left subtree.',
      'If both are greater, the LCA is in the right subtree. Otherwise, the current node is the LCA.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Microsoft', 'Facebook', 'Adobe'],
  },

  {
    id: 'find-all-anagrams',
    title: 'Find All Anagrams in a String',
    difficulty: 'medium',
    category: 'Strings',
    description: `Given two strings \`s\` and \`p\`, return an array of all the start indices of \`p\`'s anagrams in \`s\`. You may return the answer in any order.

An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.`,
    examples: [
      {
        input: 's = "cbaebabacd", p = "abc"',
        output: '[0,6]',
        explanation: 'Substring "cba" starts at index 0. Substring "bac" starts at index 6.',
      },
      {
        input: 's = "abab", p = "ab"',
        output: '[0,1,2]',
      },
    ],
    constraints: [
      '1 <= s.length, p.length <= 3 * 10^4',
      's and p consist of lowercase English letters.',
    ],
    hints: [
      'Use a fixed-size sliding window of length len(p).',
      'Maintain a frequency count for p and for the current window.',
      'Slide the window right: add the new character and remove the leftmost character, then compare counts.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Apple', 'Google'],
  },

  {
    id: 'top-k-frequent-elements',
    title: 'Top K Frequent Elements',
    difficulty: 'medium',
    category: 'Arrays & Hashing',
    description: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements. You may return the answer in any order.`,
    examples: [
      {
        input: 'nums = [1,1,1,2,2,3], k = 2',
        output: '[1,2]',
      },
      {
        input: 'nums = [1], k = 1',
        output: '[1]',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
      'k is in the range [1, the number of unique elements in the array].',
      'It is guaranteed that the answer is unique.',
    ],
    hints: [
      'Count frequencies with a hash map.',
      'Use a min-heap of size k: push each element with its frequency; if the heap exceeds size k, pop the minimum.',
      'Bucket sort approach: create buckets indexed by frequency (max frequency ≤ n), then read from the highest bucket down.',
    ],
    starterCode: 'def solution():\n    pass',
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Yelp'],
  },
];

export const problems: Problem[] = [..._allProblems].sort(
  (a, b) => _difficultyOrder[a.difficulty] - _difficultyOrder[b.difficulty]
);
