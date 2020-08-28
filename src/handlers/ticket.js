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

exports.getTicketByIdHandler = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried 5: ${event.httpMethod}`);
  }

  // All log statements are written to CloudWatch
  console.info('from code pipeline received test for change', event);
  
  // Get id from pathParameters from APIGateway because of `/{id}` at template.yml
  const ticketid = event.pathParameters.ticketid;

 //const { db1 } = await db()
  
  const ticket = await db.tickets.findByPk(ticketid)
  if (!ticket) throw new HTTPError(404, `Ticket with id: ${ticketid} was not found`)
 
  // Get the item from the table
 // get ticket by id
 const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(ticket),
  };
 
 
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
//This function will return json from input array
//
//"pern_id,user_id,type,action,symbol,value,quantity,price,commission,multiplier,parent,valid_to,agreed,option"
//"5,'user1','A','open','S',3,5,45,1,2,'p1','vlt',3,'option'"
//"5,'user1','A','open','S',3,5,45,1,2,'p1','vlt',3,'option'"
//"5,'user1','A','open','S',3,5,45,1,2,'p1','vlt',3,'option'"
exports.uploadTicketsHandler = async (event) => {
  // All log statements are written to CloudWatch
  
  // Get id from pathParameters from APIGateway because of `/{id}` at template.yml
    console.log('starting upload tickets');
    const csvString = event.body;
    console.log("recived data: "+ csvString)
    var json = [];
    var csvArray = csvString.split("\r\n");
    var csvColumns = csvArray[0].split(",");
    csvArray.shift() //Shift to data rows

    csvArray.forEach(function(csvRowString) {
        
        var csvRow = csvRowString.split(",");
        // Here we work on a single row.
        // Create an object with all of the csvColumns as keys.
        jsonRow = new Object();
        for ( var colNum = 0; colNum < csvRow.length; colNum++) {
            // Remove beginning and ending quotes since stringify will add them.
            var colData =  csvRow[colNum];
            jsonRow[csvColumns[colNum]] = colData;
        }
        json.push(jsonRow);
    });
  // Get the item from the table
 // get ticket by id
 const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(json),
  };
 return response
}
//insert tickets and return array of perns grouped by symbol
/* user_id: type.STRING,
position_id: type.STRING,
outcome: type.DOUBLE,
commission: type.DOUBLE,
multiplier: type.INTEGER,
parent: type.STRING,
option: type.STRING,
position: type.INTEGER */
  exports.insertTicketsHandler = async (event) => {
    // All log statements are written to CloudWatch
    
    
    // Get id from pathParameters from APIGateway because of `/{id}` at template.yml
      console.log('starting inserting tickets');
      const tickets = JSON.parse(event.body);
      console.log("input received:" + JSON.stringify(tickets))

      //const { Ticket } = await tickedDal()
      //Insert tickets
      //const ticket = await Ticket.bulkCreate(tickets)
      var temppernkey;
      const Property = "symbol"; //as per requirment group by
      var perns = {} //  perns to return
      var pern = {} // pern Object to return
      var innerperntickets={}
      var perntickets = {}
      var bulktickets={}
      perntickets=[]
      bulktickets=[]
      perns = [] // empty Array, which you can push() values into
      //Loop and create perns
        _.forEach( _.groupBy(tickets, Property), function(value,key){
        temppernkey=uuidv4()
        pern.temp_perm_key = temppernkey //not generated here
        //erick initialize this as per business logic
        pern.user_id="testuser"
        pern.position_id=null
        pern.outcome=0 //whatever rules you want add here
        pern.commission=0
        pern.multiplier=0
        pern.option="Option"
        pern.position=0
        innerperntickets=JSON.parse(JSON.stringify(value))
        _.forEach(innerperntickets,function(value,key) {
          value.temp_perm_key=temppernkey
          perntickets.push(value)
          bulktickets.push(value)
        })
        pern.tickets=perntickets
        perns.push(pern)        
        pern={}
        pernticket={}
        perntickets={}
        perntickets=[]
      });
      //console.log(JSON.stringify(bulktickets))
      const createdtickets = await db.tickets.bulkCreate(bulktickets)
    
    // Get the item from the table
   // get ticket by id
   const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(perns),
    };
 
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
exports.getTicketsHandler = async (event) => {
  //if (event.httpMethod !== 'GET') {
   // throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  //}
  //const { Ticket } = await tickedDal()
  //const tickets = await Ticket.findAll()
  const tickets= await queryHelper.executeQuery("Select * From tickets")

  
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
  body: JSON.stringify(tickets),
};
 
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}

exports.createTicketsHandler = async (event) => {
  if (event.httpMethod !== 'PUT') {
    throw new Error(`getMethod only accept PUT method, you tried: ${event.httpMethod}`);
  }
  
  const { Ticket } = await tickedDal()
  const ticket = await Ticket.create(JSON.parse(event.body))
  // All log statements are written to CloudWatch
  console.info('received:', event);
  
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
  body: JSON.stringify(tickets),
};
 
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}

exports.updateTicketsHandler = async (event) => {
  if (event.httpMethod !== 'POST') {
    throw new Error(`updateMethod only accept POST method, you tried: ${event.httpMethod}`);
  }
  
  const input = JSON.parse(event.body)
  const { Ticket } = await tickedDal()
  const ticket = await Ticket.findById(event.pathParameters.ticketid)
  if (!ticket) throw new HTTPError(404, `Ticket with id: ${ticketid} was not found`)
  if (input.title) ticket.title = input.title
  if (input.description) ticket.description = input.description
  await ticket.save()
 
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': "OPTIONS,POST,GET,PUT,DELETE,PATCH",
      'Access-Control-Allow-Headers' :'*'
    },
    body: JSON.stringify(tickets),
  };
 
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
