var dashboardController = require('../controller/dashboard.controller');

module.exports = function (app) {

    app.route("/api/dashboard")
        .get(dashboardController.list);

};