import { Message, User, GuildMember } from "discord.js";

export default {
  name: "userinfo",
  execute(message: Message, args: string[]) {
    const target: User = message.mentions.users.first() || message.author;
    const member: GuildMember | null = message.guild?.members.cache.get(target.id) || null;

    const createdAt = target.createdAt.toLocaleDateString("fr-FR");
    const joinedAt = member?.joinedAt
      ? member.joinedAt.toLocaleDateString("fr-FR")
      : "Inconnu";

    const roles = member
      ? member.roles.cache
          .filter(r => r.id !== message.guild?.id)
          .map(r => r.name)
          .join(", ") || "Aucun rôle"
      : "Aucun rôle";

    message.reply(
      `👤 **Informations sur ${target.username}**\n\n` +
      ` **ID :** ${target.id}\n` +
      ` **Compte créé le :** ${createdAt}\n` +
      ` **A rejoint le serveur le :** ${joinedAt}\n` +
      ` **Rôles :** ${roles}\n` +
      ` **Avatar :** ${target.displayAvatarURL({ size: 1024 })}`
    );
  }
};
