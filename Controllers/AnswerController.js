const modelFile = require('../Models/AnswerModel.js');

module.exports = class AnswerController
{
    constructor()
    {
        
    }
    
    getAnswers(db, questionId)
    {
        return new Promise((resolve, reject) => {
            db.Select("answer", ["*"], `qId='${questionId}' ORDER BY correct DESC`).then((rows) => {
                var answers = [];
                for(var i = 0; i < rows.length; i++)
                {
                    answers.push(this.populateModel(rows[i]));
                }
                
                resolve(answers);
            }).catch((err) => reject(err));
        });
    }
    
    populateModel(row)
    {
        var model = new modelFile();
        model.answerId = row.answerId;
        model.body = row.body;
        model.correct = row.correct;
        model.qId = row.qId;
        
        return model;
    }
}