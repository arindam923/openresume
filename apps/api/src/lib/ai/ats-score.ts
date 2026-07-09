import type { ResumeContent } from "@openresume/schema";

interface AtsScoreResult {
  score: number;
  breakdown: Record<string, number>;
  sections: Record<string, { score: number; feedback: string }>;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  suggestions: string[];
}

export function calculateAtsScore(content: ResumeContent, jobDescription?: string): AtsScoreResult {
  const suggestions: string[] = [];
  const sections: Record<string, { score: number; feedback: string }> = {};
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  let missingKeywords: string[] = [];

  const allText = JSON.stringify(content);
  const resumeText = allText.toLowerCase();

  // Personal section
  const personalScore = content.personal.fullName && content.personal.email ? 100 : 50;
  sections.personal = {
    score: personalScore,
    feedback: personalScore === 100 ? "Contact info complete" : "Add full name and email",
  };
  if (personalScore === 100) strengths.push("Complete contact information.");
  else {
    weaknesses.push("Missing or incomplete contact information.");
    suggestions.push("Add your full name and email address.");
  }

  // Summary
  const summaryScore = content.personal.summary && content.personal.summary.length > 50 ? 100 : 60;
  sections.summary = {
    score: summaryScore,
    feedback: summaryScore === 100 ? "Summary is present" : "Add a professional summary",
  };
  if (summaryScore === 100) strengths.push("Professional summary included.");
  else {
    weaknesses.push("Missing or short professional summary.");
    suggestions.push("Add a 2-3 sentence professional summary.");
  }

  // Experience
  const expScore =
    content.experience.length > 0
      ? content.experience.every((job) => job.highlights.some((h) => h.length > 20))
        ? 100
        : 70
      : 30;
  sections.experience = {
    score: expScore,
    feedback:
      expScore === 100
        ? "Experience section is strong"
        : expScore === 70
        ? "Add more detailed bullet points"
        : "Add work experience",
  };
  if (expScore === 100) strengths.push("Strong experience section with detailed bullets.");
  else {
    weaknesses.push("Experience section needs improvement.");
    suggestions.push("Add detailed work experience with achievement bullets.");
  }

  // Education
  const eduScore = content.education.length > 0 ? 100 : 50;
  sections.education = {
    score: eduScore,
    feedback: eduScore === 100 ? "Education listed" : "Add education",
  };
  if (eduScore === 100) strengths.push("Education section present.");
  else {
    weaknesses.push("Missing education section.");
    suggestions.push("Add your education.");
  }

  // Skills
  const skillsScore = content.skills.length >= 5 ? 100 : content.skills.length > 0 ? 70 : 30;
  sections.skills = {
    score: skillsScore,
    feedback:
      skillsScore === 100
        ? "Good skill coverage"
        : skillsScore === 70
        ? "Add more skills"
        : "Add skills section",
  };
  if (skillsScore === 100) strengths.push("Comprehensive skills section.");
  else {
    weaknesses.push("Skills section is thin.");
    suggestions.push("Add at least 5 relevant skills.");
  }

  // Projects
  const projectsScore = content.projects.length > 0 ? 100 : 60;
  sections.projects = {
    score: projectsScore,
    feedback: projectsScore === 100 ? "Projects listed" : "Add relevant projects",
  };
  if (projectsScore === 100) strengths.push("Projects section included.");
  else weaknesses.push("No projects listed.");

  // Length
  const lengthScore = allText.length > 500 && allText.length < 8000 ? 100 : 70;
  sections.length = {
    score: lengthScore,
    feedback: lengthScore === 100 ? "Resume length is good" : "Adjust resume length",
  };
  if (lengthScore < 100) suggestions.push("Aim for 1-2 pages of relevant content.");

  // Job description matching
  if (jobDescription) {
    const jobKeywords = extractKeywords(jobDescription);
    const matchedKeywords = jobKeywords.filter((keyword) => resumeText.includes(keyword.toLowerCase()));
    const matchRatio = jobKeywords.length > 0 ? matchedKeywords.length / jobKeywords.length : 1;
    const matchScore = Math.round(matchRatio * 100);
    sections.jobMatch = {
      score: matchScore,
      feedback: `${matchedKeywords.length}/${jobKeywords.length} job keywords matched`,
    };
    if (matchScore < 70) {
      suggestions.push("Add missing keywords from the job description.");
    }
    missingKeywords = jobKeywords.filter((k) => !matchedKeywords.includes(k));
  }

  const sectionScores = Object.values(sections).map((s) => s.score);
  const overallScore = Math.round(sectionScores.reduce((a, b) => a + b, 0) / sectionScores.length);

  const breakdown = {
    formatting: Math.round((personalScore + (allText.length > 500 && allText.length < 8000 ? 100 : 70)) / 2),
    experience: expScore,
    skills: skillsScore,
    keywords: jobDescription
      ? sections.jobMatch?.score ?? 50
      : 50,
    projects: projectsScore,
    education: eduScore,
    readability: Math.round(
      (summaryScore + lengthScore + (content.personal.fullName ? 100 : 50)) / 3
    ),
  };

  return {
    score: overallScore,
    breakdown,
    sections,
    strengths,
    weaknesses,
    missingKeywords,
    suggestions: [...new Set(suggestions)],
  };
}

function extractKeywords(text: string): string[] {
  // Simple keyword extraction: filter common words, keep meaningful terms
  const commonWords = new Set([
    "the", "and", "for", "are", "but", "not", "you", "all", "can", "had", "her", "was", "one", "our", "out", "day", "get", "has", "him", "his", "how", "its", "may", "new", "now", "old", "see", "two", "who", "boy", "did", "she", "use", "her", "way", "many", "oil", "sit", "set", "run", "eat", "far", "sea", "eye", "ago", "off", "too", "any", "say", "man", "try", "ask", "end", "why", "let", "put", "say", "she", "try", "way", "own", "say", "too", "old", "tell", "very", "when", "much", "would", "there", "their", "what", "said", "each", "which", "will", "about", "could", "other", "after", "first", "never", "these", "think", "where", "being", "every", "great", "might", "shall", "still", "those", "while", "this", "that", "with", "have", "from", "they", "been", "were", "said", "time", "than", "them", "into", "just", "like", "over", "also", "back", "only", "know", "take", "year", "good", "some", "come", "make", "well", "look", "even", "more", "want", "here", "down", "most", "long", "last", "find", "give", "does", "made", "part", "such", "keep", "call", "came", "need", "feel", "seem", "turn", "hand", "high", "sure", "upon", "head", "help", "home", "side", "move", "both", "five", "once", "same", "must", "name", "left", "each", "done", "open", "case", "show", "live", "play", "went", "told", "seen", "hear", "talk", "soon", "read", "stop", "face", "fact", "land", "line", "kind", "next", "word", "came", "went", "told", "seen", "hear", "talk", "soon", "read", "stop", "face", "fact", "land", "line", "kind", "next", "word",
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#\.\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !commonWords.has(word))
    .filter((word) => !/^\d+$/.test(word))
    .slice(0, 50);
}
