const { Telegraf } = require("telegraf");
const TOKEN = "7991856875:AAFjlFoJsxyPizfQVlZWkXP5JflFHJ2Pzlc";
const bot = new Telegraf(TOKEN);

const web_link = "https://charming-frangollo-05f7b0.netlify.app/";

bot.start((ctx) =>
  ctx.reply("Selamat datang di toko Riski", {
    reply_markup: {
      keyboard: [[{ text: "WEB APP", web_app: { url: web_link } }]],
    },
  })
);

bot.launch();
