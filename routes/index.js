var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    //multiparty = require('multiparty'),
    //formidable = require('formidable'),
    userModel = require('../database/database').user;

/* 中间件 */
router.use(function(req,res,next){
  /*记录登录信息*/
  res.locals.user = req.session.user;
  console.log('session');
  console.log(res.locals.user);
  next();
});
/* 首页验证登录 */
router.get('/', function(req, res) {
  /*如未登录，重定向到登录页面*/
  if(!req.session.user){
    return res.redirect('/login');
  }
  res.render('index',{title:'User Center',name:req.session.user.name});
});
/* 登录页 */
router.route('/login')
/*接收网页请求，渲染*/
.get(function(req,res) {
  /*如已登录，重定向到首页*/
  if(req.session.user){
    return res.redirect('/');
  };
  /*渲染页面并显示注册信息*/
  res.render('login', { title: 'LOGIN' , type:'login',success: req.query.login,tips:req.query.name});
})
/*提交登录请求，验证*/
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
        /*重定向到首页*/
        res.redirect('/');
  		}else{
        /*用户不存在或密码错误*/
  			console.log(query.name +' login fail');
  			res.redirect('/login?login=&name='+query.name);
  		}
  	})
  })(query)
});
/* 注册页 */
router.route('/register')
/*接收网页请求，渲染*/
.get(function(req,res){
  if(req.session.user){
    return res.redirect('/');
  };
  res.render('login', { title: 'REGISTER' , type:'register',tips:req.query.name});
})
/*发送注册请求*/
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
/* 退出 */
router.get('/logout',function(req,res){
  req.session.user = null;
  res.redirect('/');
});
/*用户后台*/
router.get('/ucenter',function(req,res){
  /*如未登录，重定向到登录页面*/
  if(!req.session.user){
    return res.redirect('/login');
  }
  res.render('ucenter');
});
/* 接收搜索请求 */
router.post('/search',function(req,res,next){
  res.end(req.body.search);
});
/* 上传文件*/
router.post('/file',function(req,res,next){
  var tempPath = './public/temp/';
  //配置上传路径
  var form = new multiparty.Form({uploadDir: tempPath});
  form.parse(req,function(err,fields,files){
    //创建临时文件保存真实文件信息
    var filesTmp = JSON.stringify(files,null,2);
    if (err){
      return res.end('parse error: '+err);
    }else{
      console.log('parse file: '+filesTmp);
      var inputFile  = files.upfile[0],
          uploadedPath = inputFile.path,
          dstPath = tempPath + inputFile.originalFilename;
      //临时文件重命名为真实文件
      fs.rename(uploadedPath,dstPath,function(err){
        if(err){
          return res.end('rename error: '+err);
        }else{
          return res.end('rename ok');
        }
      })
    }
  })
});

module.exports = router;
