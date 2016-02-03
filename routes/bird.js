var express = require('express');
var router =  express.Router();
var mongoose = require('mongoose');

router.use(function timeLog(req,res, next){
	console.log('Time:'+new Date(Date.now()).toLocaleString());
	next();
});
router.get('/',function(req, res){
	console.log('bird');
	res.send('Birds home page');
});
router.get('/about',function(req, res){
	res.send('About birds');
});

 module.exports = router;