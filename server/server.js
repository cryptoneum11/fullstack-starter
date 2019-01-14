const express = require('express');
const server = express();
const port = process.env.PORT || 8080; // can be any port, most commonly port 80, 8080, or 3000
const eol = require('os').EOL; // uses OS generalized 'End-Of-Line' character
const fs = require('fs'); // require NodeJS filesystem package

// MongoDB connection credentials
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://crypto:crypto@cluster0-9dxfg.mongodb.net/db1?retryWrites=true'; // my test mongodb cluster
const db_name = 'db1'; // name of our example collection

// Our server will use the /dist directory for static assets (html,css,js)
server.use(express.static(__dirname + '/dist'));

// Initial connect to MongoDB function
// By normalizing the connection function, we are able to re-use the Mongo connection details per request at each route
function connect(res, cb){
  MongoClient.connect(uri, {useNewUrlParser:true}, (err,client)=>{
    if(err)
      return;
    console.log('connected...');
    const db = client.db(db_name);
    cb( db, client );
  });
}
// We use the connect() function to start the connection and initiate other async functions down the line
// Express routes pass in a 'req' and 'res' object to the callback
// e.g. -- server.get('/some-route-here', (req,res)=>{}
// through the 'res' param, we can send back data via res.send(), we should keep a reference to 'res' throughout the callback chain
// Here, we pass 'res' into the connect() function
server.get('/some-route-here/:myvar' /* <-- get a passed in variable by explicitly stating in the route */, (req,res)=>{
  // we can get variables passed into the route by..
  let myvar = req.params.myvar;
  //console.log( JSON.parse(myvar) );
  // the above is the best way to get multiple variables via an AJAX request.
  connect( res, (db, client)=>{
    // we have a reference to 'res', and references to 'db' and 'client' via the callback in the connect() funciton definition
    // do some things with the data... below is an example that grabs all of our database.collection data
    db.collection('col1').find({}).toArray( (err,data)=>{
      console.log('useful log message here..'); // <-- logs server-side
      console.log('logging database data:');
      console.log( data );
      res.send(`res.send() is able to send back the data directly to our webpage (if using single variables appended.. if AJAX, results will show in web console), also, your var was "${myvar}"`); // <-- logs client-side
      client.close();
    });
  });
});

server.get('/another-route', (req,res)=>{
  // some code here that does other useful server-side things
});

// Finally, we launch the server with the listen() function
server.listen(port, ()=>{
  console.log(`server.js listening on port ${port}`);
});
