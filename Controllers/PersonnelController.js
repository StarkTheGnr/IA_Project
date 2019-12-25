const modelFile = require('../Models/PersonModel.js');

module.exports = class PersonnelController
{
    constructor()
    {
        
    }
    
    populateModel(db, username)
    {
        return new Promise((resolve, reject) => {
            db.Select("personnel", ["*"], "username='" + username + "'").then((rows) => {
                this.model = new modelFile();
                
                this.model.personId = rows[0].personId;
                this.model.username = rows[0].username;
                this.model.password = rows[0].password;
                
                resolve(this.model);
            }).catch((err) => reject(err));
        });
    }
    
    Login(db, username, password)
    {
        return new Promise((resolve, reject) => {
            db.Select("personnel", ["*"], "username='" + username + "' AND password='" + password + "'").then((rows) => {
                if(rows.length > 0)
                {
                    resolve("loggedin");
                }
                else
                    resolve("notfound");
            }).catch((err) => reject(err));
        });
    }
    
    getCandidates(db, cc)
    {
        return new Promise((resolve, reject) => {
            db.Select("candidate", ["*"], "").then((rows) => {
                let models = [];
                
                for(var i = 0; i < rows.length; i++)
                {
                    let model = cc.populateModel(rows[i]);
                    models.push(model);
                }
                
                resolve(models);
            }).catch((err) => reject(err));
        });
    }
    
    getCandidatesAsHtmlLinks(db, cc, searchEmail)
    {
        return new Promise((resolve, reject) => {
            this.getCandidates(db, cc).then((data) => {
                var result = "";
                
                for(var i = 0; i < data.length; i++)
                {
                    if(searchEmail != "" && !data[i].email.includes(searchEmail))
                        continue;
                    result += `<a class='candidates cLink' href='candidate?id=${data[i].candId}'>${data[i].email}</a><br>\n`;
                }
                
                resolve(result);
            }).catch((err) => reject(err));
        });
    }
    
    approveCandidate(db, candId, seq, useSeq, deadline)
    {
        return new Promise((resolve, reject) => {
            var seqSplit = seq.split(",");
            for(let i = 0; i < seqSplit.length; i++)
            {
                db.Insert("takenexam", ["candId", "examId", "deadline", "finished", "sequence"], [`'${candId}'`, `'${seqSplit[i]}'`, `'${deadline}'`, `0`, `'${(useSeq === "true") ? i : -1}'`]).then((row) => {
                    if(i == seqSplit.length - 1)
                        resolve("done");
                }).catch(reject);
            }
        });
    }
}