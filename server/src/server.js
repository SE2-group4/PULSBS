/**
 * main server module
 * here you can find all routes
 */
"use strict";

const cookieParser = require("cookie-parser");
const db = require("./db/Dao");
const express = require("express");
const jwt = require("express-jwt");
const morgan = require("morgan");
const prepareDb = require("./db/preparedb");

const General = require("./controllers/GeneralController");
const Student = require("./controllers/StudentController");
const { TeacherRouter, checkForExpiredLectures, nextCheck } = require("./controllers/TeacherController");
const { ManagerRouter } = require("./controllers/ManagerController");
const { SupportOfficerRouter } = require("./controllers/SupportOfficerController");
const colors = require("colors");
const { StandardErr } = require("./utils/utils");

const app = express();
app.disable("x-powered-by"); // security: do not show outside the server technology which has been used

const BASE_ROUTE = "/api/v1";
const JWT_SECRET = "1234567890";
const PORT = 3001;

app.use(express.json());
app.use(cookieParser());

morgan.token("host", function (req) {
    return "src: " + req.hostname;
});
app.use(morgan(":method".blue + " :url :host code: :status :res[content-length] - :response-time ms"));

// GENERAL HANDLERS (NO LOGIN NEEDED)
app.use(`${BASE_ROUTE}`, General);

app.get(`${BASE_ROUTE}/reset`, async (req, res) => {
    try {
        const dbPath = systemConf["dbPath"];
        const sqlPath = systemConf["--sql-path"];
        await prepareDb(dbPath, sqlPath, false);
        res.status(200).send("Success Reset");
    } catch (err) {
        res.status(400).send("Failed Reset");
    }
});

app.use(
    jwt({
        secret: JWT_SECRET,
        algorithms: ["HS256"],
        resultProperty: "userId",
        getToken: (req) => req.cookies.token,
    }).unless({ path: ["/login", "/logout"] })
);

app.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        res.status(401)
            .json(
                StandardErr.new(
                    "Login middleware",
                    StandardErr.errno.NOT_ALLOWED,
                    "login must be performed before this action",
                    401
                )
            )
            .end();
    } else {
        next();
    }
});

app.use(`${BASE_ROUTE}/students`, Student);
app.use(`${BASE_ROUTE}/teachers`, TeacherRouter);
app.use(`${BASE_ROUTE}/managers`, ManagerRouter);
app.use(`${BASE_ROUTE}/supportOfficers`, SupportOfficerRouter);

// every other routes get handled by this handler
app.all("/*", (req, res) => res.send("This route is not supported. Check the openapi doc"));

////////////////////////////////////////////////////////////////////////////////

// description: for demo purposes we are sending the email right now instead of waiting 23:59; alternatively call Teacher.nextCheck() for setting the time correctly)
function autorun() {
    setTimeout(async () => {
        try {
            await checkForExpiredLectures();
        } catch (err) {
            console.log("Error in server autorun");
        }
    }, 0);
}

const systemConf = {
    dbPath: "PULSBS.db",
    "--test": false, // set dbpath to testing.db
    "--no-autorun": false, // disable autorun
    "--sql-path": "PULSBS.sql", // set sql path
};

// Prevent adding new properties to systemConf. The properties's values can still be changed.
Object.seal(systemConf);

/**
 * parse command line options
 */
function parseOptions(options) {
    for (const option of options) {
        switch (option) {
            case "--test":
                systemConf["--test"] = "testing.db";
                systemConf["dbPath"] = "testing.db";
                break;
            case "--no-autorun":
                systemConf[option] = true;
                break;
            case "--sql-path":
                const index = options.indexOf(option);
                systemConf["--sql-path"] = options[index + 1];
                break;
            default:
                break;
        }
    }
}

function printConf() {
    console.info("Server running on " + `http://localhost:${PORT}${BASE_ROUTE}`.magenta);
    for (const [name, value] of Object.entries(systemConf)) {
        console.info(`${name.grey}: ${value}`);
    }
}

// "Main"
(async () => {
    try {
        console.info("Initializing the system");

        const options = process.argv.slice(2);
        parseOptions(options);

        if (!systemConf["--no-autorun"]) {
            autorun();
        }

        await db.init(systemConf["dbPath"]);
        app.listen(PORT, printConf);
    } catch (err) {
        console.info(err, "FAILED initializing the system".red);
        return process.exit(-1);
    }
})();
