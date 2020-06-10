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

// connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/OpenData');

io.on('connection', (socket) => {

    // this is triggered when the user requests papers on topic and clicks the main button
    socket.on('searchTopic', (message, callback) => {
        console.log('looking for papers with Topic&Tag: ',message.chosenTopic,message.chasenTag);
        
        var numberOfPapersToShow = 10;  // we return 10 papers at a time
        var toSkip = (message.numberOfPapersStream-1)*numberOfPapersToShow;  // to specify which papers stream we are at, i.e. 10-20, 20-30 etc
        
        // the request includes the topic and the tag to featch data
        paperModel.find({$and:[{clusters:message.chosenTopic}, {tags:{ "$regex": `${message.chasenTag}`, "$options": "i" }}]}).sort({publish_time:'desc'}).skip(toSkip).limit(numberOfPapersToShow).then((doc)=>{
            console.log(doc);
            callback(doc);
        },(e)=>{
            console.log(e)
        });
      });

      // this is triggered when related paper was chosen, here we search by title
      socket.on('findPaperByTitle', (message, callback) => {
        console.log('looking for paper with title: ',message.title);

        paperModel.find({title:message.title}).then((doc)=>{
            // console.log(doc);
            callback(doc);
        },(e)=>{
            console.log(e)
        });
      });

      // this is to find the total number of maching papers and triggered when the user requests papers on topic and clicks the main button
      socket.on('numberOfPapersForTopic', (message, callback) => {
        console.log('looking for number of papers with Topic: ',message.chosenTopic);

        paperModel.countDocuments({$and:[{clusters:message.chosenTopic}, {tags:{ "$regex": `${message.chasenTag}`, "$options": "i" }}]}).then((numberOfPapers)=>{
            console.log(numberOfPapers);
            callback(numberOfPapers);
        },(e)=>{
            console.log(e)
        });
      });

    socket.on('disconnect', () => {
    });
});

// listen to the port
server.listen(port, () => {
    console.log(`started on port ${port}`);
});

// featch a paper by its id, just for testing
// paperModel.find({paper_id:"d72ac6be48b1932844be27f8cd5a3b91d9010165"}).then((doc)=>{
//     console.log(doc, 'this has no publish date');
//     callback(doc);
// },(e)=>{
//     console.log(e)
// });

// count total number of papers in the DB
// paperModel.countDocuments({}).then((err,c)=>{
//     console.log(c,err);
//   },(e)=>{
//       console.log(e)
//   });

// drop the whole collection, this is used mostly after cloud deployment.
// mongoose.connection.collections.opendatas.drop(function() {
//     console.log("collection dropped")
// });

// .......................... Save myData.json to MongoDB ........................
// jsonfile.readFile('myData.json', function (err, obj) {
  
//     obj.forEach(function(paper){

//         var puublish_time = paper.publish_time;
//         // some dates are either empty or set to a future data which is wrong, so set all of them to
//         // be 1111-11-11 and deal with it separately in the fronend
//         if(paper.publish_time == "" || paper.publish_time == "2020-12-31"){
//             puublish_time="1111-11-11";
//         }

//         // model 
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

