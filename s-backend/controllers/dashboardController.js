const Student = require("../models/Student");


const getDashboardSummary = async (req, res) => {
    try {

        const totalStudents = await Student.countDocuments();

        const placementReady = await Student.countDocuments({
            placementStatus: "Placement Ready"
        });

        const needsGuidance = await Student.countDocuments({
            placementStatus: "Needs Guidance"
        });

        const immediateAttention = await Student.countDocuments({
            placementStatus: "Immediate Attention"
        });

        const studentsWithoutResume = await Student.countDocuments({
            resumeUploaded: false
        });

        const studentsWithoutInternship = await Student.countDocuments({
            internshipCount: 0
        });

        const averageCGPA = await Student.aggregate([
            {
                $group: {
                    _id: null,
                    averageCGPA: { $avg: "$cgpa" }
                }
            }
        ]);

        res.json({
            totalStudents,
            placementReady,
            needsGuidance,
            immediateAttention,
            studentsWithoutResume,
            studentsWithoutInternship,
            averageCGPA:
                averageCGPA.length > 0
                    ? averageCGPA[0].averageCGPA.toFixed(2)
                    : 0
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    getDashboardSummary
};

module.exports = {
    getDashboardSummary
};