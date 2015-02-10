var projController = require('../controller/projects.controller');

module.exports = function (app) {

    app.route('/api/projects')
        .get(projController.listProjs)
        .post(projController.createProj);

    app.route('/api/project/:projId')
        .get(projController.getProjById)
        .put(projController.updateProj)
        .delete(projController.deleteProj);

    app.param('projId', projController.projById);
};