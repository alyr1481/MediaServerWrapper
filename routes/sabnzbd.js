var express = require("express");
var router  = express.Router({mergeParams: true});
var ejs = require("ejs");


// Render the Landing Page
router.get("/",function(req,res){
  console.log("Re-Directing to SABnzbd")
  res.redirect("http://sabnzbd.alyr.co.uk");
});



module.exports = router;
