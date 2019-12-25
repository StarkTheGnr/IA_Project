const modelFile = require('../Models/PositionModel.js');

module.exports = class PositionController
{
    constructor()
    {
        
    }
    
    getPositionId(db, name)
    {
        return new Promise((resolve, reject) => {
            db.Select("position", ["*"], `name='${name}'`).then((rows) => {
                resolve(rows[0].positionId);
            }).catch((err) => reject(err));
        });
    }
    
    getPositions(db)
    {
        return new Promise((resolve, reject) => {
            db.Select("position", ["*"], "").then((rows) => {
                let models = [];
                
                for(var i = 0; i < rows.length; i++)
                {
                    let model = new modelFile();
                    
                    model.positionId = rows[i].positionId;
                    model.name = rows[i].name;
                    
                    models.push(model);
                }
                
                resolve(models);
            }).catch((err) => reject(err));
        });
    }
    
    getOptionList(db)
    {
        return new Promise((resolve, reject) => {
            this.getPositions(db).then((data) => {
                var result = "";
                
                for(var i = 0; i < data.length; i++)
                {
                    result += `<option>${data[i].name}</option>\n`;
                }
                
                resolve(result);
            }).catch((err) => reject(err));
        });
    }
}