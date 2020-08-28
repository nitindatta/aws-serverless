// Create clients and set shared const values outside of the handler.




/**
 * A simple example includes a HTTP get method to get one item by id from a DynamoDB table.
 */
const _ = require('lodash');
const db = require('../dal/db')
const queryHelper = require('../dal/queryhelper')

function HTTPError (statusCode, message) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

exports.getPositionByIdHandler = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried 5: ${event.httpMethod}`);
  }

  // All log statements are written to CloudWatch
  console.info('from code pipeline received test for change', event);
  
  // Get id from pathParameters from APIGateway because of `/{id}` at template.yml
  const id = event.pathParameters.id;
 
  const position = await db.positions.findByPk(id)
  if (!position) throw new HTTPError(404, `Position with id: ${id} was not found`)
 
  // Get the item from the table
 // get ticket by id
 const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(position),
  };
 
 
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}

//insert postions and return ok
/*       user_id: type.STRING,
      parent_id: type.INT,
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
      is_shared: type.BOOLEAN, */
  exports.insertPositionHandler = async (event) => {
    // All log statements are written to CloudWatch
    
    
    // Get id from pathParameters from APIGateway because of `/{id}` at template.yml
      console.log('starting inserting position');
      const positions = JSON.parse(event.body);
      console.log("input received:" + JSON.stringify(positions))
      //Insert new positions
      const postion = await db.positions.bulkCreate(positions)//.then(
      //Update Perns with new postions
      const updatePerns = await queryHelper.update("UPDATE perns p JOIN positions ps  ON p.temp_position_key = ps.temp_position_key SET p.position_id = ps.id")

      const allpositions= await db.positions.findAll({
        include: [
          {
            model: db.perns
          }
        ]
      })
      console.log(allpositions) 

    // Get the item from the table
   // get ticket by id
   const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(allpositions),
    };
 
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
exports.getPositionsHandler = async (event) => {
  //if (event.httpMethod !== 'GET') {
   // throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  //}
  //const { Ticket } = await tickedDal()
  //const tickets = await Ticket.findAll()
  const positions= await queryHelper.executeQuery("Select * From positions")

  
  //const tickets = await 
  // All log statements are written to CloudWatch
  console.info('received new event:', event);
  
  // Get id from pathParameters from APIGateway because of `/{id}` at template.yml
  //const ticketid = event.pathParameters.ticketid;
 
  // Get the item from the table
 // get ticket by id
 
 const response = {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': "OPTIONS,POST,GET,PUT,DELETE,PATCH",
    'Access-Control-Allow-Headers' :'*'
  },
  body: JSON.stringify(positions),
};
 
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}



