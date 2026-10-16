const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =========================================
// CREATE CERTIFICATE UPLOAD FOLDER
// =========================================

const uploadDirectory = path.join(
    __dirname,
    "../uploads/certificates"
);

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true,
    });
}

// =========================================
// STORAGE CONFIGURATION
// =========================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);

        const fileName = `certificate-${Date.now()}${extension}`;

        cb(null, fileName);
    },
});

// =========================================
// FILE FILTER
// =========================================

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(
            new Error("Only PDF certificate files are allowed."),
            false
        );
    }
};

// =========================================
// MULTER CONFIGURATION
// =========================================

const uploadCertificate = multer({
    storage,
    fileFilter,

    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

module.exports = uploadCertificate;