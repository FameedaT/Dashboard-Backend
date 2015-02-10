var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var projectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    total_people: {
        type: Number,
        default: 0
    },
    billable_headcount: {
        type: Number,
        default: 0
    },
    bench_strength: {
        type: Number,
        default: 0
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'organization'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'employee'
    }
});

mongoose.model('project', projectSchema);