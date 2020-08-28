module.exports = (sequelize, type) => {
    return sequelize.define('pern', {
        id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },      
      user_id: type.STRING,
      position_id: type.INTEGER,
      outcome: type.DOUBLE,
      commission: type.DOUBLE,
      multiplier: type.INTEGER,
      parent: type.STRING,
      option: type.STRING,
      position: type.INTEGER,
      temp_perm_key: {
        type: type.UUID,
        allowNull: false,
        unique: true
      },
      temp_position_key: {
        type: type.UUID,
        allowNull: false
      }
    })
  }