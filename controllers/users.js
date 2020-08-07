require('dotenv').config();
const User = require('../models/Users');
const Tutor = require('../models/Tutors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.registerForm = (req, res) => {
	res.render('register');
};
exports.registerUser = (req, res) => {
	//Validate user
	let {
		firstname,
		lastname,
		email,
		password,
		profile_details,
		role,
	} = req.body;

	let errors = [];

	if (!firstname) {
		errors.push({
			text: 'Please enter your firstname!',
		});
	}
	if (!lastname) {
		errors.push({
			text: 'Please enter your lastname!',
		});
	}
	if (!email) {
		errors.push({
			text: 'Please enter your email!',
		});
	}

	if (!password) {
		errors.push({
			text: 'Please enter your password',
		});
	}
	if (!profile_details) {
		errors.push({
			text: 'Please add some details about yourself',
		});
	}

	//check if there are no errors
	if (errors.length > 0) {
		res.status(500).json({
			error: 'new error, cannot register user!',
		});
		// res.render('register', {
		// 	errors,
		// 	firstname,
		// 	lastname,
		// 	email,
		// 	password,
		// 	profile_details
		// });
	} else {
		//check if email already exist
		User.findOne({ email: email })
			.then((user) => {
				if (!user) {
					//hash password before saving to the database
					bcrypt.hash(password, 10).then((hashedPasword) => {
						//add new user
						const user = new User({
							firstname: firstname,
							lastname: lastname,
							email: email,
							role: role || 'basic',
							password: hashedPasword,
							profile_details: profile_details,
						});
						accessToken = jwt.sign(
							{ userId: user._id, userRole: user.role },
							process.env.ACCESS_TOKEN,
							{ expiresIn: '1d' }
						);
						user.accessToken = accessToken;
						//save user to database
						user
							.save()
							.then(() => {
								res.status(201).json({
									message: 'user created successfully!',
									accessToken: accessToken,
									user: user,
								});
							})
							.catch((error) => {
								res.status(500).json({
									message: 'user was not created',
									error: error.message,
								});
							});
					});
				} else {
					res.status(400).json({
						message: 'Oops! Change your email... Email exists already',
					});
				}
			})
			.catch((err) => {
				res.status(500).json({
					error: err,
				});
			});
	}
};

exports.loginForm = (req, res) => {
	res.render('login');
};

exports.loginUser = (req, res) => {
	//check if email is registered in the database
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				res.status(401).json({
					message: 'Incorrect details!',
				});
			} else {
				//compare the entered password with the hashed password in the database
				bcrypt
					.compare(req.body.password, user.password)
					.then((valid) => {
						if (!valid) {
							return res.status(401).json({
								message: 'Password does not match the email entered!',
							});
						}
						//generate a token for the user
						const accessToken = jwt.sign(
							{ userId: user._id, userRole: user.role },
							process.env.ACCESS_TOKEN,
							{ expiresIn: '1d' }
						);
						User.findByIdAndUpdate(
							user._id,
							{ accessToken },
							{ useFindAndModify: false }
						)
							.then(() => {
								res.status(200).json({
									message: 'User logged in successfully!',
									id: user._id,
									role: user.role,
									accessToken: accessToken,
								});
							})
							.catch((err) => {
								res.status.json({
									message: 'Login was not successful',
								});
							});
					})
					.catch((error) => {
						res.status(500).json({
							message: 'Error in password compare!',
							error: error.message,
						});
					});
			}
		})
		.catch((error) => {
			res.status(501).json({
				message: 'Error in signing in user',
				error: error.message,
			});
		});
};

// {{
// 	$push: {
// 		data: {
// 			data_1: data_1,
// 			data_2: data_2
// 		}
// 	}
// }, new: true, useFindAndModify: false}

exports.updateUserProfile = (req, res) => {
	const user = req.body;

	//verify the token in the header before allowing update
	const { userRole, exp } = jwt.verify(req.token, process.env.ACCESS_TOKEN);
	//check if token has expired
	if (exp < Date.now().valueOf() / 1000) {
		return res.status(401).json({ error: 'JWT has expired' });
	}
	if (userRole == 'basic') {
		return res.status(403).json({ error: 'Not authorized to view this page' });
	}

	User.updateOne({ _id: req.params.id }, user)
		.then(() => {
			res.status(202).json({
				message: 'profile updated successfully',
			});
		})
		.catch((error) => {
			res.status(501).json({
				message: 'error in updating user profile!',
				error: error.message,
			});
		});
};

exports.tutorsearch = (req, res) => {
	Tutor.findOne({ email: req.body.email })
		.then((found) => {
			if (found) {
				User.findOne({ email: found.email })
					.then((user) => {
						res.status(200).json({
							message: `${found.name} is a tutor and a user!`,
							user: user,
						});
					})
					.catch((err) => {
						res.status(500).json({
							error: err.message,
						});
					});
			} else {
				res.status(500).json({
					message: `${req.body.email} is not a registered tutor`,
				});
			}
		})
		.catch((error) => {
			res.status(500).json({
				error: error.message,
			});
		});
};

exports.getAllUsers = (req, res) => {
	const { userId, userRole, exp } = jwt.verify(
		req.token,
		process.env.ACCESS_TOKEN
	);

	//check if token has expired
	if (exp < Date.now().valueOf() / 1000) {
		res.status(401).json({
			message: 'Token has expired, go generate a new token!',
		});
	}
	if (userRole == 'basic') {
		res.status(401).json({
			message: 'You do not have access to this page!',
		});
	}
	if (userRole == 'tutor') {
		res.status(401).json({
			message: 'You do not have access to this page!',
		});
	}

	if (userRole == 'admin') {
		User.findById(userId)
			.then((user) => {
				if (!user) {
					//do not show all the available users
					res.status(403).json({
						message: 'You are not authorized to access this page',
					});
				} else {
					User.find({})
						.then((users) => {
							const length = users.length;
							for (i = 0; i < length; i++) {
								const role = users[i].role;
								const id = users[i]._id;
								const name = `${users[i].firstname} ${users[i].lastname}`;
								const email = users[i].email;
								const profile_details = users[i].profile_details;

								const users1 = {
									name: name,
									id: id,
									role: role,
									email: email,
									profile_details: profile_details,
								};
								console.log(users1);
							}
							res.status(200).json({
								message: 'Successful!',
								users,
							});
						})
						.catch((error) => {
							res.status(500).json({
								error: error,
							});
						});
				}
			})
			.catch((err) => {
				//it was not successful! what could be the error
				res.status(500).json({
					error: err,
				});
			});
	}
};
