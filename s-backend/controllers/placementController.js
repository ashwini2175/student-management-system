const Placement = require("../models/Placement");
const Student = require("../models/Student");
const Notification = require("../models/Notification");

// ==========================================
// CREATE PLACEMENT DRIVE
// POST /placement
// ==========================================

const createPlacement = async (req, res) => {
    try {
        const {
            company,
            role,
            eligibilityCGPA,
            package: packageAmount,
            driveDate,
            time,
            location,
            description,
        } = req.body;

        // -----------------------------
        // Validate required fields
        // -----------------------------

        if (
            !company ||
            !role ||
            eligibilityCGPA === undefined ||
            !packageAmount ||
            !driveDate ||
            !time ||
            !location
        ) {
            return res.status(400).json({
                message: "Please provide all required placement details",
            });
        }

        // -----------------------------
        // Create placement
        // -----------------------------

        const placement = new Placement({
            company,
            role,
            eligibilityCGPA,
            package: packageAmount,
            driveDate,
            time,
            location,
            description,
        });

        await placement.save();

        // -----------------------------
        // Find eligible students
        // -----------------------------

        const eligibleStudents = await Student.find({
            cgpa: {
                $gte: Number(eligibilityCGPA),
            },
        });

        console.log(
            "Eligible Students:",
            eligibleStudents.length
        );

        // -----------------------------
        // Create notifications
        // -----------------------------

        const notifications = eligibleStudents.map(
            (student) => ({
                studentPRN: student.prn,

                title: `🏢 ${company} Placement Drive`,

                message:
                    `${company} is hiring for ${role}. ` +
                    `Eligibility: CGPA ${eligibilityCGPA}+. ` +
                    `Package: ${packageAmount}. ` +
                    `Date: ${driveDate}. ` +
                    `Time: ${time}. ` +
                    `Location: ${location}.`,

                isRead: false,
            })
        );

        if (notifications.length > 0) {
            await Notification.insertMany(
                notifications
            );
        }

        // -----------------------------
        // Response
        // -----------------------------

        res.status(201).json({
            message:
                "Placement drive created successfully",

            placement,

            eligibleStudents:
                eligibleStudents.length,

            notificationsSent:
                notifications.length,
        });

    } catch (error) {
        console.error(
            "CREATE PLACEMENT ERROR:",
            error
        );

        res.status(500).json({
            message: error.message,
        });
    }
};


// ==========================================
// GET ALL PLACEMENT DRIVES
// GET /placement
// ==========================================

const getAllPlacements = async (req, res) => {
    try {
        const placements = await Placement.find()
            .sort({ createdAt: -1 });

        res.status(200).json(placements);

    } catch (error) {
        console.error(
            "GET PLACEMENTS ERROR:",
            error
        );

        res.status(500).json({
            message: error.message,
        });
    }
};


module.exports = {
    createPlacement,
    getAllPlacements,
};