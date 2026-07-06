import fs from "fs";
import path from "path";

const dataDir = path.join(__dirname, "../data");

export const dataBase: Record<string, string> = {};

export function loadDataFiles() {
  const files = fs.readdirSync(dataDir);

  for (const file of files) {
    const fullPath = path.join(dataDir, file);

    if (file.endsWith(".md") || file.endsWith(".txt")) {
      const key = file.replace(/\.(md|txt)$/i, "").toLowerCase();
      const content = fs.readFileSync(fullPath, "utf8");
      dataBase[key] = content;
    }
  }
}

export function findRelevantData(question: string): string[] {
  const results: string[] = [];
  const lower = question.toLowerCase();

  for (const key of Object.keys(dataBase)) {
    if (lower.includes(key)) {
      results.push(dataBase[key]);
    }
  }

  return results;
}
