module.exports = class Question
{
    constructor()
    {
        this.qId = -1;
        this.body = "";
        this.examId = -1;
    
        this.answersFK = [];
    }
}