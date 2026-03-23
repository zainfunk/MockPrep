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

export const problems: Problem[] = [
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
];
