import { useEffect, useState } from "react";
import theme from "../styles/theme";

function Profile() {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Edit mode
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Profile photo
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);

    // Editable fields
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });

    // =========================================
    // GET LOGGED-IN STUDENT PROFILE
    // =========================================

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error(
                        "Login token not found. Please login again."
                    );
                }

                const response = await fetch(
                    "http://localhost:5000/student/profile",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch profile"
                    );
                }

                // Backend may return student directly
                // or inside { student }
                const studentData = data.student || data;

                setStudent(studentData);

                setFormData({
                    name: studentData.name || "",
                    email: studentData.email || "",
                });
            } catch (error) {
                console.error("Profile Error:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // =========================================
    // HANDLE INPUT CHANGE
    // =========================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =========================================
    // SAVE PROFILE
    // =========================================

    const handleSave = async () => {
        try {
            setSaving(true);
            setError("");
            setSuccessMessage("");

            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error(
                    "Login token not found. Please login again."
                );
            }

            if (!formData.name.trim()) {
                throw new Error("Name cannot be empty.");
            }

            if (!formData.email.trim()) {
                throw new Error("Email cannot be empty.");
            }

            const response = await fetch(
                "http://localhost:5000/student/profile",
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: formData.name.trim(),
                        email: formData.email.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update profile"
                );
            }

            const updatedStudent = data.student || data;

            setStudent(updatedStudent);

            setFormData({
                name: updatedStudent.name || "",
                email: updatedStudent.email || "",
            });

            // Update localStorage student data if it exists
            const savedStudent = localStorage.getItem("student");

            if (savedStudent) {
                const oldStudent = JSON.parse(savedStudent);

                localStorage.setItem(
                    "student",
                    JSON.stringify({
                        ...oldStudent,
                        ...updatedStudent,
                    })
                );
            }

            setIsEditing(false);

            setSuccessMessage(
                "Profile updated successfully! ✅"
            );
        } catch (error) {
            console.error("Update Profile Error:", error);
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    // =========================================
    // PROFILE PHOTO UPLOAD
    // =========================================

    const handleProfilePhotoChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setError("");
        setSuccessMessage("");

        // Allowed image types
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            setError(
                "Please select a JPG, PNG, or WEBP image."
            );

            event.target.value = "";
            return;
        }

        // Maximum 5 MB
        if (file.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5 MB.");

            event.target.value = "";
            return;
        }

        // Show preview immediately
        const previewUrl = URL.createObjectURL(file);
        setPhotoPreview(previewUrl);

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login again.");
            setPhotoPreview(null);
            event.target.value = "";
            return;
        }

        const formData = new FormData();

        formData.append("profilePhoto", file);

        try {
            setUploadingPhoto(true);

            const response = await fetch(
                "http://localhost:5000/student/profile/photo",
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to upload profile photo."
                );
            }

            const updatedStudent = data.student || data;

            setStudent(updatedStudent);

            // Remove temporary preview because
            // MongoDB/backend photo is now available
            setPhotoPreview(null);

            // Update localStorage
            const savedStudent =
                localStorage.getItem("student");

            if (savedStudent) {
                const oldStudent =
                    JSON.parse(savedStudent);

                localStorage.setItem(
                    "student",
                    JSON.stringify({
                        ...oldStudent,
                        ...updatedStudent,
                    })
                );
            }

            setSuccessMessage(
                "Profile photo updated successfully! ✅"
            );

            // Reset file input
            event.target.value = "";
        } catch (error) {
            console.error(
                "Profile photo upload error:",
                error
            );

            setError(error.message);
            setPhotoPreview(null);
        } finally {
            setUploadingPhoto(false);
        }
    };

    // =========================================
    // CANCEL EDIT
    // =========================================

    const handleCancel = () => {
        setFormData({
            name: student?.name || "",
            email: student?.email || "",
        });

        setIsEditing(false);
        setError("");
        setSuccessMessage("");
    };

    // =========================================
    // LOADING
    // =========================================

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <h2>Loading Profile...</h2>
            </div>
        );
    }

    // =========================================
    // ERROR
    // =========================================

    if (error && !student) {
        return (
            <div style={styles.page}>
                <div style={styles.errorMessage}>
                    ⚠️ {error}
                </div>
            </div>
        );
    }

    // =========================================
    // NO DATA
    // =========================================

    if (!student) {
        return (
            <div style={styles.loadingContainer}>
                <h2>Student profile not found.</h2>
            </div>
        );
    }

    // =========================================
    // PROFILE PHOTO URL
    // =========================================

    const profilePhoto = student.profilePhoto
        ? student.profilePhoto.startsWith("http")
            ? student.profilePhoto
            : `http://localhost:5000${student.profilePhoto}`
        : null;

    // =========================================
    // PROFILE UI
    // =========================================

    return (
        <div style={styles.page}>

            {/* SUCCESS MESSAGE */}

            {successMessage && (
                <div style={styles.successMessage}>
                    {successMessage}
                </div>
            )}

            {/* ERROR MESSAGE */}

            {error && student && (
                <div style={styles.errorMessage}>
                    ⚠️ {error}
                </div>
            )}

            {/* ================= HEADER ================= */}

            <div style={styles.headerCard}>

                {/* PROFILE PHOTO */}

                <div style={styles.profileCircle}>

                    {photoPreview ? (
                        <img
                            src={photoPreview}
                            alt="Profile Preview"
                            style={styles.profileImage}
                        />
                    ) : profilePhoto ? (
                        <img
                            src={profilePhoto}
                            alt="Profile"
                            style={styles.profileImage}
                        />
                    ) : (
                        student.name
                            ?.charAt(0)
                            .toUpperCase()
                    )}

                </div>

                {/* STUDENT INFORMATION */}

                <div style={{ flex: 1 }}>

                    <h1 style={styles.studentName}>
                        {student.name}
                    </h1>

                    <p style={styles.studentSubtitle}>
                        {student.department} •{" "}
                        {student.year === 4
                            ? "Final Year"
                            : `Year ${student.year}`}
                    </p>

                    <span style={styles.studentBadge}>
                        🎓 Student
                    </span>

                </div>

                {/* EDIT BUTTON */}

                {!isEditing && (
                    <button
                        onClick={() => {
                            setSuccessMessage("");
                            setError("");
                            setIsEditing(true);
                        }}
                        style={styles.editButton}
                    >
                        ✏️ Edit Profile
                    </button>
                )}

            </div>

            {/* ================= PERSONAL INFORMATION ================= */}

            <div style={styles.sectionCard}>

                <div style={styles.sectionHeader}>

                    <h2 style={styles.sectionTitle}>
                        👤 Personal Information
                    </h2>

                    {isEditing && (
                        <span style={styles.editingBadge}>
                            Editing
                        </span>
                    )}

                </div>

                <div style={styles.infoGrid}>

                    {/* NAME */}

                    <div>
                        <p style={styles.label}>
                            Name
                        </p>

                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                style={styles.input}
                            />
                        ) : (
                            <strong style={styles.value}>
                                {student.name || "N/A"}
                            </strong>
                        )}
                    </div>

                    {/* EMAIL */}

                    <div>
                        <p style={styles.label}>
                            Email
                        </p>

                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                style={styles.input}
                            />
                        ) : (
                            <strong style={styles.value}>
                                {student.email || "N/A"}
                            </strong>
                        )}
                    </div>

                    {/* PRN */}

                    <div>
                        <p style={styles.label}>
                            PRN 🔒
                        </p>

                        <strong style={styles.value}>
                            {student.prn || "N/A"}
                        </strong>
                    </div>

                    {/* DEPARTMENT */}

                    <div>
                        <p style={styles.label}>
                            Department 🔒
                        </p>

                        <strong style={styles.value}>
                            {student.department || "N/A"}
                        </strong>
                    </div>

                    {/* YEAR */}

                    <div>
                        <p style={styles.label}>
                            Year 🔒
                        </p>

                        <strong style={styles.value}>
                            {student.year === 4
                                ? "Final Year"
                                : `Year ${student.year}`}
                        </strong>
                    </div>

                </div>

                {/* SAVE / CANCEL */}

                {isEditing && (
                    <div style={styles.actionRow}>

                        <button
                            onClick={handleCancel}
                            disabled={saving}
                            style={styles.cancelButton}
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            style={styles.saveButton}
                        >
                            {saving
                                ? "Saving..."
                                : "💾 Save Changes"}
                        </button>

                    </div>
                )}

            </div>

            {/* ================= PROFILE PHOTO ================= */}

            <div style={styles.sectionCard}>

                <h2 style={styles.sectionTitle}>
                    📷 Profile Picture
                </h2>

                <p style={styles.photoDescription}>
                    Add a profile picture so your profile is
                    easier to identify.
                </p>

                <label
                    htmlFor="profilePhotoInput"
                    style={{
                        ...styles.photoButton,
                        opacity: uploadingPhoto ? 0.6 : 1,
                        pointerEvents: uploadingPhoto
                            ? "none"
                            : "auto",
                    }}
                >
                    {uploadingPhoto
                        ? "⏳ Uploading..."
                        : "📷 Change Profile Photo"}
                </label>

                <input
                    id="profilePhotoInput"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleProfilePhotoChange}
                    disabled={uploadingPhoto}
                    style={{ display: "none" }}
                />

                <p style={styles.fileHint}>
                    JPG, PNG or WEBP • Maximum 5 MB
                </p>

            </div>

        </div>
    );
}

// ==========================================
// STYLES
// ==========================================

const styles = {
    page: {
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
    },

    loadingContainer: {
        padding: "30px",
        textAlign: "center",
        color: theme.colors.text,
    },

    successMessage: {
        background: "#dcfce7",
        color: "#166534",
        padding: "14px 18px",
        borderRadius: "10px",
        marginBottom: "20px",
        fontWeight: "600",
    },

    errorMessage: {
        background: "#fee2e2",
        color: "#991b1b",
        padding: "14px 18px",
        borderRadius: "10px",
        marginBottom: "20px",
        fontWeight: "600",
    },

    headerCard: {
        background: theme.colors.card,
        padding: "35px",
        borderRadius: "20px",
        border: `1px solid ${theme.colors.border}`,
        marginBottom: "30px",
        display: "flex",
        alignItems: "center",
        gap: "25px",
    },

    profileCircle: {
        width: "110px",
        height: "110px",
        borderRadius: "50%",
        background: theme.colors.primary,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "42px",
        fontWeight: "bold",
        flexShrink: 0,
        overflow: "hidden",
    },

    profileImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },

    studentName: {
        margin: 0,
        color: theme.colors.text,
        fontSize: "36px",
    },

    studentSubtitle: {
        margin: "8px 0",
        fontSize: "18px",
        color: theme.colors.textLight,
    },

    studentBadge: {
        display: "inline-block",
        marginTop: "5px",
        padding: "8px 16px",
        borderRadius: "20px",
        background: "#dcfce7",
        color: "#166534",
        fontWeight: "600",
    },

    editButton: {
        border: "none",
        background: theme.colors.primary,
        color: "white",
        padding: "12px 20px",
        borderRadius: "9px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px",
    },

    sectionCard: {
        background: theme.colors.card,
        padding: "35px",
        borderRadius: "20px",
        border: `1px solid ${theme.colors.border}`,
        marginBottom: "30px",
    },

    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
    },

    sectionTitle: {
        marginTop: 0,
        marginBottom: "25px",
        color: theme.colors.text,
        fontSize: "26px",
    },

    editingBadge: {
        background: "#fef3c7",
        color: "#92400e",
        padding: "7px 13px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "600",
    },

    infoGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "30px",
    },

    label: {
        margin: 0,
        color: theme.colors.textLight,
    },

    value: {
        display: "block",
        marginTop: "8px",
        color: theme.colors.text,
        fontSize: "17px",
    },

    input: {
        width: "100%",
        boxSizing: "border-box",
        marginTop: "8px",
        padding: "12px 14px",
        borderRadius: "8px",
        border: `1px solid ${theme.colors.border}`,
        fontSize: "16px",
        outline: "none",
    },

    actionRow: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        marginTop: "35px",
        paddingTop: "25px",
        borderTop: `1px solid ${theme.colors.border}`,
    },

    cancelButton: {
        padding: "11px 20px",
        borderRadius: "8px",
        border: `1px solid ${theme.colors.border}`,
        background: "white",
        color: "#374151",
        cursor: "pointer",
        fontWeight: "600",
    },

    saveButton: {
        padding: "11px 22px",
        borderRadius: "8px",
        border: "none",
        background: "#16a34a",
        color: "white",
        cursor: "pointer",
        fontWeight: "600",
    },

    photoDescription: {
        color: theme.colors.textLight,
        marginTop: "-10px",
        marginBottom: "20px",
    },

    photoButton: {
        display: "inline-block",
        padding: "12px 20px",
        borderRadius: "9px",
        border: "none",
        background: theme.colors.primary,
        color: "white",
        cursor: "pointer",
        fontWeight: "600",
    },

    fileHint: {
        marginTop: "12px",
        fontSize: "13px",
        color: theme.colors.textLight,
    },
};

export default Profile;