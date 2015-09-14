var express = require('express');
var fs = require('fs');
var request = require('request');
var $ = require('string');
var s = require("underscore.string");
var cors = require('cors');
var bodyParser = require('body-parser');
var app     = express();

var port = process.env.PORT || 3000;

app.use(cors());


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function(req, res){
    
    url = 'http://boilerpipe-web.appspot.com/extract?url=http://bangla.bdnews24.com/bangladesh/article1012333.bdnews&extractor=ArticleExtractor&output=json&extractImages=';

    request(url, function(error, response, html){
        if(!error){



            var jsonObj = JSON.parse(html);
            var content = jsonObj.response.content.replace(/[-a-z0-9:\.]/ig,'');
            var punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
            var spaceRE = /\s+/g;
            content.replace(punctRE, '').replace(spaceRE, ' ');


            console.log(content.length);

            //res.json(s.words($(content).strip( '_', '-','>','\n').s));
            res.json($(content).lines());
        }
    });
});

app.post('/content',function(req,res){

    var url = req.body.name;

    var fullURL =  "http://boilerpipe-web.appspot.com/extract?url="+url+"&extractor=ArticleExtractor&output=json&extractImages=";

    request(fullURL, function(error, response, html){
        if(!error){

            //console.log(response);
            if(response.headers['content-type'] === "text/html; charset=utf-8"){
                res.status(404).json({ error: 'error' });
                console.log('html');

            }
            else if(response.statusCode !== 200){
                res.status(404).json({ error: 'message' });
                console.log('200');
            }
            else{
                if(response.headers['content-type'] === "application/json; charset=UTF-8"){
                    var jsonObj = JSON.parse(html);
                    var content = jsonObj.response.content;

                    var words = content.replace(/[-a-z0-9:\.]/ig,'');
                    var punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
                    var spaceRE = /\s+/g;
                    words.replace(punctRE, '').replace(spaceRE, ' ');


                    //console.log(content.length);

                    var wordSet = s.words($(words).strip( '_', '-','>','\n').s);
                    //console.log(wordSet);

                    res.status(200).json({'content' : content,'wordSet' : wordSet});
                }

            }


        }else{
            res.status(404).json({ error: 'message' });
            console.log('hiujji');
        }
    });

    //res.json(req.body.name);
});

app.post('/lines',function(req,res){

    var url = req.body.name;

    var fullURL =  "http://boilerpipe-web.appspot.com/extract?url="+url+"&extractor=ArticleExtractor&output=json&extractImages=";

    request(fullURL, function(error, response, html){
        if(!error){

            //console.log(response);
            if(response.headers['content-type'] === "text/html; charset=utf-8"){
                res.status(404).json({ error: 'error' });
                console.log('html');

            }
            else if(response.statusCode !== 200){
                res.status(404).json({ error: 'message' });
                console.log('200');
            }
            else{
                if(response.headers['content-type'] === "application/json; charset=UTF-8"){
                    var jsonObj = JSON.parse(html);
                    var content = jsonObj.response.content.replace(/[-a-z0-9:\.]/ig,'');
                    var punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
                    var spaceRE = /\s+/g;
                    content.replace(punctRE, '').replace(spaceRE, ' ');

                    var lines = $(content).lines()
                    //console.log(wordSet);

                    res.status(200).json({'lines' : lines});
                }

            }


        }else{
            res.status(404).json({ error: 'message' });
        }
    });

    //res.json(req.body.name);
});

app.post('/words',function(req,res){

    var url = req.body.name;

    var fullURL =  "http://boilerpipe-web.appspot.com/extract?url="+url+"&extractor=ArticleExtractor&output=json&extractImages=";

    request(fullURL, function(error, response, html){
        if(!error){

            //console.log(response);
            if(response.headers['content-type'] === "text/html; charset=utf-8"){
                res.status(404).json({ error: 'error' });
                console.log('html');

            }
            else if(response.statusCode !== 200){
                res.status(404).json({ error: 'message' });
                console.log('200');
            }
            else{
                if(response.headers['content-type'] === "application/json; charset=UTF-8"){
                    var jsonObj = JSON.parse(html);
                    var content = jsonObj.response.content;

                    var words = content.replace(/[-a-z0-9:\.]/ig,'');
                    var punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~|]/g;
                    var spaceRE = /\s+/g;
                    words.replace(punctRE, '').replace(spaceRE, ' ');


                    //console.log(content.length);

                    var wordSet = s.words($(words).strip( '_', '-','>','\n').s);
                    //console.log(wordSet);

                    res.status(200).json({'wordSet' : wordSet});
                }

            }


        }else{
            res.status(404).json({ error: 'message' });
        }
    });

    //res.json(req.body.name);
});



app.listen(port,function(){
    console.log('Running on gulp port ' + port);
});
exports = module.exports = app;