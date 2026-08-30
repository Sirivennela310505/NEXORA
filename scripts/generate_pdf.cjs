const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4'
});

const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
let yPos = 20;

function checkPageBreak(neededHeight) {
  if (yPos + neededHeight > pageHeight - 20) {
    doc.addPage();
    yPos = 22;
  }
}

function addHeader(title, subtitle) {
  doc.setFillColor(10, 15, 30);
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  doc.setTextColor(56, 189, 248); // Cyan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  
  doc.setTextColor(203, 213, 225);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(subtitle, 14, 23);
  
  yPos = 40;
}

function addSectionTitle(num, title) {
  checkPageBreak(16);
  doc.setTextColor(14, 165, 233); // Cyan
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`${num}. ${title}`, 14, yPos);
  
  // Underline bar
  doc.setDrawColor(14, 165, 233);
  doc.setLineWidth(0.5);
  doc.line(14, yPos + 2, pageWidth - 14, yPos + 2);
  
  yPos += 9;
}

function addSubSectionTitle(title) {
  checkPageBreak(12);
  doc.setTextColor(15, 23, 42); // Dark slate
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, yPos);
  yPos += 6;
}

function addParagraph(text) {
  checkPageBreak(12);
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  const lines = doc.splitTextToSize(text, pageWidth - 28);
  doc.text(lines, 14, yPos);
  yPos += lines.length * 4.8 + 3;
}

function addBullet(label, text) {
  checkPageBreak(8);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`•  ${label}: `, 16, yPos);
  
  const labelWidth = doc.getTextWidth(`•  ${label}: `);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  const lines = doc.splitTextToSize(text, pageWidth - 28 - labelWidth);
  doc.text(lines, 16 + labelWidth, yPos);
  yPos += lines.length * 4.5 + 2.5;
}

// ==================== COVER / TITLE ====================
addHeader('NEXORA — AI-Powered Personalized Learning & Career OS', 'Comprehensive Technical Specification & Architecture Manual • Complete Project Dossier');

// SECTION 1: EXECUTIVE SUMMARY
addSectionTitle('1', 'Executive Summary & Problem Statement');
addParagraph('Modern online learning is plagued by one-size-fits-all curricula, disjointed video tutorials, overwhelming course catalogs, and a lack of goal-oriented diagnostic feedback. Learners waste hundreds of hours on redundant content while remaining blind to critical prerequisite gaps required for real-world internships, competitive exams, or high-tier engineering careers.');
addParagraph('NEXORA is an adaptive, goal-driven AI Learning Operating System engineered to dynamically generate personalized flowchart roadmaps, diagnostic quizzes, milestone trackers, ATS resume optimizers, and free curated video masterclasses tailored 100% to each individual learner’s background and ambitions.');

// SECTION 2: CORE ARCHITECTURE & SYSTEM ENGINES
addSectionTitle('2', 'System Architecture & Engine Breakdown');
addParagraph('NEXORA operates on a multi-tier modular architecture powered by five deterministic engines combined with Google Gemini AI:');

addBullet('Adaptive Pathfinder Engine (adaptiveEngine.ts)', 'Dynamically computes step-by-step milestone DAGs (Directed Acyclic Graphs), hours estimation, and prerequisite ordering calibrated to user daily time availability and learning modality.');
addBullet('Skill Gap & Mastery Matrix (skillGapEngine.ts)', 'Tracks quantitative mastery scores across foundational, intermediate, and advanced competencies with real-time recalculation after diagnostic attempts.');
addBullet('Next-Best-Action Engine (nextBestAction.ts)', 'Evaluates user milestone state and skill scores to suggest the single highest-impact task to do next (e.g. video lecture, coding drill, or diagnostic test).');
addBullet('Gemini AI Service Integration (geminiAI.ts)', 'Connects to Google Gemini API to synthesize custom goal challenges, generate 10 topic-specific diagnostic MCQs, and author custom milestone tracks in real-time for any goal typed by the user.');
addBullet('Career Readiness & ATS Optimizer (careerEngine.ts)', 'Matches active learner skills against real internship listings and scores resume bullets for technical keywords, metrics, and STAR formatting.');

// SECTION 3: KEY APPLICATION MODULES
addSectionTitle('3', 'Key Modules & Feature Capabilities');

addSubSectionTitle('A. Conversational AI Requirement Gathering (Onboarding)');
addParagraph('Upon account creation, the AI Assistant interviews the learner regarding their target goal (custom or preset), current education level (Class 10, Class 12, Undergraduate, Career Switcher), knowledge baseline, and study pacing. It uses Gemini AI to extract real-world bottlenecks and generate a customized roadmap.');

addSubSectionTitle('B. Flowchart Roadmap & NeetCode-Style DAG Navigator');
addParagraph('Interactive flowchart visualization mapping out prerequisites, status tracking (Locked, Unlocked, Completed), estimated study hours, and verified learning materials for each node.');

addSubSectionTitle('C. Curated Free Video & Resource Hub');
addParagraph('Over 50+ verified, 100% free YouTube video courses, playlists, Harvard CS50, MIT OCW, Striver A2Z DSA, NeetCode, NCERT, and Kaggle labs categorized by goal with a 1-click live YouTube/Google search hub.');

addSubSectionTitle('D. Diagnostic Assessment & Skill Calibration');
addParagraph('Interactive MCQs and coding snippets with instant grading, detailed explanations, and automatic recalibration of the user’s roadmap upon test completion.');

addSubSectionTitle('E. Student Study Diary & Interactive Notes');
addParagraph('Daily study log tracker allowing learners to log hours studied, track daily streaks, and take notes per milestone.');

addSubSectionTitle('F. Opportunities & ATS Resume Optimizer');
addParagraph('Calculates % match scores for top tech internships (Google, Razorpay, GSoC) and provides real-time ATS feedback on project bullets.');

addSubSectionTitle('G. Profile Settings & Executive PDF Report Generator');
addParagraph('Enables learners to adjust daily availability, reset goals, and export an executive, human-readable Learning Plan PDF.');

// SECTION 4: TECHNICAL STACK & DATA PERSISTENCE
addSectionTitle('4', 'Technology Stack & Implementation Specifications');
addBullet('Frontend Framework', 'React 19, TypeScript, Vite, TailwindCSS (Vanilla utility architecture)');
addBullet('Icons & UI Components', 'Lucide React, Glassmorphism, Obsidian/Zinc Color System, Responsive Drawers');
addBullet('AI Engine', 'Google Gemini 2.5 / 1.5 Flash via REST API with fallback to deterministic local rules');
addBullet('PDF Engine', 'jsPDF for client-side multi-page executive document synthesis');
addBullet('State & Persistence', 'Unified LocalStorage Engine with cross-session synchronization and export capabilities');

// FOOTER ON ALL PAGES
const totalPages = doc.internal.getNumberOfPages();
for (let i = 1; i <= totalPages; i++) {
  doc.setPage(i);
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`NEXORA — Official Technical Specification Dossier • Page ${i} of ${totalPages}`, 14, pageHeight - 10);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth - 45, pageHeight - 10);
}

const outputPath = path.join(__dirname, '..', 'NEXORA_Comprehensive_Documentation.pdf');
const pdfBytes = doc.output('arraybuffer');
fs.writeFileSync(outputPath, Buffer.from(pdfBytes));

console.log(`PDF successfully generated at: ${outputPath}`);
