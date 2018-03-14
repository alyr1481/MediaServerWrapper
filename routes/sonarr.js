var express = require("express");
var router  = express.Router({mergeParams: true});
var ejs = require("ejs");


// Render the Landing Page
router.get("/",function(req,res){
  console.log("Re-Directing to Sonarr")
  res.redirect("http://sonarr.alyr.co.uk");
});



module.exports = router;
