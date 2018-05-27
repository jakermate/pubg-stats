const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;
const key = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJjOGM1YjNhMC0zZmY4LTAxMzYtNTZkMC0zMTI2NjQzMDhjNzEiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTI2OTk4NjQ5LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6InB1Ymctc3RhdHMtZTczOGUwOGMtMDRhYi00OTNiLWIwMjItNTZhYzA5ZTZhNTcwIiwic2NvcGUiOiJjb21tdW5pdHkiLCJsaW1pdCI6MjV9.N83L9f6o00ERumw9IQqWJvWocBJA_JCYFQJQtQJc5aA";
const url = "https://api.playbattlegrounds.com/shards";
const authorization = "Bearer "+ key;
// const idRequestString = url+"/"+region+"/players/"+id;
// const matchRequestString = url+"/"+region+"/matches/"+matchID;
// const seasonsRequestString = url+"/"+region+"/seasons";
// const playerRequestString = url+"/"+region+"/players/"+id+"/seasons/"+seasonID;
const nameCache= {

}
const request = require('request');


app.listen(port,function(){
  console.log("PUBG Server Running.");
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-COntrol-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  next();
})



// Requests
// Check for user ID on server
app.get('/search/:name',function(req,res){

})

//User search comes in with NAME string, will need to add a search for name in cache before quering API, but for now it will pass the name search directly to the api.
app.get('/user/', function(req,res){
    const that = this;
    console.log('Recieved request from client.');
    console.log('Name query: '+req.query.name);
    let playerName = "";
    let playerID = "";
    let playerMatches = {};
    const searchName = req.query.name;
    const searchRegion = req.query.region;
    const response = {};
    const apiNameSearch = url + "/"+searchRegion+"/players?filter[playerNames]="+searchName;
    console.log("Sending request to :"+apiNameSearch);
    // Sets options for get request to PUBG API
    const options = {
      url: apiNameSearch,
      method:'get',
      headers: {
        'Accept': 'application/json',
        'Authorization': authorization
      }
    }

    // Sends request to API
    request(options,function(error,body){
      // Set returned json object body to variables to be sennt to client as callback to primary get request handler.
      let object = body.body;
      res.json(object);
    });





})

// Cache Functions
function addNameToCache(name){
  if (name in nameCache){

  }
  else if (!(name in nameCache)){
    nameCache.name = name;
  }

}
