const mongoose = require('mongoose');

const mockTestSchema = new mongoose.Schema({
    mockTestName: {
        type: String,
    },
    questions: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'questions',
                 }]
        

});

module.exports = mongoose.model('MockTest', mockTestSchema);
