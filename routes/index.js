var express = require('express');
var router = express.Router();
var userModel = require('../database/database').user;

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/
/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'LOGIN' });
});
/* GET ucenter page. */
router.post('/ucenter', function(req, res, next) {
  var query = {name: req.body.name,password:req.body.password};
  console.log(query);
  (function(){
  	userModel.count(query,function(err,doc){
  		if(doc==1){
  			console.log(query.name+'login success');
  			res.render('ucenter', { title: 'User Center',name:query.name });
  		}else{
  			console.log(query.name +'login fail');
  			res.redirect('/login');
  		}
  	})
  })(query)
  
});
/* GET register page. */
router.post('/register', function(req, res, next) {
  var query = {name: req.body.re_name,password:req.body.re_password};
  console.log(query);
  (function(){
  	var user = new userModel(query);
	user.save(function(e,product,numberAffected){
		if(e) res.send(e.message);
		var html = '<p>新注册的会员数据为：'+ JSON.stringify(product) +'</p>';
		html += '<p>影响的数据量为：'+numberAffected+'</p>';
		console.log(html);
		res.redirect('/login');
	});
  })(query)
  
});
module.exports = router;
