var empController = require('../controller/employees.controller');

module.exports = function (app) {

    app.route('/api/employees')
        .get(empController.listEmps)
        .post(empController.createEmp);

    app.route('/api/employee/:empId')
        .get(empController.getEmpById)
        .put(empController.updateEmp)
        .delete(empController.deleteEmp);

    app.param('empId', empController.empById);
};