export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GenAIProblem {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  description: string;
  scenario: string;
  exampleOutput: string;
  starterCode: { python: string; javascript: string };
  judgingLanguageIds: { python: number; javascript: number };
}

export const genaiProblems: GenAIProblem[] = [
  // ── Existing problems ──────────────────────────────────────────────────────

  {
    id: 'find-duplicates-ai',
    title: 'Find All Duplicates',
    difficulty: 'medium',
    category: 'Algorithm',
    description: `Given a list of integers \`nums\`, return a list of all elements that appear more than once.

The result may be returned in any order. Each duplicate value should appear only once in the output even if it occurs more than twice.

**Example 1:**
Input: nums = [4, 3, 2, 7, 8, 2, 3, 1]
Output: [2, 3]

**Example 2:**
Input: nums = [1, 1, 2]
Output: [1]

**Example 3:**
Input: nums = [1]
Output: []

**Constraints:**
- 1 ≤ nums.length ≤ 10^5
- -10^5 ≤ nums[i] ≤ 10^5`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that's fine. But you'll be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what's submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `find_duplicates([4, 3, 2, 7, 8, 2, 3, 1])  # → [2, 3]
find_duplicates([1, 1, 2])               # → [1]
find_duplicates([1])                     # → []`,
    starterCode: {
      python: `def find_duplicates(nums: list) -> list:
    # Use the AI assistant to help you solve this.
    # Ask it to write the function, explain the approach,
    # or help you debug — then run the code to verify.
    pass


# Test your solution
print(find_duplicates([4, 3, 2, 7, 8, 2, 3, 1]))  # [2, 3]
print(find_duplicates([1, 1, 2]))                   # [1]
print(find_duplicates([1]))                         # []
`,
      javascript: `function findDuplicates(nums) {
  // Use the AI assistant to help you solve this.
  // Ask it to write the function, explain the approach,
  // or help you debug — then run the code to verify.
}


// Test your solution
console.log(findDuplicates([4, 3, 2, 7, 8, 2, 3, 1]));  // [2, 3]
console.log(findDuplicates([1, 1, 2]));                   // [1]
console.log(findDuplicates([1]));                         // []
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'csv-report-ai',
    title: 'Sales CSV Report',
    difficulty: 'medium',
    category: 'Real-World Task',
    description: `You are given a CSV string representing sales data with columns: \`product\`, \`quantity\`, \`price\`.

Write a function \`parse_sales_report(csv_string)\` that returns a dictionary with:
- \`total_revenue\`: sum of (quantity × price) across all rows
- \`best_seller\`: product name with the highest total quantity sold
- \`transaction_count\`: total number of transactions (rows, excluding header)

**Example Input:**
\`\`\`
product,quantity,price
Widget A,10,5.99
Widget B,3,12.50
Widget A,7,5.99
Widget C,15,2.00
\`\`\`

**Expected Output:**
\`\`\`
{
  "total_revenue": 162.15,
  "best_seller": "Widget C",
  "transaction_count": 4
}
\`\`\`

**Notes:**
- The CSV always has a header row
- Prices are floats; quantities are integers
- If there's a tie for best seller, return any one of the tied products`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

This is a real-world data processing task. The AI can write the parsing logic for you — but you should verify the output against the expected values, ask clarifying questions if needed, and make sure you understand the solution you submit.

You'll be assessed on how thoughtfully you use the AI: prompt quality, output validation, and whether you exercised genuine judgment rather than just copy-pasting.`,
    exampleOutput: `# Expected output:
# {'total_revenue': 162.15, 'best_seller': 'Widget C', 'transaction_count': 4}`,
    starterCode: {
      python: `def parse_sales_report(csv_string: str) -> dict:
    # Use the AI assistant to help you write this function.
    # Verify the output by running the test case below.
    pass


# Test case
csv_data = """product,quantity,price
Widget A,10,5.99
Widget B,3,12.50
Widget A,7,5.99
Widget C,15,2.00"""

result = parse_sales_report(csv_data)
print(result)
# Expected: {'total_revenue': 162.15, 'best_seller': 'Widget C', 'transaction_count': 4}
`,
      javascript: `function parseSalesReport(csvString) {
  // Use the AI assistant to help you write this function.
  // Verify the output by running the test case below.
}


// Test case
const csvData = \`product,quantity,price
Widget A,10,5.99
Widget B,3,12.50
Widget A,7,5.99
Widget C,15,2.00\`;

const result = parseSalesReport(csvData);
console.log(result);
// Expected: { total_revenue: 162.15, best_seller: 'Widget C', transaction_count: 4 }
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  // ── New problems ───────────────────────────────────────────────────────────

  {
    id: 'lru-cache-ai',
    title: 'LRU Cache',
    difficulty: 'hard',
    category: 'Data Structures',
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:
- \`LRUCache(capacity)\` — initialize with a positive integer capacity
- \`get(key)\` — return the value of the key if it exists, otherwise return \`-1\`
- \`put(key, value)\` — update or insert the key-value pair. If inserting would exceed capacity, **evict the least recently used key first**

Both \`get\` and \`put\` must run in **O(1)** average time complexity.

**Example:**
\`\`\`
cache = LRUCache(2)
cache.put(1, 1)   # cache: {1=1}
cache.put(2, 2)   # cache: {1=1, 2=2}
cache.get(1)      # → 1,  cache: {2=2, 1=1}
cache.put(3, 3)   # evicts key 2, cache: {1=1, 3=3}
cache.get(2)      # → -1 (evicted)
cache.put(4, 4)   # evicts key 1, cache: {3=3, 4=4}
cache.get(1)      # → -1 (evicted)
cache.get(3)      # → 3
cache.get(4)      # → 4
\`\`\`

**Constraints:**
- 1 ≤ capacity ≤ 3000
- 0 ≤ key, value ≤ 10^4
- At most 2 × 10^5 calls to \`get\` and \`put\``,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

This is a classic system design/data structures problem asked at Google, Meta, and Amazon. The AI can generate an implementation — but the real challenge is making sure it's actually O(1). Many AI-generated solutions use Python's \`OrderedDict\` shortcut, which works but skips the core concept.

Push the AI: ask it to explain why the approach is O(1), ask it to implement using an explicit doubly-linked list, and test the edge cases: capacity=1, updating an existing key, and eviction order. A senior engineer would verify all of these.`,
    exampleOutput: `# cache = LRUCache(2)
# cache.put(1, 1); cache.put(2, 2)
# cache.get(1)    → 1
# cache.put(3, 3) → evicts key 2
# cache.get(2)    → -1
# cache.get(3)    → 3`,
    starterCode: {
      python: `class LRUCache:
    def __init__(self, capacity: int):
        # Use the AI to implement this.
        # Challenge it: "Implement this with a doubly-linked list + hashmap, not OrderedDict."
        # Then ask it to explain why each operation is O(1).
        pass

    def get(self, key: int) -> int:
        # Return value if found, otherwise -1
        pass

    def put(self, key: int, value: int) -> None:
        # Insert or update. Evict LRU if over capacity.
        pass


# Test your implementation
cache = LRUCache(2)
cache.put(1, 1)
cache.put(2, 2)
print(cache.get(1))    # 1
cache.put(3, 3)        # evicts key 2
print(cache.get(2))    # -1 (evicted)
cache.put(4, 4)        # evicts key 1
print(cache.get(1))    # -1 (evicted)
print(cache.get(3))    # 3
print(cache.get(4))    # 4

# Edge case: capacity 1
c2 = LRUCache(1)
c2.put(1, 10)
c2.put(2, 20)
print(c2.get(1))       # -1 (evicted)
print(c2.get(2))       # 20
`,
      javascript: `class LRUCache {
  constructor(capacity) {
    // Use the AI to implement this.
    // Ask: "Use a Map + doubly-linked list — not just a plain object."
    // Verify: why does this give O(1) get and put?
  }

  get(key) {
    // Return value if found, otherwise -1
  }

  put(key, value) {
    // Insert or update. Evict LRU if over capacity.
  }
}


// Test your implementation
const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
console.log(cache.get(1));    // 1
cache.put(3, 3);              // evicts key 2
console.log(cache.get(2));    // -1
cache.put(4, 4);              // evicts key 1
console.log(cache.get(1));    // -1
console.log(cache.get(3));    // 3
console.log(cache.get(4));    // 4

// Edge case: capacity 1
const c2 = new LRUCache(1);
c2.put(1, 10);
c2.put(2, 20);
console.log(c2.get(1));       // -1
console.log(c2.get(2));       // 20
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'log-analyzer-ai',
    title: 'Web Server Log Analyzer',
    difficulty: 'hard',
    category: 'Real-World Task',
    description: `You are given a multi-line string of web server logs in **Apache Combined Log Format**:

\`\`\`
127.0.0.1 - frank [10/Oct/2000:13:55:36 -0700] "GET /index.html HTTP/1.1" 200 1234
\`\`\`

Fields: \`IP\` \`ident\` \`user\` \`[timestamp]\` \`"request"\` \`status_code\` \`bytes\`

Write a function \`analyze_logs(log_text)\` that returns a dictionary with:
- \`top_ips\` — list of up to 3 IP addresses with the most requests (most first)
- \`error_rate\` — percentage of 4xx and 5xx responses as a float rounded to 2 decimal places
- \`busiest_hour\` — integer (0–23) representing the hour with the most requests

**Example Input:**
\`\`\`
127.0.0.1 - frank [10/Oct/2000:13:25:15 -0700] "GET /index.html HTTP/1.1" 200 1234
192.168.1.1 - - [10/Oct/2000:13:30:01 -0700] "POST /login HTTP/1.1" 401 512
127.0.0.1 - - [10/Oct/2000:13:31:05 -0700] "GET /page HTTP/1.1" 404 321
10.0.0.1 - - [10/Oct/2000:14:00:00 -0700] "GET /api HTTP/1.1" 200 999
127.0.0.1 - - [10/Oct/2000:14:05:22 -0700] "DELETE /res HTTP/1.1" 500 0
192.168.1.1 - - [10/Oct/2000:14:10:11 -0700] "GET /home HTTP/1.1" 200 456
\`\`\`

**Expected Output:**
\`\`\`python
{
  'top_ips': ['127.0.0.1', '192.168.1.1', '10.0.0.1'],
  'error_rate': 50.0,
  'busiest_hour': 14
}
\`\`\`

**Notes:**
- Skip malformed lines silently
- Ties in \`top_ips\` or \`busiest_hour\` can be broken arbitrarily`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Log parsing is a staple of SRE and backend engineering interviews at Google, Netflix, and Cloudflare. The AI can write the regex — but AI-generated log parsers often handle only the happy path. Your job is to probe edge cases: what happens with malformed lines? What if two IPs are tied? Does the timestamp parsing handle the bracket format correctly?

Run the provided test case first, then try to break the AI's solution with edge cases. A good engineer doesn't ship code they haven't stress-tested.`,
    exampleOutput: `# analyze_logs(LOG_DATA) →
# {
#   'top_ips': ['127.0.0.1', '192.168.1.1', '10.0.0.1'],
#   'error_rate': 50.0,
#   'busiest_hour': 14
# }`,
    starterCode: {
      python: `import re
from collections import defaultdict

def analyze_logs(log_text: str) -> dict:
    """
    Parse Apache Combined Log Format.
    Returns: top_ips (list of 3), error_rate (float), busiest_hour (int 0-23)
    Skip malformed lines silently.
    """
    # Use the AI to write the regex and parsing logic.
    # Then ask: "What happens if a line is malformed or missing fields?"
    pass


LOG_DATA = """127.0.0.1 - frank [10/Oct/2000:13:25:15 -0700] "GET /index.html HTTP/1.1" 200 1234
192.168.1.1 - - [10/Oct/2000:13:30:01 -0700] "POST /login HTTP/1.1" 401 512
127.0.0.1 - - [10/Oct/2000:13:31:05 -0700] "GET /page HTTP/1.1" 404 321
10.0.0.1 - - [10/Oct/2000:14:00:00 -0700] "GET /api HTTP/1.1" 200 999
127.0.0.1 - - [10/Oct/2000:14:05:22 -0700] "DELETE /res HTTP/1.1" 500 0
192.168.1.1 - - [10/Oct/2000:14:10:11 -0700] "GET /home HTTP/1.1" 200 456"""

result = analyze_logs(LOG_DATA)
print(result)
# Expected:
# {'top_ips': ['127.0.0.1', '192.168.1.1', '10.0.0.1'], 'error_rate': 50.0, 'busiest_hour': 14}
`,
      javascript: `function analyzeLogs(logText) {
  // Parse Apache Combined Log Format.
  // Returns: { top_ips: string[], error_rate: number, busiest_hour: number }
  // Skip malformed lines silently.
  // Use the AI to build the regex — then challenge it on edge cases.
}


const LOG_DATA = \`127.0.0.1 - frank [10/Oct/2000:13:25:15 -0700] "GET /index.html HTTP/1.1" 200 1234
192.168.1.1 - - [10/Oct/2000:13:30:01 -0700] "POST /login HTTP/1.1" 401 512
127.0.0.1 - - [10/Oct/2000:13:31:05 -0700] "GET /page HTTP/1.1" 404 321
10.0.0.1 - - [10/Oct/2000:14:00:00 -0700] "GET /api HTTP/1.1" 200 999
127.0.0.1 - - [10/Oct/2000:14:05:22 -0700] "DELETE /res HTTP/1.1" 500 0
192.168.1.1 - - [10/Oct/2000:14:10:11 -0700] "GET /home HTTP/1.1" 200 456\`;

console.log(analyzeLogs(LOG_DATA));
// Expected: { top_ips: ['127.0.0.1', '192.168.1.1', '10.0.0.1'], error_rate: 50, busiest_hour: 14 }
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'rate-limiter-ai',
    title: 'Sliding Window Rate Limiter',
    difficulty: 'hard',
    category: 'Systems Design',
    description: `Implement a **sliding window rate limiter** that tracks API requests per user.

Implement the \`RateLimiter\` class:
- \`RateLimiter(limit, window_seconds)\` — allows at most \`limit\` requests per user within any \`window_seconds\`-second window
- \`is_allowed(user_id, current_time)\` — returns \`True\` if the request is allowed, \`False\` if the user has exceeded their limit

Each user has their own **independent** request window.

**Example:**
\`\`\`
rl = RateLimiter(3, 10)  # 3 requests per 10 seconds

rl.is_allowed("alice", 1.0)   # True  — 1st request
rl.is_allowed("alice", 5.0)   # True  — 2nd request
rl.is_allowed("alice", 9.0)   # True  — 3rd request
rl.is_allowed("alice", 10.0)  # False — 4th within [1.0, 10.0] window
rl.is_allowed("alice", 12.0)  # True  — request at t=1.0 is now expired
rl.is_allowed("bob", 5.0)     # True  — bob has his own independent limit
\`\`\`

**Constraints:**
- \`limit\` and \`window_seconds\` are positive integers
- \`current_time\` is a non-negative float (Unix timestamp or relative seconds)
- Timestamps for a given user are not necessarily in order across calls
- Must support thousands of unique user IDs efficiently`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Rate limiting is one of the most frequently asked backend system design questions at Stripe, Uber, DoorDash, and Lyft. The tricky part: AI almost always implements a **fixed-window** rate limiter (simpler) when you ask for a rate limiter. A fixed-window resets at clock boundaries — a sliding window tracks a rolling time range.

Ask the AI to implement a sliding window. Then probe: "What's the difference between fixed-window and sliding-window?" Test the boundary case at \`t=10.0\` in the example — a fixed-window implementation will get it wrong.`,
    exampleOutput: `# rl = RateLimiter(3, 10)
# is_allowed("alice", 1.0)  → True
# is_allowed("alice", 5.0)  → True
# is_allowed("alice", 9.0)  → True
# is_allowed("alice", 10.0) → False
# is_allowed("alice", 12.0) → True  (t=1.0 expired)
# is_allowed("bob", 5.0)    → True`,
    starterCode: {
      python: `from collections import defaultdict, deque

class RateLimiter:
    def __init__(self, limit: int, window_seconds: int):
        """
        limit: max requests per user per window
        window_seconds: size of the sliding window in seconds
        """
        # Use the AI — but make sure to ask for a SLIDING window, not fixed-window.
        pass

    def is_allowed(self, user_id: str, current_time: float) -> bool:
        """
        Returns True if allowed, False if rate limit exceeded.
        Requests outside the sliding window no longer count.
        """
        pass


# Test your implementation
rl = RateLimiter(3, 10)  # max 3 requests per 10 seconds

print(rl.is_allowed("alice", 1.0))   # True
print(rl.is_allowed("alice", 5.0))   # True
print(rl.is_allowed("alice", 9.0))   # True
print(rl.is_allowed("alice", 10.0))  # False (3 requests in [1.0, 10.0])
print(rl.is_allowed("alice", 12.0))  # True  (t=1.0 expired, window is now [2.0, 12.0])
print(rl.is_allowed("bob",   5.0))   # True  (independent user)
`,
      javascript: `class RateLimiter {
  constructor(limit, windowSeconds) {
    // Use the AI — but ask for a SLIDING window specifically.
    // Ask: "How is this different from a fixed-window rate limiter?"
  }

  isAllowed(userId, currentTime) {
    // Returns true if allowed, false if limit exceeded.
  }
}


// Test your implementation
const rl = new RateLimiter(3, 10);

console.log(rl.isAllowed("alice", 1.0));   // true
console.log(rl.isAllowed("alice", 5.0));   // true
console.log(rl.isAllowed("alice", 9.0));   // true
console.log(rl.isAllowed("alice", 10.0));  // false
console.log(rl.isAllowed("alice", 12.0));  // true
console.log(rl.isAllowed("bob",   5.0));   // true
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'json-flattener-ai',
    title: 'Nested JSON Flattener',
    difficulty: 'medium',
    category: 'Data Engineering',
    description: `Write a function \`flatten(obj)\` that converts a deeply nested dictionary (with nested dicts and lists) into a **single-level dictionary** using dot notation for keys.

**Rules:**
- Nested dict keys are joined with \`.\`: \`{"a": {"b": 1}}\` → \`{"a.b": 1}\`
- List items use their index: \`{"a": [10, 20]}\` → \`{"a.0": 10, "a.1": 20}\`
- Scalar values (strings, numbers, booleans, null) are leaf nodes
- Empty dicts and empty lists produce no keys

**Examples:**

\`\`\`
flatten({"a": {"b": {"c": 1}}, "d": 2})
→ {"a.b.c": 1, "d": 2}

flatten({"x": [1, 2, 3]})
→ {"x.0": 1, "x.1": 2, "x.2": 3}

flatten({"a": {"b": 1}, "c": [{"d": 2}, {"e": 3}]})
→ {"a.b": 1, "c.0.d": 2, "c.1.e": 3}

flatten({})
→ {}
\`\`\`

**Constraints:**
- Input may be arbitrarily deeply nested
- Keys in the input will not contain dots
- Values may be int, float, str, bool, None, list, or dict`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Nested data flattening is a common task in data engineering pipelines (Airbnb, Databricks, Snowflake). The AI will likely generate a working solution quickly — but will it handle all the edge cases? Test it with: empty dicts, empty lists, lists of mixed types, and deeply nested structures.

After getting the AI's solution, try to add a test case that breaks it. If it breaks, iterate with the AI to fix it. That debugging loop is what this assessment is really measuring.`,
    exampleOutput: `# flatten({"a": {"b": {"c": 1}}, "d": 2}) → {"a.b.c": 1, "d": 2}
# flatten({"x": [1, 2, 3]}) → {"x.0": 1, "x.1": 2, "x.2": 3}
# flatten({}) → {}`,
    starterCode: {
      python: `def flatten(obj: dict, prefix: str = "") -> dict:
    """
    Flatten a nested dict/list into dot-notation keys.
    {"a": {"b": 1}, "c": [10, 20]} → {"a.b": 1, "c.0": 10, "c.1": 20}
    """
    # Use the AI to write this recursively.
    # Then test edge cases: empty dicts, empty lists, mixed-type arrays.
    pass


# Test cases
print(flatten({"a": {"b": {"c": 1}}, "d": 2}))
# → {'a.b.c': 1, 'd': 2}

print(flatten({"x": [1, 2, 3]}))
# → {'x.0': 1, 'x.1': 2, 'x.2': 3}

print(flatten({"a": {"b": 1}, "c": [{"d": 2}, {"e": 3}]}))
# → {'a.b': 1, 'c.0.d': 2, 'c.1.e': 3}

print(flatten({}))
# → {}

print(flatten({"a": [], "b": {}}))
# → {}
`,
      javascript: `function flatten(obj, prefix = "") {
  // Flatten nested objects/arrays into dot-notation keys.
  // {"a": {"b": 1}, "c": [10, 20]} → {"a.b": 1, "c.0": 10, "c.1": 20}
  // Use the AI to write this — then test: empty objects, empty arrays, mixed types.
}


// Test cases
console.log(flatten({a: {b: {c: 1}}, d: 2}));
// → { 'a.b.c': 1, d: 2 }

console.log(flatten({x: [1, 2, 3]}));
// → { 'x.0': 1, 'x.1': 2, 'x.2': 3 }

console.log(flatten({a: {b: 1}, c: [{d: 2}, {e: 3}]}));
// → { 'a.b': 1, 'c.0.d': 2, 'c.1.e': 3 }

console.log(flatten({}));
// → {}

console.log(flatten({a: [], b: {}}));
// → {}
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'trie-autocomplete-ai',
    title: 'Trie with Autocomplete',
    difficulty: 'hard',
    category: 'Data Structures',
    description: `Implement a **Trie** (prefix tree) data structure with the following methods:

- \`insert(word)\` — adds a word to the trie
- \`search(word)\` → bool — returns \`True\` only if the exact word was inserted
- \`starts_with(prefix)\` → bool — returns \`True\` if any inserted word starts with \`prefix\`
- \`suggest(prefix)\` → list — returns up to **3 lexicographically smallest** words that start with \`prefix\`; returns \`[]\` if none

**Example:**
\`\`\`
trie = Trie()
for word in ["app", "apple", "application", "apply", "banana"]:
    trie.insert(word)

trie.search("app")          # True
trie.search("ap")           # False  (not inserted, only a prefix)
trie.starts_with("app")     # True
trie.starts_with("xyz")     # False
trie.suggest("app")         # ["app", "apple", "application"]
trie.suggest("appl")        # ["apple", "application", "apply"]
trie.suggest("ban")         # ["banana"]
trie.suggest("xyz")         # []
\`\`\`

**Constraints:**
- Words consist of lowercase English letters only
- 1 ≤ word length ≤ 30
- At most 10^4 insertions and 10^4 queries`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

The basic Trie (insert, search, starts_with) is a classic asked at Google, Meta, and Amazon. The \`suggest\` method is the extension that separates a good answer from a great one — and it's where AI implementations most often fail. The traversal for lexicographic ordering is subtle.

Get the AI to implement the full class, then specifically stress-test \`suggest\`: Does it return results in lexicographic order? Does it correctly limit to 3? What if the prefix itself is a word — does it appear first? Write your own tests before submitting.`,
    exampleOutput: `# trie.search("app")       → True
# trie.search("ap")        → False
# trie.suggest("app")      → ['app', 'apple', 'application']
# trie.suggest("appl")     → ['apple', 'application', 'apply']
# trie.suggest("xyz")      → []`,
    starterCode: {
      python: `class Trie:
    def __init__(self):
        # Use the AI to design the node structure.
        # Ask: "How does a Trie node track whether a word ends here?"
        pass

    def insert(self, word: str) -> None:
        pass

    def search(self, word: str) -> bool:
        """True only if this exact word was inserted."""
        pass

    def starts_with(self, prefix: str) -> bool:
        """True if any inserted word starts with prefix."""
        pass

    def suggest(self, prefix: str) -> list:
        """Return up to 3 lexicographically smallest words starting with prefix."""
        # This is the hard part — the AI may get ordering wrong. Test it carefully.
        pass


# Test your implementation
trie = Trie()
for word in ["app", "apple", "application", "apply", "banana"]:
    trie.insert(word)

print(trie.search("app"))           # True
print(trie.search("ap"))            # False
print(trie.starts_with("app"))      # True
print(trie.starts_with("xyz"))      # False
print(trie.suggest("app"))          # ['app', 'apple', 'application']
print(trie.suggest("appl"))         # ['apple', 'application', 'apply']
print(trie.suggest("ban"))          # ['banana']
print(trie.suggest("xyz"))          # []
`,
      javascript: `class Trie {
  constructor() {
    // Use the AI to design the node structure.
    // Ask: "How does each node track whether a complete word ends here?"
  }

  insert(word) {}

  search(word) {
    // True only if this exact word was inserted
  }

  startsWith(prefix) {
    // True if any inserted word starts with prefix
  }

  suggest(prefix) {
    // Return up to 3 lexicographically smallest words starting with prefix
    // This is the tricky part — verify ordering carefully
  }
}


// Test your implementation
const trie = new Trie();
for (const word of ["app", "apple", "application", "apply", "banana"]) {
  trie.insert(word);
}

console.log(trie.search("app"));          // true
console.log(trie.search("ap"));           // false
console.log(trie.startsWith("app"));      // true
console.log(trie.startsWith("xyz"));      // false
console.log(trie.suggest("app"));         // ['app', 'apple', 'application']
console.log(trie.suggest("appl"));        // ['apple', 'application', 'apply']
console.log(trie.suggest("ban"));         // ['banana']
console.log(trie.suggest("xyz"));         // []
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'session-analyzer-ai',
    title: 'Event Session Analyzer',
    difficulty: 'hard',
    category: 'Analytics',
    description: `You are given a list of user events. Each event is a dictionary with:
- \`user_id\` (string)
- \`event_type\` (string)
- \`timestamp\` (integer, seconds)

Write a function \`analyze_sessions(events)\` that returns a dictionary keyed by \`user_id\`, where each value contains:
- \`session_count\` — number of sessions (a new session starts when the gap between consecutive events for that user exceeds **30 minutes / 1800 seconds**)
- \`total_events\` — total number of events for that user
- \`most_common_event\` — the event type that appeared most often (any on tie)

The input events may be **unsorted**.

**Example:**
\`\`\`python
events = [
    {"user_id": "u1", "event_type": "click",  "timestamp": 0},
    {"user_id": "u1", "event_type": "scroll", "timestamp": 60},
    {"user_id": "u2", "event_type": "view",   "timestamp": 30},
    {"user_id": "u1", "event_type": "click",  "timestamp": 120},
    {"user_id": "u1", "event_type": "click",  "timestamp": 7400},  # gap > 1800s
    {"user_id": "u2", "event_type": "view",   "timestamp": 200},
]
# Result:
# {
#   'u1': {'session_count': 2, 'total_events': 4, 'most_common_event': 'click'},
#   'u2': {'session_count': 1, 'total_events': 2, 'most_common_event': 'view'}
# }
\`\`\`

**Constraints:**
- Timestamps are non-negative integers
- Event lists may be unsorted
- A user with only one event has \`session_count\` of 1`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Session analysis from raw event streams is asked at Amplitude, Mixpanel, Meta, and Spotify in data engineering interviews. The two hardest parts: (1) remembering to sort events per user before comparing timestamps, and (2) correctly counting session boundaries. AI models frequently forget to sort or miscalculate the 30-minute gap.

Test with: a single-event user, a user whose events arrive out of order in the input, and a gap of exactly 1800 seconds (boundary case — is that a new session or not?). Make sure you and the AI agree on the boundary definition.`,
    exampleOutput: `# analyze_sessions(events) →
# {
#   'u1': {'session_count': 2, 'total_events': 4, 'most_common_event': 'click'},
#   'u2': {'session_count': 1, 'total_events': 2, 'most_common_event': 'view'}
# }`,
    starterCode: {
      python: `from collections import defaultdict

def analyze_sessions(events: list) -> dict:
    """
    Returns per-user stats from a list of {user_id, event_type, timestamp} dicts.
    New session = gap > 1800 seconds between consecutive events (per user).
    Input may be unsorted.
    """
    # Use the AI to write this.
    # Then ask: "What happens if the events are not sorted by timestamp?"
    # Test boundary: what if the gap is exactly 1800 seconds?
    pass


events = [
    {"user_id": "u1", "event_type": "click",  "timestamp": 0},
    {"user_id": "u1", "event_type": "scroll", "timestamp": 60},
    {"user_id": "u2", "event_type": "view",   "timestamp": 30},
    {"user_id": "u1", "event_type": "click",  "timestamp": 120},
    {"user_id": "u1", "event_type": "click",  "timestamp": 7400},
    {"user_id": "u2", "event_type": "view",   "timestamp": 200},
]

result = analyze_sessions(events)
print(result)
# Expected:
# {
#   'u1': {'session_count': 2, 'total_events': 4, 'most_common_event': 'click'},
#   'u2': {'session_count': 1, 'total_events': 2, 'most_common_event': 'view'}
# }
`,
      javascript: `function analyzeSessions(events) {
  // Returns per-user stats: { session_count, total_events, most_common_event }
  // New session = gap > 1800 seconds between consecutive events (per user).
  // Input may be unsorted — sort per user first!
}


const events = [
  { user_id: "u1", event_type: "click",  timestamp: 0 },
  { user_id: "u1", event_type: "scroll", timestamp: 60 },
  { user_id: "u2", event_type: "view",   timestamp: 30 },
  { user_id: "u1", event_type: "click",  timestamp: 120 },
  { user_id: "u1", event_type: "click",  timestamp: 7400 },
  { user_id: "u2", event_type: "view",   timestamp: 200 },
];

console.log(analyzeSessions(events));
// Expected:
// {
//   u1: { session_count: 2, total_events: 4, most_common_event: 'click' },
//   u2: { session_count: 1, total_events: 2, most_common_event: 'view' }
// }
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'expression-evaluator-ai',
    title: 'Expression Evaluator',
    difficulty: 'hard',
    category: 'Algorithm',
    description: `Write a function \`evaluate(expression)\` that parses and evaluates a mathematical expression string.

**Supported features:**
- Non-negative integers (may be multi-digit)
- Operators: \`+\`, \`-\`, \`*\`, \`/\` (integer division, truncate toward zero)
- Parentheses \`()\` for grouping
- Spaces (ignore them)
- Standard operator precedence: \`*\` and \`/\` before \`+\` and \`-\`

**Do NOT use \`eval()\` or \`exec()\`.**

**Examples:**
\`\`\`
evaluate("3 + 2 * 2")                    # → 7
evaluate("3 / 2")                         # → 1
evaluate("3 + 5 / 2")                    # → 5
evaluate("(2 + 3) * 4")                  # → 20
evaluate("(1 + (4 + 5 + 2) - 3) + (6 + 8)")  # → 23
evaluate("10 - 3 * 2 + 1")              # → 5
evaluate("14 / 3 * 2")                   # → 8
\`\`\`

**Constraints:**
- The expression is always valid (no division by zero, no invalid syntax)
- Integer results only (no floats in the output)
- Parentheses may be nested`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Expression parsing is asked at Apple, Google, and Jane Street as a test of algorithmic thinking. The classic approach uses a stack for operators and operands, handling precedence explicitly. This is a well-known problem where AI often generates code that looks right but fails on cases involving nested parentheses, multi-digit numbers, or chains of same-precedence operators.

After the AI gives you a solution, build a test suite: try nested parentheses, multi-digit numbers like \`14 / 3 * 2\`, and expressions with consecutive operations of the same precedence. Don't accept the first answer — iterate.`,
    exampleOutput: `# evaluate("3 + 2 * 2")       → 7
# evaluate("(2 + 3) * 4")     → 20
# evaluate("3 / 2")           → 1
# evaluate("14 / 3 * 2")      → 8
# evaluate("(1+(4+5+2)-3)+(6+8)") → 23`,
    starterCode: {
      python: `def evaluate(expression: str) -> int:
    """
    Evaluate a math expression with +, -, *, /, parentheses.
    Respects standard operator precedence. No eval() allowed.
    Integer division truncates toward zero.
    """
    # Use the AI to implement this — stack-based solutions are common.
    # Then stress-test: multi-digit numbers, nested parens, same-precedence chains.
    pass


print(evaluate("3 + 2 * 2"))                       # 7
print(evaluate("3 / 2"))                            # 1
print(evaluate("3 + 5 / 2"))                       # 5
print(evaluate("(2 + 3) * 4"))                     # 20
print(evaluate("(1 + (4 + 5 + 2) - 3) + (6 + 8)"))  # 23
print(evaluate("10 - 3 * 2 + 1"))                 # 5
print(evaluate("14 / 3 * 2"))                      # 8
`,
      javascript: `function evaluate(expression) {
  // Evaluate a math expression with +, -, *, /, parentheses.
  // Standard operator precedence. No eval() allowed.
  // Integer division: truncate toward zero (Math.trunc).
}


console.log(evaluate("3 + 2 * 2"));                        // 7
console.log(evaluate("3 / 2"));                             // 1
console.log(evaluate("3 + 5 / 2"));                        // 5
console.log(evaluate("(2 + 3) * 4"));                      // 20
console.log(evaluate("(1 + (4 + 5 + 2) - 3) + (6 + 8)")); // 23
console.log(evaluate("10 - 3 * 2 + 1"));                  // 5
console.log(evaluate("14 / 3 * 2"));                       // 8
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'text-chunker-ai',
    title: 'LLM Text Chunker',
    difficulty: 'medium',
    category: 'AI Engineering',
    description: `Write a function \`chunk_text(text, max_words, overlap=0)\` that splits a long text into chunks suitable for feeding into an LLM context window.

**Rules:**
1. Never split mid-sentence. Sentence boundaries are: \`. \`, \`! \`, \`? \` (followed by a space), or the end of the string.
2. Each chunk must not exceed \`max_words\` words (count by splitting on whitespace).
3. If a single sentence exceeds \`max_words\` on its own, it forms its own chunk regardless.
4. \`overlap\`: the last \`overlap\` words from the previous chunk are prepended to the next chunk to preserve context continuity.
5. Return a list of chunk strings. Return \`[]\` for empty input.

**Examples:**
\`\`\`python
text = "Dogs are great. Cats are too. Both make wonderful companions."

chunk_text(text, max_words=6, overlap=0)
# → ["Dogs are great. Cats are too.", "Both make wonderful companions."]

chunk_text(text, max_words=6, overlap=2)
# → ["Dogs are great. Cats are too.", "are too. Both make wonderful companions."]

chunk_text("Hello.", max_words=10, overlap=0)
# → ["Hello."]

chunk_text("", max_words=5, overlap=0)
# → []
\`\`\`

**Constraints:**
- \`max_words\` ≥ 1
- \`0 ≤ overlap < max_words\``,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Text chunking is a core primitive in every RAG (Retrieval-Augmented Generation) pipeline — asked in AI engineering interviews at OpenAI, Anthropic, Cohere, and any company building LLM-powered products. It seems simple until you hit edge cases.

After the AI writes the function, test these: a single sentence longer than max_words, overlap larger than the previous chunk, text with no spaces, consecutive punctuation. The overlap logic especially is where AI implementations often produce off-by-one errors or double-include sentences. Verify each output manually before submitting.`,
    exampleOutput: `# chunk_text("Dogs are great. Cats are too. Both make wonderful companions.", max_words=6)
# → ["Dogs are great. Cats are too.", "Both make wonderful companions."]
# chunk_text(same, max_words=6, overlap=2)
# → ["Dogs are great. Cats are too.", "are too. Both make wonderful companions."]`,
    starterCode: {
      python: `import re

def chunk_text(text: str, max_words: int, overlap: int = 0) -> list:
    """
    Split text into sentence-boundary-respecting chunks for LLM input.

    - max_words: hard cap per chunk (word count)
    - overlap: number of words from the end of the previous chunk to prepend to the next
    - A sentence that alone exceeds max_words still gets its own chunk
    """
    # Use the AI to implement this.
    # The sentence splitting and overlap logic are both tricky.
    # Test: single oversized sentence, overlap > chunk size, empty string.
    pass


text = "Dogs are great. Cats are too. Both make wonderful companions."

print(chunk_text(text, max_words=6, overlap=0))
# → ['Dogs are great. Cats are too.', 'Both make wonderful companions.']

print(chunk_text(text, max_words=6, overlap=2))
# → ['Dogs are great. Cats are too.', 'are too. Both make wonderful companions.']

print(chunk_text("Hello.", max_words=10, overlap=0))
# → ['Hello.']

print(chunk_text("", max_words=5, overlap=0))
# → []

# Edge case: sentence longer than max_words
print(chunk_text("This is a very long sentence indeed.", max_words=3, overlap=0))
# → ['This is a very long sentence indeed.']  (own chunk, rule 3)
`,
      javascript: `function chunkText(text, maxWords, overlap = 0) {
  // Split text into sentence-boundary-respecting chunks for LLM input.
  // - maxWords: hard cap per chunk
  // - overlap: words from previous chunk prepended to next chunk
  // - A sentence exceeding maxWords still gets its own chunk
  // Use the AI — then test edge cases: oversized sentences, overlap, empty string.
}


const text = "Dogs are great. Cats are too. Both make wonderful companions.";

console.log(chunkText(text, 6, 0));
// → ['Dogs are great. Cats are too.', 'Both make wonderful companions.']

console.log(chunkText(text, 6, 2));
// → ['Dogs are great. Cats are too.', 'are too. Both make wonderful companions.']

console.log(chunkText("Hello.", 10, 0));
// → ['Hello.']

console.log(chunkText("", 5, 0));
// → []

// Edge: sentence longer than maxWords
console.log(chunkText("This is a very long sentence indeed.", 3, 0));
// → ['This is a very long sentence indeed.']
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },
];
