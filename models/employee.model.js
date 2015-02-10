var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var employeeSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    role: {
        type: String
    },
    skills: [
        {type: String}
    ],
    experience: {
        type: Number
    },
    billable: {
        type: Boolean
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'organization'
    },
    projects: [
        {
            type: Schema.ObjectId,
            ref: 'project'
        }
    ],
    updatedDate: {type: Date, default: Date.now},
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'employee'
    }
});

mongoose.model('employee', employeeSchema);