const mongoose = require('mongoose');
const paperModel = require('../models/paperModel');
const jsonfile = require('jsonfile')
const fs = require('fs')

const path = require('path');
const http = require('http');
const express = require('express');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();

const socketIO = require('socket.io');

var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

// ES6 Promises
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/OpenData');

io.on('connection', (socket) => {

    socket.on('searchTopic', (message, callback) => {
        // console.log('looking for papers in: ',message.chosenTopic);
        var numberOfPapersToShow = 10;
        var toSkip = (message.numberOfPapersStream-1)*numberOfPapersToShow;
        console.log(message.chasenTag,"chasenTag")
       
        paperModel.find( {$and:[{clusters:message.chosenTopic},{tags:message.chasenTag}]}).sort({publish_time:'desc'}).skip(toSkip).limit(numberOfPapersToShow).then((doc)=>{
            console.log(doc);
            callback(doc);
        },(e)=>{
            console.log(e)
        });
      });

      socket.on('findPaperById', (message, callback) => {
        console.log('looking for paper with title: ',message.title);

        paperModel.find({title:message.title}).then((doc)=>{
            // console.log(doc);
            callback(doc);
        },(e)=>{
            console.log(e)
        });
      });

      socket.on('numberOfPapersForTopic', (message, callback) => {
        console.log('looking for number of papers with Topic: ',message.chosenTopic);

        paperModel.countDocuments({$and:[{clusters:message.chosenTopic},{tags:message.chasenTag}]}).then((numberOfPapers)=>{
            console.log(numberOfPapers);
            callback(numberOfPapers);
        },(e)=>{
            console.log(e)
        });
      });

    socket.on('disconnect', () => {
    });
});


server.listen(port, () => {
console.log(`started on port ${port}`);
});

paperModel.find({paper_id:"d72ac6be48b1932844be27f8cd5a3b91d9010165"}).then((doc)=>{
    console.log(doc, 'this has no publish date');
    callback(doc);
},(e)=>{
    console.log(e)
});

paperModel.countDocuments({}).then((err,c)=>{
    console.log(c,err);
  },(e)=>{
      console.log(e)
  });

mongoose.connection.collections.opendatas.drop(function() {
    console.log("collection dropped")
});


// jsonfile.readFile('myData.json', function (err, obj) {
  
//     obj.forEach(function(paper){

//         // console.log(paper.title)
//         var puublish_time = paper.publish_time;
//         if(paper.publish_time == "" || paper.publish_time == "2020-12-31"){
//             puublish_time="1111-11-11";
//         }

//         const pM = new paperModel({
//             paper_id: paper.paper_id,
//             title: paper.title,
//             authors: paper.authors,
//             publish_time: puublish_time,
//             abstract: paper.abstract,
//             doi : paper.doi,
//             clusters: paper.clusters,
//             related_papers: paper.related,
//             tags: paper.tags
//         });
            
//             pM.save().then((doc)=>{
//                 console.log(doc);
//               },(e)=>{
//                   console.log(e)
//               });
//     })
// })


// 32329
// 32324
// d72ac6be48b1932844be27f8cd5a3b91d9010165
// publish time not null in db