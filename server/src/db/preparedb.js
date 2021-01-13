/**
 * load initial data into DB
 * @author Gastaldi Paolo
 */
"use strict";

const sqlite = require("sqlite3");
const fs = require("fs");
const path = require("path");
const {StandardErr} = require("../utils/utils.js");
const colors = require("colors");

/**
 * prepare the DB with default values
 * @param {String} dbpath
 * @param {String} dbscript
 * @param {Boolean} flag
 * @returns {Promise} promise
 */
function prepare(dbpath = "PULSBS.db", dbscript = "PULSBS.sql", flag = false) {
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

        let dataSql = fs.readFileSync(dbscript).toString();

        dataSql = dataSql.replace(/--(.*?)\r?\n|\r/g, ' '); // remove comments
        dataSql = dataSql.replace(/\r?\n|\r/g, ' '); // remove newline
        dataSql = dataSql.replace('\t', ' '); // remove tabs
        dataSql = dataSql.replace(/\s\s+/g, ' '); // remove multiple spaces

        // extract triggers
        const regex = /(?:CREATE TRIGGER(.*?)END;)/ig; // 'i' flag: ignore upper/lower-case, 'g' flag: use groups
        const it = dataSql.toUpperCase().matchAll(regex);
        const results = Array.from(it);
        const triggers = [];
        for(let i = results.length-1; i >= 0; i--) { // delete in reverse order
            const res = results[i]; // for each matched group
            if(flag) {
                console.log(res[0].cyan);
                console.log(res.index);
            }
            const t = res[0]; // get the matched string
            triggers[results.length-i] = t; // insert in the correct order
            dataSql = dataSql.substr(0, res.index) + dataSql.substr(res.index + res[0].length); // remove the trigger from normal queries
        }

        // extract normal queries
        let dataArr = dataSql.split(";");
        dataArr.forEach((query, index, array) => (array[index] = query.trim()));
        // dataArr = dataArr.filter((item) => !(item.startsWith('--') || item.trim() === ''));
        if(flag)
            console.log(dataArr.slice(150));

        db.serialize(() => {
            // db.run runs your SQL query against the DB
            db.run("PRAGMA foreign_keys=OFF;");
            db.run("BEGIN TRANSACTION;");

            // Loop through the `dataArr` and db.run each query
            dataArr.forEach((query) => {
                count++;
                if(!query || query.startsWith('--') || query.trim() === '') // remove comments and empty queries
                    return;
                    
                query += ";";
                db.run(query, (err) => {
                    if(flag) {
                        console.log('\nRunning normal query:'.magenta);
                        console.log(query);
                    }

                    if (err && flag) {
                        console.error(`> Error in line ${count}`);
                        console.log(query);
                        console.log(err);
                        if (require.main === module) reject(err);
                        else reject(StandardErr.fromDao(err));
                    }
                });
            });

            triggers.forEach((query) => {
                count++;

                db.run(query, (err) => {
                    if(flag) {
                        console.log('\nRunning trigger:'.magenta);
                        console.log(query);
                    }

                    if (err && flag) {
                        console.error(`> Error in line ${count}`);
                        console.log(query);
                        console.log(err);
                        if (require.main === module) reject(err);
                        else reject(StandardErr.fromDao(err));
                    }
                });
            });

            db.run("COMMIT;");

            // Close the DB connection
            db.close((err) => {
                if (err) {
                    reject(StandardErr.fromDao(err));
                    return;
                }

                if (flag) console.log(`The db at ${dbpath} has been reset`.cyan);
                resolve();
            });
        });
    });
}

if (require.main === module) {
    // if called from command line
    const args = process.argv.slice(2);
    prepare(args[0], args[1], args[2]).catch((err) => {
        console.log("Something went wrong");
        console.log(err);
    });
}

module.exports = prepare;
