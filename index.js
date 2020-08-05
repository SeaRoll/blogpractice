// ---------------------- CONSTANTS ------------------------//
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const convertDate = require(__dirname + '/public/js/convertDate.js');

// ---------------------- EXPRESS APP ------------------------//
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use('/posts', express.static('public'));

app.set("view engine", "ejs");

// ---------------------- MONGOOSE ------------------------//
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

const commentSchema = new mongoose.Schema({
  name: String,
  date: Date,
  content: String
});
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: Date,
  poster: String,
  comment: [commentSchema]
});

const Comment = mongoose.model("Comment", commentSchema);
const Post = mongoose.model("Post", postSchema);



// ---------------------- GET ROUTES ------------------------//
app.get("/", function(req, res) {
  Post.find({}).sort({date: -1}).exec(function(err, foundPosts) {
    res.render("index", {postToIndex: foundPosts, convertingDateToIndex: convertDate});
  });
});
app.get("/blog-single", function(req, res) {
  res.render("blog-single");
});
app.get("/savePost", function(req, res) {
  saveRandomDocument();
  res.redirect("/");
});
app.get("/newComment", function(req, res) {
  postComment("5f2aa41c57a390b796c925b0");
  res.redirect("/");
});

app.get("/posts/:postId", function(req, res) {
  const postId = req.params.postId;

  Post.findOne({_id: postId},  function(err, foundPost) {
    res.render("blog-single", {thePost: foundPost, convertingDateToIndex: convertDate});
  });
});
// ---------------------- POST ROUTES ------------------------//

app.post("/submitComment", function(req, res) {
  console.log(req.body);
  const commentName = req.body.name;
  const commentBody = req.body.content;
  const postId = req.body.postId;

  postComment(postId, commentName, commentBody);

  res.redirect("/posts/" + postId);
});


// ------------------------FUNCTIONS ------------------------//
function postComment(post_id, theName, theContent) {
  const todayDate = new Date();

  const newComment = new Comment({
    name: theName,
    date: todayDate,
    content: theContent
  });

  Post.findOne({_id: post_id},  function(err, foundPost) {
    if(!err) {
      foundPost.comment.push(newComment); //Add item to the list.
      foundPost.save(); // save the data.
      console.log("Saved comment to post");
    }
  });
}

function saveRandomDocument() {
  const todayDate = new Date();

  const newPost = new Post({
    title: "Lorem Ipsum",
    content: "Jack apple is a good type of apple",
    date: todayDate,
    poster: "Yo Han"
  });

  newPost.save(function(err){ // to save 100%
     if (!err){
       console.log("saved!");
     }
  });
}


// ---------------------- App listen to 3000 ------------------------//
app.listen(3000, function() {
  console.log("Server started on server port 3000");
});
