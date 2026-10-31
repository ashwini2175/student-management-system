const clamp = (v, max) => Math.min(max, Math.max(0, Number(v) || 0));
module.exports = (s) =>
  Math.round(
    clamp(s.cgpa, 10) * 2.5 +
      Math.min((s.skills || []).length * 4, 20) +
      Math.min((s.projects || []).length * 5, 15) +
      clamp(s.internshipCount, 2) * 7.5 +
      (s.resumeUploaded ? 10 : 0) +
      clamp(s.aptitudeScore, 100) * 0.1 +
      clamp(s.communicationScore, 100) * 0.05,
  );
