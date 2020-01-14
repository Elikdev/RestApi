const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
	{
		firstname: {
			type: String,
			required: true
		},
		lastname: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		profile_details: {
			type: String,
			required: true
		},
		role: {
			type: String,
			default: 'basic',
			enum: ['basic', 'tutor', 'admin']
		},
		accessToken: {
			type: String
		}
	},
	{
		timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
	}
);

module.exports = mongoose.model('User', userSchema);
