const modelFile = require('../Models/CandidateModel.js');

module.exports = class CandidateController
{
    constructor()
    {
        this.model = new modelFile();
    }
    
    Login(db, email, password)
    {
        return new Promise((resolve, reject) => {
            db.Select("candidate", ["*"], "email='" + email + "' AND password='" + password + "'").then((rows) => {
                if(rows.length > 0)
                {
                    this.model = this.populateModel(rows[0]);

                    if(this.model.approved[0] == 1)
                        resolve("loggedin");
                    else
                        resolve("notapproved");
                }
                else
                    resolve("notfound");
            }).catch((err) => reject(err));
        });
    }
    
    CheckEmail(db, email)
    {
        return new Promise((resolve, reject) => {
            db.Select("candidate", ["*"], "email='" + email + "'").then((rows) => {
                if(rows.length > 0)
                {
                    resolve("found");
                }
                else
                {
                    resolve("notfound");
                }
            }).catch((err) => reject(err));
        });
    }
    
    Register(db, email, password, phone, position, pc)
    {
        return new Promise((resolve, reject) => {
            db.Select("candidate", ["*"], "email='" + email + "' AND password='" + password + "'").then((rows) => {
                if(rows.length > 0)
                {
                    resolve("found");
                }
                else
                {
                    pc.getPositionId(db, position).then((id) => {
                        db.Insert("candidate", ["email", "password", "phoneNumber", "approved", "positionId"], [`'${email}'`, `'${password}'`, `'${phone}'`, '0', `${id}`]).then((data) => {
                            resolve("notfound");
                        }).catch((err) => reject(err));
                    }).catch((err) => reject(err));
                }
            }).catch((err) => reject(err));
        });
    }
    
    getCandidate(db, id)
    {
        return new Promise((resolve, reject) => {
            db.Select("candidate", ["*"], "candId='" + id + "'").then((rows) => {
                if(rows.length > 0)
                {
                    resolve(this.populateModel(rows[0]));
                }
                else
                {
                    resolve("notfound");
                }
            }).catch((err) => reject(err));
        });
    }
    getCandidateIdByEmail(db, email)
    {
        return new Promise((resolve, reject) => {
            db.Select("candidate", ["*"], "email='" + email + "'").then((rows) => {
                if(rows.length > 0)
                {
                    resolve(rows[0].candId);
                }
                else
                {
                    resolve("notfound");
                }
            }).catch((err) => reject(err));
        });
    }
    
    checkDeadline(deadline)
    {
        let today = new Date();
        
        return today.getFullYear() <= deadline.getFullYear() && today.getMonth() <= deadline.getMonth() && today.getDate() <= deadline.getDate();
    }
    
    finishExam(db, emailer, candId, examId, email)
    {
        return new Promise((resolve, reject) => {
            db.Update("takenexam", ["finished"], ["1"], `candId=${candId} AND examId=${examId}`).then((result) => {
                //emailer.sendEmail("assem.alsahel@gmail.com", email, `${email} has finished the exam`, `Hurray! ${email} finished the exam! Go to your login page to find out more!`);
                resolve("success");
            }).catch((err) => reject(err));
        });
    }
    
    chooseAnswer(db, candId, answerId, qId)
    {
        return new Promise((resolve, reject) => {
            db.Update("testanswer", ["chosen"], ["0"], `testanswer.candId=${candId} AND qId=${qId}`).then((result) => {
                if(answerId != -1)
                {
                    db.Update("testanswer", ["chosen"], ["1"], `testanswer.candId=${candId} AND answerId=${answerId}`).then((result) => {
                        resolve("success");
                    }).catch((err) => reject(err));
                }
                else
                    resolve("success");
            }).catch((err) => reject(err));
        });
    }
    
    getAvailExams(db, email)
    {
        return new Promise((resolve, reject) => {
            db.Select("candidate, exam, takenexam", ["candidate.candId", "takenexam.examId", "takenexam.deadline", "takenexam.finished", "takenexam.sequence", "exam.name"], `candidate.candId = takenExam.candId AND takenexam.examId = exam.examId and candidate.email = '${email}' ORDER BY takenexam.sequence`).then((rows) => {
                if(rows.length > 0)
                {
                    var htmloutput = "";
                    var useSeq = false;
                    
                    if(rows[0].sequence != -1)
                        useSeq = true;
                    
                    for(var i = 0; i < rows.length; i++)
                    {
                        if(!this.checkDeadline(rows[i].deadline))
                        {
                            htmloutput += `<a>${rows[i].name}(Deadline Passed)</a><br>`;
                            continue;
                        }
                        
                        if(useSeq)
                        {
                            if(i == 0 && rows[0].finished[0] == 0)
                            {
                                htmloutput += `<a href="./exam?examid=${rows[0].examId}">${rows[0].name}</a><br>`;
                                resolve(htmloutput);
                                return;
                            }
                            
                            if(rows[i].finished[0] == 1)
                                continue;
                            
                            htmloutput += `<a href="./exam?examid=${rows[i].examId}">${rows[i].name}</a><br>`;
                            resolve(htmloutput);
                            return;
                        }
                        else
                        {
                            htmloutput += `<a href="./exam?examid=${rows[i].examId}">${rows[i].name}</a><br>`;
                        }
                    }
                    
                    resolve(htmloutput);
                }
                else
                {
                    resolve("notfound");
                }
            }).catch((err) => reject(err));
        });
    }
    
    populateModel(row)
    {
        var model = new modelFile();
        model.candId = row.candId;
        model.email = row.email;
        model.password = row.password;
        model.phoneNumber = row.phoneNumber;
        model.approved = row.approved;
        
        return model;
    }
}