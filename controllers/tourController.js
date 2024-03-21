const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/api-features');

exports.aliasTopTours = (req, res, next) => {
    
    req.query.limit = '5';
    req.query.sort = '-ratingsAvergae,price';
    req.query.fields = 'name,price,ratingsAvergae,summary,difficulty';
    next();

}

exports.getAllTours = async (req, res) => {

    try {

        const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
        const tours = await features.query;

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