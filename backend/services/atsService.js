const REQUIRED_SKILLS = [
  "JavaScript",
  "TypeScript",
  "Node.js",
  "Express.js",
  "React",
  "MongoDB",
  "SQL",
  "Python",
  "Java",
  "AWS",
  "Docker",
  "Git",
  "REST API",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Redux",
  "JWT",
  "Mongoose",
  "Postman",
  "CI/CD",
  "Testing"
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getSkillPattern = (skill) => {
  const aliases = {
    "Node.js": ["node.js", "nodejs", "node js"],
    "Express.js": ["express.js", "expressjs", "express js", "express"],
    "REST API": ["rest api", "restful api", "rest apis"],
    "Tailwind CSS": ["tailwind css", "tailwind"],
    JavaScript: ["javascript"],
    TypeScript: ["typescript"],
    MongoDB: ["mongodb", "mongo db"],
    AWS: ["aws", "amazon web services"],
    "CI/CD": ["ci/cd", "cicd", "continuous integration", "continuous deployment"],
    JWT: ["jwt", "json web token", "json web tokens"],
    SQL: ["sql", "mysql", "postgresql", "postgres"],
    Testing: ["testing", "jest", "unit testing", "integration testing"]
  };

  return aliases[skill] || [skill.toLowerCase()];
};

const ROLE_SKILL_PROFILES = {
  "full stack developer": ["JavaScript", "React", "Node.js", "Express.js", "MongoDB", "REST API", "Git", "HTML", "CSS", "JWT"],
  "fullstack developer": ["JavaScript", "React", "Node.js", "Express.js", "MongoDB", "REST API", "Git", "HTML", "CSS", "JWT"],
  "mern stack developer": ["JavaScript", "React", "Node.js", "Express.js", "MongoDB", "REST API", "Git", "JWT"],
  "frontend developer": ["JavaScript", "React", "HTML", "CSS", "Tailwind CSS", "Git"],
  "front end developer": ["JavaScript", "React", "HTML", "CSS", "Tailwind CSS", "Git"],
  "backend developer": ["Node.js", "Express.js", "MongoDB", "SQL", "REST API", "JWT", "Git", "Testing"],
  "node.js developer": ["JavaScript", "Node.js", "Express.js", "MongoDB", "REST API", "JWT", "Git"],
  "react developer": ["JavaScript", "React", "HTML", "CSS", "Tailwind CSS", "REST API", "Git"],
  "software developer": ["JavaScript", "Python", "Java", "SQL", "Git", "REST API", "Testing"],
  "devops engineer": ["AWS", "Docker", "Git", "CI/CD", "Testing"],
  "data analyst": ["Python", "SQL", "Git"]
};

const countMatches = (text, keyword) => {
  const pattern = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "gi");
  return (text.match(pattern) || []).length;
};

const hasKeyword = (text, skill) => {
  const aliases = getSkillPattern(skill);
  return aliases.some((alias) => countMatches(text, alias) > 0);
};

const getRoleSkills = (targetRole = "", jobDescription = "") => {
  const roleText = `${targetRole} ${jobDescription}`.toLowerCase();
  const matchedProfiles = Object.entries(ROLE_SKILL_PROFILES)
    .filter(([role]) => roleText.includes(role))
    .flatMap(([, skills]) => skills);

  return Array.from(new Set(matchedProfiles));
};

const getJobKeywords = (jobDescription, targetRole = "") => {
  const normalizedJob = `${targetRole} ${jobDescription || ""}`.toLowerCase();
  const roleSkills = getRoleSkills(targetRole, jobDescription);
  const explicitSkills = REQUIRED_SKILLS.filter((skill) => hasKeyword(normalizedJob, skill));
  const combinedSkills = Array.from(new Set([...roleSkills, ...explicitSkills]));

  if (combinedSkills.length > 0) {
    return combinedSkills;
  }

  const extraKeywords = Array.from(
    new Set(
      normalizedJob
        .replace(/[^a-z0-9+#./\s-]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 3)
        .filter((word) => !["with", "from", "that", "this", "have", "will", "work", "role", "team", "using", "must", "good", "strong"].includes(word))
    )
  ).slice(0, 20);

  return Array.from(new Set([...explicitSkills, ...extraKeywords]));
};

const extractSectionText = (resumeText, sectionNames) => {
  const names = sectionNames.join("|");
  const nextSection =
    "summary|profile|objective|skills|technical skills|education|experience|work experience|internship|projects|certifications|achievements|contact";
  const pattern = new RegExp(`(?:^|\\n)\\s*(?:${names})\\s*:?\\s*\\n?([\\s\\S]*?)(?=\\n\\s*(?:${nextSection})\\s*:?\\s*\\n|$)`, "i");
  const match = resumeText.match(pattern);
  return match?.[1]?.trim() || "";
};

const clampScore = (score) => Math.max(0, Math.min(100, Math.round(score)));

const scoreBySignals = (signals) => {
  const totalWeight = signals.reduce((sum, signal) => sum + signal.weight, 0);
  const earnedWeight = signals.reduce((sum, signal) => sum + (signal.passed ? signal.weight : 0), 0);
  return clampScore((earnedWeight / totalWeight) * 100);
};

const hasEnoughWords = (text, minimum) => text.split(/\s+/).filter(Boolean).length >= minimum;

const scoreResumeSections = (resumeText, detectedSkills) => {
  const skillsText = extractSectionText(resumeText, ["skills", "technical skills"]);
  const educationText = extractSectionText(resumeText, ["education"]);
  const experienceText = extractSectionText(resumeText, ["experience", "work experience", "internship"]);
  const projectsText = extractSectionText(resumeText, ["projects"]);
  const certificationsText = extractSectionText(resumeText, ["certifications", "certificates", "courses", "training"]);

  const actionVerbPattern = /\b(built|developed|implemented|created|designed|optimized|automated|deployed|improved|managed|analyzed|integrated)\b/i;
  const metricPattern = /\b(\d+%|\d+\+|\d+\s*(users|projects|apis|modules|pages|days|hours|records|students|clients))\b/i;
  const datePattern = /\b(20\d{2}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|present)\b/i;
  const linkPattern = /\b(github|linkedin|http|www\.)\b/i;
  const techPattern = new RegExp(detectedSkills.map(escapeRegExp).join("|") || "a^", "i");
  const hasCertificationHeading = /\b(certifications?|certificates?|courses?|training)\b/i.test(resumeText);
  const hasCertificationIssuer = /\b(aws|google|microsoft|oracle|coursera|udemy|nptel|hackerrank|freecodecamp|linkedin learning|ibm|meta)\b/i.test(certificationsText);
  const hasCertificationName = /\b(certified|certificate|certification|course|training|bootcamp|specialization)\b/i.test(certificationsText);
  const hasCertificationDate = datePattern.test(certificationsText);
  let certificationScore = scoreBySignals([
    { passed: hasCertificationHeading, weight: 20 },
    { passed: hasEnoughWords(certificationsText, 12), weight: 20 },
    { passed: hasCertificationName, weight: 20 },
    { passed: hasCertificationIssuer, weight: 25 },
    { passed: hasCertificationDate, weight: 15 }
  ]);

  if (!hasCertificationHeading || !certificationsText) {
    certificationScore = 0;
  } else if (!hasCertificationIssuer && !hasCertificationDate) {
    certificationScore = Math.min(certificationScore, 45);
  } else if (!hasCertificationIssuer || !hasCertificationDate) {
    certificationScore = Math.min(certificationScore, 65);
  }

  return {
    Skills: scoreBySignals([
      { passed: /\bskills?\b|technical skills/i.test(resumeText), weight: 25 },
      { passed: detectedSkills.length >= 4, weight: 40 },
      { passed: hasEnoughWords(skillsText || resumeText, 18), weight: 20 },
      { passed: /\b(frontend|backend|database|tools|languages|frameworks)\b/i.test(skillsText || resumeText), weight: 15 }
    ]),
    Education: scoreBySignals([
      { passed: /\beducation\b/i.test(resumeText), weight: 30 },
      { passed: /\b(degree|b\.?e|btech|bachelor|master|diploma)\b/i.test(educationText || resumeText), weight: 25 },
      { passed: /\b(university|college|institute|school)\b/i.test(educationText || resumeText), weight: 20 },
      { passed: datePattern.test(educationText), weight: 15 },
      { passed: /\b(cgpa|gpa|percentage|grade)\b/i.test(educationText), weight: 10 }
    ]),
    Experience: scoreBySignals([
      { passed: /\b(experience|internship|work experience)\b/i.test(resumeText), weight: 25 },
      { passed: hasEnoughWords(experienceText, 35), weight: 20 },
      { passed: actionVerbPattern.test(experienceText), weight: 20 },
      { passed: metricPattern.test(experienceText), weight: 15 },
      { passed: datePattern.test(experienceText), weight: 10 },
      { passed: techPattern.test(experienceText), weight: 10 }
    ]),
    Projects: scoreBySignals([
      { passed: /\bprojects?\b/i.test(resumeText), weight: 20 },
      { passed: hasEnoughWords(projectsText, 45), weight: 20 },
      { passed: actionVerbPattern.test(projectsText), weight: 20 },
      { passed: techPattern.test(projectsText), weight: 15 },
      { passed: /\b(api|database|frontend|backend|authentication|dashboard|model|deployment)\b/i.test(projectsText), weight: 15 },
      { passed: linkPattern.test(projectsText), weight: 10 }
    ]),
    Certifications: certificationScore
  };
};

const calculateResumeStrength = (atsScore, jobMatchScore) => {
  const average = (atsScore + jobMatchScore) / 2;
  if (average >= 80) return "Strong";
  if (average >= 60) return "Moderate";
  return "Needs Improvement";
};

const buildScoreJustification = ({ atsScore, jobMatchScore, sectionScores, detectedSkills, matchedJobKeywords, missingJobKeywords, weakAreas, strongAreas }) => ({
  atsScore: `ATS score is ${atsScore}% based on detected technical skills, resume structure, and section quality. Found ${detectedSkills.length} tracked skills. Improve this by adding accurate role keywords, measurable impact, and stronger section details.`,
  jobMatchScore: `Job match score is ${jobMatchScore}% because the resume matched ${matchedJobKeywords.length} skills/keywords from the job requirement and missed ${missingJobKeywords.length}. Add only the missing skills you genuinely know or can demonstrate.`,
  sectionScores: {
    Skills: `Skills scored ${sectionScores.Skills}% based on skills section presence, number of detected skills, grouping, and clarity.`,
    Education: `Education scored ${sectionScores.Education}% based on degree, institution, dates, and academic details.`,
    Experience: `Experience scored ${sectionScores.Experience}% based on role/internship details, dates, action verbs, technologies used, and measurable outcomes.`,
    Projects: `Projects scored ${sectionScores.Projects}% based on project depth, technologies, implementation details, action verbs, and proof links such as GitHub.`,
    Certifications: `Certifications scored ${sectionScores.Certifications}% based on certificate names, issuer/platform, course details, and date/year evidence.`
  },
  missingSkills: missingJobKeywords.length
    ? `Missing skills/keywords found from the target role: ${missingJobKeywords.join(", ")}. Add them only if they are true for your resume, projects, or learning.`
    : "No major missing job keywords were detected from the provided job description.",
  strengths: strongAreas.length ? `Strong sections: ${strongAreas.join(", ")}.` : "No section is strong enough yet to be marked as a clear strength.",
  improvements: weakAreas.length ? `Needs improvement: ${weakAreas.join(", ")}.` : "No section is below the weak-area threshold."
});

const analyzeResumeText = (resumeText, jobDescription = "", targetRole = "") => {
  const normalizedText = resumeText.toLowerCase();
  const detectedSkills = [];
  const missingSkills = [];
  const keywordDensity = {};

  REQUIRED_SKILLS.forEach((skill) => {
    const aliases = getSkillPattern(skill);
    const totalMatches = aliases.reduce((count, alias) => count + countMatches(normalizedText, alias), 0);

    keywordDensity[skill] = totalMatches;

    if (totalMatches > 0) {
      detectedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const sectionScores = scoreResumeSections(resumeText, detectedSkills);

  const jobKeywords = getJobKeywords(jobDescription, targetRole);
  const jobKeywordsToCheck = jobKeywords.length > 0 ? jobKeywords : REQUIRED_SKILLS;
  const requiredSkills = jobKeywordsToCheck.filter((keyword) => REQUIRED_SKILLS.includes(keyword));
  const matchedJobKeywords = jobKeywordsToCheck.filter((keyword) => {
    if (REQUIRED_SKILLS.includes(keyword)) return hasKeyword(normalizedText, keyword);
    return countMatches(normalizedText, keyword) > 0;
  });
  const missingJobKeywords = jobKeywordsToCheck.filter((keyword) => !matchedJobKeywords.includes(keyword));

  const skillScore = Math.round((detectedSkills.length / REQUIRED_SKILLS.length) * 100);
  const structureScore = Math.round(Object.values(sectionScores).reduce((sum, score) => sum + score, 0) / Object.keys(sectionScores).length);
  const atsScore = Math.round(skillScore * 0.65 + structureScore * 0.35);
  const jobMatchScore = Math.round((matchedJobKeywords.length / Math.max(jobKeywordsToCheck.length, 1)) * 100);
  const resumeStrength = calculateResumeStrength(atsScore, jobMatchScore);
  const weakAreas = Object.entries(sectionScores)
    .filter(([, score]) => score < 60)
    .map(([section]) => section);
  const strongAreas = Object.entries(sectionScores)
    .filter(([, score]) => score >= 75)
    .map(([section]) => section);
  const recommendedSkills = missingJobKeywords
    .filter((keyword) => REQUIRED_SKILLS.includes(keyword))
    .slice(0, 6);
  const recommendedRoles = getRecommendedRoles(detectedSkills);
  const suggestions = buildPrioritizedSuggestions({
    atsScore,
    jobMatchScore,
    detectedSkills,
    missingSkills: missingJobKeywords,
    resumeText,
    weakAreas,
    recommendedSkills
  });
  const scoreJustification = buildScoreJustification({
    atsScore,
    jobMatchScore,
    sectionScores,
    detectedSkills,
    matchedJobKeywords,
    missingJobKeywords,
    weakAreas,
    strongAreas
  });

  return {
    atsScore,
    jobMatchScore,
    resumeStrength,
    skillsFound: detectedSkills,
    matchedSkills: detectedSkills,
    detectedSkills,
    requiredSkills,
    missingKeywords: missingJobKeywords,
    missingSkills,
    weakAreas,
    strongAreas,
    sectionScores,
    recommendedRoles,
    recommendedSkills,
    keywordDensity,
    suggestions,
    scoreJustification,
    interviewQuestions: buildInterviewQuestions(detectedSkills, weakAreas)
  };
};

const buildSuggestions = (atsScore, detectedSkills, missingSkills, resumeText) => {
  const suggestions = [];

  if (missingSkills.length > 0) {
    suggestions.push(`Add relevant experience or projects that include: ${missingSkills.slice(0, 5).join(", ")}.`);
  }

  if (detectedSkills.length < 4) {
    suggestions.push("Create a dedicated skills section and group technologies by category.");
  }

  if (!/\b(project|projects)\b/i.test(resumeText)) {
    suggestions.push("Include project descriptions with measurable outcomes and technologies used.");
  }

  if (!/\b(achieved|improved|reduced|increased|built|designed|implemented)\b/i.test(resumeText)) {
    suggestions.push("Use stronger action verbs and add measurable impact wherever possible.");
  }

  if (atsScore >= 80) {
    suggestions.push("Your resume is well aligned. Fine-tune it by matching keywords from each job description.");
  }

  return suggestions;
};

const buildPrioritizedSuggestions = ({ atsScore, jobMatchScore, detectedSkills, missingSkills, resumeText, weakAreas, recommendedSkills }) => {
  const high = [];
  const medium = [];
  const low = [];

  if (atsScore < 70) {
    high.push("Improve ATS alignment by adding a clear Skills section and using exact role keywords that truly match your experience.");
  }

  if (jobMatchScore < 70 && missingSkills.length > 0) {
    high.push(`Add relevant job-description keywords where accurate: ${missingSkills.slice(0, 6).join(", ")}.`);
  }

  if (!/\b(summary|profile|objective)\b/i.test(resumeText)) {
    high.push("Add a concise professional summary with your target role, core skills, and strongest project or internship impact.");
  }

  if (!/\b(\d+%|\d+\+|\d+\s*(users|projects|apis|modules|days|hours))\b/i.test(resumeText)) {
    medium.push("Add measurable achievements, such as performance improved, users served, modules built, or time saved.");
  }

  if (!/\bgithub\b/i.test(resumeText)) {
    medium.push("Add a GitHub profile or project repository links so recruiters can verify your implementation work.");
  }

  if (!/\blinkedin\b/i.test(resumeText)) {
    medium.push("Add a LinkedIn profile link near your contact details.");
  }

  if (weakAreas.length > 0) {
    medium.push(`Strengthen these resume sections: ${weakAreas.join(", ")}.`);
  }

  if (recommendedSkills.length > 0) {
    medium.push(`Learn or demonstrate these missing technical skills if they match your target role: ${recommendedSkills.join(", ")}.`);
  }

  if (!/\b(built|developed|implemented|optimized|designed|automated|deployed|improved)\b/i.test(resumeText)) {
    low.push("Use stronger action verbs such as built, optimized, automated, deployed, improved, and implemented.");
  }

  low.push("Keep bullet points concise and start each project bullet with action plus outcome.");

  if (detectedSkills.length > 0) {
    low.push(`Keep your strongest detected skills visible near the top: ${detectedSkills.slice(0, 5).join(", ")}.`);
  }

  return { high, medium, low };
};

const getRecommendedRoles = (skills) => {
  const normalized = new Set(skills);
  const roles = [];

  if (normalized.has("React") || normalized.has("JavaScript") || normalized.has("HTML")) roles.push("Frontend Developer");
  if (normalized.has("Node.js") || normalized.has("Express.js") || normalized.has("MongoDB")) roles.push("Backend Developer");
  if (normalized.has("React") && normalized.has("Node.js")) roles.push("Full Stack Developer");
  if (normalized.has("Python") || normalized.has("SQL")) roles.push("Data Analyst Intern");
  if (normalized.has("AWS") || normalized.has("Docker") || normalized.has("CI/CD")) roles.push("DevOps Intern");

  return roles.length > 0 ? roles : ["Software Developer Intern", "Junior Web Developer"];
};

const buildInterviewQuestions = (skills, weakAreas) => ({
  technical: [
    {
      question: `Explain one project where you used ${skills[0] || "your strongest technical skill"}.`,
      answer: "Discuss the problem, architecture, your implementation, challenges, and measurable result."
    },
    {
      question: "How would you improve the performance of a web application?",
      answer: "Mention profiling, reducing bundle size, caching, database indexing, API optimization, and lazy loading."
    }
  ],
  hr: [
    {
      question: "Tell me about yourself.",
      answer: "Give a short summary of your education, strongest skills, projects, and the role you are targeting."
    },
    {
      question: "Why should we hire you?",
      answer: "Connect your project experience, learning speed, teamwork, and role-specific skills to the company need."
    }
  ],
  project: [
    {
      question: `Your weaker resume area is ${weakAreas[0] || "project impact"}. How would you improve it?`,
      answer: "Explain how you would add clearer metrics, better architecture details, deployment links, and lessons learned."
    },
    {
      question: "Walk me through your best project from requirement to deployment.",
      answer: "Cover requirement, tech stack, database, APIs, UI, testing, deployment, and one tradeoff."
    }
  ]
});

module.exports = {
  REQUIRED_SKILLS,
  analyzeResumeText
};
