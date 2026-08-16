const calculatePlacementScore = (student) => {

    let score = 0;

    // CGPA (25 Marks)
    score += (student.cgpa / 10) * 25;

    // Skills (20 Marks)
    score += Math.min(student.skills.length * 4, 20);

    // Projects (15 Marks)
    score += Math.min(student.projectCount * 5, 15);

    // Internships (15 Marks)
    score += Math.min(student.internshipCount * 7.5, 15);

    // Resume (10 Marks)
    if (student.resumeUploaded) {
        score += 10;
    }

    // Aptitude (10 Marks)
    score += (student.aptitudeScore / 100) * 10;

    // Communication (5 Marks)
    score += (student.communicationScore / 100) * 5;

    return Math.round(score);
};

module.exports = calculatePlacementScore;