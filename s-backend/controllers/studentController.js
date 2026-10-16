const Student = require("../models/Student");
const calculatePlacementScore = require("../utils/calculatePlacementScore");
const bcrypt = require("bcryptjs");
// =====================================
// Create Student
// POST /student
// =====================================

const createStudent = async (req, res) => {
    try {
        const { password } = req.body;

        if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const student = new Student({
            ...req.body,
            password: hashedPassword
        });

        student.placementScore =
            calculatePlacementScore(student);

        if (student.placementScore >= 80) {
            student.placementStatus = "Placement Ready";
        } else if (student.placementScore >= 50) {
            student.placementStatus = "Needs Guidance";
        } else {
            student.placementStatus = "Immediate Attention";
        }

        await student.save();

        res.status(201).json({
            message: "Student Saved Successfully",
            student,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// =====================================
// Get All Students
// GET /student
// =====================================

const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().select("-password");

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// =====================================
// Get Student By PRN
// GET /student/:prn
// =====================================

const getStudentByPrn = async (req, res) => {
    try {
        const student = await Student.findOne({
            prn: req.params.prn,
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// =====================================
// Filter Students
// GET /student/filter/search
// =====================================

const filterStudents = async (req, res) => {
    try {
        const filter = {};

        if (req.query.cgpa) {
            filter.cgpa = {
                $gte: Number(req.query.cgpa),
            };
        }

        if (req.query.placementStatus) {
            filter.placementStatus =
                req.query.placementStatus;
        }

        if (req.query.department) {
            filter.department =
                req.query.department;
        }

        const students = await Student.find(filter);

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// =====================================
// Get Logged-in Student Profile
// GET /student/profile
// =====================================

const getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(
            req.student.id
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// =====================================
// Get Student Projects
// GET /student/projects
// =====================================

const getStudentProjects = async (req, res) => {
    try {
        console.log(
            "PROJECT REQ.STUDENT:",
            req.student
        );

        const student = await Student.findById(
            req.student.id
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        res.status(200).json({
            projects: student.projects || [],
        });
    } catch (error) {
        console.error(
            "GET PROJECTS ERROR:",
            error
        );

        res.status(500).json({
            message: error.message,
        });
    }
};

// =====================================
// Add Project
// POST /student/projects
// =====================================

const addProject = async (req, res) => {
    try {
        console.log(
            "ADD PROJECT REQ.STUDENT:",
            req.student
        );

        const student = await Student.findById(
            req.student.id
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        const newProject = {
            title: req.body.title,
            description: req.body.description,
            technologies:
                req.body.technologies || [],
            status:
                req.body.status || "Ongoing",
            features:
                req.body.features || [],
            challenges:
                req.body.challenges || [],
            futureScope:
                req.body.futureScope || [],
        };

        student.projects.push(newProject);

        // Keep project count updated
        student.projectCount =
            student.projects.length;

        await student.save();

        const savedProject =
            student.projects[
            student.projects.length - 1
            ];

        res.status(201).json({
            message: "Project added successfully",
            project: savedProject,
        });
    } catch (error) {
        console.error(
            "ADD PROJECT ERROR:",
            error
        );

        res.status(500).json({
            message: error.message,
        });
    }
};

// =====================================
// Update Project
// PUT /student/projects/:id
// =====================================

const updateProject = async (req, res) => {
    try {
        const student = await Student.findById(
            req.student.id
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        const project = student.projects.id(
            req.params.id
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        Object.assign(project, req.body);

        await student.save();

        res.status(200).json({
            message: "Project updated successfully",
            project,
        });
    } catch (error) {
        console.error(
            "UPDATE PROJECT ERROR:",
            error
        );

        res.status(500).json({
            message: error.message,
        });
    }
};

// =====================================
// Delete Project
// DELETE /student/projects/:id
// =====================================

const deleteProject = async (req, res) => {
    try {
        const student = await Student.findById(
            req.student.id
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        const project = student.projects.id(
            req.params.id
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        project.deleteOne();

        // Keep project count updated
        student.projectCount =
            student.projects.length - 1;

        await student.save();

        res.status(200).json({
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.error(
            "DELETE PROJECT ERROR:",
            error
        );

        res.status(500).json({
            message: error.message,
        });
    }
};

// =====================================
// Get Student Certificates
// GET /student/certificates
// =====================================

const getStudentCertificates = async (req, res) => {
    try {
        const student = await Student.findById(
            req.student.id
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        res.status(200).json({
            certificates:
                student.certificates || [],
        });
    } catch (error) {
        console.error(
            "GET CERTIFICATES ERROR:",
            error
        );

        res.status(500).json({
            message: error.message,
        });
    }
};

// =====================================
// Add Student Certificate
// POST /student/certificates
// =====================================

const addStudentCertificate = async (req, res) => {
    try {
        const student = await Student.findById(
            req.student.id
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        // Check if PDF was uploaded
        if (!req.file) {
            return res.status(400).json({
                message:
                    "Please select a certificate PDF.",
            });
        }

        // Create certificate object
        const newCertificate = {
            title: req.body.title,
            issuer: req.body.issuer,
            year: Number(req.body.year),
            fileName: req.file.originalname,
            fileUrl:
                `/uploads/certificates/${req.file.filename}`,
        };

        // Save certificate in student's document
        student.certificates.push(
            newCertificate
        );

        await student.save();

        const savedCertificate =
            student.certificates[
            student.certificates.length - 1
            ];

        res.status(201).json({
            message:
                "Certificate added successfully",
            certificate: savedCertificate,
        });
    } catch (error) {
        console.error(
            "ADD CERTIFICATE ERROR:",
            error
        );

        res.status(500).json({
            message: error.message,
        });
    }
};

// ======================================
// Update Logged-in Student Profile
// PUT /student/profile
// ======================================

const updateStudentProfile = async (req, res) => {
    try {
        const studentId = req.student.id;

        const {
            name,
            email,
            interestDomain,
        } = req.body;

        // Basic validation
        if (!name || !email) {
            return res.status(400).json({
                message:
                    "Name and email are required",
            });
        }

        const updatedStudent =
            await Student.findByIdAndUpdate(
                studentId,
                {
                    $set: {
                        name: name.trim(),
                        email: email
                            .trim()
                            .toLowerCase(),
                        interestDomain:
                            interestDomain?.trim() || "",
                    },
                },
                {
                    new: true,
                    runValidators: true,
                }
            ).select("-password");

        if (!updatedStudent) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        res.status(200).json({
            message:
                "Profile updated successfully",
            student: updatedStudent,
        });
    } catch (error) {
        console.error(
            "Update Student Profile Error:",
            error
        );

        res.status(500).json({
            message: error.message,
        });
    }
};

// =========================================
// Update Student Profile Photo
// PUT /student/profile/photo
// =========================================

const updateStudentProfilePhoto = async (
    req,
    res
) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message:
                    "Please select a profile photo.",
            });
        }

        const student = await Student.findById(
            req.student.id
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found.",
            });
        }

        // Save uploaded photo path
        student.profilePhoto =
            `/uploads/profile/${req.file.filename}`;

        await student.save();

        const updatedStudent =
            await Student.findById(
                req.student.id
            ).select("-password");

        res.status(200).json({
            message:
                "Profile photo updated successfully.",
            student: updatedStudent,
        });
    } catch (error) {
        console.error(
            "Profile photo upload error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update profile photo.",
            error: error.message,
        });
    }
};

// =====================================
// EXPORTS
// =====================================

module.exports = {
    createStudent,
    getAllStudents,
    getStudentByPrn,
    filterStudents,
    getStudentProfile,
    updateStudentProfile,
    getStudentProjects,
    addProject,
    updateProject,
    deleteProject,

    getStudentCertificates,
    addStudentCertificate,

    updateStudentProfilePhoto,
};