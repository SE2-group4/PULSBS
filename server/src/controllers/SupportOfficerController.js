const express = require("express");
const router = express.Router();
const Officer = require("../services/SupportOfficerService");
const utils = require("../utils/writer");

router.post("/:supportId/uploads/students", manageEntitiesUpload);
router.post("/:supportId/uploads/courses", manageEntitiesUpload);
router.post("/:supportId/uploads/teachers", manageEntitiesUpload);
router.post("/:supportId/uploads/lectures", manageEntitiesUpload);
router.post("/:supportId/uploads/classes", manageEntitiesUpload);
module.exports.SupportOfficerRouter = router;

const stdTests = `[{"Id":"900000","Name":"Ambra","Surname":"Ferri","City":"Poggio Ferro","OfficialEmail":"s900000@students.politu.it","Birthday":"1991-11-04","SSN":"MK97060783"},{"Id":"900001","Name":"Gianfranco","Surname":"Trentini","City":"Fenestrelle","OfficialEmail":"s900001@students.politu.it","Birthday":"1991-11-05","SSN":"SP80523410"},{"Id":"900002","Name":"Maria Rosa","Surname":"Pugliesi","City":"Villapiccola","OfficialEmail":"s900002@students.politu.it","Birthday":"1991-11-05","SSN":"ZO70355767"},{"Id":"900003","Name":"Benito","Surname":"Angelo","City":"Appiano Strada Vino","OfficialEmail":"s900003@students.politu.it","Birthday":"1991-11-06","SSN":"FH21915512"},{"Id":"900004","Name":"Algiso","Surname":"Arcuri","City":"Ambrogio","OfficialEmail":"s900004@students.politu.it","Birthday":"1991-11-09","SSN":"KU71485501"},{"Id":"900005","Name":"Costantino","Surname":"Genovese","City":"Zollino","OfficialEmail":"s900005@students.politu.it","Birthday":"1991-11-09","SSN":"DZ27229300"},{"Id":"900006","Name":"Medardo","Surname":"Bianchi","City":"San Nicolo' A Tordino","OfficialEmail":"s900006@students.politu.it","Birthday":"1991-11-10","SSN":"FO42789345"},{"Id":"900007","Name":"Felice","Surname":"Cocci","City":"Colle","OfficialEmail":"s900007@students.politu.it","Birthday":"1991-11-11","SSN":"DC3938219"},{"Id":"900008","Name":"Gastone","Surname":"Buccho","City":"Monte Antico","OfficialEmail":"s900008@students.politu.it","Birthday":"1991-11-12","SSN":"PN69370639"},{"Id":"900009","Name":"Olga","Surname":"Beneventi","City":"Palmori","OfficialEmail":"s900009@students.politu.it","Birthday":"1991-11-13","SSN":"NT60462698"}]`;
const stdEntities = JSON.parse(stdTests);

function manageEntitiesUpload(req, res) {
    Officer.manageEntitiesUpload(stdEntities, req.path)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
}
