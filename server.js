var express = require('express');
var router = express.Router();

var app = express();

var mongodb = require('mongodb');
var mongoose = require('mongoose')
var Bing = require('node-bing-api')({ accKey: process.env.MONGOLAB_KEY })

var MongoClient = mongodb.MongoClient;





var url =  process.env.MONGOLAB_URI; 



app.listen( process.env.PORT || 3000)

 var db=mongoose.connect(url, function (err, db) {
      //console.log("test")
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);}});
var schema = mongoose.Schema({unique: String , array:[ {term: Array,when:String}]});
  var schema = db.model('urls',schema)
 /*
router.post('/login', passport.authenticate('login', {
  successReturnToOrRedirect : '/home',
  failureRedirect           : '/',
  failureFlash              : true  
}));*/
 app.get('/favicon.ico', function(req, res) {
    res.send(200);
})

app.get('/*', function(req, res) { 
  var input = req.path.substr(1)
  searchcount=(req.query.offset||10);
  if (searchcount>10){
    searchcount=10
  }
  terms=[]
  if(input===""){
    schema.findOne({unique:"unique"},function(err, link) {
      res.send(link.array)
    })
  } else{
    terms=input.split('%20')}
    schema.update(
                    {unique:"unique"},
                    {$push: {"array":{term: terms, when: "now"}} })

   
  schema.findOne({unique:"unique"},function(err, link) {
    //make database if non-existst
    if(!link){
    
           newvaule = new schema({unique: "unique", array: {term: terms, when: "now"}})
            newvaule.save(function(err){

    if (err) {
        throw new Error(err);
    }})
           

                   
                } else{
                  //if there is a database add last search and remove the oldest if there are more than 10
                  var search = {term:terms, when:"now"}
                  
                  link.array.unshift({term: terms, when: Date()})
                  
                  
                  if(link.array.length>10){
                    link.array.pop();
                  }
                  
                  link.save()
                }


    

 

 
Bing.images(terms, {
  top: searchcount,
    imageFilters: {
     
    }
  }, function(error, response, body){
    console.log(body)
     if (body.d && body.d.results) {

      var  items=body.d.results;
      var results=[];
         for (var i = 0; i < items.length; i++) {
                                var dataItem = items[i];
                                results.push({
                                        url:dataItem.MediaUrl,
                                        snippet: dataItem.Title,
                                        thumbnail: dataItem.Thumbnail.MediaUrl,
                                        context:dataItem.SourceUrl,
                                        
                                        
                                    
                                });
                            }
   // console.log( results)
    res.send(results);
  }
  
  }
 );

 })

});