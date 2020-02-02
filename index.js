const TelegramBot = require('node-telegram-bot-api');
const { BOT_TOKEN, PL_CHAT, LIBIA_ID, PARDAL_ID, PL_SPLT } = require('./config');
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

splitwise = {
  from: null,
  to: null,
  amount: null,
  description: null,
  group_id: null,
  creation_method: null,
}

let payer = '';

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
    let message = ''
    if (msg.chat.id === 329960397 || msg.chat.id === 280701057) {
      bot.sendMessage(
        msg.chat.id,
        "Oi, eu sou o pai do Libia.\nPara saber onde eu fui comprar meu cigarro, mande o comando /help",
      );
    } else {
      message = "Oi, estranho. Eu eu sou o pai do Libia e, apesar de ter saído pra comprar cigarro e esquecido o caminho de volta, infelizmente só posso ajudar ele. Mas não fique triste! Se quiser, chama ele para conversar sobre mim => @gstvds";
      bot.sendMessage(
        msg.chat.id,
        message,
      );
      message = `Parece que alguém tentou usar o bot! ${msg.chat.username}`;
      bot.sendMessage(
        280701057,
        message,
      );
    }
  });

  bot.onText(/\/help/, msg => {
    if (msg.chat.id === 329960397 || msg.chat.id === 280701057) {
      bot.sendMessage(
        msg.chat.id,
        "/start - Apresentação\n/help - Comandos do bot\n/contas - Data de vencimento de cada conta\n/pago - Marca uma conta como paga\n/splitwise - Saldo no Splitwise\n/pagar &lt;nome&gt; &lt;valor&gt; - Pagamento de uma conta no Splitwise\n\nTambém volto com o cigarro um dia antes das contas vencerem.",
        { parse_mode: "HTML" }
      );
    } else {
      message = "Oi, estranho. Eu eu sou o pai do Libia e, apesar de ter saído pra comprar cigarro e esquecido o caminho de volta, infelizmente só posso ajudar ele. Mas não fique triste! Se quiser, chama ele para conversar sobre mim => @gstvds";
      bot.sendMessage(
        msg.chat.id,
        message,
      );
      message = `Parece que alguém tentou usar o bot! ${msg.chat.username}`;
      bot.sendMessage(
        280701057,
        message,
      );
    }
  });

  bot.onText(/\/splitwise/, async msg => {
    if (msg.chat.id === 329960397 || msg.chat.id === 280701057) {
      let swBalance = await balance.showBalance();
      bot.sendMessage(
        msg.chat.id,
        swBalance,
        { parse_mode: "HTML" }
      );
    } else {
      message = "Oi, estranho. Eu eu sou o pai do Libia e, apesar de ter saído pra comprar cigarro e esquecido o caminho de volta, infelizmente só posso ajudar ele. Mas não fique triste! Se quiser, chama ele para conversar sobre mim => @gstvds";
      bot.sendMessage(
        msg.chat.id,
        message,
      );
      message = `Parece que alguém tentou usar o bot! ${msg.chat.username}`;
      bot.sendMessage(
        280701057,
        message,
      );
    }
  });

  bot.onText(/\/pago/, msg => {
    if (msg.chat.id === 329960397 || msg.chat.id === 280701057) {
      bot.sendMessage(
        msg.chat.id,
        "Escolha qual conta foi paga.", {
        reply_markup: {
          keyboard: [["Água", "Internet"], ["Energia", "Condomínio"], ["Aluguel"]]
        }
      }
      );
    } else {
      message = "Oi, estranho. Eu eu sou o pai do Libia e, apesar de ter saído pra comprar cigarro e esquecido o caminho de volta, infelizmente só posso ajudar ele. Mas não fique triste! Se quiser, chama ele para conversar sobre mim => @gstvds";
      bot.sendMessage(
        msg.chat.id,
        message,
      );
      message = `Parece que alguém tentou usar o bot! ${msg.chat.username}`;
      bot.sendMessage(
        280701057,
        message,
      );
    }
  });

  bot.onText(/\/pagar(.*)/, async (msg, match) => {
    if (msg.chat.id === 329960397 || msg.chat.id === 280701057) {
      let message = '';
      if (match[1] === '') {
        message = "Para pagar, selecione o valor. Para isso, digite /pagar &lt;valor&gt;";
      } else {
        if (msg.text.indexOf("Libia") !== -1) {
          splitwise.from = LIBIA_ID;
          splitwise.to = PARDAL_ID;
        } else if (msg.text.indexOf("Pardal") !== -1) {
          splitwise.from = PARDAL_ID;
          splitwise.to = LIBIA_ID;
        }
        const textArray = msg.text.split(' ');
        splitwise.amount = textArray[2];
        splitwise.description = textArray[3];
        splitwise.group_id = PL_SPLT;
        splitwise.creation_method = "split";
        // TODO: Verificar como fazer para dividir a conta igualmente
        let message = await balance.createDebt(splitwise);
        
        bot.sendMessage(msg.chat.id, message, { parse_mode: "HTML" });
      }
    } else {
      message = "Oi, estranho. Eu eu sou o pai do Libia e, apesar de ter saído pra comprar cigarro e esquecido o caminho de volta, infelizmente só posso ajudar ele. Mas não fique triste! Se quiser, chama ele para conversar sobre mim => @gstvds";
      bot.sendMessage(
        msg.chat.id,
        message,
      );
      message = `Parece que alguém tentou usar o bot! ${msg.chat.username}`;
      bot.sendMessage(
        280701057,
        message,
      );
    }
  }
  )

  bot.on("message", msg => {
    if (msg.chat.id === 329960397 || msg.chat.id === 280701057) {
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
    } else {
      if (msg.text.indexOf("Água") === 0 || msg.text.indexOf("Internet") === 0 || msg.text.indexOf("Energia") === 0 || msg.text.indexOf("Condomínio") === 0 || msg.text.indexOf("Aluguel") === 0) {
        bot.sendMessage(msg.chat.id, "Hmm, espertinho. Infelizente você não pode fazer isso")
        bot.sendMessage(280701057, `Alguém tentou alterar uma conta ${msg.from.id}`);
      }
    }
  });

  bot.onText(/\/contas/, msg => {
    if (msg.chat.id === 329960397 || msg.chat.id === 280701057) {
      const dueDate =
        "<b>Dia 05:</b>\n Aluguel, Condomínio, Internet\n\n<b>Dia 10:</b>\n Água\n\n<b>Dia 20:  </b>\n Energia";
      bot.sendMessage(
        msg.chat.id,
        dueDate,
        { parse_mode: "HTML" }
      )
    } else {
      message = "Oi, estranho. Eu eu sou o pai do Libia e, apesar de ter saído pra comprar cigarro e esquecido o caminho de volta, infelizmente só posso ajudar ele. Mas não fique triste! Se quiser, chama ele para conversar sobre mim => @gstvds"
      bot.sendMessage(
        msg.chat.id,
        message,
      );
      message = `Parece que alguém tentou usar o bot! ${msg.chat.username}`
      bot.sendMessage(
        280701057,
        message,
      );
    }
  })
});
