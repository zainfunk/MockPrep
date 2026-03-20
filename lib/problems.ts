export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  hints: string[];
  starterCode: string;
}

export const problems: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'easy',
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
    starterCode: `function twoSum(nums: number[], target: number): number[] {
  // Your solution here
};`,
  },
  {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
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
    starterCode: `function lengthOfLongestSubstring(s: string): number {
  // Your solution here
};`,
  },
  {
    id: 'merge-k-sorted-lists',
    title: 'Merge K Sorted Lists',
    difficulty: 'hard',
    description: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.`,
    examples: [
      {
        input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        output: '[1,1,2,3,4,4,5,6]',
        explanation: 'The linked-lists are:\n1->4->5\n1->3->4\n2->6\nMerging them into one sorted list:\n1->1->2->3->4->4->5->6',
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
    starterCode: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  // Your solution here
};`,
  },
];

export function getProblemById(id: string): Problem | undefined {
  return problems.find((p) => p.id === id);
}
