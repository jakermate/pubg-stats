const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8081;
const key = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJjOGM1YjNhMC0zZmY4LTAxMzYtNTZkMC0zMTI2NjQzMDhjNzEiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTI2OTk4NjQ5LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6InB1Ymctc3RhdHMtZTczOGUwOGMtMDRhYi00OTNiLWIwMjItNTZhYzA5ZTZhNTcwIiwic2NvcGUiOiJjb21tdW5pdHkiLCJsaW1pdCI6MjV9.N83L9f6o00ERumw9IQqWJvWocBJA_JCYFQJQtQJc5aA";
const url = "https://api.playbattlegrounds.com/shards";
const authorization = "Bearer "+ key;
// Instantiate an array that stores key/value pairs of searched names.  This will be searched to see if the api call for player ID is redundant.
const nameCache= {

}
const matchCache={};
const recent = [];
const request = require('request');
const cache = require('memory-cache');


app.listen(port,function(){
  console.log("PUBG Server Running. Listening on port : "+port);
});
// Parsing Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'/client/public')));

app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  next();
})
// Error handling middleware (works on bad requests)
app.use(function(err,req,res,next){
  res.send(500, {status:500, message:'Internal Server Error', type:'Internal'});
})


// REQUESTS
// Serve homepage on initial connection
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client','build', 'index.html'));
  });

// get recent searches
app.get('/recent/',function(req,res){
  res.send(nameCache);
})

//User search comes in with NAME string, will need to add a search for name in cache before quering API, but for now it will pass the name search directly to the api.
app.get('/user/', function(req,res){
    console.log('Get request recieved.');
    const that = this;
    console.log('Recieved request from client.');
    let getCacheKeys = cache.keys();
    console.log('The cache is holding these keys: '+getCacheKeys);
    console.log('Name query: '+req.query.name);
    const searchSeason = req.query.season;
    const searchName = req.query.name;
    const searchRegion = req.query.region;
    // create new cache key for incoming response
    let reqCacheKey = searchName+searchSeason+searchRegion;
    // list all keys inside cache
    console.log('New cache key created: '+reqCacheKey);
    // check if key is already placed in cache (15 minute timeout)
    let checkCache = cache.get(reqCacheKey);
    // checks if value is cached for the key created from the new get requests.
    // If the value is found (!null), the corresponding value is sent back to the client without contacting the API server.
    if (checkCache != null){
      let response = checkCache;
      console.log(response);
      res.send(response);
    }
    // If the key/value pair is not found in the Cache in the check above, the else statement handles sending the request onto the PUBG api, and receives a new response object.  This object will then be stored with the key reqCacheKey in the cache.
    else{
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
        // Logs entire response containing player name, id, and match relationships
        console.log(body);
        if("errors" in JSON.parse(body)){
          console.log("Error from api");
          let error={'error':true}
          res.send(error);
        }
        else{
          objectJSON = JSON.parse(object);
          // namecache crashes server on bad search, must make conditional upon found resource on api side, and error handling
          let matchNumber = objectJSON.data[0].relationships.matches.data.length;
          console.log("THERE ARE "+matchNumber+" MATCHES");
          // This will take matches found on name API call and store them in a cache, indexed with the player ID.  The MATCH component will fetch from this cache in componentDidMount
          matchCache[objectJSON.data[0].id] = objectJSON.data[0].relationships.matches.data;
          // Logs
          console.log(matchCache[objectJSON.data[0].id]);
          nameCache[searchName] = objectJSON.data[0].id;
          // Logs stored name:id values from recent searches.
          // console.log(nameCache);
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
            // Logs response from API containing specific player:season statistics.
            if (error){
              throw error;
            }
            // make custom response object
            let objectJSON = JSON.parse(object);
            objectJSON['name'] = searchName;
            console.log(objectJSON.name);
            // Store the response object with the key created from the incoming get request string in the cache.  15 minute timeout.
            cache.put(reqCacheKey,objectJSON, 900000);
            console.log('Response added to cache under key: '+reqCacheKey);
            res.send(objectJSON);
          })
        }
      });
    }

})

// Grab all matches from player's season
app.get('/matches/:id',function(req,res){
  let id = req.params.id;
  console.log(matchCache);
  console.log('Fetching Matches with id: '+id);
  let response = matchCache[id];
  console.log(response);
  res.send(response);

})

// Grab telemetry for individual match, by match ID
app.get('/match/:id',function(req,res){
  let id=req.params.id;
  console.log('Searching for data from match with ID: '+ id);
  let options = {
    url: url+"/pc-na/matches/"+id,
    method:'get',
    headers:
    {
      'Accept': 'application/json',
    'Authorization': authorization
    }
  }
  request(options,function(err,response,body){
    console.log('Recieved match telemetry from API.');
    // Set match to body string object
    let match = body;
    // parse body string to JSON
    let bodyJSON = JSON.parse(body);
    // grab event ID from response body object
    let eventsId = bodyJSON.data.relationships.assets.data[0].id;
    console.log(eventsId);
    // Grab path to events json file from array in response object
    let eventsPath = "";
    for (var i = 0; i < bodyJSON.included.length; i++){
      if (bodyJSON.included[i].id == eventsId){
        eventsPath = bodyJSON.included[i].attributes.URL;
      }
    }
    // Log events ID and path together
    console.log("Path to events from match: "+id+" is: "+eventsPath);
    // Now request event object using eventsPath

    // Instead of sending whole match object, build my own object with just the information I need to send.
    // Build an array of match participants. Determine if solo, squad, or duo. Populate teams by team ID.  Order in array by ranking.
    let matchType = bodyJSON.data.attributes.gameMode;
    console.log(matchType);
    let matchShard = bodyJSON.data.attributes.shardId;
    console.log(matchShard);
    let matchMap = bodyJSON.data.attributes.mapName;
    console.log(matchMap);
    let matchLength = bodyJSON.data.attributes.duration;
    console.log("Match lasted: "+(matchLength/60).toFixed(2)+" minutes");
    let matchRoster = bodyJSON.data.relationships.rosters.data;
    // It will show up represented as ROSTER IDs, not as player ID. ROSTERS are team ID. Use these ID to find PARTICIPANT names.
    console.log(matchRoster);
    // Now loop through the INCLUDED array, which contains both ROSTERS and PARTICPANTS, and create an array for each.
    let participants = bodyJSON.included;
    // Create playerList, an array of each individual player in the match.  Each array object has partId, playerId, name, and match stats.
    let playerList = [];
    for (var i = 0; i < participants.length; i++){
      if (participants[i].type == 'participant'){
        playerList.push({
          participantId: participants[i].id,
          name: participants[i].attributes.stats.name,
          playerId: participants[i].attributes.stats.playerId,
          stats: participants[i].attributes.stats
        })
      }
    }
    console.log('playerList is now populated with a list of '+playerList.length+" player's from the match.");
    // Determine teams

    let teamList = [];
    participants.forEach(function(each){
      if (each.type == "roster"){
        teamList.push(each);
      }
    })
    console.log(teamList);
    let newList = {};
    teamList.forEach(function(each){
      newList[each.attributes.stats.teamId] = {};
      newList[each.attributes.stats.teamId].players = each.relationships.participants.data;
      newList[each.attributes.stats.teamId].rank = each.attributes.stats.rank;
    })

    for(var team in newList){
      newList[team].team = [];

    }
    playerList.forEach(function(stats){
      for(var each in newList){
        let playerArray=newList[each].players;
        playerArray.forEach(function(player){
          let id = stats['participantId'];

          if(id == player.id){
            (newList[each].team).push(stats);
          }
        })
    }})
    console.log(newList);
    let matchResponse = {};
    matchResponse.teams = newList;
    matchResponse.stats = {};
    matchResponse.stats.duration = matchLength;
    matchResponse.stats.map = matchMap;
    matchResponse.stats.mode = matchType;
    matchResponse.stats.region = matchShard;

    // End of individual match request (by ID)
    // Now returns an object containing: array of player names and stats, array of player ids in each team roster, team ranks, mapname, game mode, and duration
    res.send(matchResponse);
  })
})

// Grab home page top players, leaderboards, and recent searches data.
app.get('/home/',function(req,res){
  console.log('Bundling recent searches, top players, and leaderboards into an object to send to client.');
})

// Cache Functions
function addNameToCache(name){
  if (name in nameCache){

  }
  else if (!(name in nameCache)){
    nameCache.name = name;
  }

}
