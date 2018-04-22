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


  async.waterfall([
    // function qui va permettre de récupérer les infos du joueur a partir de son nom d'invocateur
    function(callback) {
      var URL = 'https://'+ serveur +'.api.riotgames.com/lol/summoner/v3/summoners/by-name/'+ recherche +'?api_key=' + api_key;
      request(URL, function(err, response, body) {
        if(!err && response.statusCode == 200) {
          var json = JSON.parse(body);
          console.log(json);
          data.id = json.id;   // id du joueur
          data.name = json.name;   // nom du joueur
          data.level = json.summonerLevel;  // niveau du joueur
          data.img = json.profileIconId;  //icone du joueur
          callback(null, data);
        } else {
          console.log(err);
        }
      });
    },
    // function qui recupère l'id du joueur pour avoir les stats ranked 
    function(data, callback){
      var URL = 'https://'+ serveur +'.api.riotgames.com/lol/league/v3/positions/by-summoner/'+data.id+'?api_key=' + api_key;
      request(URL, function(err, response, body) {
        if(!err && response.statusCode == 200) {
          var json = JSON.parse(body);
          console.log(json[0]);
          data.tier = json[0].tier;
          data.rank = json[0].rank;
          data.lp = json[0].leaguePoints;
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

      res.render('search', {
        info: data
      });
    });
});




var port = Number(process.env.PORT || 3000);
app.listen(port);