const WATER = 10;
const INTERNET_RENT_CONDOMINIUM = 5;
const ENERGY = 20;

module.exports = {
  expenses: async paidExpenses => {
    let message = null;
    const today = new Date();
    const day = today.getDate();
    const hour = today.getHours();
    const minute = today.getMinutes();

    if (hour === 15 && minute === 00) {

      if (!paidExpenses.water) {
        if (day === WATER - 1) {
          message = 
            "A conta de água vence <b>amanhã!</b>";
        } else if (day === WATER) {
          message =
            "A conta de água vence <b>hoje!</b>";
        }
      }

      if (!paidExpenses.internet && !paidExpenses.rent && !paidExpenses.condominium) {
        if (day === INTERNET_RENT_CONDOMINIUM - 1) {
          message = 
          "As contas de aluguel, condomínio e internet vencem <b>amanhã!</b>";
        } else if (day === INTERNET_RENT_CONDOMINIUM) {
          message = 
          "As contas de aluguel, condomínio e internet vencem <b>hoje!</b>";
        }
      } else if (!paidExpenses.internet && paidExpenses.rent && paidExpenses.condominium) {
        if (day === INTERNET_RENT_CONDOMINIUM - 1) {
          message =
          "A conta de internet vence <b>amanhã!</b>";
        } else if (day === INTERNET_RENT_CONDOMINIUM) {
          message =
          "A conta de internet vence <b>hoje!</b>";
        }
      } else if (paidExpenses.internet && !paidExpenses.rent && !paidExpenses.condominium) {
        if (day === INTERNET_RENT_CONDOMINIUM - 1) {
          message =
          "As contas de aluguel e condomínio vencem <b>amanhã!</b>";
        } else if (day === INTERNET_RENT_CONDOMINIUM) {
          message =
          "As contas de aluguel e condomínio vencem <b>amanhã!</b>";
        }
      }

      if (!paidExpenses.light) {
        if (day === ENERGY - 1) {
          message =
          "A conta de energia vence <b>amanhã!</b>";
        } else if (day === ENERGY) {
          message =
          "A conta de energia vence <b>hoje!</b>";
        }
      }
    }
    return message;
  },
  firstDayOfMonth: () => {
    const today = new Date();
    const day = today.getDate();
    return day === 1 ? true : false;
  }
};