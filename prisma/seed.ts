import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const EVENT_DAY = new Date("2026-05-22T09:00:00.000Z");
const TEAM_LOCK_TIME = new Date("2026-05-22T07:30:00.000Z");
const API_KEY_RELEASE_TIME = new Date("2026-05-22T09:00:00.000Z");
const SUBMISSION_DEADLINE = new Date("2026-05-22T12:00:00.000Z");

const adminEmails = new Set(["himanshu@altir.co", "sthatikonda@altir.co", "akhil@altir.co"]);
const judgeEmails = new Set(["asarraf@altir.co", "dnagboth@altir.co", "anjan@altir.co"]);

const employeeSeedRows = [
  { employeeId: "ATI005", fullName: "Abhinay Sharma Sahasam", title: "Senior Engineering Manager - Test", reportingManager: "Sandeep Kumar Thatikonda", primaryAssignment: "Chip1", secondaryAssignment: null, email: "asharma@altir.co" },
  { employeeId: "ATI025", fullName: "Aditya Chopra", title: "Associate Director - Engineering", reportingManager: "Kandarp Shah", primaryAssignment: "Infra", secondaryAssignment: null, email: "achopra@altir.co" },
  { employeeId: "ATI001", fullName: "Anjan Kumar Nagboth", title: "Director", reportingManager: "Sai Nagboth", primaryAssignment: "Finance and Operations", secondaryAssignment: null, email: "anjan@altir.co" },
  { employeeId: "ATI042", fullName: "Arquish Ali Ansari", title: "Senior Software Engineer", reportingManager: "Ashok Kumar Sarraf", primaryAssignment: "Hyperfuel", secondaryAssignment: null, email: "aali@altir.co" },
  { employeeId: "ATI045", fullName: "Ashok Kumar Sarraf", title: "Director of Engineering", reportingManager: "Himanshu Gauba", primaryAssignment: "Hyperfuel", secondaryAssignment: null, email: "asarraf@altir.co" },
  { employeeId: "ATI028", fullName: "Bhawna Chauhan", title: "Senior Talent Acquisition", reportingManager: "Vasumathi Adwant", primaryAssignment: "Human Resources", secondaryAssignment: null, email: "bchauhan@altir.co" },
  { employeeId: "ATI015", fullName: "Deepti Nagboth", title: "Senior Principal Architect", reportingManager: "Himanshu Gauba", primaryAssignment: "Foundation", secondaryAssignment: null, email: "dnagboth@altir.co" },
  { employeeId: "ATI016", fullName: "Deepti Vaidyula", title: "Associate Principal Engineer - Test", reportingManager: "Abhinay Sharma", primaryAssignment: "Chip1", secondaryAssignment: null, email: "dvaidyula@altir.co" },
  { employeeId: "ATI032", fullName: "Gundimi Srinidhi", title: "Senior Software Engineer", reportingManager: "Sandeep Kumar Thatikonda", primaryAssignment: "Chip1", secondaryAssignment: null, email: "sgundimi@altir.co" },
  { employeeId: "ATI021", fullName: "Habib Sheikh", title: "Senior Software Engineer", reportingManager: "Sandeep Kumar Thatikonda", primaryAssignment: "Chip1", secondaryAssignment: null, email: "shabib@altir.co" },
  { employeeId: "ATI020", fullName: "Hari Krishna Bolla", title: "Associate Manager - Test", reportingManager: "Ashok Kumar Sarraf", primaryAssignment: "Hyperfuel", secondaryAssignment: "JK Logix", email: "hbolla@altir.co" },
  { employeeId: "ATI034", fullName: "Hema Leena Errampally", title: "Lead Human Resources", reportingManager: "Vasumathi Adwant", primaryAssignment: "Human Resources", secondaryAssignment: null, email: "herrampally@altir.co" },
  { employeeId: "ATI027", fullName: "Himanshu Gauba", title: "Vice President Engineering", reportingManager: "Sai Nagboth", primaryAssignment: "Management", secondaryAssignment: null, email: "himanshu@altir.co" },
  { employeeId: "ATI039", fullName: "Imaduddin Mohammad", title: "Senior DevOps Engineer", reportingManager: "Aditya Chopra", primaryAssignment: "Infra", secondaryAssignment: null, email: "imohammad@altir.co" },
  { employeeId: "ATI038", fullName: "Manjunath Shivanand Kalagi", title: "SDET 1", reportingManager: "Hari Krishna Bolla", primaryAssignment: "Hyperfuel", secondaryAssignment: null, email: "mkalagi@altir.co" },
  { employeeId: "ATI022", fullName: "Nagababu Guddati", title: "Associate Principal Engineer", reportingManager: "Satish Goud Bathini", primaryAssignment: "Data Team", secondaryAssignment: null, email: "nguddati@altir.co" },
  { employeeId: "ATI004", fullName: "Om Naresh Sreenivasan", title: "Senior Technical Product Manager", reportingManager: "Sandeep Kumar Thatikonda", primaryAssignment: "Chip1", secondaryAssignment: null, email: "osreenivasan@altir.co" },
  { employeeId: "ATI017", fullName: "Phani Yedidi", title: "Senior Technical Product Manager", reportingManager: "Sandeep Kumar Thatikonda", primaryAssignment: "Chip1", secondaryAssignment: null, email: "pyedidi@altir.co" },
  { employeeId: "ATI007", fullName: "Pranab Dutta", title: "Senior Architect", reportingManager: "Sandeep Kumar Thatikonda", primaryAssignment: "Chip1", secondaryAssignment: null, email: "pdutta@altir.co" },
  { employeeId: "ATI008", fullName: "Pratyush Mehul Kota", title: "Senior Software Engineer", reportingManager: "Ashok Kumar Sarraf", primaryAssignment: "JK Logix", secondaryAssignment: "Hyperfuel", email: "pkota@altir.co" },
  { employeeId: "ATI031", fullName: "Sahithi Muppa", title: "Lead SDET", reportingManager: "Abhinay Sharma", primaryAssignment: "FastTrack", secondaryAssignment: "Hyperfuel", email: "smuppa@altir.co" },
  { employeeId: "ATI009", fullName: "Sandeep Kumar Thatikonda", title: "Director of Engineering", reportingManager: "Himanshu Gauba", primaryAssignment: "Chip1", secondaryAssignment: "Soundful", email: "sthatikonda@altir.co" },
  { employeeId: "ATI026", fullName: "Satish Bathini", title: "Engineering Manager", reportingManager: "Srinivas Sanka", primaryAssignment: "Data Team", secondaryAssignment: null, email: "sbathini@altir.co" },
  { employeeId: "ATI036", fullName: "Shivananda Sai", title: "Senior Software Engineer", reportingManager: "Sandeep Kumar Thatikonda", primaryAssignment: "Chip1", secondaryAssignment: null, email: "shivananda.sai@altir.co" },
  { employeeId: "ATI011", fullName: "Tejaswini Allagadda", title: "Senior Software Engineer", reportingManager: "Sandeep Kumar Thatikonda", primaryAssignment: "Chip1", secondaryAssignment: null, email: "tallagadda@altir.co" },
  { employeeId: "ATI010", fullName: "Thyagaraju Gopalakrishna", title: "Senior System Ops Engineer", reportingManager: "Aditya Chopra", primaryAssignment: "Infra", secondaryAssignment: null, email: "tgopalakrishna@altir.co" },
  { employeeId: "ATI033", fullName: "Uma Mahesh Mutyala", title: "SDET II", reportingManager: "Abhinay Sharma", primaryAssignment: "FastTrack", secondaryAssignment: null, email: "umutyala@altir.co" },
  { employeeId: "ATI044", fullName: "Vanshika Sachdev", title: "Senior Software Engineer", reportingManager: "Ashok Kumar Sarraf", primaryAssignment: "Hyperfuel", secondaryAssignment: "JK Logix", email: "vsachdev@altir.co" },
  { employeeId: "ATI040", fullName: "Varun Deviprasad Kukade", title: "Senior Software Engineer", reportingManager: "Ashok Kumar Sarraf", primaryAssignment: "JK Logix", secondaryAssignment: "Hyperfuel", email: "vkukade@altir.co" },
  { employeeId: "ATI023", fullName: "Vasumathi Adwant", title: "Associate Director - Human Resources", reportingManager: "Sai Nagboth", primaryAssignment: "Human Resources", secondaryAssignment: null, email: "vadwant@altir.co" },
  { employeeId: "ATI012", fullName: "Venkat Krishna Kodakandla", title: "Senior Technical Product Manager", reportingManager: "Ashok Kumar Sarraf", primaryAssignment: "JK Logix", secondaryAssignment: "Hyperfuel & Soundful", email: "vkodakandla@altir.co" },
  { employeeId: "ATI037", fullName: "Vinay Kumar Bajjuri", title: "Senior Software Engineer", reportingManager: "Sandeep Kumar Thatikonda", primaryAssignment: "Chip1", secondaryAssignment: null, email: "vbajjuri@altir.co" },
  { employeeId: "ATI046", fullName: "Harika G", title: "SDET 1", reportingManager: "Sandeep Kumar Thatikonda", primaryAssignment: "Chip1", secondaryAssignment: null, email: "hguntamukkala@altir.co" },
  { employeeId: "ATI047", fullName: "Arvind Dhakar", title: "Senior Software Engineer", reportingManager: "Sandeep Kumar Thatikonda", primaryAssignment: "Chip1", secondaryAssignment: null, email: "adhakar@altir.co" },
  { employeeId: "ATI048", fullName: "Krupa Panchal", title: "Senior Software Engineer", reportingManager: "Sandeep Kumar Thatikonda", primaryAssignment: "Chip1", secondaryAssignment: null, email: "kpanchal@altir.co" },
  { employeeId: "ATI049", fullName: "Nikhil Kumar Singh", title: "Software Engineer", reportingManager: "Sandeep Kumar Thatikonda", primaryAssignment: "Chip1", secondaryAssignment: null, email: "nkumar@altir.co" },
  { employeeId: "ATI050", fullName: "Aditya Jain", title: "Senior Software Engineer", reportingManager: "Sandeep Kumar Thatikonda", primaryAssignment: "Chip1", secondaryAssignment: null, email: "ajain@altir.co" },
  { employeeId: "ATI051", fullName: "Akhilesh Gupta Ainapur", title: "Director – AI Solutions", reportingManager: "Sai Nagboth", primaryAssignment: null, secondaryAssignment: null, email: "akhil@altir.co" },
  { employeeId: "ATI052", fullName: "Dipak Majhi", title: "Senior Technical Product Manager", reportingManager: "Sandeep Kumar Thatikonda", primaryAssignment: "Chip1", secondaryAssignment: null, email: "dmajhi@altir.co" },
  { employeeId: "ATIT01", fullName: "Aishwarya Reddy", title: "Intern", reportingManager: "Ashok Kumar Sarraf", primaryAssignment: "JK Logix", secondaryAssignment: "Hyperfuel", email: "areddy@altir.co" },
  { employeeId: "ATIT03", fullName: "Tanmay Sanjay Lautawar", title: "Intern", reportingManager: "Ashok Kumar Sarraf", primaryAssignment: "JK Logix", secondaryAssignment: "Hyperfuel", email: "tlautawar@altir.co" },
  { employeeId: "ATIT04", fullName: "Srilochan Kalakunta", title: "Intern", reportingManager: "Aditya Chopra", primaryAssignment: "Hyperfuel", secondaryAssignment: "JK Logix", email: "skalakunta@altir.co" },
  { employeeId: "ATIT05", fullName: "Priyanshi Minesh Shah", title: "Intern", reportingManager: "Akhilesh Gupta Ainapur", primaryAssignment: "AI POC", secondaryAssignment: null, email: "pshah@altir.co" },
  { employeeId: "AEU024", fullName: "Alexey Duduk", title: "Lead UI", reportingManager: "Sandeep Kumar Thatikonda", primaryAssignment: "Chip1", secondaryAssignment: "Soundful", email: "aduduk@altir.co" },
  { employeeId: "AEU025", fullName: "Alex Yermakov", title: "Lead UI", reportingManager: "Sandeep Kumar Thatikonda", primaryAssignment: "Chip1", secondaryAssignment: null, email: "ayermakov@altir.co" },
  { employeeId: "AEU027", fullName: "Andrey Kuznetcov", title: "Architect", reportingManager: "Sandeep Kumar Thatikonda", primaryAssignment: "Chip1", secondaryAssignment: "Foundation", email: "akuznetcov@altir.co" },
  { employeeId: "AEU017", fullName: "Mikita Monich", title: "Software Engineer", reportingManager: "Sandeep Kumar Thatikonda", primaryAssignment: "Soundful", secondaryAssignment: null, email: "mmonich@altir.co" },
  { employeeId: "AEU008", fullName: "Sergei Vareyko", title: "Lead Software Engineer", reportingManager: "Deepti N", primaryAssignment: "Foundation", secondaryAssignment: null, email: "svareyko@altir.co" },
  { employeeId: "AEU023", fullName: "Sergey Us", title: "DevOps Engineer", reportingManager: "Kandarp Shah", primaryAssignment: "Infra", secondaryAssignment: null, email: "sus@altir.co" },
];

const eventCriteria = [
  { key: "team_formed", label: "Complete team formed", description: "Two members locked into a team.", category: "EVENT", pointsValue: 10, sortOrder: 1 },
  { key: "cross_assignment", label: "Different assignments", description: "Members come from different primary assignments.", category: "EVENT", pointsValue: 5, sortOrder: 2 },
  { key: "formed_before_lock", label: "Formed before lock", description: "Team formed before the 1:00 PM lock time.", category: "EVENT", pointsValue: 5, sortOrder: 3 },
  { key: "idea_submitted", label: "Idea submitted", description: "Team committed to an idea before build start.", category: "EVENT", pointsValue: 10, sortOrder: 4 },
  { key: "repo_submitted", label: "GitHub repo submitted", description: "Repository link added for review.", category: "EVENT", pointsValue: 10, sortOrder: 5 },
  { key: "demo_uploaded", label: "Demo submitted", description: "Demo video uploaded or linked.", category: "EVENT", pointsValue: 15, sortOrder: 6 },
  { key: "deck_uploaded", label: "Presentation submitted", description: "Presentation deck shared for judges.", category: "EVENT", pointsValue: 10, sortOrder: 7 },
  { key: "before_515", label: "Submitted before 5:15 PM", description: "Final package ready ahead of the late cutoff.", category: "EVENT", pointsValue: 5, sortOrder: 8 },
];

const judgeCriteria = [
  { key: "innovation", label: "Innovation", description: "Novelty of the idea and approach.", category: "JUDGE", maxScore: 10, sortOrder: 101 },
  { key: "business_value", label: "Business usefulness", description: "How relevant the solution is for Altir teams or customers.", category: "JUDGE", maxScore: 10, sortOrder: 102 },
  { key: "execution", label: "Execution", description: "Delivery quality within the event window.", category: "JUDGE", maxScore: 10, sortOrder: 103 },
  { key: "demo_quality", label: "Demo quality", description: "Clarity and polish of the demo.", category: "JUDGE", maxScore: 10, sortOrder: 104 },
  { key: "presentation", label: "Presentation clarity", description: "How well the team explains the outcome.", category: "JUDGE", maxScore: 10, sortOrder: 105 },
];

const teamBlueprints = [
  {
    slug: "prompt-ops",
    name: "Prompt Ops",
    status: "BUILDING",
    formedAt: new Date("2026-05-22T06:05:00.000Z"),
    members: ["osreenivasan@altir.co", "hbolla@altir.co"],
    idea: {
      title: "Command Center Copilot",
      summary: "A real-time event copilot that summarizes submissions, flags blockers, and drafts announcements for the organizer desk.",
      sourceType: "CUSTOM",
      stackSummary: "Next.js, OpenAI API, SQLite, Tailwind",
      bankCategory: "Operations AI",
      submittedById: "osreenivasan@altir.co",
      submittedAt: new Date("2026-05-22T08:50:00.000Z"),
    },
    apiKey: { label: "OPENAI-ALTIR-001", provider: "OpenAI", secret: "sk-proj-altir-techday-001", notes: "Reserved for ops demo team." },
    submission: {
      status: "READY_FOR_JUDGING",
      repoUrl: "https://github.com/altir-techday/prompt-ops",
      demoUrl: "https://videos.altir.local/prompt-ops-demo",
      presentationUrl: "https://slides.altir.local/prompt-ops",
      stackTags: "Next.js,OpenAI,Prisma,Tailwind",
      buildSummary: "Live briefing board with AI-generated recap cards and scoring alerts.",
      repoReadmeReady: true,
      submittedAt: new Date("2026-05-22T11:38:00.000Z"),
    },
    pointAwards: [
      { key: "team_formed", points: 10, reason: "Team formed with two confirmed members." },
      { key: "cross_assignment", points: 5, reason: "Chip1 and Hyperfuel pairing." },
      { key: "formed_before_lock", points: 5, reason: "Team locked before the cutoff." },
      { key: "idea_submitted", points: 10, reason: "Idea submitted before API key release." },
      { key: "repo_submitted", points: 10, reason: "GitHub repository linked." },
      { key: "demo_uploaded", points: 15, reason: "Demo video attached." },
      { key: "deck_uploaded", points: 10, reason: "Presentation deck shared." },
      { key: "before_515", points: 5, reason: "Submission package ready before 5:15 PM." },
    ],
  },
  {
    slug: "infra-guard",
    name: "Infra Guard",
    status: "BUILDING",
    formedAt: new Date("2026-05-22T06:20:00.000Z"),
    members: ["imohammad@altir.co", "bchauhan@altir.co"],
    idea: {
      title: "On-call Readiness Radar",
      summary: "A lightweight dashboard that converts incident notes into staffing suggestions and incident handoff summaries.",
      sourceType: "BANK",
      stackSummary: "Next.js, Prisma, Chart.js, Azure OpenAI",
      bankCategory: "Reliability",
      submittedById: "imohammad@altir.co",
      submittedAt: new Date("2026-05-22T08:55:00.000Z"),
    },
    apiKey: { label: "OPENAI-ALTIR-002", provider: "OpenAI", secret: "sk-proj-altir-techday-002", notes: "Infra showcase lane." },
    submission: {
      status: "READY_FOR_JUDGING",
      repoUrl: "https://github.com/altir-techday/infra-guard",
      demoUrl: "https://videos.altir.local/infra-guard-demo",
      presentationUrl: "https://slides.altir.local/infra-guard",
      stackTags: "Next.js,Azure OpenAI,Prisma,Chart.js",
      buildSummary: "Incident insights board tuned for engineering and HR coordination.",
      repoReadmeReady: true,
      submittedAt: new Date("2026-05-22T11:28:00.000Z"),
    },
    pointAwards: [
      { key: "team_formed", points: 10, reason: "Team formed with two confirmed members." },
      { key: "cross_assignment", points: 5, reason: "Infra and Human Resources pairing." },
      { key: "formed_before_lock", points: 5, reason: "Team locked before the cutoff." },
      { key: "idea_submitted", points: 10, reason: "Idea submitted before API key release." },
      { key: "repo_submitted", points: 10, reason: "GitHub repository linked." },
      { key: "demo_uploaded", points: 15, reason: "Demo video attached." },
      { key: "deck_uploaded", points: 10, reason: "Presentation deck shared." },
      { key: "before_515", points: 5, reason: "Submission package ready before 5:15 PM." },
    ],
  },
  {
    slug: "stack-signal",
    name: "Stack Signal",
    status: "SUBMITTED",
    formedAt: new Date("2026-05-22T06:12:00.000Z"),
    members: ["pkota@altir.co", "pshah@altir.co"],
    idea: {
      title: "POC Portfolio Radar",
      summary: "Tracks internal AI POCs, highlights stale experiments, and recommends the next validation step for each initiative.",
      sourceType: "CUSTOM",
      stackSummary: "Next.js, Prisma, SQLite, Azure deployment",
      bankCategory: "Portfolio Management",
      submittedById: "pshah@altir.co",
      submittedAt: new Date("2026-05-22T08:42:00.000Z"),
    },
    apiKey: { label: "OPENAI-ALTIR-003", provider: "OpenAI", secret: "sk-proj-altir-techday-003", notes: "AI POC lane." },
    submission: {
      status: "SUBMITTED",
      repoUrl: "https://github.com/altir-techday/stack-signal",
      demoUrl: "https://videos.altir.local/stack-signal-demo",
      presentationUrl: "https://slides.altir.local/stack-signal",
      stackTags: "Next.js,Prisma,SQLite,Azure",
      buildSummary: "A portfolio radar for internal experiments, with health signals and owner reminders.",
      repoReadmeReady: true,
      submittedAt: new Date("2026-05-22T11:15:00.000Z"),
    },
    pointAwards: [
      { key: "team_formed", points: 10, reason: "Team formed with two confirmed members." },
      { key: "cross_assignment", points: 5, reason: "JK Logix and AI POC pairing." },
      { key: "formed_before_lock", points: 5, reason: "Team locked before the cutoff." },
      { key: "idea_submitted", points: 10, reason: "Idea submitted before API key release." },
      { key: "repo_submitted", points: 10, reason: "GitHub repository linked." },
      { key: "demo_uploaded", points: 15, reason: "Demo video attached." },
      { key: "deck_uploaded", points: 10, reason: "Presentation deck shared." },
      { key: "before_515", points: 5, reason: "Submission package ready before 5:15 PM." },
    ],
  },
  {
    slug: "chip-pulse",
    name: "Chip Pulse",
    status: "BUILDING",
    formedAt: new Date("2026-05-22T06:18:00.000Z"),
    members: ["sgundimi@altir.co", "vadwant@altir.co"],
    idea: {
      title: "Standup Digest Generator",
      summary: "Condenses engineering standups and HR staffing notes into a single daily digest for leadership.",
      sourceType: "BANK",
      stackSummary: "Next.js, Prisma, OpenAI, Tailwind",
      bankCategory: "Internal Productivity",
      submittedById: "sgundimi@altir.co",
      submittedAt: new Date("2026-05-22T08:58:00.000Z"),
    },
    apiKey: { label: "OPENAI-ALTIR-004", provider: "OpenAI", secret: "sk-proj-altir-techday-004", notes: "Daily operations experiment." },
    submission: {
      status: "IN_PROGRESS",
      repoUrl: "https://github.com/altir-techday/chip-pulse",
      demoUrl: null,
      presentationUrl: null,
      stackTags: "Next.js,Prisma,OpenAI,Tailwind",
      buildSummary: "Digest generator for standup notes and staffing alerts.",
      repoReadmeReady: true,
      submittedAt: null,
    },
    pointAwards: [
      { key: "team_formed", points: 10, reason: "Team formed with two confirmed members." },
      { key: "cross_assignment", points: 5, reason: "Chip1 and Human Resources pairing." },
      { key: "formed_before_lock", points: 5, reason: "Team locked before the cutoff." },
      { key: "idea_submitted", points: 10, reason: "Idea submitted before API key release." },
      { key: "repo_submitted", points: 10, reason: "GitHub repository linked." },
    ],
  },
  {
    slug: "euro-ui-lab",
    name: "Euro UI Lab",
    status: "IDEA_SUBMITTED",
    formedAt: new Date("2026-05-22T06:40:00.000Z"),
    members: ["aduduk@altir.co", "mmonich@altir.co"],
    idea: {
      title: "Demo Storyboard Builder",
      summary: "Turns a repo, idea summary, and screenshots into a presentation-ready storyboard for hackathon demos.",
      sourceType: "CUSTOM",
      stackSummary: "Next.js, Prisma, Shadcn, Azure Blob",
      bankCategory: "Design Systems",
      submittedById: "aduduk@altir.co",
      submittedAt: new Date("2026-05-22T08:47:00.000Z"),
    },
    apiKey: { label: "OPENAI-ALTIR-005", provider: "OpenAI", secret: "sk-proj-altir-techday-005", notes: "Design-focused lane." },
    submission: {
      status: "IN_PROGRESS",
      repoUrl: null,
      demoUrl: null,
      presentationUrl: null,
      stackTags: "Next.js,Shadcn,Prisma,Azure Blob",
      buildSummary: "Storyboard builder for fast internal demo polish.",
      repoReadmeReady: false,
      submittedAt: null,
    },
    pointAwards: [
      { key: "team_formed", points: 10, reason: "Team formed with two confirmed members." },
      { key: "cross_assignment", points: 5, reason: "Chip1 and Soundful pairing." },
      { key: "formed_before_lock", points: 5, reason: "Team locked before the cutoff." },
      { key: "idea_submitted", points: 10, reason: "Idea submitted before API key release." },
    ],
  },
];

function passwordFromEmail(email: string) {
  return email.split("@")[0] ?? "";
}

async function main() {
  await prisma.judgeScore.deleteMany();
  await prisma.eventPointAward.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.idea.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.scoreCriterion.deleteMany();
  await prisma.timelineItem.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: employeeSeedRows
      .filter((row) => row.email)
      .map((row) => ({
        id: row.email!.toLowerCase(),
        email: row.email!.toLowerCase(),
        password: passwordFromEmail(row.email!.toLowerCase()),
        employeeId: row.employeeId,
        fullName: row.fullName,
        title: row.title,
        reportingManager: row.reportingManager,
        primaryAssignment: row.primaryAssignment,
        secondaryAssignment: row.secondaryAssignment,
        isEligible: true,
        isActive: true,
        isAdmin: adminEmails.has(row.email!.toLowerCase()),
        isJudge: judgeEmails.has(row.email!.toLowerCase()),
      })),
  });

  const criteria = [...eventCriteria, ...judgeCriteria];

  await prisma.scoreCriterion.createMany({
    data: criteria,
  });

  const criterionByKey: Record<string, { id: string }> = Object.fromEntries(
    (await prisma.scoreCriterion.findMany({ select: { id: true, key: true } })).map((criterion) => [
      criterion.key,
      criterion,
    ]),
  );

  const adminUser = "akhil@altir.co";

  await prisma.announcement.createMany({
    data: [
      {
        title: "Check-in open",
        message: "Team formation is open. Lock-in happens at 1:00 PM sharp.",
        level: "INFO",
        isPinned: true,
        isPublished: true,
        publishedAt: new Date("2026-05-22T05:30:00.000Z"),
        createdById: adminUser,
      },
      {
        title: "API key unlock rule",
        message: "Submit an idea before 2:30 PM to unlock your team API key right at build start.",
        level: "ACTION",
        isPinned: true,
        isPublished: true,
        publishedAt: new Date("2026-05-22T06:00:00.000Z"),
        createdById: adminUser,
      },
      {
        title: "Demo uploads due",
        message: "Keep the final repo, demo link, and deck in one place before presentations begin.",
        level: "REMINDER",
        isPinned: false,
        isPublished: true,
        publishedAt: new Date("2026-05-22T10:45:00.000Z"),
        createdById: adminUser,
      },
    ],
  });

  await prisma.timelineItem.createMany({
    data: [
      {
        title: "Check-in and team formation",
        description: "Finalize pairs, names, and ideas.",
        kind: "CHECK_IN",
        startsAt: new Date("2026-05-22T05:30:00.000Z"),
        endsAt: TEAM_LOCK_TIME,
        sortOrder: 1,
        isPublic: true,
        createdById: adminUser,
      },
      {
        title: "Team lock",
        description: "Team changes require admin override after this point.",
        kind: "LOCK",
        startsAt: TEAM_LOCK_TIME,
        sortOrder: 2,
        isPublic: true,
        createdById: adminUser,
      },
      {
        title: "Build window",
        description: "Code, ship, and keep the command center updated.",
        kind: "BUILD",
        startsAt: API_KEY_RELEASE_TIME,
        endsAt: SUBMISSION_DEADLINE,
        sortOrder: 3,
        isPublic: true,
        createdById: adminUser,
      },
      {
        title: "Presentations",
        description: "Each team gets a short demo and judge Q&A.",
        kind: "PRESENT",
        startsAt: SUBMISSION_DEADLINE,
        endsAt: new Date("2026-05-22T13:00:00.000Z"),
        sortOrder: 4,
        isPublic: true,
        createdById: adminUser,
      },
    ],
  });

  for (const blueprint of teamBlueprints) {
    const team = await prisma.team.create({
      data: {
        slug: blueprint.slug,
        name: blueprint.name,
        status: blueprint.status,
        formedAt: blueprint.formedAt,
        lockedAt: TEAM_LOCK_TIME,
        memberships: {
          create: blueprint.members.map((userId, index) => ({
            userId,
            isCaptain: index === 0,
          })),
        },
      },
    });

    await prisma.idea.create({
      data: {
        teamId: team.id,
        ...blueprint.idea,
        isCurrent: true,
        isPublic: true,
      },
    });

    await prisma.apiKey.create({
      data: {
        provider: blueprint.apiKey.provider,
        label: blueprint.apiKey.label,
        secret: blueprint.apiKey.secret,
        status: "ASSIGNED",
        assignedTeamId: team.id,
        assignedAt: EVENT_DAY,
        visibleFrom: API_KEY_RELEASE_TIME,
        notes: blueprint.apiKey.notes,
      },
    });

    await prisma.submission.create({
      data: {
        teamId: team.id,
        ...blueprint.submission,
      },
    });

    await prisma.eventPointAward.createMany({
      data: blueprint.pointAwards.map((award) => ({
        teamId: team.id,
        criterionId: criterionByKey[award.key]?.id,
        grantedById: adminUser,
        points: award.points,
        source: "SYSTEM",
        reason: award.reason,
        grantedAt: EVENT_DAY,
      })),
    });
  }

  const teams: Record<string, { id: string; slug: string }> = Object.fromEntries(
    (await prisma.team.findMany({ select: { id: true, slug: true } })).map((team) => [team.slug, team]),
  );
  const judges = ["asarraf@altir.co", "dnagboth@altir.co", "anjan@altir.co"];
  const judgedSlugs = ["prompt-ops", "infra-guard", "stack-signal"];

  const scoreMatrix: Record<string, Record<string, number[]>> = {
    "prompt-ops": {
      innovation: [9, 9, 8],
      business_value: [9, 8, 9],
      execution: [8, 9, 8],
      demo_quality: [9, 8, 8],
      presentation: [8, 8, 9],
    },
    "infra-guard": {
      innovation: [8, 8, 8],
      business_value: [9, 9, 8],
      execution: [8, 8, 9],
      demo_quality: [8, 8, 8],
      presentation: [8, 7, 8],
    },
    "stack-signal": {
      innovation: [8, 9, 8],
      business_value: [8, 9, 9],
      execution: [9, 8, 8],
      demo_quality: [8, 9, 8],
      presentation: [9, 8, 8],
    },
  };

  for (const slug of judgedSlugs) {
    const team = teams[slug];

    for (const [criterionKey, values] of Object.entries(scoreMatrix[slug])) {
      for (const [index, judgeId] of judges.entries()) {
        await prisma.judgeScore.create({
          data: {
            judgeId,
            enteredById: judgeId,
            teamId: team.id,
            criterionId: criterionByKey[criterionKey].id,
            score: values[index] ?? values[0] ?? 0,
            note: "Seeded demo score for command center previews.",
            status: "SUBMITTED",
            submittedAt: new Date("2026-05-22T12:20:00.000Z"),
          },
        });
      }
    }
  }

  console.log(`Seeded ${employeeSeedRows.length} employees, ${teamBlueprints.length} teams, and ${criteria.length} criteria.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
