/**
 * Officer entity
 * @author Lorenzo Appendini
 * @version 1.0.0
 */
'use strict';

const User = require('./User.js');

class Officer extends User {
    /**
     * class constructor
     * @param {Number} officerId 
     * @param {String} firstName 
     * @param {String} lastName 
     * @param {String} email 
     * @param {String} password 
     */
    constructor(officerId = -1, firstName = null, lastName = null, email = null, password = null) {
        super(officerId, firstName, lastName, email, password);
        this.officerId = officerId;
    }

    /**
     * create a new officer from a generic object
     * @param {Object} obj
     * @returns {Officer} new officer
     */
    static from(obj) {
        const officer = Object.assign(new Officer(), obj);
        if (obj.userId)
            officer.officerId = obj.userId;
        officer.password = null; // default security option
        return officer;
    }
}

module.exports = Officer;