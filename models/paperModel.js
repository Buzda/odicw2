  
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a Schema and a Model

const paperSchema = new Schema({
    paper_id: String,
    title: String,
    authors: String,
    publish_time: Date,
    abstract: String,
    doi: String,
    clusters: String,
    related_papers: Array
});

const paperModel = mongoose.model('OpenData', paperSchema);

module.exports = paperModel;