const dbFile = require("./Database.js");
const personControllerFile = require("./Controllers/PersonnelController.js");
const questionControllerFile = require("./Controllers/QuestionController.js");
const answerControllerFile = require("./Controllers/AnswerController.js");
const candidateControllerFile = require("./Controllers/CandidateController.js");
const positionControllerFile = require("./Controllers/PositionController.js");
const examControllerFile = require("./Controllers/ExamController.js");
const emailFile = require("./Email.js");


const db = new dbFile();
const personnelController = new personControllerFile();
const questionController = new questionControllerFile();
const answerController = new answerControllerFile();
const candidateController = new candidateControllerFile();
const positionController = new positionControllerFile();
const examController = new examControllerFile();
const emailer = new emailFile();

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var session = require('express-session');

db.Connect().then(() => {
}).catch((err) => console.log(err));

app.use("/Views", express.static("Views"));

app.use(session({
  secret: 'potatoes are awesome!',
  resave: false,
  saveUninitialized: true,
  cookie: { }
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded())

app.get('/Views/candidatelogin.html', (req, res) => {
    fs.readFile('./Views/candidatelogin.html', (err, html) => {
        if (err) 
        {
            console.log(err);
            res.end();
        } 

        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(html);  
        res.end();    
    });
});

app.post('/Views/register', (req, res) => {
    candidateController.Register(db, req.body.email, req.body.password, req.body.phone, req.body.position, positionController).then((result) => {
        res.writeHead(200, {'Content-Type': 'text/html'})  
        res.end(result);
    }).catch((err) => console.log(err));
});

app.post('/Views/checkemail', (req, res) => {
    candidateController.CheckEmail(db, req.body.email).then((result) => {
        res.writeHead(200, {'Content-Type': 'text/html'})  
        res.end(result);
    }).catch((err) => console.log(err));
});

app.post('/Views/login', (req, res) => {
    candidateController.Login(db, req.body.email, req.body.password).then((result) => {
        if(result === "loggedin")
        {
            req.session.username = null;
            req.session.email = req.body.email;
        }
        
        res.writeHead(200, {'Content-Type': 'text/html'})  
        res.end(result);
    }).catch((err) => console.log(err));
});

app.post('/Views/loginhr', (req, res) => {
    personnelController.Login(db, req.body.username, req.body.password).then((result) => {
        if(result === "loggedin")
        {
            req.session.email = null;
            req.session.username = req.body.username;
        }
        
        res.writeHead(200, {'Content-Type': 'text/html'})  
        res.end(result);
    }).catch((err) => console.log(err));
});

app.get('/Views/positions', (req, res) => {
    positionController.getOptionList(db).then((result) => {
        res.writeHead(200, {'Content-Type': 'text/html'})  
        res.end(result);
    }).catch((err) => console.log(err));
});

app.get('/Views/candidates', (req, res) => {
    if(req.session.username == null)
    {
        res.writeHead(201, {'Content-Type': 'text/html'})
        res.end("alert('Please login again');window.location.replace('./hrlogin.html');");
        return;
    }
    
    personnelController.getCandidatesAsHtmlLinks(db, candidateController, req.query.searchTerm).then((result) => {
        res.writeHead(200, {'Content-Type': 'text/html'})  
        res.end(result);
    }).catch((err) => console.log(err));
});

app.get('/Views/exams', (req, res) => {
    if(req.session.username == null)
    {
        res.writeHead(201, {'Content-Type': 'text/html'})
        res.end("alert('Please login again');window.location.replace('./hrlogin.html');");
        return;
    }
    
    examController.getExamsHtml(db, req.query.searchTerm).then((result) => {
        res.writeHead(200, {'Content-Type': 'text/html'})  
        res.end(result);
    }).catch((err) => console.log(err));
});

app.get('/Views/addexam', (req, res) => {
    if(req.session.username == null)
    {
        res.writeHead(201, {'Content-Type': 'text/html'})
        res.end("alert('Please login again');window.location.replace('./hrlogin.html');");
        return;
    }
    
    examController.addExam(db, req.query.name).then((result) => {
        res.writeHead(200, {'Content-Type': 'text/html'})  
        res.end(result);
    }).catch((err) => console.log(err));
});
app.get('/Views/updateexam', (req, res) => {
    if(req.session.username == null)
    {
        res.writeHead(201, {'Content-Type': 'text/html'})
        res.end("alert('Please login again');window.location.replace('./hrlogin.html');");
        return;
    }
    
    examController.updateExam(db, req.query.id, req.query.name).then((result) => {
        res.writeHead(200, {'Content-Type': 'text/html'})  
        res.end(result);
    }).catch((err) => console.log(err));
});
app.get('/Views/deleteexam', (req, res) => {
    if(req.session.username == null)
    {
        res.writeHead(201, {'Content-Type': 'text/html'})
        res.end("alert('Please login again');window.location.replace('./hrlogin.html');");
        return;
    }
    
    examController.deleteExam(db, req.query.id).then((result) => {
        res.writeHead(200, {'Content-Type': 'text/html'})  
        res.end(result);
    }).catch((err) => console.log(err));
});

app.get('/Views/questions', (req, res) => {
    if(req.session.username == null)
    {
        res.writeHead(201, {'Content-Type': 'text/html'})
        res.end("alert('Please login again');window.location.replace('./hrlogin.html');");
        return;
    }
    
    examController.getQuestionsHtml(db, req.query.searchTerm).then((result) => {
        res.writeHead(200, {'Content-Type': 'text/html'})  
        res.end(result);
    }).catch((err) => console.log(err));
});

app.get('/Views/addquestion', (req, res) => {
    if(req.session.username == null)
    {
        res.writeHead(201, {'Content-Type': 'text/html'})
        res.end("alert('Please login again');window.location.replace('./hrlogin.html');");
        return;
    }
    
    examController.addQuestion(db, req.query.body, req.query.examid).then((result) => {
        res.writeHead(200, {'Content-Type': 'text/html'})  
        res.end(result);
    }).catch((err) => console.log(err));
});
app.get('/Views/updatequestion', (req, res) => {
    if(req.session.username == null)
    {
        res.writeHead(201, {'Content-Type': 'text/html'})
        res.end("alert('Please login again');window.location.replace('./hrlogin.html');");
        return;
    }
    
    examController.updateQuestion(db, req.query.id, req.query.body, req.query.examid).then((result) => {
        res.writeHead(200, {'Content-Type': 'text/html'})  
        res.end(result);
    }).catch((err) => console.log(err));
});
app.get('/Views/deletequestion', (req, res) => {
    if(req.session.username == null)
    {
        res.writeHead(201, {'Content-Type': 'text/html'})
        res.end("alert('Please login again');window.location.replace('./hrlogin.html');");
        return;
    }
    
    examController.deleteQuestion(db, req.query.id).then((result) => {
        res.writeHead(200, {'Content-Type': 'text/html'})  
        res.end(result);
    }).catch((err) => console.log(err));
});

app.get('/Views/answers', (req, res) => {
    if(req.session.username == null)
    {
        res.writeHead(201, {'Content-Type': 'text/html'})
        res.end("alert('Please login again');window.location.replace('./hrlogin.html');");
        return;
    }
    
    examController.getAnswersHtml(db, req.query.searchTerm).then((result) => {
        res.writeHead(200, {'Content-Type': 'text/html'})  
        res.end(result);
    }).catch((err) => console.log(err));
});

app.get('/Views/addanswer', (req, res) => {
    if(req.session.username == null)
    {
        res.writeHead(201, {'Content-Type': 'text/html'})
        res.end("alert('Please login again');window.location.replace('./hrlogin.html');");
        return;
    }
    
    examController.addAnswer(db, req.query.body, req.query.qid, req.query.correct).then((result) => {
        res.writeHead(200, {'Content-Type': 'text/html'})  
        res.end(result);
    }).catch((err) => console.log(err));
});
app.get('/Views/updateanswer', (req, res) => {
    if(req.session.username == null)
    {
        res.writeHead(201, {'Content-Type': 'text/html'})
        res.end("alert('Please login again');window.location.replace('./hrlogin.html');");
        return;
    }
    
    examController.updateAnswer(db, req.query.id, req.query.body, req.query.qid, req.query.correct).then((result) => {
        res.writeHead(200, {'Content-Type': 'text/html'})  
        res.end(result);
    }).catch((err) => console.log(err));
});
app.get('/Views/deleteanswer', (req, res) => {
    if(req.session.username == null)
    {
        res.writeHead(201, {'Content-Type': 'text/html'})
        res.end("alert('Please login again');window.location.replace('./hrlogin.html');");
        return;
    }
    
    examController.deleteAnswer(db, req.query.id).then((result) => {
        res.writeHead(200, {'Content-Type': 'text/html'})  
        res.end(result);
    }).catch((err) => console.log(err));
});

app.get('/Views/candidate', (req, res) => {
    if(req.session.username == null)
    {
        res.writeHead(201, {'Content-Type': 'text/html'})
        res.end("<script>alert('Please login again');window.location.replace('./hrlogin.html');</script>");
        return;
    }
    
    examController.getCandidateExams(db, req.query.id, req.session).then((result) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(result);
    }).catch(console.log);
});

app.get('/Views/approve', (req, res) => {
    if(req.session.username == null)
    {
        res.writeHead(201, {'Content-Type': 'text/html'})
        res.end("alert('Please login again');window.location.replace('./hrlogin.html');");
        return;
    }
    if(!req.session.approveId)
    {
        res.writeHead(201, {'Content-Type': 'text/html'})
        res.end("alert('Something went wrong! Please login again and then try again.');window.location.replace('./hrlogin.html');");
        return;
    }
    
    candidateController.getCandidate(db, req.session.approveId).then((cand) => {
        personnelController.approveCandidate(db, req.session.approveId, req.query.seq, req.query.useseq, req.query.deadline).then((result) => {
            //emailer.sendEmail("assem.alsahel@gmail.com", cand.email, "You have been approved!", "Hurray! You have been approved! Please login to your account to take the exams.")

            res.writeHead(200, {'Content-Type': 'text/html'})  
            res.end(result);
        }).catch((err) => console.log(err));
    }).catch((err) => console.log(err));
    
});

app.get('/Views/disapprove', (req, res) => {
    if(req.session.username == null)
    {
        res.writeHead(201, {'Content-Type': 'text/html'})
        res.end("alert('Please login again');window.location.replace('./hrlogin.html');");
        return;
    }
    if(!req.session.approveId)
    {
        res.writeHead(201, {'Content-Type': 'text/html'})
        res.end("alert('Something went wrong! Please login again and then try again.');window.location.replace('./hrlogin.html');");
        return;
    }
    
    candidateController.getCandidate(db, req.session.approveId).then((cand) => {
        personnelController.approveCandidate(db, req.session.approveId, req.query.seq, req.query.useseq, req.query.deadline).then((result) => {
            //emailer.sendEmail("assem.alsahel@gmail.com", cand.email, "Unfortunately, you didn't make it", "Hello, I regret to inform you that you were disapproved.")

            res.writeHead(200, {'Content-Type': 'text/html'})  
            res.end(result);
        }).catch((err) => console.log(err));
    }).catch((err) => console.log(err));
    
});

app.get('/Views/candexams', (req, res) => {
    if(req.session.email == null)
    {
        res.writeHead(201, {'Content-Type': 'text/html'})
        res.end("alert('Please login again');window.location.replace('./candidatelogin.html');");
        return;
    }
    
    candidateController.getAvailExams(db, req.session.email).then((result) => {
        res.writeHead(200, {'Content-Type': 'text/html'})  
        res.end(result);
    }).catch((err) => console.log(err));
});

app.get('/Views/getmyemail', (req, res) => {
    let responseTxt = "";
    if(req.session.email == null && req.session.username == null)
    {
        res.writeHead(201, {'Content-Type': 'text/html'})
        res.end("alert('Please login again');window.location.replace('./candidatelogin.html');");
        return;
    }
    else if(req.session.email != null)
        responseTxt = req.session.email;
    else
        responseTxt = req.session.username;
        
    res.writeHead(200, {'Content-Type': 'text/html'})  
    res.end(responseTxt);
});

app.get('/Views/exam', (req, res) => {
    if(req.session.email == null)
    {
        res.writeHead(201, {'Content-Type': 'text/html'})
        res.end("alert('Please login again');window.location.replace('./candidatelogin.html');");
        return;
    }
    
    candidateController.getCandidateIdByEmail(db, req.session.email).then((id) => {
        questionController.get5RandomQuestions(db, answerController, req.query.examid, id).then((result) => {
            questionController.lockInAnswers(db, id, result).then((output) => {
                req.session.exam = req.query.examid;
                
                res.writeHead(200, {'Content-Type': 'text/html'})  
                res.end(output);
            }).catch((err) => console.log(err));
        }).catch((output) => {
            req.session.exam = req.query.examid;
            
            res.writeHead(200, {'Content-Type': 'text/html'})  
            res.end(output);
        });
    }).catch((err) => console.log(err));
});

app.post('/Views/finishexam', (req, res) => {
    if(req.session.email == null)
    {
        res.writeHead(201, {'Content-Type': 'text/html'})
        res.end("alert('Please login again');window.location.replace('./candidatelogin.html');");
        return;
    }
    
    candidateController.getCandidateIdByEmail(db, req.session.email).then((id) => {
        candidateController.finishExam(db, emailer, id, req.session.exam, req.session.email).then((result) => {
            res.writeHead(200, {'Content-Type': 'text/html'})  
            res.end(result);
        }).catch((err) => console.log(err));
    }).catch((err) => console.log(err));
});

app.post('/Views/chooseanswer', (req, res) => {
    if(req.session.email == null)
    {
        res.writeHead(201, {'Content-Type': 'text/html'})
        res.end("alert('Please login again');window.location.replace('./candidatelogin.html');");
        return;
    }
    
    candidateController.getCandidateIdByEmail(db, req.session.email).then((id) => {
        candidateController.chooseAnswer(db, id, req.body.answerid, req.body.qid).then((result) => {
            res.writeHead(200, {'Content-Type': 'text/html'})  
            res.end(result);
        }).catch((err) => console.log(err));
    }).catch((err) => console.log(err));
});

app.listen(8080, () => console.log(`Listening on port ${8080}!`))










