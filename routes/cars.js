var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.redirect('/cars/porsche')
})

router.get('/porsche', function(req, res, next) {
	res.render('porsches')
});

// router.get('/porsche/:id', function(req, res, next) {
// 	var id = req.params.id
// 	console.log(req.params.id)
// 	res.render('porsche_by_id', {carId: id} )
// });

module.exports = router;
