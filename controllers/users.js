require('dotenv').config();
const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.registerUser = (req, res) => {
	//Validate user

	let errors = [];

	if (!req.body.firstname) {
		errors.push({
			text: 'Please enter your firstname!'
		});
	}
	if (!req.body.lastname) {
		errors.push({
			text: 'Please enter your lastname!'
		});
	}
	if (!req.body.email) {
		errors.push({
			text: 'Please enter your email!'
		});
	}
	if (!req.body.role) {
		errors.push({
			text: 'Please add a role!'
		});
	}
	if (!req.body.password) {
		errors.push({
			text: 'Please enter your password'
		});
	}

	//check if there are no errors
	if (errors.length > 0) {
		res.status(404).json({
			message: 'Oops! There was an error while signing up, try again later',
			error: errors
		});
	} else {
		//check if email already exist
		User.findOne({ email: req.body.email })
			.then(user => {
				if (!user) {
					//hash password before saving to the database
					bcrypt.hash(req.body.password, 10).then(hashedPasword => {
						//add new user
						const user = new User({
							firstname: req.body.firstname,
							lastname: req.body.lastname,
							email: req.body.email,
							role: req.body.role,
							password: hashedPasword,
							profile_details: req.body.profile_details
						});

						//save user to database
						user
							.save()
							.then(() => {
								res.status(201).json({
									message: 'user created successfully!'
								});
							})
							.catch(error => {
								res.status(500).json({
									message: 'user was not created',
									error: error.message
								});
							});
					});
				} else {
					res.status(400).json({
						message: 'Oops! Change your email... Email exists already'
					});
				}
			})
			.catch(err => {
				res.status(500).json({
					error: err
				});
			});
	}
};

exports.loginUser = (req, res) => {
	//check if email is registered in the database
	User.findOne({ email: req.body.email })
		.then(user => {
			if (!user) {
				res.status(401).json({
					message: 'Incorrect details!'
				});
			} else {
				//compare the entered password with the hashed password in the database
				bcrypt
					.compare(req.body.password, user.password)
					.then(valid => {
						if (!valid) {
							return res.status(401).json({
								message: 'Password does not match the email entered!'
							});
						}
						//generate a token for the user
						const token = jwt.sign(
							{ userId: user._id },
							process.env.ACCESS_TOKEN
						);
						res.status(200).json({
							message: 'User logged in successfully!',
							id: user._id,
							token: token
						});
					})
					.catch(error => {
						res.status(500).json({
							message: 'Error in password compare!',
							error: error.message
						});
					});
			}
		})
		.catch(error => {
			res.status(501).json({
				message: 'Error in signing in user',
				error: error.message
			});
		});
};

exports.updateUserProfile = (req, res) => {
	const user = new User({
		_id: req.params.id,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email,
		role: req.body.role,
		password: req.body.password,
		profile_details: req.body.profile_details
	});

	//verify the token in the header before allowing update
	jwt.verify(req.token, process.env.ACCESS_TOKEN, err => {
		if (err) {
			res.status(403).json({
				message: 'You do not have access to this page!'
			});
		} else {
			User.updateOne({ _id: req.params.id }, user)
				.then(() => {
					res.status(202).json({
						message: 'profile updated successfully'
					});
				})
				.catch(error => {
					res.status(501).json({
						message: 'error in updating user profile!',
						error: error.message
					});
				});
		}
	});
};
