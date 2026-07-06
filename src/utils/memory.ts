export const conversationHistory: { role: "user" | "assistant" | "system"; content: string }[] = [];

export function addToHistory(role: "user" | "assistant", content: string) {
  conversationHistory.push({ role, content });

  // limite à 100 messages pour éviter les débordements
  if (conversationHistory.length > 100) {
    conversationHistory.shift();
  }
}
