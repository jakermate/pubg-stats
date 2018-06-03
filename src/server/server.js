const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.port || 8080;
const key = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJjOGM1YjNhMC0zZmY4LTAxMzYtNTZkMC0zMTI2NjQzMDhjNzEiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTI2OTk4NjQ5LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6InB1Ymctc3RhdHMtZTczOGUwOGMtMDRhYi00OTNiLWIwMjItNTZhYzA5ZTZhNTcwIiwic2NvcGUiOiJjb21tdW5pdHkiLCJsaW1pdCI6MjV9.N83L9f6o00ERumw9IQqWJvWocBJA_JCYFQJQtQJc5aA";
const url = "https://api.playbattlegrounds.com/shards";
const authorization = "Bearer "+ key;
// Instantiate an array that stores key/value pairs of searched names.  This will be searched to see if the api call for player ID is redundant.
const nameCache= {

}
const matchCache={};
const recent = [];
const request = require('request');


app.listen(port,function(){
  console.log("PUBG Server Running. Listening on port : "+port);
});
// Parsing Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-COntrol-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  next();
})
// Error handling middleware (works on bad requests)
app.use(function(err,req,res,next){
  res.send(500, {status:500, message:'Internal Server Error', type:'Internal'});
})


// Requests
// Check for user ID on server
app.get('/search/:name',function(req,res){

})

//User search comes in with NAME string, will need to add a search for name in cache before quering API, but for now it will pass the name search directly to the api.
app.get('/user/', function(req,res){
    console.log('Get request recieved.');
    const that = this;
    console.log('Recieved request from client.');
    console.log('Name query: '+req.query.name);
    const searchSeason = req.query.season;
    const searchName = req.query.name;
    const searchRegion = req.query.region;
    const response = {};
    const apiNameSearch = url + "/"+searchRegion+"/players?filter[playerNames]="+searchName;
    console.log("Sending request to :"+apiNameSearch);
    // Sets options for get request to PUBG API
    const nameOptions = {
      url: apiNameSearch,
      method:'get',
      headers: {
        'Accept': 'application/json',
        'Authorization': authorization
      }
    }

    // Sends request to API
    request(nameOptions,function(error,response,body){
      // Set returned json object body to variables to be sennt to client as callback to primary get request handler.

      let object = response.body;
      console.log(body);
      if("errors" in JSON.parse(body)){
        console.log("Error from api");
        res.send('ERROR');
      }
      else{
        objectJSON = JSON.parse(object);
        // namecache crashes server on bad search, must make conditional upon found resource on api side, and error handling
        let matchNumber = objectJSON.data[0].relationships.matches.data.length;
        console.log("THERE ARE "+matchNumber+" MATCHES");
        // This will take matches found on name API call and store them in a cache, indexed with the player ID.  The MATCH component will fetch from this cache in componentDidMount
        matchCache[objectJSON.data[0].id] = objectJSON.data[0].relationships.matches.data;
        console.log(matchCache[searchName]);
        nameCache[searchName] = objectJSON.data[0].id;
        console.log(nameCache);
        // dont send until stat/season object is found
        // res.json(object);
        let options = {
          url: url+"/"+searchRegion+"/players/"+nameCache[searchName]+"/seasons/"+searchSeason,
          method:'get',
          headers: {
            'Accept': 'application/json',
            'Authorization': authorization
          }
        }
        // Take player ID and season query and use another request to call for player stats from specific season.
        request(options,function(error,response,body){
          object = response.body;
          console.log(object);
          if (error){
            throw error;
          }
          res.send(object);
        })
      }
    });
})


app.get('/matches/:id',function(req,res){
  let id = req.params.id;
  console.log(matchCache);
  console.log('Fetching Matches with id: '+id);
  let response = matchCache[id];
  console.log(response);
  res.send(response);

})


// Cache Functions
function addNameToCache(name){
  if (name in nameCache){

  }
  else if (!(name in nameCache)){
    nameCache.name = name;
  }

}
