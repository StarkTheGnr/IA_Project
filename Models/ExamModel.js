module.exports = class ExamModel
{
    constructor()
    {
        this.examId = -1;
        this.name = "";

        this.candidatesFK = [];
    }
}