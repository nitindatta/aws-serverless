const dbconnection = require('./dbconnection')
const Sequelize = require('sequelize')
const PernModel = require('../models/Pern')
const TicketModel = require('../models/Ticket')
const PositionModel = require('../models/Position')

const db = {};
dbconnection.connectDb()

db.tickets=TicketModel(dbconnection.sequelize, Sequelize)
db.perns = PernModel(dbconnection.sequelize, Sequelize)
db.positions=PositionModel(dbconnection.sequelize, Sequelize)
//Create Relations
db.perns.hasMany(db.tickets,{ foreignKey: 'pern_id', foreignKeyConstraint: true }); //Perns has many tickets
db.positions.hasMany(db.perns,{ foreignKey: 'position_id', foreignKeyConstraint: true }); //Position has many perns

module.exports = db;