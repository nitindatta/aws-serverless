module.exports = (sequelize, type) => {
    return sequelize.define('position', {
        id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },      
      user_id: type.STRING,
      parent_id: type.INTEGER,
      position_type: type.STRING,
      parent: type.STRING,
      position_id: type.STRING,
      outcome: type.DOUBLE,
      commission: type.DOUBLE,
      position: type.INTEGER,
      multiplier: type.INTEGER,      
      valid_to: type.STRING,
      valid_to_month: type.INTEGER,
      credit: type.DOUBLE,
      is_shared: type.BOOLEAN,
      temp_position_key: {
        type: type.UUID,
        allowNull: false,
        unique: true
      }
    })
  }

  