var express = require('express');

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

//static pages
app.use(express.static(__dirname + '/public'));



//routes go here
app.get('/', function(req, res) {
        res.render('home');
});
app.get('/about', function(req, res){
        res.render('about');
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

