// Create clients and set shared const values outside of the handler.




/**
 * A simple example includes a HTTP get method to get one item by id from a DynamoDB table.
 */
const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');

const db = require('../dal/db')
const queryHelper = require('../dal/queryhelper')

function HTTPError (statusCode, message) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

exports.getPernByIdHandler = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried 5: ${event.httpMethod}`);
  }

  // All log statements are written to CloudWatch
  console.info('from code pipeline received test for change', event);
  
  // Get id from pathParameters from APIGateway because of `/{id}` at template.yml
  const id = event.pathParameters.id;
  const pern = await db.perns.findByPk(id)
  if (!ticket) throw new HTTPError(404, `Pern with id: ${id} was not found`)
 
  // Get the item from the table
 // get ticket by id
 const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(pern),
  };
 
 
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}

//insert perns and return array of postions
/* user_id: type.STRING,
position_id: type.STRING,
outcome: type.DOUBLE,
commission: type.DOUBLE,
multiplier: type.INTEGER,
parent: type.STRING,
option: type.STRING,
position: type.INTEGER */ 
  exports.insertPernsHandler = async (event) => {
    // All log statements are written to CloudWatch
    
    
    // Get id from pathParameters from APIGateway because of `/{id}` at template.yml
      console.log('starting inserting perns1');
      const perns = JSON.parse(event.body);
      console.log("input received:" + JSON.stringify(perns))

        //refactor to update for new created ones
      var temppositionkey;
      var positionpern={}
      var bulkperns={}
      var positions = {} //  positions tp return
      var position = {} // position Object
      var positionperns={}
      positionperns=[]
      bulkperns=[]
      //var positionkey = 'positions'; //position key
      positions = []; // empty Array, which you can push() values into*/
      //Loop and create perns
        _.forEach(perns, function(value,key){
          temppositionkey=uuidv4()
          position.temp_position_key = temppositionkey //soft relation used for updating later
          //erick initialize this as per business logic
          position.user_id="testuser"
          position.parent_id="1"
          position.position_type="1"      
          position.outcome=0.0  
          position.commission=0.0 
          position.multiplier=0
          position.position=0
          position.valid_to=""
          position.valid_to_month=4
          position.credit=0.0
          position.is_shared=false

          positionpern=JSON.parse(JSON.stringify(value))
          positionpern.temp_position_key=temppositionkey
          positionperns.push(positionpern)
          bulkperns.push(positionpern)
          position.perns=positionperns
          
          positions.push(position)
          position = {}
          positionpern={}
          
      });
      const pern = await db.perns.bulkCreate(bulkperns)
      const updatetickets = await queryHelper.update("UPDATE tickets t JOIN perns p  ON t.temp_perm_key = p.temp_perm_key SET t.pern_id = p.id")

    // Get the item from the table
   // get ticket by id
   const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(positions),
    };
 
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
exports.getPernsHandler = async (event) => {
  //if (event.httpMethod !== 'GET') {
   // throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  //}
  //const { Ticket } = await tickedDal()
  //const tickets = await Ticket.findAll()
  const perns= await queryHelper.executeQuery("Select * From perns")

  
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
  body: JSON.stringify(perns),
};
 
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}



