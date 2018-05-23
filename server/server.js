const express = require('express');

const app = express();
const port = 8080;
const key = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJjOGM1YjNhMC0zZmY4LTAxMzYtNTZkMC0zMTI2NjQzMDhjNzEiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTI2OTk4NjQ5LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6InB1Ymctc3RhdHMtZTczOGUwOGMtMDRhYi00OTNiLWIwMjItNTZhYzA5ZTZhNTcwIiwic2NvcGUiOiJjb21tdW5pdHkiLCJsaW1pdCI6MjV9.N83L9f6o00ERumw9IQqWJvWocBJA_JCYFQJQtQJc5aA";
const url = "https://api.playbattlegrounds.com/shards";
const authorization = "Bearer "+ key;


app.listen(port,function(){
  console.log("PUBG Server Running.");
});
