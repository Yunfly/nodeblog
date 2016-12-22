var express = require('express');
var router = express.Router();
var mongo = require("mongodb");
var db = require('monk')('localhost/nodeblog');

router.get('/show/:category',function(req,res,next){
	var db = req.db;
	var posts = db.get('posts');
	posts.find({category: req.params.category},{},function(err,posts){
		res.render('index',{
		  	"title":req.params.category,
		  	"posts":posts
		  });
	});
});


/* Homepage Blog Posts */
router.get('/add', function(req, res, next) {
  res.render('addcategory',{
  	"title":"Add Category"
  });
});


router.post('/add',function(req,res,next){
	// 获取表单数据
	var title = req.body.title;

	// 表单验证
	req.checkBody('title','Title filed is required').notEmpty();

	// 排错
	var errors = req.validationErrors();
	if (errors) {
		res.render('addcategory',{
			"errors":errors,
			"title":title
		})
	} else {
		// 如果没有错误，将表单数据存入数据库
		var categories = db.get('categories');

		// 提交到数据库
		categories.insert({
			"title":title
		},function(err,category){
			if (err) {
				res.send('上传分类时出现错误！');
			} else {
				req.flash('success',"分类已经上传");
				res.location("/");
				res.redirect("/");
			}
		});
	}
});
module.exports = router;
