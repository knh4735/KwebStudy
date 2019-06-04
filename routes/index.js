var express = require('express');
var router = express.Router();
var controller=require("../controller");
var Pokemon = require("../models/pokemon.js");

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', urlShortened:"" });
});


router.post('/urlShortener', function(req, res, next) {
  controller.urlShortener(req,res);
});*/

router.get('/', function(req, res, next) {
  controller.urlShortener(req,res);
});


router.get('/pokemon/name/:name',function(req,res,next){
  Pokemon.find({name: req.params.name},  function(err, pokemons){
    if(err) return res.status(500).json({error: err});
    if(pokemons.length === 0) return res.status(404).json({error: 'pokemon not found'});
    var response = [];

    for(var i =0; i<pokemons.length;i++){
      response[i] = {};
      response[i].no = pokemons[i].no;
      response[i].name = pokemons[i].name;
      response[i].type = pokemons[i].type;
      response[i].expl = pokemons[i].expl;
    }

    res.json(response);
  })
});

router.get('/pokemon/no/:no',function(req,res,next){
  Pokemon.find({no: req.params.no},  function(err, pokemons){
    if(err) return res.status(500).json({error: err});
    if(pokemons.length === 0) return res.status(404).json({error: 'pokemon not found'});

    var response = [];

    for(var i =0; i<pokemons.length;i++){
      response[i] = {};
      response[i].no = pokemons[i].no;
      response[i].name = pokemons[i].name;
      response[i].type = pokemons[i].type;
      response[i].expl = pokemons[i].expl;
    }

    res.json(response);
  })
});

router.get('/pokemon',function(req,res,next){
  Pokemon.find(function(err, pokemons){
    if(err) return res.status(500).send({error: 'database failure'});

    var response = [];

    for(var i =0; i<pokemons.length;i++){
      response[i] = {};
      response[i].no = pokemons[i].no;
      response[i].name = pokemons[i].name;
      response[i].type = pokemons[i].type;
      response[i].expl = pokemons[i].expl;
    }

    res.json(response);
  })
});

router.put('/pokemon',function(req,res){
  console.log("put");
});


router.delete('/pokemon',function(req,res){
  console.log("delete");
});

router.get('/asdf',function(req,res){
  console.log("?");
});

/*
router.post('/pokemon',function(req,res,next){
  var fs = require('fs');
  var path = require("path");
  var pokedex;
  var filepath = path.join(__dirname, 'pokedex.json');

  Pokemon.remove({}, function(err, output){
   // if(err) return res.status(500).json({ error: "database failure" });


   // res.status(204).end();
  });

  fs.readFile(filepath, 'utf8', function(error, data) {
    if (error) console.log(error);
    pokedex = JSON.parse(data);

    for (var i = 1; i < pokedex.length; i++) {
      var poke = new Pokemon();
      poke.no = pokedex[i].no;
      poke.name = pokedex[i].name;
      poke.type = pokedex[i].type;
      poke.expl = pokedex[i].expl;

      poke.save(function (err) {
        if (err) {
          console.error(err);
          res.json({result: 0});
          return;
        }
        res.json({result: 1});
      });
    }
  });

});
*/

module.exports = router;


/*
router.get('/pokemon/name/:name',function(req,res,next) {

  //검색한 이름의 포켓몬 정보를 json 형태로 반환
  //{'no' : '도감 번호', 'name' : '이름', 'type' : '타입, 'expl' : '설명'}

});

router.get('/pokemon/no/:no',function(req,res,next) {

   //검색한 번호의 포켓몬 정보를 json 형태로 반환
   //{'no' : '도감 번호', 'name' : '이름', 'type' : '타입, 'expl' : '설명'}

});

router.get('/pokemon',function(req,res,next) {

  //도감에 저장된 모든 포켓몬의 정보를 json 형태로 반환
  //[{'no' : '도감 번호', 'name' : ' 이름', 'type' : '타입, 'expl' : '설명'},
  //...]
});
*/


