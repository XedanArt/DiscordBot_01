import { SYSTEM_PROMPT } from "../config/systemPrompt";
import { Message } from "discord.js";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import { conversationHistory, addToHistory } from "../utils/memory";
import { findRelevantData } from "../utils/data";

dotenv.config();

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY || ""
});

export default {
  name: "ask",
  async execute(message: Message, args: string[]) {
    const question = args.join(" ");

    if (!question) {
      return message.reply("❓ Pose-moi une question : `!ask comment fonctionne un moteur ?`");
    }

    try {
      const relevantData = findRelevantData(question);

      // On construit les messages en contournant le typage du SDK Groq
      const messages: any[] = [
        { role: "system", content: SYSTEM_PROMPT },

        // mémoire conversationnelle
        ...conversationHistory.map(m => ({
          role: m.role,
          content: m.content
        })),

        // fiches internes
        ...relevantData.map(d => ({
          role: "system",
          content: "Information interne :\n" + d
        })),

        { role: "user", content: question }
      ];

      const response = await client.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: messages as any, // ✔ contournement propre
        temperature: 0.7,
        max_tokens: 2048
      });

      const answer = response.choices[0].message.content || "Je n'ai pas réussi à répondre.";

      addToHistory("user", question);
      addToHistory("assistant", answer);

      const chunks = answer.match(/[\s\S]{1,2000}/g) || [];

      for (const chunk of chunks) {
        await message.reply(chunk);
      }

    } catch (err: any) {
      console.error("Erreur Groq :", err);
      message.reply("⚠️ Erreur lors de l'appel à Groq : " + (err?.message || "inconnue"));
    }
  }
};
