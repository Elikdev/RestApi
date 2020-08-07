require('dotenv').config();
const express = require('express');
const routes = require('./routes/index');
const adminRouter = require('./routes/admin');
const tutorRouter = require('./routes/tutor');
const userRouter = require('./routes/users');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

//database connection
mongoose
	.connect(process.env.DB_CONNECT, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Successfully connected to database!');
	})
	.catch((err) => {
		console.log('Database connection was not established!');
		console.error(err);
	});

const port = process.env.PORT || 3000;

//handlebars
app.engine('hbs', exphbs({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');

//static folders
app.use(express.static(path.join(__dirname, 'public')));

//bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

//index view
app.get('/', (req, res) => {
	res.render('index');
});

//routes
app.use('/', routes);
app.use('/admin', adminRouter);
app.use('/tutor', tutorRouter);
app.use('/user', userRouter);

app.listen(
	port,
	console.log(`Welcome to your application running on port ${port}`)
);
