const Tour = require('./../models/tourModel')

exports.aliasTopTours = (req, res, next) => {
    
    req.query.limit = '5';
    req.query.sort = '-ratingsAvergae,price';
    req.query.fields = 'name,price,ratingsAvergae,summary,difficulty';
    next();

}

exports.getAllTours = async (req, res) => {

    try {

        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Filtering
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

        let query = Tour.find(JSON.parse(queryString));

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Field limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');;
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // Pagination
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 100;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if (skip >= numTours) throw new Error('This page does not exist');
        }

        const tours = await query;

        res
            .status(200)
            .json({
                status: 'success',
                results: tours.length,
                data: {
                    tours
                }
            })

    } catch (err) {

        res.status(404).json({
            status: 'Fail',
            message: err.message
        })

    }


}

exports.getTour = async (req, res) => {

    try {

        const tour = await Tour.findById(req.params.id);
        // Tour.findOne({ _id: req.params.id })

        res
            .status(200)
            .json({
                status: 'Success',
                data: tour
            })

    } catch (err) {

        res
            .status(404)
            .json({
                status: 'Fail',
                message: err
            })

    }

}

exports.createTour = async (req, res) => {

    try {

        // Old way
        // const newTour = new Tour({})
        // newTour.save();

        // New way
        const newTour = await Tour.create(req.body);

        res
            .status(201) // created
            .json({
                status: "success",
                data: {
                    tour: newTour
                }
            })

    } catch (err) {

        res.status(400).json({
            status: 'Fail',
            message: err
        })

    }

}

exports.updateTour = async (req, res) => {

    try {

        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })

    } catch (err) {

        res.status(404).json({
            status: 'Fail',
            message: err
        })

    }

}

exports.deleteTour = async (req, res) => {

    try {

        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'Tour deleted'
        })

    } catch (err) {

        res.status(404).json({
            status: 'Fail',
            message: err
        })

    }
}

exports.getTourStats = async (req, res) => {

    try {

        const stats = await Tour.aggregate([
            {
                $match: { ratingsAvergae: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    averageRating: { $avg: '$ratingsAvergae' },
                    averagePrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: { averagePrice: 1 }
            },
            {
                $match: { _id: { $ne: 'EASY' } }
            }
        ])

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        })

    } catch(err) {

        res.status(404).json({
            status: 'Fail',
            message: err
        })

    }
}