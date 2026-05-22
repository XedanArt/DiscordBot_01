import { SYSTEM_PROMPT } from "../config/systemPrompt";
import { Message } from "discord.js";
import dotenv from "dotenv";
import Groq from "groq-sdk";


dotenv.config();

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export default {
  name: "ask",
  async execute(message: Message, args: string[]) {
    const question = args.join(" ");

    if (!question) {
      return message.reply("❓ Pose-moi une question : `!ask comment fonctionne un moteur ?`");
    }

    try {
      const response = await client.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question }
        ]
      });

      const answer = response.choices[0].message.content || "Je n'ai pas réussi à répondre.";

      // Découpage en blocs de 2000 caractères
      const chunks = answer.match(/[\s\S]{1,2000}/g) || [];

for (const chunk of chunks) {
  await message.reply(chunk);
}


    } catch (err) {
      console.error("Erreur Groq :", err);
      message.reply("⚠️ Erreur lors de l'appel à Groq.");
    }
  }
};
