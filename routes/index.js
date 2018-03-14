var express = require("express");
var router  = express.Router({mergeParams: true});
var ejs = require("ejs");


// Render the Landing Page
router.get("/",function(req,res){
  res.render("index/landing");
});



module.exports = router;
