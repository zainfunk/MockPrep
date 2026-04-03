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

  // ── Easy Problems ──────────────────────────────────────────────────────────

  {
    id: 'palindrome-checker-ai',
    title: 'Palindrome Checker',
    difficulty: 'easy',
    category: 'Algorithm',
    description: `Given a string \`s\`, return \`True\` if it is a palindrome after removing all non-alphanumeric characters and converting to lowercase, or \`False\` otherwise.

**Example 1:**
Input: s = "A man a plan a canal Panama"
Output: True

**Example 2:**
Input: s = "race a car"
Output: False

**Example 3:**
Input: s = " "
Output: True

**Constraints:**
- 1 ≤ s.length ≤ 2 × 10^5
- s consists only of printable ASCII characters`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `is_palindrome("A man a plan a canal Panama")  # → True
is_palindrome("race a car")                  # → False
is_palindrome(" ")                           # → True`,
    starterCode: {
      python: `def is_palindrome(s: str) -> bool:
    # Use the AI assistant to help you solve this.
    # Ask it to write the function, explain the approach,
    # or help you debug — then run the code to verify.
    pass


# Test your solution
print(is_palindrome("A man a plan a canal Panama"))  # True
print(is_palindrome("race a car"))                   # False
print(is_palindrome(" "))                            # True
`,
      javascript: `function isPalindrome(s) {
  // Use the AI assistant to help you solve this.
  // Ask it to write the function, explain the approach,
  // or help you debug — then run the code to verify.
}


// Test your solution
console.log(isPalindrome("A man a plan a canal Panama"));  // true
console.log(isPalindrome("race a car"));                   // false
console.log(isPalindrome(" "));                            // true
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'moving-average-ai',
    title: 'Moving Average',
    difficulty: 'easy',
    category: 'Algorithm',
    description: `Given a list of numbers \`nums\` and a window size \`k\`, return a list of moving averages. Each element \`i\` in the result is the average of \`nums[i - k + 1 .. i]\` (or the average of all available elements if fewer than \`k\` exist).

**Example 1:**
Input: nums = [1, 2, 3, 4, 5], k = 3
Output: [1.0, 1.5, 2.0, 3.0, 4.0]

**Example 2:**
Input: nums = [10, 20, 30], k = 5
Output: [10.0, 15.0, 20.0]

**Example 3:**
Input: nums = [], k = 3
Output: []

**Constraints:**
- 0 ≤ nums.length ≤ 10^4
- 1 ≤ k ≤ 10^4
- -10^6 ≤ nums[i] ≤ 10^6`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `moving_average([1, 2, 3, 4, 5], 3)  # → [1.0, 1.5, 2.0, 3.0, 4.0]
moving_average([10, 20, 30], 5)      # → [10.0, 15.0, 20.0]
moving_average([], 3)                # → []`,
    starterCode: {
      python: `def moving_average(nums: list, k: int) -> list:
    # Use the AI assistant to help you solve this.
    # Ask it to write the function, explain the approach,
    # or help you debug — then run the code to verify.
    pass


# Test your solution
print(moving_average([1, 2, 3, 4, 5], 3))  # [1.0, 1.5, 2.0, 3.0, 4.0]
print(moving_average([10, 20, 30], 5))      # [10.0, 15.0, 20.0]
print(moving_average([], 3))                # []
`,
      javascript: `function movingAverage(nums, k) {
  // Use the AI assistant to help you solve this.
  // Ask it to write the function, explain the approach,
  // or help you debug — then run the code to verify.
}


// Test your solution
console.log(movingAverage([1, 2, 3, 4, 5], 3));  // [1.0, 1.5, 2.0, 3.0, 4.0]
console.log(movingAverage([10, 20, 30], 5));      // [10.0, 15.0, 20.0]
console.log(movingAverage([], 3));                // []
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'word-frequency-ai',
    title: 'Word Frequency Counter',
    difficulty: 'easy',
    category: 'Real-World Task',
    description: `Given a string of text, return the top \`n\` most frequent words as a list of \`[word, count]\` pairs, sorted by frequency descending (alphabetically for ties). Words are case-insensitive and punctuation should be stripped.

**Example 1:**
Input: text = "the cat sat on the mat the cat", n = 2
Output: [["the", 3], ["cat", 2]]

**Example 2:**
Input: text = "Hello, world! Hello.", n = 3
Output: [["hello", 2], ["world", 1]]

**Example 3:**
Input: text = "", n = 5
Output: []

**Constraints:**
- 0 ≤ text.length ≤ 10^5
- 1 ≤ n ≤ 10^4`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `word_frequency("the cat sat on the mat the cat", 2)  # → [["the", 3], ["cat", 2]]
word_frequency("Hello, world! Hello.", 3)              # → [["hello", 2], ["world", 1]]
word_frequency("", 5)                                  # → []`,
    starterCode: {
      python: `def word_frequency(text: str, n: int) -> list:
    # Use the AI assistant to help you solve this.
    # Ask it to write the function, explain the approach,
    # or help you debug — then run the code to verify.
    pass


# Test your solution
print(word_frequency("the cat sat on the mat the cat", 2))  # [["the", 3], ["cat", 2]]
print(word_frequency("Hello, world! Hello.", 3))            # [["hello", 2], ["world", 1]]
print(word_frequency("", 5))                                # []
`,
      javascript: `function wordFrequency(text, n) {
  // Use the AI assistant to help you solve this.
  // Ask it to write the function, explain the approach,
  // or help you debug — then run the code to verify.
}


// Test your solution
console.log(wordFrequency("the cat sat on the mat the cat", 2));  // [["the", 3], ["cat", 2]]
console.log(wordFrequency("Hello, world! Hello.", 3));            // [["hello", 2], ["world", 1]]
console.log(wordFrequency("", 5));                                // []
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'number-formatter-ai',
    title: 'Number Formatter',
    difficulty: 'easy',
    category: 'Real-World Task',
    description: `Format a number with thousands separators (commas) and a specified number of decimal places. Handle negative numbers, zero, and large numbers correctly.

**Example 1:**
Input: num = 1234567.89, decimals = 2
Output: "1,234,567.89"

**Example 2:**
Input: num = -9876543, decimals = 0
Output: "-9,876,543"

**Example 3:**
Input: num = 0, decimals = 2
Output: "0.00"

**Constraints:**
- -10^15 ≤ num ≤ 10^15
- 0 ≤ decimals ≤ 10`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `format_number(1234567.89, 2)  # → "1,234,567.89"
format_number(-9876543, 0)    # → "-9,876,543"
format_number(0, 2)           # → "0.00"`,
    starterCode: {
      python: `def format_number(num: float, decimals: int) -> str:
    # Use the AI assistant to help you solve this.
    # Ask it to write the function, explain the approach,
    # or help you debug — then run the code to verify.
    pass


# Test your solution
print(format_number(1234567.89, 2))  # "1,234,567.89"
print(format_number(-9876543, 0))    # "-9,876,543"
print(format_number(0, 2))           # "0.00"
`,
      javascript: `function formatNumber(num, decimals) {
  // Use the AI assistant to help you solve this.
  // Ask it to write the function, explain the approach,
  // or help you debug — then run the code to verify.
}


// Test your solution
console.log(formatNumber(1234567.89, 2));  // "1,234,567.89"
console.log(formatNumber(-9876543, 0));    // "-9,876,543"
console.log(formatNumber(0, 2));           // "0.00"
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  // ── Medium Problems ────────────────────────────────────────────────────────

  {
    id: 'balanced-brackets-ai',
    title: 'Balanced Brackets Validator',
    difficulty: 'medium',
    category: 'Algorithm',
    description: `Given a string containing bracket characters \`()[]{}<>\`, determine if the brackets are properly nested and matched. Return \`True\` if valid, or a tuple \`(False, position)\` indicating the 0-indexed position of the first unmatched bracket.

**Example 1:**
Input: s = "({[]})"
Output: True

**Example 2:**
Input: s = "([)]"
Output: (False, 2)

**Example 3:**
Input: s = "{[}"
Output: (False, 2)

**Constraints:**
- 0 ≤ s.length ≤ 10^4
- s may contain any printable characters; only bracket chars are validated`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `validate_brackets("({[]})")  # → True
validate_brackets("([)]")    # → (False, 2)
validate_brackets("{[}")      # → (False, 2)`,
    starterCode: {
      python: `def validate_brackets(s: str):
    # Use the AI assistant to help you solve this.
    # Ask it to write the function, explain the approach,
    # or help you debug — then run the code to verify.
    pass


# Test your solution
print(validate_brackets("({[]})"))  # True
print(validate_brackets("([)]"))    # (False, 2)
print(validate_brackets("{[}"))     # (False, 2)
`,
      javascript: `function validateBrackets(s) {
  // Use the AI assistant to help you solve this.
  // Ask it to write the function, explain the approach,
  // or help you debug — then run the code to verify.
}


// Test your solution
console.log(validateBrackets("({[]})"));  // true
console.log(validateBrackets("([)]"));    // [false, 2]
console.log(validateBrackets("{[}"));     // [false, 2]
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'markdown-parser-ai',
    title: 'Markdown to HTML',
    difficulty: 'medium',
    category: 'Real-World Task',
    description: `Convert a subset of Markdown to HTML. Support: headings (\`#\`, \`##\`, \`###\`), bold (\`**text**\`), italic (\`*text*\`), inline code (\`\`text\`\`), links (\`[text](url)\`), and unordered list items (\`- item\`). Process line by line; no nested lists needed.

**Example:**
Input:
\`\`\`
# Hello World
This is **bold** and *italic* text.
- Item one
- Item two
Visit [Google](https://google.com) for more.
\`\`\`

Output:
\`\`\`
<h1>Hello World</h1>
<p>This is <strong>bold</strong> and <em>italic</em> text.</p>
<ul><li>Item one</li><li>Item two</li></ul>
<p>Visit <a href="https://google.com">Google</a> for more.</p>
\`\`\`

**Constraints:**
- Input is valid UTF-8 text
- No nested markdown (e.g., bold inside a heading is fine to ignore)`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `md = "# Title\\n**bold** and *italic*\\n- a\\n- b"
parse_markdown(md)
# → "<h1>Title</h1>\\n<p><strong>bold</strong> and <em>italic</em></p>\\n<ul><li>a</li><li>b</li></ul>"`,
    starterCode: {
      python: `def parse_markdown(text: str) -> str:
    # Use the AI assistant to help you solve this.
    # Ask it to write the function, explain the approach,
    # or help you debug — then run the code to verify.
    pass


# Test your solution
md = """# Hello World
This is **bold** and *italic* text.
- Item one
- Item two
Visit [Google](https://google.com) for more."""
print(parse_markdown(md))
`,
      javascript: `function parseMarkdown(text) {
  // Use the AI assistant to help you solve this.
  // Ask it to write the function, explain the approach,
  // or help you debug — then run the code to verify.
}


// Test your solution
const md = \`# Hello World
This is **bold** and *italic* text.
- Item one
- Item two
Visit [Google](https://google.com) for more.\`;
console.log(parseMarkdown(md));
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'stock-profit-ai',
    title: 'Max Stock Profit',
    difficulty: 'medium',
    category: 'Algorithm',
    description: `Given a list of daily stock prices and an integer \`k\` (maximum number of buy-sell transactions), return the maximum profit achievable. You must sell before buying again. A transaction is one buy + one sell.

**Example 1:**
Input: prices = [3, 2, 6, 5, 0, 3], k = 2
Output: 7

**Example 2:**
Input: prices = [2, 4, 1], k = 2
Output: 2

**Example 3:**
Input: prices = [1, 2, 3, 4, 5], k = 2
Output: 4

**Constraints:**
- 1 ≤ prices.length ≤ 10^4
- 0 ≤ prices[i] ≤ 10^4
- 1 ≤ k ≤ 100`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `max_profit([3, 2, 6, 5, 0, 3], 2)  # → 7
max_profit([2, 4, 1], 2)            # → 2
max_profit([1, 2, 3, 4, 5], 2)     # → 4`,
    starterCode: {
      python: `def max_profit(prices: list, k: int) -> int:
    # Use the AI assistant to help you solve this.
    # Ask it to write the function, explain the approach,
    # or help you debug — then run the code to verify.
    pass


# Test your solution
print(max_profit([3, 2, 6, 5, 0, 3], 2))  # 7
print(max_profit([2, 4, 1], 2))            # 2
print(max_profit([1, 2, 3, 4, 5], 2))     # 4
`,
      javascript: `function maxProfit(prices, k) {
  // Use the AI assistant to help you solve this.
  // Ask it to write the function, explain the approach,
  // or help you debug — then run the code to verify.
}


// Test your solution
console.log(maxProfit([3, 2, 6, 5, 0, 3], 2));  // 7
console.log(maxProfit([2, 4, 1], 2));            // 2
console.log(maxProfit([1, 2, 3, 4, 5], 2));     // 4
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'url-shortener-ai',
    title: 'URL Shortener',
    difficulty: 'medium',
    category: 'Systems Design',
    description: `Implement an in-memory URL shortener with two functions:
- \`encode(long_url)\` → returns a short alphanumeric code (base62). Encoding the same URL twice must return the same code.
- \`decode(short_code)\` → returns the original URL, or \`None\` / \`null\` if the code does not exist.

Use base62 encoding (a-z, A-Z, 0-9). Start counter at 1.

**Example:**
\`\`\`
encode("https://example.com/very/long/path")  → "b"
encode("https://example.com/very/long/path")  → "b"  (same URL, same code)
encode("https://other.com")                   → "c"
decode("b")   → "https://example.com/very/long/path"
decode("zzz") → None
\`\`\`

**Constraints:**
- URLs are valid non-empty strings
- Short codes are base62 strings of length ≥ 1`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `encode("https://example.com/very/long/path")  # → "b"
encode("https://example.com/very/long/path")  # → "b"
encode("https://other.com")                   # → "c"
decode("b")    # → "https://example.com/very/long/path"
decode("zzz")  # → None`,
    starterCode: {
      python: `# Implement encode and decode using module-level state
_counter = 1
_url_to_code = {}
_code_to_url = {}
BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

def encode(long_url: str) -> str:
    # Use the AI assistant to help you solve this.
    pass

def decode(short_code: str):
    # Use the AI assistant to help you solve this.
    pass


# Test your solution
print(encode("https://example.com/very/long/path"))  # "b"
print(encode("https://example.com/very/long/path"))  # "b" (same)
print(encode("https://other.com"))                   # "c"
print(decode("b"))    # "https://example.com/very/long/path"
print(decode("zzz"))  # None
`,
      javascript: `const BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
let counter = 1;
const urlToCode = {};
const codeToUrl = {};

function encode(longUrl) {
  // Use the AI assistant to help you solve this.
}

function decode(shortCode) {
  // Use the AI assistant to help you solve this.
}


// Test your solution
console.log(encode("https://example.com/very/long/path"));  // "b"
console.log(encode("https://example.com/very/long/path"));  // "b"
console.log(encode("https://other.com"));                   // "c"
console.log(decode("b"));    // "https://example.com/very/long/path"
console.log(decode("zzz"));  // null
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'dependency-resolver-ai',
    title: 'Dependency Resolver',
    difficulty: 'medium',
    category: 'Algorithm',
    description: `Given a dictionary mapping package names to their list of dependencies, return a valid installation order using topological sort. If a circular dependency exists, return an error message instead.

**Example 1:**
Input: {"A": ["B", "C"], "B": ["C"], "C": []}
Output: ["C", "B", "A"]

**Example 2:**
Input: {"A": ["B"], "B": ["A"]}
Output: "Error: circular dependency detected"

**Example 3:**
Input: {"web": ["react", "lodash"], "react": [], "lodash": []}
Output: ["react", "lodash", "web"]

**Constraints:**
- 1 ≤ packages ≤ 500
- Dependency names always appear as keys
- Multiple valid orderings are acceptable`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `resolve({"A": ["B", "C"], "B": ["C"], "C": []})  # → ["C", "B", "A"]
resolve({"A": ["B"], "B": ["A"]})                  # → "Error: circular dependency detected"
resolve({"web": ["react", "lodash"], "react": [], "lodash": []})  # → ["react", "lodash", "web"]`,
    starterCode: {
      python: `def resolve(packages: dict):
    # Use the AI assistant to help you solve this.
    # Ask it to write the function, explain the approach,
    # or help you debug — then run the code to verify.
    pass


# Test your solution
print(resolve({"A": ["B", "C"], "B": ["C"], "C": []}))
# ["C", "B", "A"]
print(resolve({"A": ["B"], "B": ["A"]}))
# "Error: circular dependency detected"
print(resolve({"web": ["react", "lodash"], "react": [], "lodash": []}))
# ["react", "lodash", "web"]
`,
      javascript: `function resolve(packages) {
  // Use the AI assistant to help you solve this.
  // Ask it to write the function, explain the approach,
  // or help you debug — then run the code to verify.
}


// Test your solution
console.log(resolve({"A": ["B", "C"], "B": ["C"], "C": []}));
// ["C", "B", "A"]
console.log(resolve({"A": ["B"], "B": ["A"]}));
// "Error: circular dependency detected"
console.log(resolve({"web": ["react", "lodash"], "react": [], "lodash": []}));
// ["react", "lodash", "web"]
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'time-zone-converter-ai',
    title: 'Time Zone Converter',
    difficulty: 'medium',
    category: 'Real-World Task',
    description: `Implement two functions:

1. \`convert_time(dt_str, from_tz, to_tz)\` — Convert a datetime string (ISO 8601: "YYYY-MM-DDTHH:MM:SS") from one IANA timezone to another. Return the result as an ISO 8601 string with UTC offset.

2. \`find_meeting_slot(timezones, date)\` — Given a list of IANA timezone strings and a date ("YYYY-MM-DD"), find the earliest 1-hour slot where all timezones are within business hours (09:00–17:00 local). Return the UTC start time as "HH:MM UTC", or \`None\` if no slot exists.

**Example 1:**
Input: "2024-03-10T09:00:00", "America/New_York", "Asia/Tokyo"
Output: "2024-03-10T23:00:00+09:00"

**Example 2:**
Input: timezones = ["America/New_York", "Europe/London"], date = "2024-06-15"
Output: "14:00 UTC"

**Constraints:**
- All timezones are valid IANA names
- Use the \`pytz\` or \`zoneinfo\` library (Python) / \`Intl\` API (JavaScript)`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `convert_time("2024-03-10T09:00:00", "America/New_York", "Asia/Tokyo")
# → "2024-03-10T23:00:00+09:00"

find_meeting_slot(["America/New_York", "Europe/London"], "2024-06-15")
# → "14:00 UTC"`,
    starterCode: {
      python: `from datetime import datetime
try:
    from zoneinfo import ZoneInfo
except ImportError:
    from backports.zoneinfo import ZoneInfo

def convert_time(dt_str: str, from_tz: str, to_tz: str) -> str:
    # Use the AI assistant to help you solve this.
    pass

def find_meeting_slot(timezones: list, date: str):
    # Use the AI assistant to help you solve this.
    pass


# Test your solution
print(convert_time("2024-03-10T09:00:00", "America/New_York", "Asia/Tokyo"))
# "2024-03-10T23:00:00+09:00"
print(find_meeting_slot(["America/New_York", "Europe/London"], "2024-06-15"))
# "14:00 UTC"
`,
      javascript: `function convertTime(dtStr, fromTz, toTz) {
  // Use the AI assistant to help you solve this.
  // Hint: use Intl.DateTimeFormat or the temporal API
}

function findMeetingSlot(timezones, date) {
  // Use the AI assistant to help you solve this.
}


// Test your solution
console.log(convertTime("2024-03-10T09:00:00", "America/New_York", "Asia/Tokyo"));
// "2024-03-10T23:00:00+09:00"
console.log(findMeetingSlot(["America/New_York", "Europe/London"], "2024-06-15"));
// "14:00 UTC"
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'matrix-spiral-ai',
    title: 'Matrix Spiral Traversal',
    difficulty: 'medium',
    category: 'Algorithm',
    description: `Implement two functions:

1. \`spiral_order(matrix)\` — Return all elements of an m×n matrix in clockwise spiral order starting from the top-left.

2. \`fill_spiral(values, rows, cols)\` — Given a flat list and dimensions, fill an m×n matrix in clockwise spiral order and return it.

**Example 1:**
Input: [[1,2,3],[4,5,6],[7,8,9]]
Output: [1, 2, 3, 6, 9, 8, 7, 4, 5]

**Example 2:**
Input: [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
Output: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]

**Example 3 (fill_spiral):**
Input: values=[1..9], rows=3, cols=3
Output: [[1,2,3],[8,9,4],[7,6,5]]

**Constraints:**
- 1 ≤ m, n ≤ 10
- m × n = len(values) for fill_spiral`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `spiral_order([[1,2,3],[4,5,6],[7,8,9]])          # → [1,2,3,6,9,8,7,4,5]
spiral_order([[1,2,3,4],[5,6,7,8],[9,10,11,12]]) # → [1,2,3,4,8,12,11,10,9,5,6,7]
fill_spiral(list(range(1,10)), 3, 3)             # → [[1,2,3],[8,9,4],[7,6,5]]`,
    starterCode: {
      python: `def spiral_order(matrix: list) -> list:
    # Use the AI assistant to help you solve this.
    pass

def fill_spiral(values: list, rows: int, cols: int) -> list:
    # Use the AI assistant to help you solve this.
    pass


# Test your solution
print(spiral_order([[1,2,3],[4,5,6],[7,8,9]]))
# [1, 2, 3, 6, 9, 8, 7, 4, 5]
print(spiral_order([[1,2,3,4],[5,6,7,8],[9,10,11,12]]))
# [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]
print(fill_spiral(list(range(1, 10)), 3, 3))
# [[1,2,3],[8,9,4],[7,6,5]]
`,
      javascript: `function spiralOrder(matrix) {
  // Use the AI assistant to help you solve this.
}

function fillSpiral(values, rows, cols) {
  // Use the AI assistant to help you solve this.
}


// Test your solution
console.log(spiralOrder([[1,2,3],[4,5,6],[7,8,9]]));
// [1, 2, 3, 6, 9, 8, 7, 4, 5]
console.log(spiralOrder([[1,2,3,4],[5,6,7,8],[9,10,11,12]]));
// [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]
console.log(fillSpiral([1,2,3,4,5,6,7,8,9], 3, 3));
// [[1,2,3],[8,9,4],[7,6,5]]
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'config-validator-ai',
    title: 'Config Schema Validator',
    difficulty: 'medium',
    category: 'Data Engineering',
    description: `Given a JSON config object and a schema dictionary, validate the config and return a list of error strings. An empty list means valid.

Schema fields per key:
- \`type\`: "string", "number", "boolean", "array", "object"
- \`required\`: true/false
- \`min\` / \`max\`: numeric range (for numbers) or length range (for strings/arrays)
- \`properties\`: nested schema (for objects)
- \`items\`: schema for array elements

**Example:**
Schema: \`{"port": {"type": "number", "required": true, "min": 1, "max": 65535}, "host": {"type": "string", "required": true}}\`
Config: \`{"port": 70000}\`
Output: \`["port: value 70000 exceeds max 65535", "host: required field missing"]\`

**Constraints:**
- Nested depth ≤ 5
- Arrays may contain objects`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `schema = {"port": {"type": "number", "required": True, "min": 1, "max": 65535},
          "host": {"type": "string", "required": True}}
validate_config({"port": 70000}, schema)
# → ["port: value 70000 exceeds max 65535", "host: required field missing"]
validate_config({"port": 8080, "host": "localhost"}, schema)
# → []`,
    starterCode: {
      python: `def validate_config(config: dict, schema: dict) -> list:
    # Use the AI assistant to help you solve this.
    # Ask it to write the function, explain the approach,
    # or help you debug — then run the code to verify.
    pass


# Test your solution
schema = {
    "port": {"type": "number", "required": True, "min": 1, "max": 65535},
    "host": {"type": "string", "required": True},
}
print(validate_config({"port": 70000}, schema))
# ["port: value 70000 exceeds max 65535", "host: required field missing"]
print(validate_config({"port": 8080, "host": "localhost"}, schema))
# []
`,
      javascript: `function validateConfig(config, schema) {
  // Use the AI assistant to help you solve this.
  // Ask it to write the function, explain the approach,
  // or help you debug — then run the code to verify.
}


// Test your solution
const schema = {
  port: { type: "number", required: true, min: 1, max: 65535 },
  host: { type: "string", required: true },
};
console.log(validateConfig({ port: 70000 }, schema));
// ["port: value 70000 exceeds max 65535", "host: required field missing"]
console.log(validateConfig({ port: 8080, host: "localhost" }, schema));
// []
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'token-bucket-ai',
    title: 'Token Bucket Rate Limiter',
    difficulty: 'medium',
    category: 'AI Engineering',
    description: `Implement a token bucket rate limiter class. The bucket refills at \`rate\` tokens per second up to \`capacity\`.

Methods:
- \`__init__(capacity, rate)\` — initialize the bucket full
- \`consume(n, timestamp)\` — returns \`True\` if \`n\` tokens are available (and consumes them), \`False\` otherwise. \`timestamp\` is a float (seconds).

**Example:**
\`\`\`
tb = TokenBucket(10, 2)     # capacity=10, rate=2/sec
tb.consume(5, 0.0)   → True   (10 - 5 = 5 remaining)
tb.consume(7, 1.0)   → True   (5 + 2*1 = 7 → 7 - 7 = 0)
tb.consume(1, 1.5)   → True   (0 + 2*0.5 = 1 → 1 - 1 = 0)
tb.consume(3, 1.5)   → False  (0 tokens)
\`\`\`

**Constraints:**
- 1 ≤ capacity ≤ 10^6
- 0 < rate ≤ 10^6
- Timestamps are monotonically non-decreasing floats`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `tb = TokenBucket(10, 2)
tb.consume(5, 0.0)   # → True
tb.consume(7, 1.0)   # → True
tb.consume(1, 1.5)   # → True
tb.consume(3, 1.5)   # → False`,
    starterCode: {
      python: `class TokenBucket:
    def __init__(self, capacity: float, rate: float):
        # Use the AI assistant to help you implement this.
        pass

    def consume(self, n: float, timestamp: float) -> bool:
        # Use the AI assistant to help you implement this.
        pass


# Test your solution
tb = TokenBucket(10, 2)
print(tb.consume(5, 0.0))   # True
print(tb.consume(7, 1.0))   # True
print(tb.consume(1, 1.5))   # True
print(tb.consume(3, 1.5))   # False
`,
      javascript: `class TokenBucket {
  constructor(capacity, rate) {
    // Use the AI assistant to help you implement this.
  }

  consume(n, timestamp) {
    // Use the AI assistant to help you implement this.
  }
}


// Test your solution
const tb = new TokenBucket(10, 2);
console.log(tb.consume(5, 0.0));   // true
console.log(tb.consume(7, 1.0));   // true
console.log(tb.consume(1, 1.5));   // true
console.log(tb.consume(3, 1.5));   // false
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'stream-stats-ai',
    title: 'Running Stream Statistics',
    difficulty: 'medium',
    category: 'Analytics',
    description: `Implement a \`StreamStats\` class that processes a stream of numbers and maintains running statistics without storing the full history (except for approximate median).

Methods:
- \`add(num)\` — add a number to the stream
- \`mean()\` → float
- \`std()\` → float (population standard deviation)
- \`min()\` → float
- \`max()\` → float
- \`median()\` → float (exact or approximate)
- \`percentile(p)\` → float for p in [0, 100] (approximate is acceptable)
- \`count()\` → int

**Example:**
\`\`\`
s = StreamStats()
for x in [2, 4, 4, 4, 5, 5, 7, 9]:
    s.add(x)
s.mean()       → 5.0
s.std()        → 2.0
s.median()     → 4.5
s.percentile(75) → 5.5
\`\`\`

**Constraints:**
- Up to 10^6 additions
- Values are real numbers`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `s = StreamStats()
for x in [2, 4, 4, 4, 5, 5, 7, 9]: s.add(x)
s.mean()         # → 5.0
s.std()          # → 2.0
s.median()       # → 4.5
s.percentile(75) # → 5.5
s.count()        # → 8`,
    starterCode: {
      python: `class StreamStats:
    def __init__(self):
        # Use the AI assistant to help you implement this.
        pass

    def add(self, num: float):
        pass

    def mean(self) -> float:
        pass

    def std(self) -> float:
        pass

    def min(self) -> float:
        pass

    def max(self) -> float:
        pass

    def median(self) -> float:
        pass

    def percentile(self, p: float) -> float:
        pass

    def count(self) -> int:
        pass


# Test your solution
s = StreamStats()
for x in [2, 4, 4, 4, 5, 5, 7, 9]:
    s.add(x)
print(s.mean())          # 5.0
print(s.std())           # 2.0
print(s.median())        # 4.5
print(s.percentile(75))  # 5.5
print(s.count())         # 8
`,
      javascript: `class StreamStats {
  constructor() {
    // Use the AI assistant to help you implement this.
  }

  add(num) {}
  mean() {}
  std() {}
  min() {}
  max() {}
  median() {}
  percentile(p) {}
  count() {}
}


// Test your solution
const s = new StreamStats();
for (const x of [2, 4, 4, 4, 5, 5, 7, 9]) s.add(x);
console.log(s.mean());          // 5.0
console.log(s.std());           // 2.0
console.log(s.median());        // 4.5
console.log(s.percentile(75));  // 5.5
console.log(s.count());         // 8
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  // ── Hard Problems ──────────────────────────────────────────────────────────

  {
    id: 'graph-shortest-path-ai',
    title: 'Multi-Source Shortest Path',
    difficulty: 'hard',
    category: 'Algorithm',
    description: `Given a weighted directed graph and a list of source nodes, find the shortest distance from **any** source to every other node (multi-source Dijkstra). Also implement path reconstruction.

Input format:
- \`graph\`: dict of node → list of (neighbor, weight) tuples
- \`sources\`: list of starting nodes

Return a dict mapping each node to \`(distance, path)\` where path is the list of nodes from the nearest source.

**Example:**
\`\`\`
graph = {
  "A": [("B", 1), ("C", 4)],
  "B": [("C", 2), ("D", 5)],
  "C": [("D", 1)],
  "D": []
}
sources = ["A"]
\`\`\`
Output: \`{"A": (0, ["A"]), "B": (1, ["A","B"]), "C": (3, ["A","B","C"]), "D": (4, ["A","B","C","D"])}\`

**Constraints:**
- 1 ≤ nodes ≤ 10^4
- 1 ≤ edges ≤ 10^5
- Weights are positive integers`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `graph = {"A": [("B",1),("C",4)], "B": [("C",2),("D",5)], "C": [("D",1)], "D": []}
multi_source_dijkstra(graph, ["A"])
# → {"A":(0,["A"]), "B":(1,["A","B"]), "C":(3,["A","B","C"]), "D":(4,["A","B","C","D"])}`,
    starterCode: {
      python: `import heapq

def multi_source_dijkstra(graph: dict, sources: list) -> dict:
    # Use the AI assistant to help you solve this.
    # Ask it to write the function, explain the approach,
    # or help you debug — then run the code to verify.
    pass


# Test your solution
graph = {
    "A": [("B", 1), ("C", 4)],
    "B": [("C", 2), ("D", 5)],
    "C": [("D", 1)],
    "D": [],
}
result = multi_source_dijkstra(graph, ["A"])
for node, (dist, path) in sorted(result.items()):
    print(f"{node}: dist={dist}, path={path}")
`,
      javascript: `function multiSourceDijkstra(graph, sources) {
  // Use the AI assistant to help you solve this.
  // Ask it to write the function, explain the approach,
  // or help you debug — then run the code to verify.
}


// Test your solution
const graph = {
  A: [["B", 1], ["C", 4]],
  B: [["C", 2], ["D", 5]],
  C: [["D", 1]],
  D: [],
};
const result = multiSourceDijkstra(graph, ["A"]);
for (const [node, [dist, path]] of Object.entries(result)) {
  console.log(\`\${node}: dist=\${dist}, path=\${path}\`);
}
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'bloom-filter-ai',
    title: 'Bloom Filter',
    difficulty: 'hard',
    category: 'Data Structures',
    description: `Implement a Bloom filter with configurable false-positive rate.

Given desired false-positive rate \`fpr\` (0 < fpr < 1) and expected number of elements \`n\`, automatically compute the optimal bit array size \`m\` and number of hash functions \`k\`.

Methods:
- \`__init__(n, fpr)\`
- \`add(item)\`
- \`might_contain(item)\` → bool

Use the formulas:
- \`m = -(n * ln(fpr)) / (ln(2)^2)\`
- \`k = (m/n) * ln(2)\`

**Example:**
\`\`\`
bf = BloomFilter(1000, 0.01)
bf.add("hello")
bf.might_contain("hello")   → True  (guaranteed)
bf.might_contain("world")   → False (with high probability)
\`\`\`

**Constraints:**
- Use only built-in hash functions (no external libs)
- must_contain guarantees no false negatives`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `bf = BloomFilter(1000, 0.01)
bf.add("hello")
bf.might_contain("hello")  # → True
bf.might_contain("world")  # → False (likely)
# After adding 1000 distinct items, false positive rate ≈ 1%`,
    starterCode: {
      python: `import math

class BloomFilter:
    def __init__(self, n: int, fpr: float):
        # Use the AI assistant to help you implement this.
        # Compute optimal m and k, then initialize the bit array.
        pass

    def add(self, item: str):
        pass

    def might_contain(self, item: str) -> bool:
        pass


# Test your solution
bf = BloomFilter(1000, 0.01)
words = ["apple", "banana", "cherry", "date", "elderberry"]
for w in words:
    bf.add(w)

for w in words:
    print(f"{w}: {bf.might_contain(w)}")  # all True

print(bf.might_contain("fig"))       # False (likely)
print(bf.might_contain("grape"))     # False (likely)
`,
      javascript: `class BloomFilter {
  constructor(n, fpr) {
    // Use the AI assistant to help you implement this.
    // Compute optimal m and k, then initialize the bit array.
  }

  add(item) {}

  mightContain(item) {}
}


// Test your solution
const bf = new BloomFilter(1000, 0.01);
const words = ["apple", "banana", "cherry", "date", "elderberry"];
for (const w of words) bf.add(w);
for (const w of words) console.log(\`\${w}: \${bf.mightContain(w)}\`);  // all true
console.log(bf.mightContain("fig"));    // false (likely)
console.log(bf.mightContain("grape"));  // false (likely)
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'event-sourcing-ai',
    title: 'Event Sourcing Engine',
    difficulty: 'hard',
    category: 'Systems Design',
    description: `Implement an event sourcing engine with snapshotting support.

Events are dicts with at minimum \`{"entity_id": str, "timestamp": float, "type": str, "data": dict}\`. State is derived by replaying events in order.

Methods:
- \`append(event)\` — store an event
- \`get_state(entity_id)\` → dict (current state from all events)
- \`get_state_at(entity_id, timestamp)\` → dict (state up to and including that timestamp)
- \`snapshot(entity_id)\` — store current state as a snapshot to speed up future replays

Event types to handle: \`"set"\` (merge data into state), \`"delete"\` (remove keys listed in data["keys"]).

**Example:**
\`\`\`
store = EventStore()
store.append({"entity_id":"u1","timestamp":1.0,"type":"set","data":{"name":"Alice","age":30}})
store.append({"entity_id":"u1","timestamp":2.0,"type":"set","data":{"age":31}})
store.get_state("u1")         → {"name": "Alice", "age": 31}
store.get_state_at("u1", 1.0) → {"name": "Alice", "age": 30}
\`\`\``,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `store = EventStore()
store.append({"entity_id":"u1","timestamp":1.0,"type":"set","data":{"name":"Alice","age":30}})
store.append({"entity_id":"u1","timestamp":2.0,"type":"set","data":{"age":31}})
store.get_state("u1")          # → {"name": "Alice", "age": 31}
store.get_state_at("u1", 1.0)  # → {"name": "Alice", "age": 30}`,
    starterCode: {
      python: `class EventStore:
    def __init__(self):
        # Use the AI assistant to help you implement this.
        pass

    def append(self, event: dict):
        pass

    def get_state(self, entity_id: str) -> dict:
        pass

    def get_state_at(self, entity_id: str, timestamp: float) -> dict:
        pass

    def snapshot(self, entity_id: str):
        pass


# Test your solution
store = EventStore()
store.append({"entity_id":"u1","timestamp":1.0,"type":"set","data":{"name":"Alice","age":30}})
store.append({"entity_id":"u1","timestamp":2.0,"type":"set","data":{"age":31}})
store.append({"entity_id":"u1","timestamp":3.0,"type":"delete","data":{"keys":["age"]}})
print(store.get_state("u1"))          # {"name": "Alice"}
print(store.get_state_at("u1", 1.0)) # {"name": "Alice", "age": 30}
store.snapshot("u1")
store.append({"entity_id":"u1","timestamp":4.0,"type":"set","data":{"city":"NY"}})
print(store.get_state("u1"))          # {"name": "Alice", "city": "NY"}
`,
      javascript: `class EventStore {
  constructor() {
    // Use the AI assistant to help you implement this.
  }

  append(event) {}
  getState(entityId) {}
  getStateAt(entityId, timestamp) {}
  snapshot(entityId) {}
}


// Test your solution
const store = new EventStore();
store.append({entity_id:"u1",timestamp:1.0,type:"set",data:{name:"Alice",age:30}});
store.append({entity_id:"u1",timestamp:2.0,type:"set",data:{age:31}});
store.append({entity_id:"u1",timestamp:3.0,type:"delete",data:{keys:["age"]}});
console.log(store.getState("u1"));          // {name: "Alice"}
console.log(store.getStateAt("u1", 1.0));   // {name: "Alice", age: 30}
store.snapshot("u1");
store.append({entity_id:"u1",timestamp:4.0,type:"set",data:{city:"NY"}});
console.log(store.getState("u1"));          // {name: "Alice", city: "NY"}
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'parser-combinator-ai',
    title: 'Mini Parser Combinator',
    difficulty: 'hard',
    category: 'Algorithm',
    description: `Build a set of composable parser primitives, then use them to parse simple arithmetic expressions.

Implement these combinators (each takes an input string + position, returns \`(result, new_pos)\` or raises/returns \`None\` on failure):
- \`literal(s)\` — matches exact string s
- \`regex(pattern)\` — matches a regex at current position
- \`sequence(*parsers)\` — all must match in order, returns list of results
- \`choice(*parsers)\` — first match wins
- \`many(parser)\` — zero or more matches, returns list
- \`optional(parser)\` — zero or one match

Then implement \`parse_expr(s)\` that parses and **evaluates** an arithmetic expression with \`+\`, \`-\`, \`*\`, \`/\`, integers, and parentheses.

**Example:**
\`\`\`
parse_expr("3 + 4 * 2")    → 11
parse_expr("(1 + 2) * 3")  → 9
parse_expr("10 / 2 - 1")   → 4
\`\`\``,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `parse_expr("3 + 4 * 2")    # → 11
parse_expr("(1 + 2) * 3")  # → 9
parse_expr("10 / 2 - 1")   # → 4.0`,
    starterCode: {
      python: `import re

def literal(s):
    # Use the AI assistant to help you implement this.
    pass

def regex(pattern):
    pass

def sequence(*parsers):
    pass

def choice(*parsers):
    pass

def many(parser):
    pass

def optional(parser):
    pass

def parse_expr(s: str):
    # Use your combinators to parse and evaluate the expression.
    pass


# Test your solution
print(parse_expr("3 + 4 * 2"))    # 11
print(parse_expr("(1 + 2) * 3"))  # 9
print(parse_expr("10 / 2 - 1"))   # 4.0
`,
      javascript: `function literal(s) {
  // Use the AI assistant to help you implement this.
}

function regex(pattern) {}
function sequence(...parsers) {}
function choice(...parsers) {}
function many(parser) {}
function optional(parser) {}

function parseExpr(s) {
  // Use your combinators to parse and evaluate the expression.
}


// Test your solution
console.log(parseExpr("3 + 4 * 2"));    // 11
console.log(parseExpr("(1 + 2) * 3"));  // 9
console.log(parseExpr("10 / 2 - 1"));   // 4
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'cache-with-ttl-ai',
    title: 'Distributed Cache with TTL',
    difficulty: 'hard',
    category: 'Systems Design',
    description: `Implement an LRU cache extended with per-key TTL and cache statistics.

Methods:
- \`__init__(capacity)\`
- \`get(key)\` → value or \`None\` (expired keys return None and are evicted)
- \`set(key, value, ttl_seconds)\` — store with expiry
- \`delete(key)\`
- \`get_or_compute(key, fn, ttl_seconds)\` → value (computes and caches if missing/expired)
- \`stats()\` → dict with \`hit_rate\`, \`total_hits\`, \`total_misses\`, \`eviction_count\`, \`size\`
- \`sweep()\` — remove all expired keys

Use \`time.time()\` for current time (or accept a \`clock\` function for testability).

**Example:**
\`\`\`
cache = TTLCache(3)
cache.set("a", 1, ttl_seconds=10)
cache.get("a")   → 1
cache.get("z")   → None
cache.stats()    → {"hit_rate": 0.5, "total_hits": 1, "total_misses": 1, ...}
\`\`\``,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `cache = TTLCache(3)
cache.set("a", 1, 10)
cache.get("a")   # → 1
cache.get("z")   # → None
cache.stats()    # → {"hit_rate": 0.5, "total_hits": 1, "total_misses": 1, "eviction_count": 0, "size": 1}`,
    starterCode: {
      python: `import time
from collections import OrderedDict

class TTLCache:
    def __init__(self, capacity: int, clock=None):
        # Use the AI assistant to help you implement this.
        pass

    def get(self, key: str):
        pass

    def set(self, key: str, value, ttl_seconds: float):
        pass

    def delete(self, key: str):
        pass

    def get_or_compute(self, key: str, fn, ttl_seconds: float):
        pass

    def stats(self) -> dict:
        pass

    def sweep(self):
        pass


# Test your solution
t = [0.0]
clock = lambda: t[0]
cache = TTLCache(3, clock=clock)
cache.set("a", 1, 10)
cache.set("b", 2, 5)
print(cache.get("a"))    # 1
print(cache.get("z"))    # None
t[0] = 6.0
print(cache.get("b"))    # None (expired)
cache.sweep()
print(cache.stats())
`,
      javascript: `class TTLCache {
  constructor(capacity, clock = null) {
    // Use the AI assistant to help you implement this.
    this._clock = clock || (() => Date.now() / 1000);
  }

  get(key) {}
  set(key, value, ttlSeconds) {}
  delete(key) {}
  getOrCompute(key, fn, ttlSeconds) {}
  stats() {}
  sweep() {}
}


// Test your solution
let t = 0;
const cache = new TTLCache(3, () => t);
cache.set("a", 1, 10);
cache.set("b", 2, 5);
console.log(cache.get("a"));   // 1
console.log(cache.get("z"));   // null
t = 6;
console.log(cache.get("b"));   // null (expired)
cache.sweep();
console.log(cache.stats());
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'pipeline-builder-ai',
    title: 'Composable Data Pipeline',
    difficulty: 'hard',
    category: 'Data Engineering',
    description: `Build a composable, lazy data pipeline. A \`Pipeline\` chains stages that process items from an input iterable.

Implement these stages:
- \`transform(fn)\` — map each item through fn
- \`filter(pred)\` — keep items where pred is True
- \`batch(n)\` — group items into lists of size n
- \`flatten()\` — flatten one level of nested iterables
- \`take(n)\` — stop after n items
- \`branch(pred, pipe_true, pipe_false)\` — route items to one of two sub-pipelines

\`Pipeline.run(source)\` should be lazy (use generators).

**Example:**
\`\`\`
p = (Pipeline()
     .filter(lambda x: x % 2 == 0)
     .transform(lambda x: x * 10)
     .batch(3))
list(p.run(range(10)))
→ [[0, 20, 40], [60, 80]]
\`\`\``,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `p = Pipeline().filter(lambda x: x % 2 == 0).transform(lambda x: x * 10).batch(3)
list(p.run(range(10)))  # → [[0, 20, 40], [60, 80]]

p2 = Pipeline().transform(lambda x: x**2).take(5)
list(p2.run(range(100)))  # → [0, 1, 4, 9, 16]`,
    starterCode: {
      python: `class Pipeline:
    def __init__(self):
        # Use the AI assistant to help you implement this.
        self._stages = []

    def transform(self, fn):
        pass

    def filter(self, pred):
        pass

    def batch(self, n: int):
        pass

    def flatten(self):
        pass

    def take(self, n: int):
        pass

    def branch(self, pred, pipe_true, pipe_false):
        pass

    def run(self, source):
        # Lazily process the source through all stages.
        pass


# Test your solution
p = (Pipeline()
     .filter(lambda x: x % 2 == 0)
     .transform(lambda x: x * 10)
     .batch(3))
print(list(p.run(range(10))))  # [[0, 20, 40], [60, 80]]

p2 = Pipeline().transform(lambda x: x**2).take(5)
print(list(p2.run(range(100))))  # [0, 1, 4, 9, 16]
`,
      javascript: `class Pipeline {
  constructor() {
    // Use the AI assistant to help you implement this.
    this._stages = [];
  }

  transform(fn) { return this; }
  filter(pred) { return this; }
  batch(n) { return this; }
  flatten() { return this; }
  take(n) { return this; }
  branch(pred, pipeTrue, pipeFalse) { return this; }

  *run(source) {
    // Lazily process source through all stages.
  }
}


// Test your solution
const p = new Pipeline()
  .filter(x => x % 2 === 0)
  .transform(x => x * 10)
  .batch(3);
console.log([...p.run([0,1,2,3,4,5,6,7,8,9])]);  // [[0,20,40],[60,80]]

const p2 = new Pipeline().transform(x => x**2).take(5);
console.log([...p2.run([...Array(100).keys()])]);  // [0,1,4,9,16]
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'circuit-breaker-ai',
    title: 'Circuit Breaker Pattern',
    difficulty: 'hard',
    category: 'Systems Design',
    description: `Implement the circuit breaker design pattern with three states:
- **CLOSED** — normal operation, calls pass through
- **OPEN** — too many failures, calls are rejected immediately with an error
- **HALF_OPEN** — testing recovery, limited calls allowed through

Config parameters:
- \`failure_threshold\` — failures in CLOSED before opening
- \`timeout\` — seconds in OPEN before moving to HALF_OPEN
- \`success_threshold\` — consecutive successes in HALF_OPEN before re-closing

Methods:
- \`call(fn, *args)\` → result or raises \`CircuitOpenError\`
- \`state\` property → "CLOSED", "OPEN", or "HALF_OPEN"
- \`reset()\` — force back to CLOSED

**Example:**
\`\`\`
cb = CircuitBreaker(failure_threshold=3, timeout=30, success_threshold=2)
# After 3 failures → state becomes "OPEN"
# After 30s → state becomes "HALF_OPEN"
# After 2 successes → state becomes "CLOSED"
\`\`\``,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `cb = CircuitBreaker(failure_threshold=3, timeout=30, success_threshold=2)
print(cb.state)  # "CLOSED"
def fail(): raise Exception("err")
for _ in range(3):
    try: cb.call(fail)
    except: pass
print(cb.state)  # "OPEN"
try: cb.call(lambda: 42)
except CircuitOpenError: print("rejected")  # "rejected"`,
    starterCode: {
      python: `import time

class CircuitOpenError(Exception):
    pass

class CircuitBreaker:
    def __init__(self, failure_threshold: int, timeout: float, success_threshold: int, clock=None):
        # Use the AI assistant to help you implement this.
        pass

    @property
    def state(self) -> str:
        pass

    def call(self, fn, *args):
        pass

    def reset(self):
        pass


# Test your solution
t = [0.0]
cb = CircuitBreaker(failure_threshold=3, timeout=30, success_threshold=2, clock=lambda: t[0])
print(cb.state)  # CLOSED

def fail(): raise Exception("oops")
for _ in range(3):
    try: cb.call(fail)
    except Exception: pass

print(cb.state)  # OPEN
try:
    cb.call(lambda: 42)
except CircuitOpenError:
    print("call rejected")  # call rejected

t[0] = 31.0  # advance past timeout
print(cb.state)  # HALF_OPEN
`,
      javascript: `class CircuitOpenError extends Error {}

class CircuitBreaker {
  constructor({ failureThreshold, timeout, successThreshold, clock = null }) {
    // Use the AI assistant to help you implement this.
    this._clock = clock || (() => Date.now() / 1000);
  }

  get state() {}

  call(fn, ...args) {}

  reset() {}
}


// Test your solution
let t = 0;
const cb = new CircuitBreaker({ failureThreshold: 3, timeout: 30, successThreshold: 2, clock: () => t });
console.log(cb.state);  // CLOSED
const fail = () => { throw new Error("oops"); };
for (let i = 0; i < 3; i++) {
  try { cb.call(fail); } catch (e) {}
}
console.log(cb.state);  // OPEN
try { cb.call(() => 42); } catch (e) {
  if (e instanceof CircuitOpenError) console.log("call rejected");
}
t = 31;
console.log(cb.state);  // HALF_OPEN
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'semantic-cache-ai',
    title: 'Semantic Response Cache',
    difficulty: 'hard',
    category: 'AI Engineering',
    description: `Build a semantic cache for LLM responses using TF-IDF cosine similarity — no external ML libraries allowed.

Methods:
- \`store(query, response)\` — add a query-response pair
- \`lookup(query, threshold)\` → the stored response for the most similar past query if similarity ≥ threshold, else \`None\`
- \`similarity(q1, q2)\` → float in [0, 1] (cosine similarity of TF-IDF vectors)

TF-IDF: term frequency × inverse document frequency. Use all stored queries as the corpus.

**Example:**
\`\`\`
cache = SemanticCache()
cache.store("What is Python?", "Python is a programming language.")
cache.lookup("What is Python?", 0.9)   → "Python is a programming language."
cache.lookup("Tell me about Python", 0.5) → "Python is a programming language."
cache.lookup("What is JavaScript?", 0.9) → None
\`\`\``,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `cache = SemanticCache()
cache.store("What is Python?", "Python is a programming language.")
cache.lookup("What is Python?", 0.9)      # → "Python is a programming language."
cache.lookup("Tell me about Python", 0.5) # → "Python is a programming language."
cache.lookup("What is JavaScript?", 0.9)  # → None`,
    starterCode: {
      python: `import math
from collections import Counter

class SemanticCache:
    def __init__(self):
        # Use the AI assistant to help you implement this.
        pass

    def store(self, query: str, response: str):
        pass

    def lookup(self, query: str, threshold: float):
        pass

    def similarity(self, q1: str, q2: str) -> float:
        pass


# Test your solution
cache = SemanticCache()
cache.store("What is Python?", "Python is a programming language.")
cache.store("How does garbage collection work?", "GC automatically frees unused memory.")

print(cache.lookup("What is Python?", 0.9))
# "Python is a programming language."
print(cache.lookup("Tell me about Python", 0.5))
# "Python is a programming language." (likely)
print(cache.lookup("What is JavaScript?", 0.9))
# None
`,
      javascript: `class SemanticCache {
  constructor() {
    // Use the AI assistant to help you implement this.
  }

  store(query, response) {}
  lookup(query, threshold) {}
  similarity(q1, q2) {}
}


// Test your solution
const cache = new SemanticCache();
cache.store("What is Python?", "Python is a programming language.");
cache.store("How does garbage collection work?", "GC automatically frees unused memory.");

console.log(cache.lookup("What is Python?", 0.9));
// "Python is a programming language."
console.log(cache.lookup("Tell me about Python", 0.5));
// likely: "Python is a programming language."
console.log(cache.lookup("What is JavaScript?", 0.9));
// null
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'query-engine-ai',
    title: 'Mini SQL Query Engine',
    difficulty: 'hard',
    category: 'Data Engineering',
    description: `Parse and execute simple SQL queries against in-memory data (list of dicts).

Support:
- \`SELECT col1, col2 FROM table\` (or \`SELECT *\`)
- \`WHERE\` with: \`=\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\`, \`AND\`, \`OR\`, \`IN (v1,v2)\`, \`LIKE 'pat%'\`
- \`ORDER BY col [ASC|DESC]\`
- \`LIMIT n\`

**Example:**
\`\`\`python
data = [
  {"name": "Alice", "age": 30, "dept": "eng"},
  {"name": "Bob",   "age": 25, "dept": "eng"},
  {"name": "Carol", "age": 35, "dept": "hr"},
]
execute("SELECT name, age FROM employees WHERE dept = 'eng' ORDER BY age DESC LIMIT 2", {"employees": data})
→ [{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]
\`\`\`

**Constraints:**
- No JOINs, subqueries, or aggregates needed
- String values are single-quoted in the SQL`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `data = [{"name":"Alice","age":30,"dept":"eng"},{"name":"Bob","age":25,"dept":"eng"},{"name":"Carol","age":35,"dept":"hr"}]
execute("SELECT name, age FROM employees WHERE dept = 'eng' ORDER BY age DESC LIMIT 2", {"employees": data})
# → [{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]`,
    starterCode: {
      python: `def execute(sql: str, tables: dict) -> list:
    # Use the AI assistant to help you solve this.
    # Ask it to write the function, explain the approach,
    # or help you debug — then run the code to verify.
    pass


# Test your solution
data = [
    {"name": "Alice", "age": 30, "dept": "eng"},
    {"name": "Bob",   "age": 25, "dept": "eng"},
    {"name": "Carol", "age": 35, "dept": "hr"},
]
result = execute(
    "SELECT name, age FROM employees WHERE dept = 'eng' ORDER BY age DESC LIMIT 2",
    {"employees": data}
)
print(result)  # [{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]

result2 = execute(
    "SELECT * FROM employees WHERE age > 28 AND dept != 'hr'",
    {"employees": data}
)
print(result2)  # [{"name": "Alice", "age": 30, "dept": "eng"}]
`,
      javascript: `function execute(sql, tables) {
  // Use the AI assistant to help you solve this.
  // Ask it to write the function, explain the approach,
  // or help you debug — then run the code to verify.
}


// Test your solution
const data = [
  { name: "Alice", age: 30, dept: "eng" },
  { name: "Bob",   age: 25, dept: "eng" },
  { name: "Carol", age: 35, dept: "hr"  },
];
console.log(execute(
  "SELECT name, age FROM employees WHERE dept = 'eng' ORDER BY age DESC LIMIT 2",
  { employees: data }
));
// [{ name: "Alice", age: 30 }, { name: "Bob", age: 25 }]
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },

  {
    id: 'consistent-hashing-ai',
    title: 'Consistent Hashing Ring',
    difficulty: 'hard',
    category: 'Systems Design',
    description: `Implement a consistent hashing ring with virtual nodes for load distribution.

Methods:
- \`__init__(replicas=100)\` — number of virtual nodes per physical node
- \`add_node(node)\` — add a node (and its virtual copies) to the ring
- \`remove_node(node)\` — remove a node and all its virtual nodes
- \`get_node(key)\` → the physical node responsible for this key
- \`distribution()\` → dict mapping each node to the number of sample keys assigned to it (use 1000 sample keys "key_0" through "key_999")

**Example:**
\`\`\`
ring = ConsistentHashRing(replicas=100)
ring.add_node("server-1")
ring.add_node("server-2")
ring.add_node("server-3")
ring.get_node("user:alice")    → "server-2"  (may vary by hash)
ring.get_node("user:bob")      → "server-1"
ring.distribution()            → {"server-1": 340, "server-2": 330, "server-3": 330}
\`\`\`

**Constraints:**
- Use Python \`hashlib\` or \`hash()\` / JS \`crypto\` or a simple hash function`,
    scenario: `You have access to an AI assistant that can help you write, debug, and explain code.

Your goal is to solve this problem correctly. The AI can write code for you — that is fine. But you will be assessed on **how well you use the AI**: the quality of your prompts, whether you verify AI output, whether you understand what is submitted, and whether you exercise your own judgment.

Think of this as a realistic work simulation: a senior dev watching over your shoulder as you pair with an AI tool.`,
    exampleOutput: `ring = ConsistentHashRing(replicas=100)
ring.add_node("server-1")
ring.add_node("server-2")
ring.add_node("server-3")
ring.get_node("user:alice")  # → "server-X" (consistent for same key)
dist = ring.distribution()
# Each server gets roughly 333 of 1000 sample keys
print(sum(dist.values()))    # → 1000`,
    starterCode: {
      python: `import hashlib
import bisect

class ConsistentHashRing:
    def __init__(self, replicas: int = 100):
        # Use the AI assistant to help you implement this.
        pass

    def add_node(self, node: str):
        pass

    def remove_node(self, node: str):
        pass

    def get_node(self, key: str) -> str:
        pass

    def distribution(self) -> dict:
        pass


# Test your solution
ring = ConsistentHashRing(replicas=100)
ring.add_node("server-1")
ring.add_node("server-2")
ring.add_node("server-3")

print(ring.get_node("user:alice"))  # consistent result
print(ring.get_node("user:alice"))  # same result

dist = ring.distribution()
print(dist)
print(sum(dist.values()))  # 1000

ring.remove_node("server-2")
dist2 = ring.distribution()
print(dist2)               # server-2 keys redistributed
print(sum(dist2.values())) # still 1000
`,
      javascript: `const crypto = require("crypto");

class ConsistentHashRing {
  constructor(replicas = 100) {
    // Use the AI assistant to help you implement this.
    this.replicas = replicas;
  }

  addNode(node) {}
  removeNode(node) {}
  getNode(key) {}
  distribution() {}
}


// Test your solution
const ring = new ConsistentHashRing(100);
ring.addNode("server-1");
ring.addNode("server-2");
ring.addNode("server-3");

console.log(ring.getNode("user:alice"));  // consistent
console.log(ring.getNode("user:alice"));  // same

const dist = ring.distribution();
console.log(dist);
console.log(Object.values(dist).reduce((a,b)=>a+b,0));  // 1000
`,
    },
    judgingLanguageIds: { python: 71, javascript: 63 },
  },
];
