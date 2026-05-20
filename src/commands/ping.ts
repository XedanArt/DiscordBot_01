import { Message } from "discord.js";

export default {
  name: "ping",
  description: "Répond Pong !",

  execute(message: Message) {
    message.reply("Pong !");
  }
};
import { Client, GatewayIntentBits } from "discord.js";
import fs from "fs";
import path from "path";