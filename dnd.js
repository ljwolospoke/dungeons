var express = require('express');
var credentials = require('./credentials.js');
//var flash = require('flash');
var app = express();
var handlebars = require('express-handlebars')                                 
        .create({ defaultLayout:'main' });                                     
app.engine('handlebars', handlebars.engine);                                  
app.set('view engine', 'handlebars'); 
app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next){
        res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
        next();
});

app.get('/sign-ajax', function(req, res) {
  res.render('sign-ajax', {
  login: req.session.user_id?req.session.user_id:false,
  user_name:req.session.user_first_name,
  });
});

app.post("/process", function(req, res) {
  req.session.flash = "Form received successfully";
  console.log(req.query.form);
  console.log(req.body._csrf);
  console.log(req.body.name);
  console.log(req.body.email);
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

app.use(function(req, res, next){
	res.locals.flash = req.session.flash;
next();
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

app.get('/headers', function(req, res){
res.set('Content-Type', 'text/plain');
var s = '';
for(var name in req.headers) s += name + ': ' + req.headers[name] + '/n';
res.send(s);
});

//static pages
app.use(express.static(__dirname + '/public'));

//routes go here
app.get('/', function(req, res) {
  req.session.userName = 'Brandon';
  console.log(req.cookies.website);
  res.cookie('website', 'alert');
  res.render('home');
});

app.get('/sign', function(req, res){
  res.render('sign', { csrf: 'CSRF token goes here' });
});

app.get('/logout', function(req, res){
  res.render('logout')
});

app.get('/sign-ajax', function(req, res){
  res.render('sign-ajax', { csrf: 'CSRF token goes here' });
});

if(req.xhr) return res.json({ success: true });
  req.session.flash = {
    type: 'success',
    intro: 'Thank you',
    message: 'Submission successful!',
  };
    return res.redirect(303, '/');
  });
});

app.get('/about', function(req, res){
        res.render('about');
});

app.get('/character', function(req, res) {
        res.render('character');
});

app.get('/dice', function(req, res) {
        res.render('dice');
});
	

app.get('/character', function(req, res){
        res.render('character', {

        
        exChar: [
               { name: 'linix', race: 'DragonBorn', class: 'Sorcerer-Wizard', gender: 'male' },
                ],


});

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

