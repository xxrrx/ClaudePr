import { query } from "@anthropic-ai/claude-agent-sdk";

const prompt = `
Review the latest git changes and look for bugs.
`;

async function run() {
  for await (const message of query({
    prompt,
    options: {
      allowedTools: ["Read", "Glob", "Grep", "Bash"],
    },
  })) {
    if ("result" in message) {
      console.log(message.result);
    }
  }
}

run();
