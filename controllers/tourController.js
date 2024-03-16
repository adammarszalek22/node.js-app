const Tour = require('./../models/tourModel')

// exports.checkId = (req, res, next, val) => {
//     if (+req.params.id > tours.length) {
//         return res.status(404).json({
//             status: "Fail",
//             message: "Invalid ID"
//         })
//     }

//     next();
// }

// exports.checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.price) {
//         return res.status(400).json({
//             status: "fail",
//             message: "Missing name or price"
//         })
//     }

//     next();
// }

exports.getAllTours = async (req, res) => {

    try {

        let queryObj = { ...req.query };
        const excludedFields = ['page', 'sprt', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

        queryObj = JSON.parse(queryString);
        
        const query = Tour.find(queryObj);

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
            message: err
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


