var orgController = require('../controller/organizations.controller.js');

module.exports = function (app) {

    app.route('/api/organizations')
        .get(orgController.listOrgs)
        .post(orgController.createOrg);

    app.route('/api/organization/:orgId')
        .get(orgController.getOrgById)
        .put(orgController.updateOrg)
        .delete(orgController.deleteOrg);

    app.param('orgId', orgController.orgById);
};