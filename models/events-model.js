const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            required: true
        },
        coordinates: [Number]
    },
    img: String,
    artist: [{
        type: Schema.Types.ObjectId, ref: 'Artist'
    }]
}, {
    timestamps: true
})

eventSchema.index({location: '2dsphere'})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event