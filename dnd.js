var express = require('express');
var mysql = require("mysql");
var credentials = require("./credentials");
//var qs = require("querystring");
//var flash = require('flash');
var app = express();
var handlebars = require('express-handlebars')                                 
        .create({ defaultLayout:'main' });                                     
app.engine('handlebars', handlebars.engine);                                  
app.set('view engine', 'handlebars'); 
app.set('port', process.env.PORT || 3000);
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session') ({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret,
}));

app.use(function(req, res, next){
        res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
        next();
});

function sendResponse(req, res, data) {
  res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
  res.end(JSON.stringify(data));
}

app.get('/character-ajax', function(req, res) {
  var conn = mysql.createConnection(credentials.connection);
  // connect to database
  conn.connect(function(err) {
    if (err) {
      console.error("ERROR: cannot connect: " + e);
      return;
    }
    // query the database
    conn.query("SELECT * FROM USERS", function(err, rows, fields) {
      // build json result object
      var outjson = {};
      if (err) {
        // query failed
        outjson.success = false;
        outjson.message = "Query failed: " + err;
      }
      else {
        // query successful
        outjson.success = true;
        outjson.message = "Query successful!";
        outjson.data = rows;
      }
      // return json object that contains the result of the query
     //sendResponse(req, res, outjson) 
     res.render('character-ajax', {
       users: outjson
     });
   });
    conn.end();
  });
});


app.use(function(req, res, next){
  res.locals.user = req.session.user;
  next();
});


app.get('/sign-ajax', function(req, res) {
  res.render('sign-ajax');
});

app.post("/process", function(req, res) {
   console.log(req.query.form);
  console.log(req.body._csrf);
  console.log(req.body.name);
  console.log(req.body.email);
  req.session.user = {
    email: req.body.email
  };
  if (req.xhr || req.accepts("json,html") === "json") {
    res.send({
      success: true,
      message: "Submission successful"
    });
   }
   else {
    res.redirect(303, "/");
  }
});

var METHOD = 0;
function counter(){
 METHOD++;
};


//routes go here
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session') ({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret,
}));

app.get('/headers', function(req, res){
res.set('Content-Type', 'text/plain');
var s = '';
for(var name in req.headers) s += name + ': ' + req.headers[name] + '/n';
res.send(s);
});

//static pages
app.use(express.static(__dirname + '/public'));

app.use(require('body-parser').urlencoded({ extended: true }));


//routes go here
app.get('/', function(req, res) {
  req.session.userName = 'Brandon';
  console.log(req.cookies.website);
  res.cookie('website', 'alert');
  res.render('home');
});

//
app.get('/sign-ajax', function(req, res){
  req.session.flash = {
    type: 'success',
    intro: 'Thank you',
    message: 'Submission successful!',
  };
  return res.redirect(303, '/');
});


app.get('/dice', function(req, res) {
        res.render('dice');
});
	
app.get('/character-ajax', function(req, res){
        res.render('character-ajax', {  csrf: 'CSRF token goes here',   


        exChar: [
               { name: 'Linix', race: 'DragonBorn', class: 'Sorcerer-Wizard', gender: 'male', },
               { name: 'Aoife', race: 'Half-Elf', class: 'Priest', gender: 'Female', },

		],


  });
});

app.post('/process', function(req,res){
  if(req.xhr || req.accepts('json,html')==='json'){
    // if there were an error, we would send {error: 'error description' }
    console.log(JSON.stringify(req.body));
    res.send({
      success: true,
      message: "The Submission Was Successful!"
    });
  } else {
    // if there were an error, we would redirect to an error page
    res.redirect(303, '/');
  }
});

app.use(function(req, res, next){
  res.locals.flash = req.session.flash;
  req.session.flash;
  next();
});


// 404 catch-all handler (middleware)
app.use(function(req, res, next){
        res.status(404);
        res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
        console.error(err.stack);
        res.status(500);
        res.render('500');
});

app.listen(app.get('port'), function(){
console.log('Express started on http://localhost:' +
app.get('port') + '; pressCtrl-C to terminate.');
});

