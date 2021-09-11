var express = require('express');
var router = express.Router();

router.get('/porsche', function(req, res, next) {
  res.render('dashboard', {
  	filepath: '/js/ScatterplotPorsches.js', 
  	style: '/stylesheets/porsches.css'
  });
})

router.get('/craigslist', function(req, res, next) {
  res.render('dashboard', {
    filepath: '/js/ScatterplotCraigslist.js', 
    style: '/stylesheets/porsches.css'
  });
})

router.get('/fbmarketplace', function(req, res, next) {
  res.render('dashboard', {
    filepath: '/js/ScatterplotFacebook.js', 
    style: '/stylesheets/porsches.css'
  });
})
module.exports = router;