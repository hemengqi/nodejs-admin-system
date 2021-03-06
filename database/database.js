var express = require('express');
var router =  express.Router();
var mongoose = require('mongoose');
//测试连接数据库
mongoose.connect('mongodb://monkey:Monkey@2016@localhost:27017/chihuo');
var db = mongoose.connection;
db.on('error',function(){
	console.error.bind(console,'connection error:');
	mongoose.open = 'mongoDB not open';
});
db.once('open',function(callback){
	mongoose.open = 'mongoDB opened';
});
var userSchema = new mongoose.Schema({
	name: String,
	password: String,
});
var userModel = mongoose.model('users',userSchema);
router.get('/',function(req,res){
	res.send(mongoose.open);
});
//增
router.get('/insert',function(req,res){
	console.log('insert');
	var user = new userModel({name:'dsfdsf',password: 'dsfdsfdsfsfd'});
	user.save(function(e,product,numberAffected){
		if(e) {
			res.send(e.message);
		}else{
			var html = '<p>新增的数据为：'+ JSON.stringify(product) +'</p>';
			html += '<p>影响的数据量为：'+numberAffected+'</p>';
			res.send(html);
		}
	});
});
//删
router.get('/delete',function(req,res){
	userModel.remove({
		name: 'dsfdsf'
	},function(e){
		if(e) {
			res.send(e.message);
		}else{
			res.send('删除成功');
		}
	})
});
//改
router.get('/update',function(req,res){
	console.log('update');
	userModel.update({
		name: 'dsfdsf'
	},{
		password: '435435435'
	},function(e,raw){
		if(e) {
			res.send(e.message);
		}else{
			var html = '<p>修改的结果为：'+JSON.stringify(raw)+'</p>';
			//html += '<p>影响的数据量为：'+numberAffected+'</p>';
			res.send(html);
		}
	});
});
//查
router.get('/find',function(req,res){
	console.log('find');
	userModel.find({
		name: 'hemengqi'
	},function(e,docs){
		console.log(docs);
		if(e) {
			res.send(e.message);
		}else{
			var html = '<p>查询到的数据为：'+JSON.stringify(docs)+'</p>';
			res.send(html);
		}
	})
});
exports.router = router;
exports.user = userModel;