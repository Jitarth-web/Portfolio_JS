import { useState, useEffect, useRef } from "react";

const PROBLEMS = [
  {
    filename: "solution.cpp",
    commandNvim: "nvim solution.cpp",
    commandCompile: "g++ solution.cpp && ./a.out",
    code: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    bool canJump(vector<int>& nums) {
        int reach = 0;
        for(int i=0; i<nums.size(); i++) {
            if(i > reach)
                return false;
            reach = max(reach, i + nums[i]);
        }
        return true;
    }
};`,
    result: `Accepted\nRuntime: 0 ms\nMemory: 8.3 MB`
  },
  {
    filename: "two_sum.cpp",
    commandNvim: "nvim two_sum.cpp",
    commandCompile: "g++ two_sum.cpp && ./a.out",
    code: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;
        for(int i=0; i<nums.size(); i++) {
            if(mp.count(target - nums[i]))
                return {mp[target - nums[i]], i};
            mp[nums[i]] = i;
        }
        return {};
    }
};`,
    result: `Accepted\nRuntime: 4 ms\nMemory: 10.8 MB`
  },
  {
    filename: "reverse.cpp",
    commandNvim: "nvim reverse.cpp",
    commandCompile: "g++ reverse.cpp && ./a.out",
    code: `#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(NULL) {}
};

class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode *prev = nullptr;
        ListNode *curr = head;
        while(curr) {
            ListNode *next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
};`,
    result: `Accepted\nRuntime: 0 ms\nMemory: 8.5 MB`
  }
];

const tokenizeCpp = (text) => {
  const regex = /(\/\/.*)|(#include\s*<.*?>)|(\b(?:class|public|private|bool|int|char|double|float|for|while|if|else|return|void|nullptr|vector|unordered_map|ListNode|struct|using|namespace|NULL)\b)|(\b\d+\b)|([a-zA-Z_][a-zA-Z0-9_]*)|(\S)/g;
  
  const tokens = [];
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        text: text.substring(lastIndex, match.index),
        type: "plain"
      });
    }
    
    const [lexeme, comment, include, keyword, number, identifier, symbol] = match;
    
    if (comment) {
      tokens.push({ text: lexeme, type: "comment" });
    } else if (include) {
      tokens.push({ text: lexeme, type: "include" });
    } else if (keyword) {
      tokens.push({ text: lexeme, type: "keyword" });
    } else if (number) {
      tokens.push({ text: lexeme, type: "number" });
    } else if (identifier) {
      const nextCharIndex = match.index + lexeme.length;
      const isFunction = text.substring(nextCharIndex, nextCharIndex + 10).trim().startsWith("(");
      tokens.push({ text: lexeme, type: isFunction ? "function" : "identifier" });
    } else if (symbol) {
      tokens.push({ text: lexeme, type: "symbol" });
    }
    
    lastIndex = regex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    tokens.push({
      text: text.substring(lastIndex),
      type: "plain"
    });
  }
  
  return tokens;
};

const renderCodeText = (text) => {
  const tokens = tokenizeCpp(text);
  return tokens.map((token, idx) => (
    <span key={idx} className={`code-token-${token.type}`}>
      {token.text}
    </span>
  ));
};

export default function InteractiveCodingTerminal() {
  const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
  const [editorText, setEditorText] = useState("");
  const [terminalLines, setTerminalLines] = useState([]);
  const [currentTerminalInput, setCurrentTerminalInput] = useState("");
  const [editorSaving, setEditorSaving] = useState(true); // unsaved dot by default

  const terminalPanelRef = useRef(null);

  // Auto-scroll terminal container panel (does not affect browser page scrolling)
  useEffect(() => {
    if (terminalPanelRef.current) {
      terminalPanelRef.current.scrollTop = terminalPanelRef.current.scrollHeight;
    }
  }, [terminalLines, currentTerminalInput]);

  useEffect(() => {
    let isMounted = true;
    let timerId = null;

    const sleep = (ms) => new Promise((resolve) => {
      timerId = setTimeout(resolve, ms);
    });

    const typeInTerminal = (text) => {
      return new Promise((resolve) => {
        let index = 0;
        const interval = setInterval(() => {
          if (!isMounted) {
            clearInterval(interval);
            resolve();
            return;
          }
          setCurrentTerminalInput((prev) => prev + text[index]);
          index++;
          if (index >= text.length) {
            clearInterval(interval);
            timerId = setTimeout(resolve, 300);
          }
        }, 55);
      });
    };

    const typeInEditor = (code) => {
      return new Promise((resolve) => {
        let index = 0;
        const interval = setInterval(() => {
          if (!isMounted) {
            clearInterval(interval);
            resolve();
            return;
          }
          
          // Type characters in small chunks to make it look active but fast
          const stepSize = code[index] === "\n" ? 1 : Math.floor(Math.random() * 2) + 2;
          const chunk = code.substring(index, index + stepSize);
          setEditorText((prev) => prev + chunk);
          index += stepSize;
          
          if (index >= code.length) {
            clearInterval(interval);
            resolve();
          }
        }, 18);
      });
    };

    const runSequence = async () => {
      // --- PROBLEM 0: solution.cpp (canJump) ---
      if (currentProblemIdx === 0) {
        const problem = PROBLEMS[0];
        setEditorText("");
        setEditorSaving(true);
        await sleep(500);

        await typeInTerminal(problem.commandNvim);
        if (!isMounted) return;
        setTerminalLines((prev) => [...prev, `$ ${problem.commandNvim}`]);
        setCurrentTerminalInput("");
        await sleep(400);

        await typeInEditor(problem.code);
        await sleep(1000);

        setEditorSaving(false);
        await sleep(500);

        await typeInTerminal(problem.commandCompile);
        if (!isMounted) return;
        setTerminalLines((prev) => [...prev, `$ ${problem.commandCompile}`]);
        setCurrentTerminalInput("");
        await sleep(600);

        const lines = problem.result.split("\n");
        setTerminalLines((prev) => [...prev, ...lines]);
        await sleep(4500); // admire success

        setTerminalLines([]);
        setCurrentProblemIdx(1);
      }

      // --- PROBLEM 1: two_sum.cpp (twoSum) ---
      else if (currentProblemIdx === 1) {
        const problem = PROBLEMS[1];
        setEditorText("");
        setEditorSaving(true);
        await sleep(500);

        // nvim two_sum.cpp
        await typeInTerminal(problem.commandNvim);
        if (!isMounted) return;
        setTerminalLines((prev) => [...prev, `$ ${problem.commandNvim}`]);
        setCurrentTerminalInput("");
        await sleep(400);

        // Type code WITH syntax error (missing semicolon on line 12)
        const buggyCode = `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;
        for(int i=0; i<nums.size(); i++) {
            if(mp.count(target - nums[i]))
                return {mp[target - nums[i]], i};
            mp[nums[i]] = i
        }
        return {};
    }
};`;
        await typeInEditor(buggyCode);
        await sleep(800);

        // "Save" the buggy code
        setEditorSaving(false);
        await sleep(400);

        // Compile buggy code
        await typeInTerminal(problem.commandCompile);
        if (!isMounted) return;
        setTerminalLines((prev) => [...prev, `$ ${problem.commandCompile}`]);
        setCurrentTerminalInput("");
        await sleep(600);

        // Output syntax error
        const syntaxError = [
          "two_sum.cpp: In member function 'twoSum':",
          "two_sum.cpp:12:28: error: expected ';' before '}' token",
          "            mp[nums[i]] = i",
          "                           ^",
          "                           ;"
        ];
        setTerminalLines((prev) => [...prev, ...syntaxError]);
        await sleep(3500); // look at the error

        // Open nvim again to fix it
        await typeInTerminal(problem.commandNvim);
        if (!isMounted) return;
        setTerminalLines((prev) => [...prev, `$ ${problem.commandNvim}`]);
        setCurrentTerminalInput("");
        await sleep(400);

        // Visual fix: Animate adding a semicolon at the end of the buggy line
        setEditorSaving(true);
        await sleep(800);
        
        // Type the semicolon character
        setEditorText(buggyCode.replace("mp[nums[i]] = i", "mp[nums[i]] = i;"));
        await sleep(1000);

        setEditorSaving(false);
        await sleep(500);

        // Compile corrected code
        await typeInTerminal(problem.commandCompile);
        if (!isMounted) return;
        setTerminalLines((prev) => [...prev, `$ ${problem.commandCompile}`]);
        setCurrentTerminalInput("");
        await sleep(600);

        // Accepted!
        const lines = problem.result.split("\n");
        setTerminalLines((prev) => [...prev, ...lines]);
        await sleep(4500); // admire success

        setTerminalLines([]);
        setCurrentProblemIdx(2);
      }

      // --- PROBLEM 2: reverse.cpp (reverseList) ---
      else if (currentProblemIdx === 2) {
        const problem = PROBLEMS[2];
        setEditorText("");
        setEditorSaving(true);
        await sleep(500);

        // nvim reverse.cpp
        await typeInTerminal(problem.commandNvim);
        if (!isMounted) return;
        setTerminalLines((prev) => [...prev, `$ ${problem.commandNvim}`]);
        setCurrentTerminalInput("");
        await sleep(400);

        // Type buggy code with infinite loop (forgot curr = next; inside while loop)
        const buggyCode = `#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(NULL) {}
};

class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode *prev = nullptr;
        ListNode *curr = head;
        while(curr) {
            ListNode *next = curr->next;
            curr->next = prev;
            prev = curr;
        }
        return prev;
    }
};`;
        await typeInEditor(buggyCode);
        await sleep(800);

        // Save
        setEditorSaving(false);
        await sleep(400);

        // Compile & run infinite loop
        await typeInTerminal(problem.commandCompile);
        if (!isMounted) return;
        setTerminalLines((prev) => [...prev, `$ ${problem.commandCompile}`]);
        setCurrentTerminalInput("");
        
        // Wait 1.5 seconds simulating execution hang
        await sleep(1500);

        // Print TLE error
        const tleError = [
          "Time Limit Exceeded",
          "Testcases passed: 42/120",
          "Error: Execution timed out after 5.00 seconds"
        ];
        setTerminalLines((prev) => [...prev, ...tleError]);
        await sleep(3500); // look at the error

        // Open nvim to fix it
        await typeInTerminal(problem.commandNvim);
        if (!isMounted) return;
        setTerminalLines((prev) => [...prev, `$ ${problem.commandNvim}`]);
        setCurrentTerminalInput("");
        await sleep(400);

        // Visual fix: Type "curr = next;" line char-by-char inside nvim
        setEditorSaving(true);
        await sleep(1000);
        
        const lineToType = "\n            curr = next;";
        let typedPart = "";
        for (let char of lineToType) {
          if (!isMounted) return;
          typedPart += char;
          setEditorText(buggyCode.replace("prev = curr;", "prev = curr;" + typedPart));
          await sleep(80); // typewriter speed for fix
        }
        await sleep(800);

        setEditorSaving(false);
        await sleep(500);

        // Compile corrected code
        await typeInTerminal(problem.commandCompile);
        if (!isMounted) return;
        setTerminalLines((prev) => [...prev, `$ ${problem.commandCompile}`]);
        setCurrentTerminalInput("");
        await sleep(600);

        // Accepted!
        const lines = problem.result.split("\n");
        setTerminalLines((prev) => [...prev, ...lines]);
        await sleep(4500); // admire success

        setTerminalLines([]);
        setCurrentProblemIdx(0); // restart loop
      }
    };

    runSequence();

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [currentProblemIdx]);

  const renderTerminalLine = (line, idx) => {
    if (line.startsWith("$ ")) {
      return (
        <div key={idx} className="terminal-line-item">
          <span className="term-prompt">jitarth@terminal:~$ </span>
          <span className="term-command">{line.substring(2)}</span>
        </div>
      );
    }
    if (line.includes("Accepted")) {
      return (
        <div key={idx} className="terminal-line-item term-output-accepted">
          {line}
        </div>
      );
    }
    if (line.includes("error:") || line.includes("Time Limit Exceeded") || line.includes("Error:")) {
      return (
        <div key={idx} className="terminal-line-item font-semibold" style={{ color: "#ff5f56" }}>
          {line}
        </div>
      );
    }
    if (line.includes("Runtime:") || line.includes("Memory:") || line.includes("Testcases passed:")) {
      return (
        <div key={idx} className="terminal-line-item term-output-meta">
          {line}
        </div>
      );
    }
    return (
      <div key={idx} className="terminal-line-item text-gray-500">
        {line}
      </div>
    );
  };

  const lines = editorText.split("\n");
  const lineCount = Math.max(16, lines.length); // Adjusted min-height for headers
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="coding-terminal-container">
      <div className="coding-terminal-window-header">
        <div className="window-dots">
          <span className="window-dot red" />
          <span className="window-dot yellow" />
          <span className="window-dot green" />
        </div>
        <div className="window-title">Jitarth@CSE-Terminal</div>
        <div className="leetcode-streak" style={{ marginRight: "4px" }}>
          <span style={{ color: "#ffa116", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
            🔥 365 Days Streak
          </span>
        </div>
      </div>

      <div className="coding-terminal-split">
        {/* Editor panel */}
        <div className="editor-panel">
          <div className="editor-tab-bar">
            <div className="editor-tab">
              <span className="tab-icon-cpp">C++</span>
              <span>{PROBLEMS[currentProblemIdx].filename}</span>
              {editorSaving ? (
                <span className="unsaved-dot" />
              ) : (
                <span className="saved-check">✓</span>
              )}
            </div>
          </div>
          <div className="editor-content-area">
            <div className="line-numbers">
              {lineNumbers.map((num) => (
                <div key={num}>{num}</div>
              ))}
            </div>
            <div className="code-display">
              {lines.map((line, idx) => (
                <div key={idx} style={{ minHeight: "1.5em" }}>
                  {renderCodeText(line)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Terminal panel */}
        <div className="terminal-panel" ref={terminalPanelRef}>
          <div className="terminal-history">
            {terminalLines.map((line, idx) => renderTerminalLine(line, idx))}
          </div>
          <div className="term-input-line">
            {currentTerminalInput || terminalLines.length > 0 || currentTerminalInput === "" ? (
              <>
                <span className="term-prompt">jitarth@terminal:~$ </span>
                <span className="term-command">{currentTerminalInput}</span>
                <span className="term-cursor" />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
