import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

export function ask(question: string): Promise<string> {
  return rl.question(question);
}

export function closePrompt(): void {
  rl.close();
}
