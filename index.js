//-------------------------------------------//

var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var PORT = process.env.PORT || 8080;


const app = express()

app.use(bodyParser.json())
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended:true
}))

var bodyParser = require('body-parser');
const { urlencoded } = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.set("view engine","ejs");
app.use(express.static('static'));
app.use(express.static('images'));

//-------------------------------------------//

const uri = process.env.MONGODB_URI || "mongodb+srv://VaishnaviH:haravrva@cluster0.fez0i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))

//-------------------------------------------//

app.get('/', function (req, res) {
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
	 res.render('home');
});

app.get('/event',function(req,res){
    var mysort1 = { date: 1 , time: 1};
    var mysort2 = { date: -1 , time: -1};
    var present_date = new Date()
    var query1 = {date: {$gt: present_date}}
    var query2 = {date: {$lt: present_date}}

    console.log(present_date)

    db.collection("event").find(query1).sort(mysort1).toArray(function(err, upcoming) {
        if (err) throw err;
        console.log(upcoming.length)
        db.collection("event").find(query2).limit(6).sort(mysort2).toArray(function(err, finished) {
            if (err) throw err;
            console.log(finished.length)
            res.render('event',{'data': upcoming, 'data1': finished})
        });
    });
});

app.get('/magazine',function(req,res){
    db.collection("magazine").find().toArray(function(err, result) {
        if (err) throw err;
        res.render('magazine',{'data': result})

    });
});

app.get('/announcement',function(req,res){

    db.collection("achivement").find().toArray(function(err, result) {
        if (err) throw err;
        res.render('announcement',{'data': result})

    });
});

app.get('/update',function(req,res){
    res.render('update')
});

app.get('/signin',function(req,res){
    res.render('signin')
});

app.get('/login',function(req,res){
    res.render('login')
});

app.get('/course',function(req,res){
    res.render('course')
});
//-------------------------------------------//


app.post('/addadmin' , urlencodedParser,function(req,res){
    var email= req.body.email;
	var password= req.body.password;
	var cpassword= req.body.cpassword;

    var query = { email: email };
    db.collection("login").find(query).toArray(function(err, result1) {
        if (err) throw err;
        console.log(result1);
        if(result1.length==0){
            if(password==cpassword){
                var data2 = {
                    "email" : email,
                    "password" : password
                }

                db.collection('login').insertOne(data2,(err,collection)=>{
                    if(err){
                        throw err;
                    }
                    console.log("Record Inserted Successfully Into Login collection");
                });

                res.redirect('update');

            }
        }
    });
});

app.post('/loggedin' , urlencodedParser,function(req,res){
    var email= req.body.email;
	var password= req.body.password;
    
    var query = { email: email };
    db.collection("login").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        if(result.length>0){
            if(result[0].password == password){
                res.render('update',{'user': result[0].email})
    
            }else{
                console.log('Invalid password');
                res.redirect('login')
            }
        }else{
            res.redirect('login')
        }
    });
});
app.post('/addevent',urlencodedParser,function(req,res){
    var eventname= req.body.eventname;
    var date= req.body.date;
    date = new Date(date);
	var time= req.body.time;
	var description= req.body.description;
	var location= req.body.location;
	var resourceperson= req.body.resourceperson;
    var url = req.body.url;
    var data = {
        'eventname':eventname,
        'date':date,
        'time':time,
        'location':location,
        'description': description,
        'resource person': resourceperson,
        'url': url
    }

    var query = { eventname: eventname };

    db.collection("event").find(query).toArray(function(err, result1) {
        if (err) throw err;
        console.log(result1);
        if(result1.length==0){
            db.collection('event').insertOne(data,(err,collection)=>{
                if(err){
                    throw err;
                }
                console.log("Record Inserted Successfully Into Event  collection");
            });
            res.redirect('update')
        }else{
            console.log(eventname+" already exist!!!")
            res.redirect('update')
        }});
});


app.post('/deleteevent',urlencodedParser,function(req,res){
    var eventname= req.body.eventname;
    var reason = req.body.reason;

    var myquery = { eventname: eventname };
    db.collection("event").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log(eventname + " event  deleted from Event Collection");
    res.redirect('update')

  });
});


app.post('/addmagazine',urlencodedParser,function(req,res){
    var magazinename= req.body.magazinename;
    var author= req.body.author;
    var genre= req.body.genre;
    var description= req.body.description;
    var url = req.body.url;

    var data = {
        'magazinename': magazinename,
        'author': author,
        'genre': genre,
        'description': description,
        'url' : url,
        'published': Date()

    }


    var query = { magazinename: magazinename };

    db.collection("magazine").find(query).toArray(function(err, result1) {
        if (err) throw err;
        console.log(result1);
        if(result1.length==0){
            db.collection('magazine').insertOne(data,(err,collection)=>{
                if(err){
                    throw err;
                }
                console.log("Record Inserted Successfully Into Magazine  collection");
            });
            res.redirect('update')
        }else{
            console.log(magazinename+" already exist!!!")
            res.redirect('update')
        }
    });
});

app.post('/deletemagazine',urlencodedParser,function(req,res){
    var magazinename= req.body.magazinename;
    var reason = req.body.reason;

    var myquery = { magazinename: magazinename };
    db.collection("magazine").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log(magazinename + " event  deleted from Event Collection");
    res.redirect('update')

  });
});

app.post('/addannouncement',urlencodedParser,function(req,res){
    var announcementtitle = req.body.announcementtitle;
    var description = req.body.description;
    var url = req.body.url;
    
    var data = {
        'announcementtitle': announcementtitle,
        'description': description,
        'url': url,
        'published': Date()
    }

    var query = { announcementtitle: announcementtitle };

    db.collection("achivement").find(query).toArray(function(err, result1) {
        if (err) throw err;
        console.log(result1);
        if(result1.length==0){
            db.collection('achivement').insertOne(data,(err,collection)=>{
                if(err){
                    throw err;
                }
                console.log("Record Inserted Successfully Into Achivements  collection");
            });
            res.redirect('update')
        }else{
            console.log(announcementtitle+" already exist!!!")
            res.redirect('update')
        }
    });

});

app.post('/deleteannouncement',urlencodedParser,function(req,res){
    var announcementtitle = req.body.announcementtitle;
    var reason = req.body.reason;

    var myquery = { announcementtitle: announcementtitle };
    db.collection("achivement").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log(announcementtitle + " event  deleted from Event Collection");
    res.redirect('update')

  });
});

//-------------------------------------------//

app.listen(PORT,function()
{
  console.log("Server running on port "+ PORT);
});

//-------------------------------------------//
