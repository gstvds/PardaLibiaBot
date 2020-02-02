const Splitwise = require('splitwise');
const {
  PL_SPLT,
  LIBIA_ID,
  PARDAL_ID,
  consumerKey,
  consumerSecret,
  accessToken,
} = require('./config');

module.exports = {
  showBalance: async () => {
    const sw = Splitwise({
      consumerKey,
      consumerSecret,
      accessToken
    });

    const group = await sw.getGroup({ id: PL_SPLT });
    let balance = '';

    group.members.map(member => {
      const amount = parseFloat(member.balance[0].amount);
      let value = null;

      if (amount < 0) {
        value = `<b>deve</b> ${Math.abs(amount).toFixed(2)}`;
      } else {
        value = `<b>receberá</b> ${Math.abs(amount).toFixed(2)}`;
      }
      
      if (member.id === parseInt(LIBIA_ID)) {
        balance = balance.concat(`Libia ${value} reais. \n\n`);
      } else if (member.id === parseInt(PARDAL_ID)) {
        balance = balance.concat(`Pardal ${value} reais. \n\n`);
      }
    });
    return balance;
  },

  mostNegative: async () => {
    const sw = Splitwise({
      consumerKey,
      consumerSecret,
      accessToken,
    });

    const group = await sw.getGroup({ id: PL_SPLT });
    let balance = 1000;
    let user = null;

    group.members.map(member => {
      const amount = parseFloat(member.balance[0].amount);
      if (amount < balance) {
        balance = amount;
        switch (member.id) {
          case parseInt(LIBIA_ID):
            user = "@gstvds";
            break;
          case parseInt(PARDAL_ID):
            user = "@pardal";
            break;
          default:
            break;
        }
      }
    });
    return `Maior saldo devedor: ${user} (deve ${Math.abs(balance).toFixed(2)} reais)`;
  },

  /**
   * @deprecated Not working
   */
  // createDebt: async splitwise => {
  //   const sw = Splitwise({
  //     consumerKey,
  //     consumerSecret,
  //     accessToken,
  //   })

  //   let data = ''

  //   const response = await sw.createDebt({
  //     from: splitwise.from,
  //     to: splitwise.to,
  //     cost: splitwise.cost,
  //     description: splitwise.description,
  //     group_id: splitwise.group_id,
  //     users: [
  //       {
  //         user_id: splitwise.users[0].user_id,
  //         paid_share: splitwise.users[0].paid_share,
  //         owed_share: splitwise.users[0].owed_share,
  //       },
  //       {
  //         user_id: splitwise.users[1].user_id,
  //         paid_share: splitwise.users[1].paid_share,
  //         owed_share: splitwise.users[1].owed_share,
  //       },
  //     ]
  //   })

  //   data = `Retorno ${JSON.stringify(response)}`
  //   return data
  // }
};