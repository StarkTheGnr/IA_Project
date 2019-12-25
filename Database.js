const mysql = require('mysql');

module.exports = class Database
{
    constructor()
    {
        this.state = "disconnected";
        
        this.connection = mysql.createConnection({
           host: "localhost",
            user: "root",
            password: "1234*",
            database: "iaproject"
        });
    }
    
    Connect()
    {
        return new Promise((resolve, reject) => {
            if(this.state !== "disconnected")
            {
                resolve();
                return
            }
                    
            this.state = "connecting";
            this.connection.connect((err) => {
               if(err) 
               {
                   reject(err);
                   return;
               }
                
                this.state = "connected";
                console.log("Connected to database successfully!");
                resolve();
            });
        });
    }
    
    Select(table, columns, whereClause)
    {
        return new Promise((resolve, reject) => {
            this.Connect().then(() => {
                if(!this.connection)
                {
                    reject("No Connection!");
                    return;
                }

                let query = "SELECT " + columns[0];
                for(let i = 1; i < columns.length; i++)
                {
                    query += ", " + columns[i];
                }

                query += " FROM " + table;
                if(whereClause !== "")
                    query += " WHERE " + whereClause + ";";

                this.connection.query(query, (err, rows) => {
                   if(err) 
                   {
                       reject(err);
                       return;
                   }

                    resolve(rows);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
    
    Delete(table, whereClause)
    {
        return new Promise((resolve, reject) => {
            this.Connect().then(() => {
                if(!this.connection)
                {
                    reject("No Connection!");
                    return;
                }

                let query = "DELETE FROM " + table;

                if(whereClause !== "")
                    query += " WHERE " + whereClause + ";";

                this.connection.query(query, (err, rows) => {
                   if(err) 
                   {
                       reject(err);
                       return;
                   }

                    resolve(rows);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
    
    Insert(table, columns, values)
    {
        return new Promise((resolve, reject) => {
            this.Connect().then(() => {
                if(!this.connection)
                {
                    reject("No Connection!");
                    return;
                }

                let query = "INSERT INTO `" + table + "`(`" + columns[0] + "`";
                for(let i = 1; i < columns.length; i++)
                {
                    query += ", `" + columns[i] + "`";
                }

                query += ") VALUES (" + values[0];
                for(let i = 1; i < columns.length; i++)
                {
                    query += ", " + values[i];
                }
                query += ");";
                
                this.connection.query(query, (err, res) => {
                   if(err) 
                   {
                       reject(err);
                       return;
                   }

                    resolve(res);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
    
    Update(table, columns, values, whereClause)
    {
        return new Promise((resolve, reject) => {
            this.Connect().then(() => {
                if(!this.connection)
                {
                    reject("No Connection!");
                    return;
                }

                let query = "UPDATE `" + table + "` SET `" + columns[0] + "` = " + values[0];
                for(let i = 1; i < columns.length; i++)
                {
                    query += ", `" + columns[i] + "` = " + values[i];
                }
                
                if(whereClause !== "")
                    query += " WHERE " + whereClause + ";";
                
                this.connection.query(query, (err, res) => {
                   if(err) 
                   {
                       reject(err);
                       return;
                   }

                    resolve(res);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
}