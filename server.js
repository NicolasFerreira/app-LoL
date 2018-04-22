var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var request = require('request');
var async = require('async');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');

app.get('/', function(req, res){
  res.render('index');
});


app.get('/search', function(req, res) {
  var data = {};
  var api_key = 'RGAPI-6d1e59a6-58de-4d44-b66a-8414749bf712';
  var recherche = req.query.summoner.toLowerCase();
  var serveur = 'euw1';
  var URL = 'https://'+ serveur +'.api.riotgames.com/lol/summoner/v3/summoners/by-name/'+ recherche +'?api_key=' + api_key;

  async.waterfall([
    function(callback) {
      request(URL, function(err, response, body) {
        if(!err && response.statusCode == 200) {
          var json = JSON.parse(body);
          console.log(json);
          data.id = json.id;
          data.name = json.name;
          data.level = json.summonerLevel;
          callback(null, data);
        } else {
          console.log(err);
        }
      });
    }
  ],
  function(err, data) {
    if(err) {
      console.log(err);
      return;
    }

    res.render('index', {
      /*title: "coucou",
      body: "hey",*/
      info: data
    });
  });
});







var port = Number(process.env.PORT || 3000);
app.listen(port);