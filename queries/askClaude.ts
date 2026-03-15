import { query } from "@anthropic-ai/claude-agent-sdk";

const prompt = "Explain what this project does";

async function run() {
  for await (const message of query({ prompt })) {
    if ("result" in message) {
      console.log(message.result);
    }
  }
}

run();
