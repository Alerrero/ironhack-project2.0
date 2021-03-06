const express = require('express')
const router = express.Router()
const TicketmasterAPI = require('../configs/ticketmaster.config')
const Event = require('../models/events.model')

const ticketmasterHandler = new TicketmasterAPI()

const { removeDups, normalizeText } = require('../utils')



// Endpoints
router.get('/', (req, res, next) => {

    let localCities = []

    Event
        .find()
        .then(response => {
            localCities = response.map(elm => elm.city)
            return ticketmasterHandler.getAllVenues()
        })
        .then(response => {
            const venues = response.data._embedded.venues
            const tmCities = venues.map(elm => elm.city.name)
            const cities = removeDups(localCities.concat(tmCities).sort()) //Cities with no dups array
            const normalizedCities = cities.map(elm => normalizeText(elm).toLowerCase()) //Normalized cities array

            const finalCities = cities.map((elm, idx) => { //Array of objects w/ cities and normalizedCities
                const obj = {}
                obj.city = elm
                obj.normCity = normalizedCities[idx]
                return obj
            })

            res.render('index', { finalCities })
        })
        .catch(err => next(new Error(err)))

})
router.post('/', (req, res) => {
    const city = req.body.city
    res.redirect(`/eventos/${city}`)
})

module.exports = router