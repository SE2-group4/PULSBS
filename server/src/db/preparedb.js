/**
 * load initial data into DB 
 * @author Gastaldi Paolo
 */
'use strict';

const sqlite = require('sqlite3');
const fs = require('fs');
const path = require('path');

/**
 * prepare the DB with default values
 * @param {String} dbpath
 * @param {String} dbscript 
 * @param {Boolean} flag 
 * @returns {Promise} promise
 */
function prepare(dbpath = 'PULSBS.db', dbscript = 'PULSBS.sql', flag = true) {
    return new Promise((resolve, reject) => {
        if(flag) {
            const cwd = __dirname;
            dbpath = path.join(cwd, dbpath);
            dbscript = path.join(cwd, dbscript);
            console.log(`Working on ${cwd}`);
            console.log(`Opening database connection on ${dbpath} to execute the script ${dbscript}`);
        }

        const db = new sqlite.Database(dbpath, (err) => {
            if(err) {
                console.log("Error creating DB connection!");
                reject(err);
                return;
            }
        });

        let count = 0; // line counter

        if(flag) console.log("Preparing your DB...");

        const dataSql = fs.readFileSync(dbscript).toString();
        const dataArr = dataSql.toString().split(';');

        db.serialize(() => {
            // db.run runs your SQL query against the DB
            db.run('PRAGMA foreign_keys=OFF;');
            db.run('BEGIN TRANSACTION;');
            // Loop through the `dataArr` and db.run each query
            dataArr.forEach((query) => {
                count++;
                if(query && (query.trim() !== '')) {
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
                if(err) {
                    rejects(err);
                    return;
                }
                
                resolve();
            });
        });
    });
}

if(require.main === module) { // if called from command line
    const args = process.argv.slice(2);
    prepare(args[0], args[2], args[3]).then(() => {
        console.log("The testing DB is ready, enjoy! :)");
    });
}

module.exports = prepare;