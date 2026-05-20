import { Message } from "discord.js";

export default {
  name: "rank",
  execute(message: Message, args: string[], xpData: any) {
    const target = message.mentions.users.first() || message.author;
    const userId = target.id;

    if (!xpData[userId]) {
      xpData[userId] = { xp: 0, level: 0 };
    }

    // Transformer xpData en tableau trié
    const sorted = Object.entries(xpData)
      .sort((a: any, b: any) => b[1].xp - a[1].xp);

    // Trouver la position du joueur
    const rank = sorted.findIndex((entry: any) => entry[0] === userId) + 1;

    const { xp, level } = xpData[userId];

    message.reply(
      `🏆 **Rank de ${target.username}**\n` +
      ` Niveau : **${level}**\n` +
      ` XP : **${xp}**\n` +
      ` Position : **#${rank}** sur ${sorted.length} joueurs`
    );
  }
};
