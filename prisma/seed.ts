import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const EVENT_POINT_WEIGHTS = {
  team_formed: 50,
  cross_assignment: 40,
  formed_before_lock: 40,
  idea_submitted: 50,
  repo_submitted: 50,
  demo_uploaded: 80,
  deck_uploaded: 50,
  before_515: 40,
} as const;

const EVENT_DAY = new Date("2026-05-22T08:00:00.000Z");
const TEAM_LOCK_TIME = new Date("2026-05-22T06:30:00.000Z");
const API_KEY_RELEASE_TIME = new Date("2026-05-22T07:30:00.000Z");
const SUBMISSION_DEADLINE = new Date("2026-05-22T12:00:00.000Z");
const DEMOS_SOFT_END = new Date("2026-05-22T13:30:00.000Z");

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
  { key: "team_formed", label: "Complete team formed", description: "Two members locked into a team.", category: "EVENT", pointsValue: EVENT_POINT_WEIGHTS.team_formed, sortOrder: 1 },
  { key: "cross_assignment", label: "Different assignments", description: "Members come from different primary assignments.", category: "EVENT", pointsValue: EVENT_POINT_WEIGHTS.cross_assignment, sortOrder: 2 },
  { key: "formed_before_lock", label: "Formed before lock", description: "Team formed before the 12:00 PM lock time.", category: "EVENT", pointsValue: EVENT_POINT_WEIGHTS.formed_before_lock, sortOrder: 3 },
  { key: "idea_submitted", label: "Idea submitted", description: "Team committed to an idea before build start.", category: "EVENT", pointsValue: EVENT_POINT_WEIGHTS.idea_submitted, sortOrder: 4 },
  { key: "repo_submitted", label: "GitHub repo submitted", description: "Repository link added for review.", category: "EVENT", pointsValue: EVENT_POINT_WEIGHTS.repo_submitted, sortOrder: 5 },
  { key: "demo_uploaded", label: "Demo submitted", description: "Demo video uploaded or linked.", category: "EVENT", pointsValue: EVENT_POINT_WEIGHTS.demo_uploaded, sortOrder: 6 },
  { key: "deck_uploaded", label: "Presentation submitted", description: "Presentation deck shared for judges.", category: "EVENT", pointsValue: EVENT_POINT_WEIGHTS.deck_uploaded, sortOrder: 7 },
  { key: "before_515", label: "Submitted before 5:00 PM", description: "Final package ready 30 minutes ahead of the 5:30 PM deadline.", category: "EVENT", pointsValue: EVENT_POINT_WEIGHTS.before_515, sortOrder: 8 },
];


const judgeCriteria = [
  { key: "innovation", label: "Innovation", description: "Novelty of the idea and approach.", category: "JUDGE", maxScore: 10, sortOrder: 101 },
  { key: "business_value", label: "Business usefulness", description: "How relevant the solution is for Altir teams or customers.", category: "JUDGE", maxScore: 10, sortOrder: 102 },
  { key: "execution", label: "Execution", description: "Delivery quality within the event window.", category: "JUDGE", maxScore: 10, sortOrder: 103 },
  { key: "demo_quality", label: "Demo quality", description: "Clarity and polish of the demo.", category: "JUDGE", maxScore: 10, sortOrder: 104 },
  { key: "presentation", label: "Presentation clarity", description: "How well the team explains the outcome.", category: "JUDGE", maxScore: 10, sortOrder: 105 },
];


function passwordFromEmail(email: string, employeeId: string) {
  const local = email.split("@")[0] ?? "";
  return `${local}_${employeeId}`;
}

async function main() {
  await prisma.judgeScore.deleteMany();
  await prisma.eventPointAward.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.idea.deleteMany();
  await prisma.ideaBankEntry.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.scoreCriterion.deleteMany();
  await prisma.timelineItem.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.appSetting.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: employeeSeedRows
      .filter((row) => row.email)
      .map((row) => ({
        id: row.email!.toLowerCase(),
        email: row.email!.toLowerCase(),
        password: passwordFromEmail(row.email!.toLowerCase(), row.employeeId),
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

  await prisma.appSetting.createMany({
    data: [
      { key: "score_event_weight", value: "0.4" },
      { key: "score_judge_weight", value: "0.6" },
      { key: "admin_event_phase", value: "BUILD" },
    ],
  });

  await prisma.ideaBankEntry.createMany({
    data: [
      {
        title: "Slide composer from raw meeting transcripts",
        problemStatement:
          "Teams lose hours turning messy meeting notes into customer-ready decks. Recurring asks need a repeatable first draft, not a blank slide.",
        description:
          "A web app where users paste or upload meeting transcripts, pick a tone (exec update vs deep dive), and get structured slides with titles, bullets, and speaker notes. MVP focuses on one template and export to Markdown/PDF.",
        expectedOutcome:
          "End-to-end demo: paste sample transcript → generated outline + 4 slides + export. Clear guardrails copy for PII and hallucinations.",
        stackHint: "~3h · Next.js + Whisper (or mock transcript API)",
        category: "DESIGN",
        sortOrder: 1,
        isActive: true,
      },
      {
        title: "Customer onboarding checklist generator",
        problemStatement:
          "Onboarding playbooks live in scattered docs; new CSMs wing it and miss steps. We need a fast way to generate a tailored checklist per account segment.",
        description:
          "Simple wizard: industry, product SKU, region → generated checklist with owners, due offsets, and links to internal templates. Save as shareable page for the team.",
        expectedOutcome:
          "Working flow with 2 segment presets, editable checklist UI, and 'copy for Slack' summary. Shows how prompts stay grounded in the handbook text.",
        stackHint: "~3h · Python + OpenAI",
        category: "OPS",
        sortOrder: 2,
        isActive: true,
      },
      {
        title: "Internal docs answer bot",
        problemStatement:
          "Engineers ask the same policy and architecture questions in chat because internal search is noisy and stale.",
        description:
          "Tiny RAG UI over a bundled markdown corpus (handbook excerpts). Ask a question, see cited snippets, and a short synthesized answer with links to sources.",
        expectedOutcome:
          "Demo with ~10 docs, working query box, citations highlighted, and graceful 'not found' state. Shows latency and content safety notes.",
        stackHint: "~3h · Next.js + pgvector or SQLite FTS mock",
        category: "ENG",
        sortOrder: 3,
        isActive: true,
      },
      {
        title: "Deal desk objection simulator",
        problemStatement:
          "New sellers struggle to practice crisp responses to tough objections before live customer calls.",
        description:
          "Role-play UI: pick persona (CFO, security, procurement), receive objection prompts, capture rep answer, and return concise coaching bullets plus a model answer.",
        expectedOutcome:
          "Three persona cards, timed turns, session recap export. Highlights tone and compliance guardrails for customer-facing language.",
        stackHint: "~2h · OpenAI API",
        category: "BIZ",
        sortOrder: 4,
        isActive: true,
      },
    ],
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
        message: "Team formation is open. Lock-in happens at 12:00 PM sharp.",
        level: "INFO",
        isPinned: true,
        isPublished: true,
        publishedAt: new Date("2026-05-22T05:30:00.000Z"),
        createdById: adminUser,
      },
      {
        title: "API key unlock rule",
        message: "Submit an idea before 1:30 PM to unlock your team API key right at build start.",
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
        endsAt: DEMOS_SOFT_END,
        sortOrder: 4,
        isPublic: true,
        createdById: adminUser,
      },
    ],
  });

  console.log(`Seeded ${employeeSeedRows.length} employees and ${criteria.length} criteria.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
