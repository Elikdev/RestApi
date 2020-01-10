const mongoose = require('mongoose');

const tutorShema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		course: {
			type: String,
			required: true
		},
		level: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		mobile_num: {
			type: Number,
			required: true
		},
		details: {
			type: String,
			required: true
		}
	},
	{
		timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
	}
);

module.exports = mongoose.model('Tutor', tutorShema);
