const Course = require('../models/course');
const Mocktest = require('../models/mocktest');
const Section = require('../models/section');

// ================ create Section ================
exports.createMockTests = async (req, res) => {
    try {
        // extract data 
        const { mockTestName, courseId } = req.body;
        console.log(mockTestName);
        // console.log('sectionName, courseId = ', sectionName, ",  = ", courseId)

        // validation
        if (!mockTestName || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        // create entry in DB
        const newMockTest = await Mocktest.create({ mockTestName });

        // link - section id to current course 
        const updatedCourse = await Course.findByIdAndUpdate(courseId,
            {
                $push: {
                    mocktests: newMockTest._id
                }
            },
            { new: true }
        );

        const updatedCourseDetails = await Course.findById(courseId)
            .populate({
                path: 'mocktests',
                populate: {
                    path: 'questions'
                }

            })

        // above -- populate remaining 

        res.status(200).json({
            success: true,
            updatedCourseDetails,
            message: 'Section created successfully'
        })
    }

    catch (error) {
        console.log('Error while creating section');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while creating section'
        })
    }
}


// ================ update Section ================
exports.updateSection = async (req, res) => {
    try {
        // extract data
        const { sectionName, sectionId, courseId } = req.body;

        // validation
        if (!sectionId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // update section name in DB
        await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });

        const updatedCourseDetails = await Course.findById(courseId)
            .populate({
                path: 'courseContent',
                populate: {
                    path: 'subSection'
                }
            })

        res.status(200).json({
            success: true,
            data:updatedCourseDetails,
            message: 'Section updated successfully'
        });
    }
    catch (error) {
        console.log('Error while updating section');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while updating section'
        })
    }
}



// ================ Delete Section ================
exports.deleteSection = async (req, res) => {
    try {
        const { sectionId, courseId } = req.body;
        // console.log('sectionId = ', sectionId);

        // delete section by id from DB
        await Section.findByIdAndDelete(sectionId);

        const updatedCourseDetails = await Course.findById(courseId)
            .populate({
                path: 'courseContent',
                populate: {
                    path: 'subSection'
                }
            })

        res.status(200).json({
            success: true,
            data: updatedCourseDetails,
            message: 'Section deleted successfully'
        })
    }
    catch (error) {
        console.log('Error while deleting section');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while deleting section'
        })
    }
}

