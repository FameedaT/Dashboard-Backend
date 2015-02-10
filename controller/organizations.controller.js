var mongoose = require('mongoose'),
    async = require('async'),
    Organization = mongoose.model('organization'),
    Employee = mongoose.model('employee'),
    Project = mongoose.model('project');

exports.listOrgs = function (req, res, next) {
    Organization.find()
        .populate('owner')
        .populate('updatedBy')
        .exec(function (err, organizations) {
            if (err) {
                console.log("Unable to fetch Organization list.");
                next(err);
            } else {
                var tasks = [];
                organizations.forEach(function (org) {
                    tasks.push(function (callback) {
                        Project.find({organization: org}, function (err, result) {
                            if (err) {
                                console.log("Unable to fetch Projects.");
                            }
                            if (result) {
                                org.projects = result;
                                callback(err, org);
                            } else {
                                console.log("No projects found");
                            }
                        });
                    });
                });

                async.parallel(tasks, function (err, orgs) {
                    if (err) {
                        console.log("Unable to fetch Organizations with Projects.");
                        next(err);
                    } else {
                        res.send(orgs);
                    }
                });
            }
        });
}

exports.orgById = function (req, res, next, orgId) {
    Organization.findOne({_id: orgId})
        .populate('owner')
        .populate('updatedBy')
        .exec(function (err, item) {
            if (err) {
                console.log("Error while fetching Org by Id");
                next(err);
            }
            if (item) {
                req.org = undefined;
                var tasks = [];
                tasks.push(function (callback) {
                    Project.find({organization: item}, function (err, result) {
                        if (err) {
                            console.log("Unable to fetch Projects for Org.");
                        }
                        if (result) {
                            item.projects = result;
                            callback(err, item);
                        } else {
                            console.log("No projects found");
                        }
                    });
                });

                async.parallel(tasks, function (err, org) {
                    if (err) {
                        console.log("Unable to fetch Organizations with Projects.");
                        next(err);
                    } else {
                        req.org = item;
                        next();
                    }
                });
            } else {
                var error = {
                    error: "Organization not found"
                }
                res.status(404).send(error);
            }
        }
    );
}

exports.getOrgById = function (req, res) {
    res.send(req.org);
}

exports.updateOrg = function (req, res) {
    var org = req.org;
    org.name = req.body.name;
    org.total_people = req.body.total_people;
    org.billable_headcount = req.body.billable_headcount;
    org.bench_strength = req.body.bench_strength;

    if (req.body.owner != undefined) {
        org.owner = req.body.owner;
    }

    if (req.body.updatedBy != undefined) {
        org.updatedBy = req.body.updatedBy;
    }

    org.updatedDate = Date.now();
    org.save(function (err) {
        if (err) {
            console.log("Unable to save organization.");
            console.log(err);
        } else {
            res.send(org);
        }
    });
}


exports.createOrg = function (req, res) {
    var org = new Organization(req.body);
    org.owner = undefined;
    org.updatedBy = undefined;
    if (req.body.owner != undefined) {
        org.owner = req.body.owner;
    }
    if (req.body.updatedBy != undefined) {
        org.updatedBy = req.body.updatedBy;
    }
    org.updatedDate = Date.now();
    console.log("Org to save " + org);
    org.save(function (err) {
        if (err) {
            console.log("Unable to save organization.");
            console.log(err);
        } else {
            res.send(org);
        }
    });
}

exports.deleteOrg = function (req, res) {
    var org = req.org;
    org.remove(function (err) {
        if (err) {
            console.log("Unable To remove Organization");
            console.log(err);
            res.status(400).send(err.err);
        } else {
            res.send(org);
        }
    });
}