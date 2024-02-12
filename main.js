var express = require('express')
var app = express()

var mdb = require('mongodb').MongoClient
var con = new mdb('mongodb+srv://chandrudu461:Bchandrudu_069@cluster0.s50fpsr.mongodb.net/');

con.connect(function (err) {
    if (err) {
        console.log("Not connected")
    } else {
        console.log("Connected")
    }
});

app.listen(8888)
app.use(express.static('public'))

app.set('view engine', 'ejs')
app.set('views', 'views')

app.get('/login', login);
app.get('/register', register);
app.get('/insert_question', insert_question);
app.get('/answers', answers);
app.get('/add_answer', add_answer);

function register(req, res) {
    var myobj = {
        _id: req.query._id,
        fullname: req.query.fullname,
        mailid: req.query.mailid,
        password: req.query.password,
        occupation: req.query.occupation
    }
    con.db().collection("users").insertOne(myobj);
    res.send(`
    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #333; height: 400px;">
        <h3>Registered successfully</h3> 
        <a href="login.html">    
            <button style="background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; transition: background-color 0.3s ease;">
                login
            </button>
        </a>
    </div>  
`);

}

function login(req, res) {
    con.db().collection('users').find({ _id: req.query._id, password: req.query.password }).toArray().then(result => dashboard(result, req, res));
    // res.send(result);
}

function dashboard(result, req, res) {
    if (result.length) {
        // res.send(result[0].fullname)
        con.db().collection('qs').find().toArray().then(qs => res.render("dashboard", { qs: qs, result: result }));
        // res.render("dashboard",{fullname:result[0].fullname});
    }
    else
        res.send("invalid" + result)
}

function insert_question(req, res) {
    console.log(req.query.question);
    var q = req.query.question;
    var myobj1 = { question: q }
    con.db().collection('qs').insertOne(myobj1);
    res.send(`<h2 style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">Question inserted</h2>`);
}

function answers(req, res) {
    console.log(req.query._id);

    con.db().collection('as').find({ qid: req.query._id }).toArray().then(as => res.render("answers.ejs", { qid: req.query._id, as: as }));
}

function add_answer(req, res) {
    var a = req.query.answer;
    var myobj = { qid: req.query.qid, answer: a }
    con.db().collection('as').insertOne(myobj);
    res.send(`<h2 style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #333; height: 200px;">Answer added successfully</h2>`);
}
