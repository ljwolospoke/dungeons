var express = require('express');
var mysql = require("mysql");
var credentials = require("./credentials");
//var qs = require("querystring");
//var flash = require('flash');
var mysql = require('mysql');
var app = express();
var http = require("http");
var fs = require("fs");
//var credentials = require("./credentials");
var qs = require("querystring");
//var mysql = require("mysql");

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
app.get('/users', function(req, res) {
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
<<<<<<< HEAD

app.get('/character', function(req, res) {
  var conn = mysql.createConnection(credentials.connection);
  // connect to database
  conn.connect(function(err) {
    if (err) {
      console.error("ERROR: cannot connect: " + e);
      return;
    }
    // query the database
    conn.query("SELECT * FROM CHARACTERS", function(err, rows, fields) {
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
     sendResponse(req, res, outjson)
     res.render('character', {
       characters: outjson
     });
   });
    conn.end();
  });
});


=======
//session
>>>>>>> 1a10a3a0f7d4122abd3bb51a773aea8a9e44b543
app.use(function(req, res, next){
  res.locals.user = req.session.user;
  next();
});

app.use(function(req, res, next){
  res.locals.character = req.session.character;
  next();
});



app.get('/home', function(req, res) {
  res.render('home');
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
<<<<<<< HEAD
   else {
    //res.redirect(303, "/");
  }
=======
  req.session.user = {
      type: 'success',
      intro: 'Thank you',
      message: 'Submission successful!',
    };

>>>>>>> 1a10a3a0f7d4122abd3bb51a773aea8a9e44b543
});

var COUNTER = 0;
setInterval(function() {
  COUNTER++;
},  5000);

app.get('/login-counter', function(req, res) {
  res.send({
    counter: COUNTER
  });
});

//routes go here
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session') ({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret,
}));

//addUser to database
app.get('/addUser', function(req, res){
res.render('addUser');
console.log('appget');
});

app.get('/headers', function(req, res){
res.set('Content-Type', 'text/plain');
var s = '';
for(var name in req.headers) s += name + ': ' + req.headers[name] + '/n';
res.send(s);
});

//static pages
app.use(express.static(__dirname + '/public'));


//
//app.post('/' function(req, res){
//res.render('sign-ajax');
//});

app.get('/', function(req, res){
  res.render('sign-ajax');
//goes into process  
//req.session.user = {
  //  type: 'success',
   // intro: 'Thank you',
   // message: 'Submission successful!',
  //};

});
//

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

<<<<<<< HEAD
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
    //res.redirect(303, '/');
  }
});


app.use(function(req, res, next){
  res.locals.flash = req.session.flash;
  req.session.flash;
  next();
});
=======
>>>>>>> 1a10a3a0f7d4122abd3bb51a773aea8a9e44b543
//sendResponse data
app.get('/get_json_data', function(req, res ) {
  var data  = {};
  res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
  res.end(JSON.stringify(data));
});

//chRcter
app.get('/characters', function(req, res) {
  var conn = mysql.createConnection(credentials.connection);
  // connect to database
  conn.connect(function(err) {
    if (err) {
      console.error("ERROR: cannot connect: " + e);
      return;
    }
    // query the database
    conn.query("SELECT * FROM CHARACTERS", function(err, rows, fields) {
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
        res.render("characters", {
         characters:outjson
         });
//      sendResponse(req, res, outjson);
    });
    conn.end();
  });
});

<<<<<<< HEAD
//pull characters from the database
//conn.connect(function(err) {
//if (err) {
//console.error("ERROR: cannot connect: " + e);
//return;

=======
>>>>>>> 1a10a3a0f7d4122abd3bb51a773aea8a9e44b543

//addUser
app.post('/add_user', function (req, res) {
    console.log(req.body.name);
    var conn = mysql.createConnection(credentials.connection);
    // connect to database
    conn.connect(function(err) {
      if (err) {
        console.error("ERROR: cannot connect: " + e);
        return;
      }
      // query the database
      conn.query("INSERT INTO USERS (UserName) VALUE (?)", [req.body.name], function(err, rows, fields) {
        // build json result object
	console.log('err');
	console.log(err);
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
        }
        // return json object that contains the result of the query
        sendResponse(req, res, outjson);
      });
      conn.end();
    });
<<<<<<< HEAD
  });
 });
=======
});
>>>>>>> 1a10a3a0f7d4122abd3bb51a773aea8a9e44b543


//styles go here:



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

