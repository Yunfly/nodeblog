var express = require('express');
var router = express.Router();
var mongo = require("mongodb");
var db = require('monk')('localhost/nodeblog');

router.get('/add', function(req, res, next) {
	var categories = db.get('categories');

	categories.find({}, {}, function(err, categories) {
		res.render('addpost', {
			"title": "Add Post",
			"categories": categories
		});
	});
});

router.post('/add', function(req, res, next) {
	var title = req.body.title;
	var category = req.body.category;
	var body = req.body.body;
	var author = req.body.author;
	var date = new Date();

	if(req.file.mainimage){
        var mainImageOriginalName   = req.file.mainimage.originalname;
        var mainImageName           = req.file.mainimage.name;
        var mainImageMime           = req.file.mainimage.mimetype;
        var mainImagePath           = req.file.mainimage.path;
        var mainImageExt            = req.file.mainimage.extension;
        var mainImageSize           = req.file.mainimage.size;
    } else{
        var mainImageName = 'noimage.png';
    }

	// Form Validation
	req.checkBody('title', "Title field is require").notEmpty();
	req.checkBody('body', "Body field is require").notEmpty();

	// Check Errors
	var errors = req.validationErrors();

	if (errors) {
		res.render('addpost', {
			"errors": errors,
			"title": title,
			"body": body
		});
	} else {
		var posts = db.get('posts');

		// Submit it to DB
		posts.insert({
			"title": title,
			"body": body,
			"category": category,
			"date": date,
			"author": author,
			"mainimage": mainImageName
		}, function(err, post) {
			if (err) {
				res.send('There is an issue submitting the post');
			} else {
				req.flash('success', "Post Submitted");
				req.location('/');
				req.redirect("/");
			}
		});
	}
});

module.exports = router;