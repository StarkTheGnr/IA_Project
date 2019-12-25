module.exports = class CandidateModel
{
    constructor()
    {
        this.candId = -1;
        this.email = "";
        this.password = "";
        this.phoneNumber = "";
        this.approved = -1;

        this.examsFK = [];
    }
}