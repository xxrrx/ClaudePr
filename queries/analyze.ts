import { query } from "@anthropic-ai/claude-agent-sdk";

async function analyzeProject() {
  const prompt = `
  Analyze this repository and report:
  - duplicate code
  - security issues
  - performance problems
  `;

  for await (const message of query({
    prompt,
    options: {
      allowedTools: ["Read", "Glob", "Grep"],
    },
  })) {
    if ("result" in message) {
      console.log("FINAL RESULT:");
      console.log(message.result);
    }
  }
}

analyzeProject();
