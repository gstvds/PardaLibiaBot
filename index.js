const TelegramBot = require('node-telegram-bot-api');
const { BOT_TOKEN, PL_CHAT } = require('./config');
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const notifications = require('./notifications');
const balance = require('./balance');

const express = require('express');
const app = express();
const host = "0.0.0.0";
const port = process.env.PORT || 3000;

paidExpenses = {
  water: false,
  internet: false,
  light: false,
  rent: false,
  condominium: false,
}

app.listen(port, host, function () {
  if (PL_CHAT) {
    let notifyGroup = null;
    setInterval(async () => {
      notifyGroup = await notifications.expenses(paidExpenses);
      notifyGroup
        ? bot.sendMessage(PL_CHAT, notifyGroup, { parse_mode: "HTML" })
        : false;
    }, 60000);

    setInterval(() => {
      let resetMonth = notifications.firstDayOfMonth();
      if (resetMonth) {
        paidExpenses = {
          water: false,
          internet: false,
          light: false,
          rent: false,
          condominium: false,
        };
        console.log("Expenses set to unpaid");
      }
    }, 60000 * 24);
  }

  bot.onText(/\/start/, msg => {
    bot.sendMessage(
      msg.chat.id,
      "Oi, eu sou o pai do Libia.\nPara saber onde eu fui comprar meu cigarro, mande o comando /help"
    );
  });

  bot.onText(/\/help/, msg => {
    bot.sendMessage(
      msg.chat.id,
      "/start - Apresentação\n/help - Comandos do bot\n/contas - Data de vencimento de cada conta\n/pago - Marca uma conta como paga\n/splitwise - Saldo no Splitwise\n\nTambém volto com o cigarro um dia antes das contas vencerem."
    );
  });

  bot.onText(/\/splitwise/, async msg => {
    let swBalance = await balance.showBalance();
    bot.sendMessage(
      msg.chat.id,
      swBalance,
      { parse_mode: "HTML" }
    );
  });

  bot.onText(/\/pago/, msg => {
    bot.sendMessage(
      msg.chat.id,
      "Escolha qual conta foi paga.", {
      reply_markup: {
        keyboard: [["Água", "Internet"], ["Energia", "Condomínio"], ["Aluguel"]]
      }
    }
    );
  });

  bot.on("message", msg => {
    if (msg.text.indexOf("Água") === 0) {
      paidExpenses.water = true;
      const message =
        "Conta de <b>água</b> paga! \nA notificação para esse mês foi desativada.";
      bot.sendMessage(
        msg.chat.id,
        message,
        { parse_mode: "HTML" }
      );
    }

    if (msg.text.indexOf("Internet") === 0) {
      paidExpenses.internet = true;
      const message =
        "Conta de <b>internet</b> paga! \nA notificação para esse mês foi desativada.";
      bot.sendMessage(
        msg.chat.id,
        message,
        { parse_mode: "HTML" }
      );
    }

    if (msg.text.indexOf("Energia") === 0) {
      paidExpenses.energy = true;
      const message =
        "Conta de <b>energia</b> paga! \nA notificação para esse mês foi desativada.";
      bot.sendMessage(
        msg.chat.id,
        message,
        { parse_mode: "HTML" }
      );
    }

    if (msg.text.indexOf("Condomínio") === 0) {
      paidExpenses.condominium = true;
      const message =
        "Conta de <b>condomínio</b> paga! \nA notificação para esse mês foi desativada.";
      bot.sendMessage(
        msg.chat.id,
        message,
        { parse_mode: "HTML" }
      );
    }

    if (msg.text.indexOf("Aluguel") === 0) {
      paidExpenses.rent = true;
      const message =
        "Conta de <b>aluguel</b> paga! \nA notificação para esse mês foi desativada.";
      bot.sendMessage(
        msg.chat.id,
        message,
        { parse_mode: "HTML" }
      );
    }
  });

  bot.onText(/\/contas/, msg => {
    const dueDate = 
      "<b>Dia 05:</b>\n Aluguel, Condomínio, Internet\n\n<b>Dia 10:</b>\n Água\n\n<b>Dia 20:  </b>\n Energia";
    bot.sendMessage(
      msg.chat.id,
      dueDate,
      { parse_mode: "HTML" }
    )
  })
});
