export const dummyAnalysis = {
  id: "demo-analysis",
  candidateName: "Demo Candidate",
  atsScore: 82,
  jobMatchScore: 76,
  resumeStrength: "Strong",
  skillsFound: ["JavaScript", "React", "Node.js", "MongoDB", "Git", "REST API"],
  missingKeywords: ["Docker", "AWS", "CI/CD", "Testing"],
  weakAreas: ["Certifications", "Cloud deployment", "Measurable project outcomes"],
  strongAreas: ["Frontend development", "Backend APIs", "Database fundamentals"],
  recommendedRoles: ["Full Stack Developer", "MERN Stack Developer", "Frontend Engineer"],
  sectionScores: {
    Skills: 86,
    Education: 72,
    Experience: 78,
    Projects: 84,
    Certifications: 48
  },
  recommendedSkills: ["Docker", "AWS", "Unit Testing", "CI/CD"],
  suggestions: {
    high: [
      "Add measurable achievements to project descriptions, such as latency reduced or users served.",
      "Include missing job keywords naturally in the skills and experience sections."
    ],
    medium: [
      "Improve the professional summary with role-specific impact and target technologies.",
      "Add GitHub and LinkedIn links near the contact section."
    ],
    low: [
      "Use consistent bullet formatting across all sections.",
      "Replace generic verbs with action verbs such as built, optimized, automated, and delivered."
    ]
  },
  interviewQuestions: {
    technical: [
      {
        question: "How does React state management differ from server-side data persistence?",
        answer: "React state is temporary UI state, while server-side persistence stores data durably in databases or external storage."
      }
    ],
    hr: [
      {
        question: "Tell me about a time you improved a project.",
        answer: "Use the STAR method and explain the problem, your action, the tools used, and measurable result."
      }
    ],
    project: [
      {
        question: "Explain one project architecture from your resume.",
        answer: "Describe frontend, backend, database, APIs, authentication, deployment, and one technical challenge."
      }
    ]
  },
  createdAt: new Date().toISOString()
};

export const dummyHistory = [
  dummyAnalysis,
  {
    ...dummyAnalysis,
    id: "demo-analysis-2",
    candidateName: "Frontend Resume",
    atsScore: 74,
    jobMatchScore: 69,
    resumeStrength: "Moderate",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];
