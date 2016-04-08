var router = require('express').Router();
router.get('/demo1',function(req,res){
	res.render('angular_demo1',{title:'angular demo 1'});
})
module.exports = router;