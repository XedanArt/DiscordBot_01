import { Message } from "discord.js";

export default {
  name: "level",
  execute(message: Message, args: string[], xpData: any) {
    const userId = message.author.id;

    if (!xpData[userId]) {
      xpData[userId] = { xp: 0, level: 0 };
    }

    const { xp, level } = xpData[userId];

    message.reply(
      ` **${message.author.username}**, tu es niveau **${level}** avec **${xp} XP**.`
    );
  }
};
