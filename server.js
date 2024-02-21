const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
// .connect(process.env.DATABASE_LOCAL, {
.connect(DB, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: true,
	useUnifiedTopology: true
})
.then(con => {
	console.log("DB connection successful!");
});

const tourSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A tour must have a name'],
		unique: true
	},
	price: {
		type: Number,
		required: [true, 'A tour must have a price']
	},
	rating: {
		type: Number,
		default: 4.5
	}
})

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
	name: 'The Forest Hiker4',
	price: 4.97,
	rating: 4.7
})

testTour.save().then(doc => {
	console.log(doc);
})
.catch(err => {
	console.log('ERROR')
});

// console.log(process.env);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`App running on port ${port}`);
});
