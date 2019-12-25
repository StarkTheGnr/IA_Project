function checkEmail()
{          
    getPositions();
        
    var email = document.getElementById("emailField").value;

    if(!validateEmail(email))
    {
        document.getElementById("foundEmail").innerHTML = "Validation failed. Please re-enter your details.";
        return;
    }
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "checkemail", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(`email=${email}`);

    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            if(xmlhttp.responseText === "found")
                document.getElementById("foundEmail").innerHTML = "Email already used. Please choose another email.";
            else
                document.getElementById("foundEmail").innerHTML = "Email is available.";
        }
    }
    
}

function RefreshExams()
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "candexams", true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4)
        {
            if(xmlhttp.status == 200)
                document.getElementById("examsAvail").innerHTML = xmlhttp.responseText;
            else if(xmlhttp.status == 201)
                eval(xmlhttp.responseText);
        }
    }
}
function FinishExam()
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "finishexam", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();

    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4)
        {
            if(xmlhttp.status == 200)
                window.location.replace("./candidatehome.html");
            else if(xmlhttp.status == 201)
                eval(xmlhttp.responseText);
        }
    }
}

function ChooseAnswer(radio)
{
    let answerId = radio.value;
    let qId = radio.name;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "chooseanswer", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(`answerid=${answerId}&qid=${qId}`);

    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4)
        {
            if(xmlhttp.status == 200)
                console.log("saved answer.");
            else if(xmlhttp.status == 201)
                eval(xmlhttp.responseText);
        }
    }
}

function ShowCandidates()
{
    Array.prototype.forEach.call(document.getElementsByClassName("home"), (elem) => {
        elem.hidden = true;
    });
    Array.prototype.forEach.call(document.getElementsByClassName("candidates"), (elem) => {
        elem.hidden = false;
    });
    Array.prototype.forEach.call(document.getElementsByClassName("exams"), (elem) => {
        elem.hidden = true;
    });
        Array.prototype.forEach.call(document.getElementsByClassName("questions"), (elem) => {
        elem.hidden = true;
    });
    Array.prototype.forEach.call(document.getElementsByClassName("answers"), (elem) => {
        elem.hidden = true;
    });
    
    var searchTerm = document.getElementById("searchTxt").value;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "candidates?searchTerm=" + searchTerm, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4)
        {
            if(xmlhttp.status == 200)
                document.getElementById("linkContainer").innerHTML = xmlhttp.responseText;
            else if(xmlhttp.status == 201)
                eval(xmlhttp.responseText);
        }
    }
}

function ShowHome()
{
    Array.prototype.forEach.call(document.getElementsByClassName("home"), (elem) => {
        elem.hidden = false;
    });
    Array.prototype.forEach.call(document.getElementsByClassName("candidates"), (elem) => {
        elem.hidden = true;
    });
    Array.prototype.forEach.call(document.getElementsByClassName("exams"), (elem) => {
        elem.hidden = true;
    });
    Array.prototype.forEach.call(document.getElementsByClassName("questions"), (elem) => {
        elem.hidden = true;
    });
    Array.prototype.forEach.call(document.getElementsByClassName("answers"), (elem) => {
        elem.hidden = true;
    });
}

function ShowExams()
{
    Array.prototype.forEach.call(document.getElementsByClassName("home"), (elem) => {
        elem.hidden = true;
    });
    Array.prototype.forEach.call(document.getElementsByClassName("candidates"), (elem) => {
        elem.hidden = true;
    });
    Array.prototype.forEach.call(document.getElementsByClassName("exams"), (elem) => {
        elem.hidden = false;
    });
    Array.prototype.forEach.call(document.getElementsByClassName("questions"), (elem) => {
        elem.hidden = true;
    });
    Array.prototype.forEach.call(document.getElementsByClassName("answers"), (elem) => {
        elem.hidden = true;
    });
    
    var searchTerm = document.getElementById("searchTxt").value;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "exams?searchTerm=" + searchTerm, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4)
        {
            if(xmlhttp.status == 200)
                document.getElementById("examContainer").innerHTML = xmlhttp.responseText;
            else if(xmlhttp.status == 201)
                eval(xmlhttp.responseText);
        }
    }
}
function ShowQuestions()
{
    Array.prototype.forEach.call(document.getElementsByClassName("home"), (elem) => {
        elem.hidden = true;
    });
    Array.prototype.forEach.call(document.getElementsByClassName("candidates"), (elem) => {
        elem.hidden = true;
    });
    Array.prototype.forEach.call(document.getElementsByClassName("exams"), (elem) => {
        elem.hidden = true;
    });
    Array.prototype.forEach.call(document.getElementsByClassName("questions"), (elem) => {
        elem.hidden = false;
    });
    Array.prototype.forEach.call(document.getElementsByClassName("answers"), (elem) => {
        elem.hidden = true;
    });
    
    var searchTerm = document.getElementById("searchTxt").value;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "questions?searchTerm=" + searchTerm, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4)
        {
            if(xmlhttp.status == 200)
                document.getElementById("qContainer").innerHTML = xmlhttp.responseText;
            else if(xmlhttp.status == 201)
                eval(xmlhttp.responseText);
        }
    }
}
function ShowAnswers()
{
    Array.prototype.forEach.call(document.getElementsByClassName("home"), (elem) => {
        elem.hidden = true;
    });
    Array.prototype.forEach.call(document.getElementsByClassName("candidates"), (elem) => {
        elem.hidden = true;
    });
    Array.prototype.forEach.call(document.getElementsByClassName("exams"), (elem) => {
        elem.hidden = true;
    });
    Array.prototype.forEach.call(document.getElementsByClassName("questions"), (elem) => {
        elem.hidden = true;
    });
    Array.prototype.forEach.call(document.getElementsByClassName("answers"), (elem) => {
        elem.hidden = false;
    });
    
    var searchTerm = document.getElementById("searchTxt").value;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "answers?searchTerm=" + searchTerm, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4)
        {
            if(xmlhttp.status == 200)
                document.getElementById("aContainer").innerHTML = xmlhttp.responseText;
            else if(xmlhttp.status == 201)
                eval(xmlhttp.responseText);
        }
    }
}

function AddExam()
{
    var name = document.getElementById("examChangeTxt").value;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "addexam?name=" + name, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4)
        {
            if(xmlhttp.status == 200)
                ShowExams();
            else if(xmlhttp.status == 201)
                eval(xmlhttp.responseText);
        }
    }
}
function UpdateExam()
{
    var name = document.getElementById("examChangeTxt").value;
    var id = document.getElementById("examIdTxt").value;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", `updateexam?id=${id}&name=${name}`, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4)
        {
            if(xmlhttp.status == 200)
                ShowExams();
            else if(xmlhttp.status == 201)
                eval(xmlhttp.responseText);
        }
    }
}
function DeleteExam()
{
    var id = document.getElementById("examIdTxt").value;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", `deleteexam?id=${id}`, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4)
        {
            if(xmlhttp.status == 200)
                ShowExams();
            else if(xmlhttp.status == 201)
                eval(xmlhttp.responseText);
        }
    }
}

function AddQuestion()
{
    var name = document.getElementById("qChangeTxt").value;
    var examId = document.getElementById("qExamTxt").value;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", `addquestion?body=${name}&examid=${examId}`, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4)
        {
            if(xmlhttp.status == 200)
                ShowQuestions();
            else if(xmlhttp.status == 201)
                eval(xmlhttp.responseText);
        }
    }
}
function UpdateQuestion()
{
    var name = document.getElementById("qChangeTxt").value;
    var id = document.getElementById("qIdTxt").value;
    var examId = document.getElementById("qExamTxt").value;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", `updatequestion?id=${id}&body=${name}&examid=${examId}`, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4)
        {
            if(xmlhttp.status == 200)
                ShowQuestions();
            else if(xmlhttp.status == 201)
                eval(xmlhttp.responseText);
        }
    }
}
function DeleteQuestion()
{
    var id = document.getElementById("qIdTxt").value;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", `deletequestion?id=${id}`, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4)
        {
            if(xmlhttp.status == 200)
                ShowQuestions();
            else if(xmlhttp.status == 201)
                eval(xmlhttp.responseText);
        }
    }
}

function Approve()
{
    var seq = document.getElementById("examChangeTxt").value;
    var useSeq = document.getElementById("sequenceCheck").checked;
    var deadline = document.getElementById("deadlineTxt").value;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", `approve?seq=${seq}&useseq=${useSeq}&deadline=${deadline}`, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4)
        {
            if(xmlhttp.status == 200)
                window.location.replace("./hrhome.html");
            else if(xmlhttp.status == 201)
                eval(xmlhttp.responseText);
        }
    }
}

function AddAnswer()
{
    var name = document.getElementById("aChangeTxt").value;
    var qId = document.getElementById("aQTxt").value;
    var correct = document.getElementById("aCorrectTxt").value;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", `addanswer?body=${name}&qid=${qId}&correct=${correct}`, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4)
        {
            if(xmlhttp.status == 200)
                ShowAnswers();
            else if(xmlhttp.status == 201)
                eval(xmlhttp.responseText);
        }
    }
}
function UpdateAnswer()
{
    var name = document.getElementById("aChangeTxt").value;
    var id = document.getElementById("aIdTxt").value;
    var qId = document.getElementById("aQTxt").value;
    var correct = document.getElementById("aCorrectTxt").value;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", `updateanswer?id=${id}&body=${name}&qid=${qId}&correct=${correct}`, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4)
        {
            if(xmlhttp.status == 200)
                ShowAnswers();
            else if(xmlhttp.status == 201)
                eval(xmlhttp.responseText);
        }
    }
}
function DeleteAnswer()
{
    var id = document.getElementById("aIdTxt").value;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", `deleteanswer?id=${id}`, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4)
        {
            if(xmlhttp.status == 200)
                ShowAnswers();
            else if(xmlhttp.status == 201)
                eval(xmlhttp.responseText);
        }
    }
}

function Login()
{              
    var email = document.getElementById("emailField").value;
    var password = document.getElementById("passwordField").value;

    if(!validateEmail(email) || !validatePassword(password))
    {
        document.getElementById("foundEmail").innerHTML = "Validation failed. Please re-enter your details.";
        return;
    }
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "login", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(`email=${email}&password=${password}`);

    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            if(xmlhttp.responseText === "notapproved")
                document.getElementById("foundEmail").innerHTML = "You haven't been approved yet. You will get an email shortly.";
            else if(xmlhttp.responseText === "notfound")
                document.getElementById("foundEmail").innerHTML = "Email or password is incorrect. Please try again.";
            else
            {
                document.getElementById("foundEmail").innerHTML = "Logged in successfully.";
                window.location.replace("./candidatehome.html");
            }
        }
    }
}

function LoginHR()
{              
    var username = document.getElementById("emailField").value;
    var password = document.getElementById("passwordField").value;

    if(!validateUsername(username) || !validatePassword(password))
    {
        document.getElementById("foundEmail").innerHTML = "Validation failed. Please re-enter your details.";
        return;
    }
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "loginhr", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(`username=${username}&password=${password}`);

    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            if(xmlhttp.responseText === "notfound")
                document.getElementById("foundEmail").innerHTML = "username or password is incorrect. Please try again.";
            else
            {
                document.getElementById("foundEmail").innerHTML = "Logged in successfully.";
                window.location.replace("./hrhome.html");
            }
        }
    }
}

function Register()
{              
    var email = document.getElementById("emailField").value;
    var password = document.getElementById("passwordField").value;
    var phone = document.getElementById("phoneField").value;
    var position = document.getElementById("positionList").value;
    
    if(!validateEmail(email) || !validatePassword(password) || !validatePhone(phone))
    {
        document.getElementById("registerInfo").innerHTML = "Validation failed. Please re-enter your details.";
        return;
    }
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "register", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(`email=${email}&password=${password}&phone=${phone}&position=${position}`);

    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            if(xmlhttp.responseText === "found")
                document.getElementById("registerInfo").innerHTML = "Email in use. Please choose another email.";
            else
                document.getElementById("registerInfo").innerHTML = "Account created successfully. Please wait for approval.";
        }
    }
}

function getPositions()
{              
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "positions", true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            document.getElementById("positionList").innerHTML = xmlhttp.responseText;
        }
    }
}

function validateEmail(email)
{
    if(email.length > 100)
        return false;
    
    var regexp = new RegExp("[0-9a-zA-Z]+[@][0-9a-zA-Z]+[.][0-9a-zA-Z]+");
    return regexp.exec(email) != null;
}

function validateUsername(username)
{
    if(username.length > 30)
        return false;
    
    var regexp = new RegExp("[0-9a-zA-Z_@./#$+-]+");
    return regexp.exec(username) != null;
}

function validatePassword(password)
{
    if(password.length > 20)
        return false;
    
    var regexp = new RegExp("[0-9a-zA-Z_@./#&+-]+");
    return regexp.exec(password) != null;
}

function validatePhone(phone)
{
    if(phone.length > 12)
        return false;
    
    var regexp = new RegExp("[0-9-]+");
    return regexp.exec(phone) != null;
}