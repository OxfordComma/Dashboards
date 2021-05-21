var express = require('express');
var router = express.Router();


// router.get('/car', function(req, res, next) {
//   res.render('dashboard', {
//     filepath: '/js/CarDashboard.js',
//     style: '/stylesheets/style.css'
//   });
// })

// router.get('/overwatch', function(req, res, next) {
//   res.render('dashboard', {
//   	filepath: '/js/OverwatchDashboard.js', 
//   	style: '/stylesheets/overwatch.css'
//   });
// })

router.get('/porsche', function(req, res, next) {
  res.render('dashboard', {
  	filepath: '/js/ScatterplotPorsches.js', 
  	style: '/stylesheets/porsches.css'
  });
})

module.exports = router;