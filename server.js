const bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const mongoUrl = 'mongodb+srv://admin:admin@lab3.jb2ei.mongodb.net/lab3';
const domen = 'http://localhost:3000';
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.json());
app.use('/static', express.static(__dirname + '/public'));

let mongo;

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "КПП",
      version: '2021',
    },
  },
  apis: ["server.js"]
};



MongoClient.connect(mongoUrl, {useUnifiedTopology: true})
.then(function(client) {
  mongo = client.db();
}).catch((error) => console.log(error.message));

app.get('/', function(request, response) {
  response.render('index');
});

app.post('/list', function (request, response){
  if(request.body.name != "" && request.body.price != "" && request.body.description != "" && request.body.key != ""){
    mongo.collection('list').insertOne({
      name: request.body.name,
      price: request.body.price,
      description: request.body.description,
      key: request.body.key,
    }).then(function(arr) {
      response.json(arr.ops);
    });
  }
  else{
    console.log("incorrect");
  }
  
});

app.get('/list', function (request, response){
  mongo
  .collection('list')
  .find()
  .toArray()
  .then(function(arr) {
    response.json(arr);
  });
});
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
console.log(swaggerDocs)
/** 
* @swagger
* /list/:
*   post:
*     description: post new product
*     parameters:
*      - in: body
*        name: body
*        description: post
*        required: true
*     responses:
*       201:
*         description: 
*/
/**
* @swagger
* paths:
*  /list/:
*   get:
*     description: get all list
*     responses:
*       200:
*         description: Success
*/

app.listen(3000, function() {
  console.log('App started on '+ domen);
});
