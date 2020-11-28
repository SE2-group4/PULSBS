/**
 * load initial data into DB
 * @author Gastaldi Paolo
 */
"use strict";

const sqlite = require("sqlite3");
const fs = require("fs");
const path = require("path");
const StandardErr = require("../utils/utils");
const colors = require("colors");

/**
 * prepare the DB with default values
 * @param {String} dbpath
 * @param {String} dbscript
 * @param {Boolean} flag
 * @returns {Promise} promise
 */
function prepare(dbpath = "PULSBS.db", dbscript = "PULSBS.sql", flag = true) {
    return new Promise((resolve, reject) => {
        const cwd = __dirname;
        dbpath = path.join(cwd, dbpath);
        dbscript = path.join(cwd, dbscript);
        
        if (flag) {
            console.log(`RESETTING DB`.green);
            console.log(`Current file directory         ${cwd.green}`);
            console.log(`Opening database connection on ${dbpath.green}`);
            console.log(`Executing script at            ${dbscript.green}`);
        }

        const db = new sqlite.Database(dbpath, (err) => {
            if (err) {
                console.log("Error creating DB connection!");
                reject(StandardErr.fromDao(err));
                return;
            }
        });

        let count = 0; // line counter

        const dataSql = fs.readFileSync(dbscript).toString();
        const dataArr = dataSql.toString().split(/\r?\n/);
        dataArr.forEach((query, index, array) => array[index] = query.trim());
        
        db.serialize(() => {
            // db.run runs your SQL query against the DB
            db.run("PRAGMA foreign_keys=OFF;");
            db.run("BEGIN TRANSACTION;");

            // Loop through the `dataArr` and db.run each query
            dataArr.forEach((query) => {
                count++;
                if (query) {
                    db.run(query, (err) => {
                        if (err && flag) {
                            console.error(`> Error in line ${count}`);
                            console.log(err);
                            reject(StandardErr.fromDao(err));
                        }
                    });
                }
            });

            db.run("COMMIT;");

            // Close the DB connection
            db.close((err) => {
                if (err) {
                    reject(StandardErr.fromDao(err));
                    return;
                }

                console.log(`The db at ${dbpath} has been reset`.cyan);
                resolve();
            });
        });
    });
}

if (require.main === module) {
    // if called from command line
    const args = process.argv.slice(2);
    prepare(args[0], args[1], args[2])
        .catch((err) => {
            console.log("Something went wrong");
            console.log(err);
        });
}

module.exports = prepare;
