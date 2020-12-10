/**
 * Manager entity
 * @author Lorenzo Ceccarelli
 * @version 1.0.0
 */
'use strict';

const User = require('./User.js');

class Manager extends User {
    /**
     * class constructor
     * @param {Number} managerId 
     * @param {String} firstName 
     * @param {String} lastName 
     * @param {String} email 
     * @param {String} password 
     */
    constructor(managerId = -1, firstName = null, lastName = null, email = null, password = null) {
        super(managerId, firstName, lastName, email, password);
        this.managerId = managerId;
    }

    /**
     * create a new manager from a generic object
     * @param {Object} obj
     * @returns {Teacher} new manager
     */
    static from(obj) {
        const manager = Object.assign(new Manager(), obj);
        if (obj.userId)
            manager.managerId = obj.userId;
        manager.password = null; // default security option
        return manager;
    }
}

module.exports = Manager;
