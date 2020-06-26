const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var videoSchema = new Schema({
    _id: false,
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },

});

var subjectSchema = new Schema({
    name: String,
    videos: [videoSchema]
});

var classSchema = new Schema({
    classId: {
        type: String,
        required: true,
        unique: true
    },
    subjects: [subjectSchema]

});

module.exports = mongoose.model('Videos', classSchema);