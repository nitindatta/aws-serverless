module.exports = (sequelize, type) => {
    return sequelize.define('ticket', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      pern_id: type.INTEGER,
      user_id: type.STRING,
      transaction_date: type.DATE,
      type: type.STRING,
      action: {
        type: type.STRING,
        validate: {
          isIn: [['open', 'close','pending']]
        }
      },
      symbol: type.STRING,
      value: type.DOUBLE,
      quantity: type.INTEGER,
      price: type.DOUBLE,
      commission: type.DOUBLE,
      multiplier: type.INTEGER,
      parent: type.STRING,
      valid_to: type.STRING,
      agreed: type.DOUBLE,
      option: type.STRING,
      temp_perm_key: {
        type: type.UUID,
        allowNull: false
      }
    })
  }