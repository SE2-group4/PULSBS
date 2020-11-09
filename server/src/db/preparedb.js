/**
 * load initial data into DB 
 * @author Gastaldi Paolo
 */
'use strict';

const sqlite = require('sqlite3');
const fs = require('fs');
const path = require('path');
const { resolve } = require('path');
const { rejects } = require('assert');

/**
 * prepare the DB with default values
 * @param {String} dbpath
 * @param {String} dbscript 
 * @param {Boolean} flag 
 * @returns {Promise} promise
 */
function prepare(dbpath = './testing.db', dbscript = './testing.sql', flag = true) {
    return new Promise((resolve, reject) => {
        if(flag) {
            console.log(`Working on ${__dirname}`);
            console.log(`Opening database connection on ${dbpath} to execute the script ${dbscript}`);
        }

        const db = new sqlite.Database(path.resolve(__dirname, dbpath), (err) => {
            if(err) 
                console.log("Error creating DB connection!");
        });

        let count = 0; // line counter

        if(flag) console.log("Preparing your DB...");

        const dataSql = fs.readFileSync(path.resolve(__dirname, dbscript)).toString();
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
                if(err) {
                    rejects(err);
                    return;
                }
                
                resolve();
            });
        });
    });
}

if(require.main === module) // if called from command line
    prepare().then(() => {
        console.log("The testing DB is ready, enjoy! :)");
    });

module.exports = prepare;