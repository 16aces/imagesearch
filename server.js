var express = require('express');
var router = express.Router();

var app = express();

var mongodb = require('mongodb');
var mongoose = require('mongoose')
var Bing = require('node-bing-api')({ accKey: MONGOLAB_KEY })
//"wrffrQVe5/sl9SM4ULyIUHeOSaIVGoISmHN7cx7j330"
var MongoClient = mongodb.MongoClient;





var url =  process.env.MONGOLAB_URI; 

var url = MONGOLAB_URI
//'mongodb://zakr:jessica1qq@ds041566.mlab.com:41566/zrsearch'
app.listen(process.env.PORT ||'3000',function(){
  console.log("this is working")
})

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
  var input = req.path.substr(30)
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
    /*schema.update(
                    {unique:"unique"},
                    {$push: {"array":{term: terms, when: "now"}} })
*/
   
  schema.findOne({unique:"unique"},function(err, link) {

    if(!link){
   // console.log(URL)
    //URL.count({},function(err,count){console.log(count)})
    
           newvaule = new schema({unique: "unique", array: {term: terms, when: "now"}})
            newvaule.save(function(err){

    if (err) {
        throw new Error(err);
    }})
           

                   
                } else{
                  var search = {term:terms, when:"now"}
                  
                  link.array.unshift({term: terms, when: Date()})
                  
                  console.log(link.array)
                  if(link.array.length>10){
                    link.array.pop();
                  }
                  console.log(link.array)
                  console.log("end line")
                  link.save()
                }


    

  })

 
Bing.images(terms, {
  top: searchcount,
    imageFilters: {
     
    }
  }, function(error, rez, body){
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

});