var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function () {
    var db = mongoose.connect(config.db, function (err) {
        if (err) {
            console.error('Unable to connect to MongoDB!');
            console.log(err);
        }
    });
    require('../models/project.model');
    require('../models/employee.model');
    require('../models/organization.model');

    return db; //Not required
}