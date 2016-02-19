var express = require('express');
var router = express.Router();
var userModel = require('../database/database').user;

/* Check login */
router.use(function(req,res,next){
  //记录登录信息
  res.locals.user = req.session.user;
  next();
});
/* GET home page. */
router.get('/', function(req, res) {
  var user = req.session.user;
  if(!user){
    return res.redirect('/login');
  }
  res.render('ucenter',{title:'User Center',name:user.name});
});
/* GET login page */
router.route('/login')
.get(function(req,res) {
  if(req.session.user){
    return res.redirect('/');
  };
  res.render('login', { title: 'LOGIN' , type:'login',success: req.query.login,tips:req.query.name});
})
.post(function(req, res) {
  var query = {name: req.body.name,password:req.body.password};
  /*验证用户名和密码*/
  (function(){
  	console.log('login account:');
    console.log(query);
    userModel.findOne(query,function(err,user){
      if(user){
        /*用户存在*/
  			console.log(query.name+' login success');
        req.session.user = user;
        console.log('req.session.user.name=='+req.session.user.name);
        res.redirect('/');
  		}else{
        /*用户不存在或密码错误*/
  			console.log(query.name +' login fail');
  			res.redirect('/login?login=&name='+query.name);
  		}
  	})
  })(query)
});
/* GET register page */
router.route('/register')
.get(function(req,res){
  if(req.session.user){
    return res.redirect('/');
  };
  res.render('login', { title: 'REGISTER' , type:'register',tips:req.query.name});
})
.post(function(req, res) {
  var query = {name: req.body.re_name,password:req.body.re_password};
  (function(){
  	userModel.find({name:query.name},function(err,doc){
  		if(doc.length>0){
  			console.log('username already existed');
  			res.redirect('/register?name='+query.name);
  		}else{
  			var user = new userModel(query);
  			user.save(function(err,doc,numberAffected){
  				if(err) res.send(err.message);
  				var html = '<p>新注册的会员数据为：'+ JSON.stringify(doc) +'</p>';
  				html += '<p>影响的数据量为：'+numberAffected+'</p>';
  				console.log(html);
  				res.redirect('/login?login=true&name='+query.name);
  			});
  		}
  	})
  	
  })(query) 
});
/* GET logout */
router.get('/logout',function(req,res){
  req.session.user = null;
  res.redirect('/');
});
/* GET search page. */
router.post('/search',function(req,res,next){
  res.end(req.body.search);
});
/* GET file*/
router.post('/file',function(req,res,next){
  console.log(req.files);
  res.end('file submit success');
});

module.exports = router;
