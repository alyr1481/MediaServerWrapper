require('dotenv').config();

var compression = require('compression'),
    express = require("express"),
    app = express(),
    minifyHTML = require('express-minify-html'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    expressSanitizer = require("express-sanitizer"),
    flash = require("connect-flash"),
    passport = require('passport'),
    LocalStratergy = require('passport-local'),
    methodOverride = require('method-override'),
    User = require("./models/users"),
    session = require('express-session');


var indexRoutes = require('./routes/index'),
    radarrRoutes = require('./routes/radarr'),
    sonarrRoutes = require('./routes/sonarr'),
    sabRoutes = require('./routes/sabnzbd'),
    plexRoutes = require('./routes/plex'),
    embyRoutes = require('./routes/emby');


// Mongoose Settings
// mongoose.Promise = global.Promise;
// if (process.env.LOCAL_OR_REMOTE==1){
//  mongoose.connect(process.env.MONGO_LOCAL);
//  console.log("Connection to MongoDB is Live!");
// } else{
//   mongoose.connect(process.env.MONGO_REMOTE);
//   console.log("Connection to MongoDB is Live!");
// }

// Express Settings
app.use(compression());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
app.use(flash());
app.use(minifyHTML({
    override:      false,
    exception_url: true,
    htmlMinifier: {
        removeComments:            true,
        collapseWhitespace:        true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes:     true,
        removeEmptyAttributes:     true,
        minifyJS:                  true
    }
}));
var cacheTime = 86400000;     // 1 day
app.use(express.static(__dirname + '/public',{ maxAge: cacheTime }));

// Passport Config
app.locals.moment = require('moment');
app.use(session({
  secret: 'hfdjfbklashdjfh5ojhr387478394hyudfh3hr3',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  //res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.headers = req.headers;
  next();
});

// Routes
app.use('/', indexRoutes);
app.use('/radarr', radarrRoutes);
app.use('/sabnzbd', sabRoutes);
app.use('/sonarr', sonarrRoutes);
app.use('/emby', embyRoutes);
app.use('/plex', plexRoutes);


if (process.env.LOCAL_OR_REMOTE==1){
  app.listen(3000,function(){
    console.log("LOCAL SERVER HAS STARTED!");
  });
} else{
  app.listen(process.env.PORT, process.env.IP,function(){
    console.log("REMOTE SERVER HAS STARTED!");
  });
}
