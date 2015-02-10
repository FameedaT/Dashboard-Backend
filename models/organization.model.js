var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var organizationSchema = new Schema({
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
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'employee'
    },
    updatedDate: {type: Date, default: Date.now},
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'employee'
    }
});

mongoose.model('organization', organizationSchema);