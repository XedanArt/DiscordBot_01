import {
  Client,
  GatewayIntentBits,
  Message,
  TextChannel,
  ThreadChannel,
  DMChannel
} from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { loadDataFiles } from "./utils/data";

dotenv.config();

// XP system
const xpFile = path.join(__dirname, "xp.json");

let xpData: any = fs.existsSync(xpFile)
  ? JSON.parse(fs.readFileSync(xpFile, "utf8"))
  : {};

function saveXP() {
  fs.writeFileSync(xpFile, JSON.stringify(xpData, null, 2));
}

function getLevelFromXP(xp: number) {
  return Math.floor(0.1 * Math.sqrt(xp));
}

// Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Command loader
const commands = new Map<string, any>();
const commandsPath = path.join(__dirname, "commands");

function loadCommands(dir: string) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      loadCommands(fullPath);
    } else if (file.endsWith(".ts") || file.endsWith(".js")) {
      const command = require(fullPath).default;
      commands.set(command.name, command);
    }
  }
}

loadCommands(commandsPath);

// ✔ Charger les fiches internes
loadDataFiles();

client.once("clientReady", () => {
  console.log(`Bot connecté en tant que ${client.user?.tag}`);
});

client.on("messageCreate", (message: Message) => {
  if (message.author.bot) return;

  const userId = message.author.id;

  if (!xpData[userId]) {
    xpData[userId] = { xp: 0, level: 0 };
  }

  xpData[userId].xp += 10;

  const newLevel = getLevelFromXP(xpData[userId].xp);

  if (newLevel > xpData[userId].level) {
    xpData[userId].level = newLevel;

    const channel = message.channel;

    if (
      channel instanceof TextChannel ||
      channel instanceof ThreadChannel ||
      channel instanceof DMChannel
    ) {
      channel.send(
        `🎉 **${message.author.username}** vient de passer niveau **${newLevel}** !`
      );
    }
  }

  saveXP();

  if (!message.content.startsWith("!")) return;

  const args = message.content.slice(1).trim().split(" ");
  const commandName = args.shift()?.toLowerCase();

  if (!commandName) return;

  const command = commands.get(commandName);
  if (command) {
    command.execute(message, args, xpData);
  }
});

client.login(process.env.DISCORD_TOKEN);
