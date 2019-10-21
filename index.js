var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Willkommen bei meiner API!');
  });

app.get('/docs', function (req, res) {

    const storage = './storage/';
    const fs = require('fs');
    const yaml = require('yaml');

    let readFiles = new Promise((res, rej) =>{

        fs.readdir(storage, (err, files) => {
            
            console.log(files);
            
            if(files){
               res(files)
            } else {
                rej(Error(err))
            }
          });
    })
    
    readFiles.then((docs) =>{
        console.log(docs);
        let docData = docs.map((doc) => {
            return new Promise((res, rej) => {

                fs.readFile(storage+doc, 'utf8', (err,data) =>{
                    if(data){
                        res(Object.assign({}, yaml.parseAllDocuments(data)))
                    } else {
                        rej(err)
                    }
                })
            })
        })

        Promise.all(docData).then((finalResult) => {
            res.json(Object.assign({}, finalResult));
        })

    })
  });

app.listen(3000, function () {
console.log('Example app listening on port 3000!');
});