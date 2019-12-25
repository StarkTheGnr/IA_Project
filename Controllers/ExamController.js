const modelFile = require('../Models/ExamModel.js');

module.exports = class ExamController
{
    constructor()
    {
        
    }
    
    getExamById(db, id)
    {
        return new Promise((resolve, reject) => {
            db.Select("exam", ["*"], "examId='" + id + "'").then((rows) => {
                resolve(this.populateModel(rows[0]));
            }).catch((err) => reject(err));
        });
    }
    
    getCandidateExams(db, id, session)
    {
        return new Promise((resolve, reject) => {
            db.Select("takenexam", ["*"], "candId='" + id + "'").then((rows) => {
                let resultHTML = `    <div class="loginContainer" style="text-align: center">
        <h2 class="loginHeader">HR Check Up</h2>`;
                
                if(rows.length == 0)
                {
                    session.approveId = id;
                    resultHTML += `<a href="./approve.html">Approve</a>`
                    
                    resolve(resultHTML);
                    return;
                }
                
                let totalScore = 0;
                
                let usedHeader = false;
                for(let i = 0; i < rows.length; i++)
                {
                    let shouldSetExam = true;
                    this.getExamById(db, rows[i].examId).then((exam) => {
                        let examId = exam.examId;
                        let examName = exam.name;

                        let correctNum = 0;
                        let skippedNum = 0;
                        let markedNum = 0;
                        
                        db.Select("testanswer, question, exam", ["testanswer.qId"], `candId = ${id} AND testanswer.qId = question.qId AND question.examId = exam.examId AND exam.examId = ${examId} GROUP BY qId`).then((qids) => {
                            for(let z = 0; z < qids.length; z++)
                            {
                                db.Select("position, candidate, testanswer, answer, question", ["candidate.approved", "candidate.positionId", "position.name as posname", "candidate.email", "testanswer.candId", "testanswer.answerId", "question.qId", "testanswer.chosen", "testanswer.markedquestion", "question.body as qbody", "answer.body as abody", "answer.correct"], `position.positionId = candidate.positionId AND candidate.candId = ${id} AND testanswer.candId = ${id} AND testanswer.answerId = answer.answerId AND answer.qId = question.qId AND question.qId = ${qids[z].qId}`).then((dataR) => {
                                    if(!usedHeader)
                                    {
                                        if(dataR[0].approved[0] == 0)
                                        {
                                            session.approveId = id;
                                            resultHTML += `<a href="./approve.html">Approve</a>`
                                        }
                                        
                                        resultHTML += `        <h3 class="loginHeader">${dataR[0].email}</h3>
                                                                <h3 class="loginHeader">applying for ${dataR[0].posname}</h3>

                                                                <p>Results:</p>`;
                                        usedHeader = true;
                                    }
                                    if(shouldSetExam)
                                    {
                                         resultHTML += `========================
                                                    <p>Exam: ${examName}</p>
                                                    ------------------------`;
                                        shouldSetExam = false;
                                    }
                                    
                                    resultHTML += `<p>${(dataR[0].markedquestion[0] == 1)?"(MARKED)":""} Question: ${dataR[0].qbody}</p>`;
                                    
                                    let skipped = true;
                                    for(let j = 0; j < dataR.length; j++)
                                    {
                                        if(dataR[j].chosen[0] == 1)
                                        {
                                            skipped = false;
                                            if(dataR[j].correct[0] == 1)
                                                correctNum++;
                                        }
                                        
                                        resultHTML += `<p>${dataR[j].abody}${(dataR[j].correct[0] == 1)?"(CHOSEN)" : ""}</p>`;
                                    }
                                    if(skipped)
                                        skippedNum++;
                                    
                                    if(dataR[0].markedquestion[0] == 1)
                                        markedNum++;
                                     resultHTML += `----------------`;
                                    
                                    
                                    if(z == qids.length - 1)
                                    {
                                        totalScore += correctNum;
                                        resultHTML += `********************
                                                    <br>
                                                    SCORE: ${correctNum}/5
                                                    Skipped: ${skippedNum}/5
                                                    Marked: ${markedNum}/5
                                                    <br>
                                                    ********************`;
                                        
                                        if(i == rows.length - 1)
                                        {
                                            resultHTML += `********************************
                                                    <br>
                                                    Total Summarized Score: ${totalScore}/${rows.length * 5}
                                                    <br>
                                                    ********************************`;
                                            resolve(resultHTML);
                                            return;
                                        }
                                    }
                                }).catch((err) => console.log(err));
                            }
                        }).catch((err) => reject(err));
                    }).catch(reject);
                }
            }).catch((err) => reject(err));
        });
    }
    
    getExamsHtml(db, searchTerm)
    {
        return new Promise((resolve, reject) => {
            db.Select("exam", ["*"], "").then((rows) => {
                let htmloutput = "";
                for(var i = 0; i < rows.length; i++)
                {
                    if(searchTerm != "" && !rows[i].name.includes(searchTerm))
                        continue;
                    htmloutput += `<p class="exams">${rows[i].examId} | ${rows[i].name}</p>`;
                }
                
                resolve(htmloutput);
            }).catch(reject);
        });
    }
    getQuestionsHtml(db, searchTerm)
    {
        return new Promise((resolve, reject) => {
            db.Select("question", ["*"], "").then((rows) => {
                let htmloutput = "";
                for(var i = 0; i < rows.length; i++)
                {
                    if(searchTerm != "" && !rows[i].body.includes(searchTerm))
                        continue;
                    htmloutput += `<p class="questions">${rows[i].qId} | ${rows[i].body} | ${rows[i].examId}</p>`;
                }
                
                resolve(htmloutput);
            }).catch(reject);
        });
    }
    getAnswersHtml(db, searchTerm)
    {
        return new Promise((resolve, reject) => {
            db.Select("answer", ["*"], "").then((rows) => {
                let htmloutput = "";
                for(var i = 0; i < rows.length; i++)
                {
                    if(searchTerm != "" && !rows[i].body.includes(searchTerm))
                        continue;
                    htmloutput += `<p class="answers">${rows[i].answerId} | ${rows[i].body} | ${rows[i].qId} | ${rows[i].correct[0]}</p>`;
                }
                
                resolve(htmloutput);
            }).catch(reject);
        });
    }
    
    addExam(db, name)
    {
        return new Promise((resolve, reject) => {
            db.Insert("exam", ["name"], [`'${name}'`]).then((row) => {
                resolve("done");
            }).catch(reject);
        });
    }
    updateExam(db, id, name)
    {
        return new Promise((resolve, reject) => {
            db.Update("exam", ["name"], [`'${name}'`], `examId=${id}`).then((row) => {
                resolve("done");
            }).catch(reject);
        });
    }
    deleteExam(db, id)
    {
        return new Promise((resolve, reject) => {
            db.Delete("exam", `examId=${id}`).then((row) => {
                resolve("done");
            }).catch(reject);
        });
    }
    
    addQuestion(db, body, examId)
    {
        return new Promise((resolve, reject) => {
            db.Insert("question", ["body", "examId"], [`'${body}'`, `'${examId}'`]).then((row) => {
                resolve("done");
            }).catch(reject);
        });
    }
    updateQuestion(db, id, body, examId)
    {
        return new Promise((resolve, reject) => {
            db.Update("question", ["body", "examId"], [`'${body}'`, `'${examId}'`], `qId=${id}`).then((row) => {
                resolve("done");
            }).catch(reject);
        });
    }
    deleteQuestion(db, id)
    {
        return new Promise((resolve, reject) => {
            db.Delete("question", `qId=${id}`).then((row) => {
                resolve("done");
            }).catch(reject);
        });
    }
    
    addAnswer(db, body, qId, correct)
    {
        return new Promise((resolve, reject) => {
            db.Insert("answer", ["body", "qId", "correct"], [`'${body}'`, `'${qId}'`, `${correct}`]).then((row) => {
                resolve("done");
            }).catch(reject);
        });
    }
    updateAnswer(db, id, body, qId, correct)
    {
        return new Promise((resolve, reject) => {
            db.Update("answer", ["body", "qId", "correct"], [`'${body}'`, `'${qId}'`, `${correct}`], `answerId=${id}`).then((row) => {
                resolve("done");
            }).catch(reject);
        });
    }
    deleteAnswer(db, id)
    {
        return new Promise((resolve, reject) => {
            db.Delete("answer", `answerId=${id}`).then((row) => {
                resolve("done");
            }).catch(reject);
        });
    }
    
    populateModel(row)
    {
        var model = new modelFile();
        model.examId = row.examId;
        model.name = row.name;
        
        return model;
    }
}