var http = require('http');
var url = require('url');
var mysql = require('mysql');


console.log('\n---===CHESS SERVER STARTED===---\n');

SQLConnected = false;

initialGameState = ["cb","hb","bb","qb","kb","bb","hb","cb","p1b","p1b","p1b","p1b","p1b","p1b","p1b","p1b","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","p1w","p1w","p1w","p1w","p1w","p1w","p1w","p1w","cw","hw","bw","qw","kw","bw","hw","cw"];

//set up sql server
var sqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chess"
});

//check sql connection
sqlConnection.connect(function(err) {
  if (err) throw err;
  console.log("SQL SERVER CONNECTED");
  SQLConnected = true;
});

//set up server to listen for calls.
http.createServer(function (httpRequest, httpResponse) {
  var inputText = url.parse(httpRequest.url, true).query;
  var gameKey = inputText.gameKey;
  if(httpRequest.method == 'POST'){
    console.log("POST: " + gameKey);
    var POSTbody = '';
    httpRequest.on('data', function (data) {
      POSTbody += data;
    });
    httpRequest.on('end', function () {
      var color = JSON.stringify(JSON.parse(POSTbody).color);
      var game_state = JSON.stringify(JSON.parse(POSTbody).board);
      var loser = JSON.stringify(JSON.parse(POSTbody).loser);
      httpResponse.writeHead(200,{'Content-Type':'text/html',"Access-Control-Allow-Origin":"*"});
      sqlConnection.query("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE '" + gameKey + "\'", function (err, resultFromQuery) {
      if (err) throw err;//if game not new.
        sqlConnection.query("SELECT * FROM "+gameKey+" ORDER  BY turn DESC LIMIT  1", function (err, resultFromQuery) {
          if (err) throw err;
          if(resultFromQuery[0].color == JSON.parse(color)){
            console.log("DUPLICATE TURN ERROR: " + gameKey);
            httpResponse.write("UPDATE FAILED: DUPLICATE COLOR MOVE");
            httpResponse.end();
          }
          else{
            sqlConnection.query("INSERT INTO "+gameKey+" (game_state,color,loser) VALUES (\'" + game_state + "\',"+color+","+loser+")", function (err, resultFromQuery) {
              if (err) throw err;
              console.log("GAMESTATE UPDATE SUCCESS: "+ gameKey)
              httpResponse.write("UPDATE SUCCESSFUL");
              httpResponse.end();
            });
          }
        });
      });
    });
  }
  else{
    console.log("GET: " + gameKey);
    sqlConnection.query("SELECT * FROM "+gameKey+" ORDER  BY turn DESC LIMIT  1", function (err, resultFromQuery) {
      if (err){ //no game yet, make one.
        httpResponse.writeHead(200,{'Content-Type':'text/html',"Access-Control-Allow-Origin":"*"});
        sqlConnection.query("CREATE TABLE "+gameKey+" (game_state text,turn int not null auto_increment,color text,loser text,primary key (turn))", function (err, resultFromQuery) {
          if (err) throw err;
          sqlConnection.query("INSERT INTO "+gameKey+" (game_state,color,loser) VALUES (\'" + JSON.stringify(initialGameState) + "\',\"b\",\"\")", function (err, resultFromQuery) {
            if (err) throw err;
            console.log("NEWGAME SUCCESS: "+gameKey)
            httpResponse.write(JSON.stringify(initialGameState));
            httpResponse.end("w"+gameKey);
          });
        });
      }
      else{
        httpResponse.writeHead(200,{'Content-Type':'text/html',"Access-Control-Allow-Origin":"*"});
        if(resultFromQuery[0].loser){
          console.log("GAMEOVER: "+gameKey);
          httpResponse.write(resultFromQuery[0].loser);
        }
        else{
          httpResponse.write(resultFromQuery[0].game_state+resultFromQuery[0].color);
        }
        httpResponse.end();
      }
    });
  }
}).listen(8080);
