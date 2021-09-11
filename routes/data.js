var express = require('express');
var router = express.Router();

var mongoDownloader = require('../js/dl/mongoDownloader.js')
mongoDownloader.connectToMongo()
// console.log(client)

//all
router.get('/cars/porsche/all', async function(req, res, next) {
	var data = await mongoDownloader.getMongoData('rennlist', 'listings', {})
	res.json(data)
})

router.get('/cars/porsche/all/normalized', async function(req, res, next) {
	var new_data = await mongoDownloader.getMongoData('rennlist', 'listings_normalized', {
		// _generation: '997',
	})
	var old_data = await mongoDownloader.getMongoData('rennlist', 'old_listings_normalized', {
	})
	res.json(old_data.concat(new_data))
})

//new
router.get('/cars/porsche/new', async function(req, res, next) {
	var data = await mongoDownloader.getMongoData('rennlist', 'listings', {
		// _generation: '997',
	})
	res.json(data)
})

router.get('/cars/porsche/new/normalized', async function(req, res, next) {
	var data = await mongoDownloader.getMongoData('rennlist', 'listings_normalized', {
		// _generation: '997',
	})
	res.json(data)
})


//old
router.get('/cars/porsche/old', async function(req, res, next) {
	var data = await mongoDownloader.getMongoData('rennlist', 'old_listings', {
		_generation: '997',
	})
	res.json(data)
})

router.get('/cars/porsche/old/normalized', async function(req, res, next) {
	var data = await mongoDownloader.getMongoData('rennlist', 'old_listings_normalized', {
		_generation: '997',
	})
	res.json(data)
})


// router.get('/cars/porsche/predicted', async function(req, res, next) {
// 	var data = await mongoDownloader.getMongoData('rennlist', 'listings_normalized', {
// 		// _submodel: 'Carrera S',
// 		_generation: '997',
// 	})
// 	data = mongoDownloader.applyMLModel(await mongoDownloader.getMLModel(), data)
// 	res.json(data)
// })

// router.get('/cars/porsche/model', async function(req, res, next) {
// 	var data = await mongoDownloader.getMongoData('cl_cars', 'porsche_linear_model', {})
// 	res.json(data)
// })

router.get('/cars/craigslist/normalized', async function(req, res, next) {
	var data = await mongoDownloader.getMongoData('craigslist', 'cars_normalized', {})
	res.json(data)
})

router.get('/cars/fbmarketplace/normalized', async function(req, res, next) {
	var data = await mongoDownloader.getMongoData('fbmarketplace', 'cars_normalized', {})
	res.json(data)
})

router.get('/overwatch', async function(req, res) {
	var team = req.query.team
	console.log(team)
	var data = await mongoDownloader.getMongoData('overwatch', 'overwatchleague_2020', {
		'team_name': team
	})
	res.json(data)
})


module.exports = router;
