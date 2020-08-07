const Tutor = require("../models/Tutors");

exports.addTutor = (req, res) => {
	const tutor = new Tutor({
		name: req.body.name,
		course: req.body.course,
		level: req.body.level,
		email: req.body.email,
		mobile_num: req.body.mobile_num,
		details: req.body.details,
	});

	tutor
		.save()
		.then(() => {
			res.status(200).json({
				message: "Tutor created successfuly!",
			});
		})
		.catch((error) => {
			res.status(501).json({
				error: error.message,
			});
		});
};

exports.findTutor = (req, res) => {
	Tutor.find({ course: req.body.course })
		.then((courses) => {
			res.status(201).json({
				message: `${req.body.course} tutuors found! `,
				Data: {
					Courses: courses,
				},
			});
		})
		.catch((error) => {
			res.status(501).json({
				message: "Such course is not available!",
				error: error.message,
			});
		});
};

exports.updateTutor = (req, res) => {
	const product = new Product({
		_id: req.params.id,
		name: req.body.name,
		course: req.body.course,
		level: req.body.level,
		email: req.body.email,
		mobile_num: req.body.mobile_num,
		details: req.body.details,
	});

	Product.updateOne({ _id: req.params.id }, product)
		.then((product) => {
			res.status(201).json({
				message: "Modified!",
				product: product,
			});
		})
		.catch((error) => {
			res.status(501).json({
				message: "Not modified!",
				error: error.message,
			});
		});
};

exports.deleteTutor = (req, res) => {
	product
		.deleteOne({ _id: req.params.id })
		.then(() => {
			res.status(201).json({
				message: "Deleted!",
			});
		})
		.catch((error) => {
			res.status(501).json({
				message: "Not deleted!",
				error: error.message,
			});
		});
};
