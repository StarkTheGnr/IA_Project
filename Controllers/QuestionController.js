const modelFile = require('../Models/QuestionModel.js');

module.exports = class QuestionController
{
    constructor()
    {
        
    }
    
    populateModel(db, ac, rows)
    {
        return new Promise((resolve, reject) => {
            var models = [];
            for(var i = 0; i < rows.length; i++)
            {
                let model = new modelFile();
                model.qId = rows[i].qId;
                model.body = rows[i].body;
                model.examId = rows[i].examId;
                
                ac.getAnswers(db, model.qId).then((data) => {
                    model.answersFK = data;
                    
                    models.push(model);
                    if(models.length == rows.length)
                    {
                        resolve(models)
                        return;
                    }
                }).catch((err) => reject(err));
            }
        });
    }
    
    get5RandomQuestions(db, ac, exam, candId)
    {
        return new Promise((resolve, reject) => {
            db.Select("testanswer, question, exam, answer", ["testanswer.candId", "testanswer.answerId", "testanswer.qId", "testanswer.chosen", "testanswer.markedquestion", "question.body", "question.examId", "answer.body as abody"], `testanswer.candId='${candId}' AND testanswer.answerID = answer.answerId AND testanswer.qId = question.qId AND question.examId = exam.examId AND exam.examId=${exam} ORDER BY testanswer.qId`).then((oldQs) => {
                if(oldQs.length == 0)
                {
                    db.Select("question", ["*"], "examId='" + exam + "'").then((rows) => {
                        let randNums = [];
                        let randData = [];
                        while(randNums.length < Math.min(5, rows.length))
                        {
                            let rand = parseInt(Math.floor(Math.random() * rows.length));
                            if(randNums.indexOf(rand) == -1)
                            {
                                randNums.push(rand);
                                randData.push(rows[rand]);
                            }
                        }

                        if(randData.length == 0)
                        {
                            resolve([])
                            return;
                        }

                        this.populateModel(db, ac, randData).then((data) => {
                            resolve(data);
                        }).catch((err) => console.log(err));
                    }).catch((err) => console.log(err));
                }
                else
                {
                    let htmloutput = `<!DOCTYPE html>
                                    <html lang="">
                                    <head>
                                        <meta charset="utf-8">
                                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                        <title>Candidate Login</title>
                                    </head>

                                    <body>
                                        <script src="./js/main.js"></script>`;
                    
                    for(let ind = 0; ind < (oldQs.length/4);ind++)
                    {
                        let arr = [0, 1, 2, 3];
                        arr.sort(() => Math.random() - 0.5);
                        
                        let temp1 = oldQs[arr[0] + (ind*4)], temp2 = oldQs[arr[1] + (ind*4)], temp3 = oldQs[arr[2] + (ind*4)], temp4 = oldQs[arr[3] + (ind*4)];
                        oldQs[ind*4] = temp1;
                        oldQs[ind*4 + 1] = temp2;
                        oldQs[ind*4 + 2] = temp3;
                        oldQs[ind*4 + 3] = temp4;
                    }
                    
                    let question = "";
                    let markSkip = true;
                    for(let i = 0; i < oldQs.length; i++)
                    {
                        if(oldQs[i].body !== question)
                        {
                            if(question !== "")
                            {
                                if(markSkip)
                                    htmloutput += `<input type="radio" name="${oldQs[i-1].qId}" value='-1' onclick="ChooseAnswer(this)" checked> Skip</input><br><br>`;
                                else
                                    htmloutput += `<input type="radio" name="${oldQs[i-1].qId}" value='-1' onclick="ChooseAnswer(this)"> Skip</input><br><br>`;
                                
                                markSkip = true;
                            }
                            
                            question = oldQs[i].body;
                            htmloutput += `<p>${question}</p>`;
                        }
                        
                        if(oldQs[i].chosen[0] == 1)
                        {
                            markSkip = false;
                            htmloutput += `<input type="radio" name="${oldQs[i].qId}" value='${oldQs[i].answerId}' onclick="ChooseAnswer(this)" checked> ${oldQs[i].abody}</input><br>`;
                        }
                        else
                            htmloutput += `<input type="radio" name="${oldQs[i].qId}" value='${oldQs[i].answerId}' onclick="ChooseAnswer(this)"> ${oldQs[i].abody}</input><br>`;                            
                    }
                    
                    if(markSkip)
                        htmloutput += `<input type="radio" name="${oldQs[oldQs.length - 1].qId}" value='-1' onclick="ChooseAnswer(this)" checked> Skip</input><br><br>`;
                    else
                        htmloutput += `<input type="radio" name="${oldQs[oldQs.length - 1].qId}" value='-1' onclick="ChooseAnswer(this)"> Skip</input><br><br>`;
                    
                    htmloutput += `<input type="submit" value="Finish" onclick="FinishExam()">`;
                    htmloutput += `</body></html>`;
                    
                    reject(htmloutput);
                }
            }).catch((err) => console.log(err));
        });
    }
    
    lockInAnswers(db, candId, models)
    {
        return new Promise((resolve, reject) => {
            if(models.length == 0)
            {
                resolve("Something went wrong!");
                return;
            }
            
            let htmloutput = `<!DOCTYPE html>
                                    <html lang="">
                                    <head>
                                        <meta charset="utf-8">
                                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                        <title>Candidate Login</title>
                                    </head>

                                    <body>
                                        <script src="./js/main.js"></script>`;
            for(let i = 0; i < models.length; i++)
            {
                let correctNum = 0;
                for(let z = 0; z < models[i].answersFK.length; z++)
                {
                    if(models[i].answersFK[z].correct[0] == 1)
                        correctNum++;
                }
                let incorrectNum = Math.abs(models[i].answersFK.length - correctNum);
                
                let randArr = (correctNum == 0) ? [] : [Math.floor(Math.random() * correctNum)];
                while(randArr.length < Math.min(4, ((correctNum == 0) ? 0 : 1) + incorrectNum))
                {
                    let rand = correctNum + parseInt(Math.floor(Math.random() * incorrectNum));
                    if(randArr.indexOf(rand) == -1)
                    {
                        randArr.push(rand);
                    }
                }
                
                htmloutput += `<p>${models[i].body}</p>`;
                
                randArr.sort(() => Math.random() - 0.5);
                for(let j = 0; j < randArr.length; j++)
                {
                    db.Insert("testanswer", ["candId", "answerId", "qId", "chosen", "markedquestion"], [`'${candId}'`, `'${models[i].answersFK[randArr[j]].answerId}'`, `'${models[i].qId}'`, `0`, `0`]).catch((err) => reject(err));
                    htmloutput += `<input type="radio" name="${models[i].qId}" value='${models[i].answersFK[randArr[j]].answerId}' onclick="ChooseAnswer(this)"> ${models[i].answersFK[randArr[j]].body}</input><br>`;
                }
                
                htmloutput += `<input type="radio" name="${models[i].qId}" value='-1' onclick="ChooseAnswer(this)" checked> Skip</input><br><br>`;
            }
            htmloutput += `<input type="submit" value="Finish" onclick="FinishExam()">`;
            htmloutput += `</body></html>`;
            resolve(htmloutput);
            return;
        });
    }
}