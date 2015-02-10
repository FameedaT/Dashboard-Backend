var mongoose = require('mongoose'),
    async = require('async'),
    Organization = mongoose.model('organization'),
    Employee = mongoose.model('employee'),
    Project = mongoose.model('project');

exports.listEmps = function (req, res, next) {
    Employee.find()
        .populate('organization')
        .populate('projects')
        .populate('updatedBy')
        .exec(function (err, employees) {
            if (err) {
                console.log("Unable to fetch Employees list.");
                next(err);
            }
            res.send(employees);
        });
}

exports.empById = function (req, res, next, empId) {
    Employee.findOne({_id: empId})
        .populate('organization')
        .populate('projects')
        .populate('updatedBy')
        .exec(function (err, employee) {
            if (err) {
                console.log("Error while fetching Employee by Id");
                next(err);
            }
            if (employee) {
                req.employee = employee;
                next();
            } else {
                var error = {
                    error: "Employee not found"
                }
                res.status(404).send(error);
            }
        });
}

exports.getEmpById = function (req, res) {
    res.send(req.employee);
}

exports.updateEmp = function (req, res) {
    var employee = req.employee;
    employee.firstName = req.body.firstName;
    employee.lastName = req.body.lastName;
    employee.role = req.body.role;
    employee.skills = req.body.skills;
    employee.experience = req.body.experience;
    employee.billable = req.body.billable;
    employee.updatedDate = Date.now();

    if (req.body.organization != undefined) {
        employee.organization = req.body.organization;
    }

    if (req.body.updatedBy != undefined) {
        employee.updatedBy = req.body.updatedBy;
    }

    if (req.body.projects != undefined) {
        employee.projects = req.body.projects;
    }

    employee.save(function (err) {
        if (err) {
            console.log("Unable to save Employee.");
            console.log(err);
        } else {
            res.send(employee);
        }
    });
}


exports.createEmp = function (req, res) {
    var employee = new Employee(req.body);
    employee.save(function (err) {
        if (err) {
            console.error('Error in employee create()');
            console.error(err);
            res.status(400).send(err);
        } else {
            res.send(employee);
        }
    });
}

exports.deleteEmp = function (req, res) {
    var employee = req.employee;
    employee.remove(function (err) {
        if (err) {
            console.log("Unable to delete Employee");
            console.log(err);
            res.status(400).send(err.err);
        } else {
            res.send(employee);
        }
    });
}