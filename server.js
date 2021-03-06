var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var request = require('request');
var async = require('async');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.get('/', function(req, res){
  res.render('index');
});


app.get('/search', function(req, res) {
  var data = {};
  var api_key = 'RGAPI-e952c342-2137-4b79-95d0-212498b472d7';
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
          for (var i = json.length - 1; i >= 0; i--) {
            if (json[i].queueType === "RANKED_SOLO_5x5"){
              console.log(json[i]);
              data.tier = json[i].tier;
              data.rank = json[i].rank;
              data.lp = json[i].leaguePoints;
              data.wins = json[i].wins;
              data.losses = json[i].losses;
              data.winrate = ((json[i].wins/(json[i].wins+json[i].losses))*100).toFixed(2); // winrate soloqueu en %
            }
          }
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
        info: data,   // données du joeur recherché
        ddversion: "8.8.1" //version du site ddragon , banque d'images LoL
      });
    });
});



var port = Number(process.env.PORT || 3030);
app.listen(port);