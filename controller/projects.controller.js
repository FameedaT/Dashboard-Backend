var mongoose = require('mongoose'),
    async = require('async'),
    Organization = mongoose.model('organization'),
    Employee = mongoose.model('employee'),
    Project = mongoose.model('project');

exports.listProjs = function (req, res, next) {
    Project.find()
        .populate('organization')
        .populate('owner')
        .exec(function (err, projects) {
            if (err) {
                console.log("Unable to fetch Project list.");
                next(err);
            } else {
                res.send(projects);
            }
        });
}

exports.projById = function (req, res, next, projId) {
    Project.findOne({_id: projId})
        .populate('organization')
        .populate('owner')
        .exec(function (err, project) {
            if (err) {
                console.log("Error while fetching Project by Id");
                next(err);
            }
            if (project) {
                req.project = project;
                next();
            } else {
                var error = {
                    error: "Project not found"
                }
                res.status(404).send(error);
            }
        });
}

exports.getProjById = function (req, res) {
    res.send(req.project);
}

exports.updateProj = function (req, res) {
    var project = req.project;
    project.name = req.body.name;
    project.total_people = req.body.total_people;
    project.billable_headcount = req.body.billable_headcount;
    project.bench_strength = req.body.bench_strength;

    var tasks = [];
    var organization = req.body.organization;

    if (organization != undefined) {
        project.organization = undefined;
        tasks.push(function (callback) {
            Organization.findOne({_id: organization}, function (err, org) {
                if (err) {
                    console.log("Error while fetching Organization for Project." + err);
                }
                if (org) {
                    callback(err, {type: "organization", value: org});
                } else {
                    console.log("Error: Organization not found");
                }
            });
        });
    }
    var owner = req.body.owner;
    if (owner != undefined) {
        project.owner = undefined;
        tasks.push(function (callback) {
            Employee.findOne({_id: owner}, function (err, owner) {
                if (err) {
                    console.log("Error while fetching Owner of project." + err);
                }
                if (owner) {
                    callback(err, {type: "employee", value: owner});
                } else {
                    console.log("Error: Owner not found");
                }
            });
        });
    }
    async.parallel(
        tasks, function (err, results) {
            if (err) {
                console.log("Unable to fetch Organization and Employee.");
                console.log(err);
            } else {
                if (results) {
                    results.forEach(function (result) {
                        if (result.type === 'employee') {
                            project.owner = result.value;
                        }
                        else if (result.type === 'organization') {
                            project.organization = result.value;
                        }
                    });
                }
                console.log(project);
                project.save(function (err, project) {
                    if (err) {
                        console.log("Unable to update Project.");
                        console.log(err);
                    } else {
                        res.send(project);
                    }
                });
            }
        });

}


exports.createProj = function (req, res) {
    var tasks = [];
    var organization = req.body.organization;
    if (organization != undefined) {
        req.body.organization = undefined;
        tasks.push(function (callback) {
            Organization.findOne({_id: organization}, function (err, org) {
                if (err) {
                    console.log("Error while fetching Organization for Project." + err);
                }
                if (org) {
                    callback(err, {type: "organization", value: org});
                } else {
                    console.log("Error: Organization not found");
                }
            });
        });
    }
    var owner = req.body.owner;
    if (owner != undefined) {
        req.body.owner = undefined;
        tasks.push(function (callback) {
            Employee.findOne({_id: owner}, function (err, emp) {
                if (err) {
                    console.log("Error while fetching Owner of Project." + err);
                }
                if (emp) {
                    callback(err, {type: "employee", value: emp});
                } else {
                    console.log("Error: Employee not found");
                }
            });
        });
    }
    async.parallel(
        tasks, function (err, results) {
            if (err) {
                console.log("Unable to fetch Organization and Employee.");
                console.log(err);
            } else {
                var project = new Project(req.body);
                if (results) {
                    results.forEach(function (result) {
                        if (result.type == 'employee') {
                            project.owner = result.value;
                        }
                        else if (result.type == 'organization') {
                            project.organization = result.value;
                        }
                    });
                }
                project.save(function (err, project) {
                    if (err) {
                        console.log("Unable to save Project.");
                        console.log(err);
                    } else {
                        res.send(project);
                    }
                });
            }
        }
    );
}

exports.deleteProj = function (req, res) {
    var project = req.project;
    project.remove(function (err) {
        if (err) {
            console.log("Unable to delete Project");
            console.log(err);
            res.status(400).send(err.err);
        } else {
            res.send(project);
        }
    });
}