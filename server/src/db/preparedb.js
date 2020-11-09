/**
 * load initial data into DB 
 * @author Gastaldi Paolo
 */
'use strict';

const sqlite = require('sqlite3');
const fs = require('fs');

/**
 * prepare the DB with default values
 * @param {String} path 
 * @param {Function} cb 
 * @param {Boolean} flag 
 */
function prepare(path = './testing.db', cb, flag) {
    const db = new sqlite.Database(path, (err) => {
        if(err) 
            console.log("Error creating DB connection!");
    });

    let count = 0; // line counter

    if(flag) console.log("Preparing your DB...");

    const dataSql = fs.readFileSync('./testing.sql').toString();
    const dataArr = dataSql.toString().split(';');

    db.serialize(() => {
        // db.run runs your SQL query against the DB
        db.run('PRAGMA foreign_keys=OFF;');
        db.run('BEGIN TRANSACTION;');
        // Loop through the `dataArr` and db.run each query
        dataArr.forEach((query) => {
            count++;
            if(query) {
                db.run(query, (err) => {
                    if(err && flag){
                        console.error(`> Error in line ${count}`);
                        console.error(err);
                    }
                });
            }
        });
        db.run('COMMIT;');

        // Close the DB connection
        db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            if(flag) console.log("The testing DB is ready, enjoy! :)");
    
            if(cb) cb();
        });
    });
}

if (require.main === module) // if called from command line
    prepare();

module.exports.prepare = prepare;