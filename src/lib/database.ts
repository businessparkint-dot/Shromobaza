
// src/lib/database.ts

/* =========================================================
   WORKER
========================================================= */

export type Worker = {
  id: string;
  name: string;
  role: string;
  category: string;
  subCategory: string;

  division: string;
  district: string;
  location: string;

  phone: string;
  experience: string;
  currentWork: string;

  skills: string[];
  about: string;
  rate: string;

  rating: number;
  completedJobs: number;
  verified: boolean;

  available: boolean;
  availability:
    | "এখনই পাওয়া যাবে"
    | "শিগগির পাওয়া যাবে"
    | "ব্যস্ত";
};

/* =========================================================
   EMPLOYER
========================================================= */

export type Employer = {
  id: string;
  name: string;
  location: string;
  phone?: string;
  email?: string;
  verified?: boolean;
};

/* =========================================================
   JOB
========================================================= */

export type Job = {
  id: string;
  employerId: string;
  title: string;
  description?: string;
  location: string;
  salary: string;
  category?: string;
  workersNeeded?: number;
  status?: "open" | "closed";
  createdAt?: string;
};

/* =========================================================
   APPLICATION
========================================================= */

export type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected";

export type Application = {
  id: string;
  jobId: string;
  workerId: string;
  employerId: string;
  status: ApplicationStatus;
  message?: string;
  appliedAt?: string;
};

/* =========================================================
   HIRE REQUEST
========================================================= */

export type HireRequest = {
  id: string;
  workerId: string;
  employerId: string;
  jobTitle: string;
  location: string;
  salary: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
};

/* =========================================================
   CATEGORIES
========================================================= */

export const categories = {
  মিস্ত্রি: [
    "রাজমিস্ত্রি",
    "টাইলস মিস্ত্রি",
    "পেইন্টার",
    "কার্পেন্টার",
    "ছাদ মিস্ত্রি",
    "স্যানিটারি মিস্ত্রি",
  ],

  শ্রমিক: [
    "সাধারণ শ্রমিক",
    "নির্মাণ শ্রমিক",
    "কৃষি শ্রমিক",
    "হেলপার",
    "লোডিং শ্রমিক",
    "গুদাম শ্রমিক",
  ],

  টেকনিশিয়ান: [
    "ইলেকট্রিশিয়ান",
    "প্লাম্বার",
    "ওয়েল্ডার",
    "AC টেকনিশিয়ান",
    "কম্পিউটার টেকনিশিয়ান",
    "ইলেকট্রনিক্স টেকনিশিয়ান",
  ],

  ড্রাইভার: [
    "প্রাইভেট কার",
    "মাইক্রোবাস",
    "ট্রাক",
    "বাস",
    "পিকআপ",
    "ডেলিভারি ড্রাইভার",
  ],

  আইনজীবী: [
    "সিভিল আইন",
    "ফৌজদারি আইন",
    "জমি আইন",
    "পারিবারিক আইন",
    "কোম্পানি আইন",
    "আইনি পরামর্শ",
  ],

  ইঞ্জিনিয়ার: [
    "সিভিল ইঞ্জিনিয়ার",
    "ইলেকট্রিক্যাল ইঞ্জিনিয়ার",
    "মেকানিক্যাল ইঞ্জিনিয়ার",
    "আর্কিটেক্ট",
    "সাইট ইঞ্জিনিয়ার",
    "প্রজেক্ট ম্যানেজার",
  ],

  ডাক্তার: [
    "মেডিসিন",
    "সার্জারি",
    "শিশু বিশেষজ্ঞ",
    "চর্মরোগ",
    "ডেন্টাল",
    "জেনারেল ফিজিশিয়ান",
  ],

  সিকিউরিটি: [
    "সিকিউরিটি গার্ড",
    "সিকিউরিটি সুপারভাইজার",
    "নাইট গার্ড",
    "অফিস সিকিউরিটি",
  ],

  "পার্ট টাইম": [
    "ডেলিভারি কর্মী",
    "রেস্টুরেন্ট কর্মী",
    "দোকান কর্মী",
    "কাস্টমার সার্ভিস",
    "ক্লিনিং কর্মী",
  ],
} as const;

/* =========================================================
   LOCATIONS
========================================================= */

export const locations = {
  "ঢাকা বিভাগ": [
    "ঢাকা",
    "ফরিদপুর",
    "গাজীপুর",
    "গোপালগঞ্জ",
    "কিশোরগঞ্জ",
    "মাদারীপুর",
    "মানিকগঞ্জ",
    "মুন্সীগঞ্জ",
    "নারায়ণগঞ্জ",
    "নরসিংদী",
    "রাজবাড়ী",
    "শরীয়তপুর",
    "টাঙ্গাইল",
  ],

  "খুলনা বিভাগ": [
    "বাগেরহাট",
    "চুয়াডাঙ্গা",
    "যশোর",
    "ঝিনাইদহ",
    "খুলনা",
    "কুষ্টিয়া",
    "মাগুরা",
    "মেহেরপুর",
    "নড়াইল",
    "সাতক্ষীরা",
  ],

  "চট্টগ্রাম বিভাগ": [
    "বান্দরবান",
    "ব্রাহ্মণবাড়িয়া",
    "চাঁদপুর",
    "চট্টগ্রাম",
    "কুমিল্লা",
    "কক্সবাজার",
    "ফেনী",
    "খাগড়াছড়ি",
    "লক্ষ্মীপুর",
    "নোয়াখালী",
    "রাঙ্গামাটি",
  ],

  "রাজশাহী বিভাগ": [
    "বগুড়া",
    "জয়পুরহাট",
    "নওগাঁ",
    "নাটোর",
    "চাঁপাইনবাবগঞ্জ",
    "পাবনা",
    "রাজশাহী",
    "সিরাজগঞ্জ",
  ],

  "সিলেট বিভাগ": [
    "হবিগঞ্জ",
    "মৌলভীবাজার",
    "সুনামগঞ্জ",
    "সিলেট",
  ],

  "রংপুর বিভাগ": [
    "দিনাজপুর",
    "গাইবান্ধা",
    "কুড়িগ্রাম",
    "লালমনিরহাট",
    "নীলফামারী",
    "পঞ্চগড়",
    "রংপুর",
    "ঠাকুরগাঁও",
  ],

  "ময়মনসিংহ বিভাগ": [
    "জামালপুর",
    "ময়মনসিংহ",
    "নেত্রকোণা",
    "শেরপুর",
  ],

  "বরিশাল বিভাগ": [
    "বরগুনা",
    "বরিশাল",
    "ভোলা",
    "ঝালকাঠি",
    "পটুয়াখালী",
    "পিরোজপুর",
  ],
} as const;

/* =========================================================
   WORKERS
========================================================= */

export const workers: Worker[] = [
  {
    id: "worker-001",
    name: "রহিম মিয়া",
    role: "রাজমিস্ত্রি",
    category: "মিস্ত্রি",
    subCategory: "রাজমিস্ত্রি",
    division: "ঢাকা বিভাগ",
    district: "ঢাকা",
    location: "মিরপুর, ঢাকা",
    phone: "01700000001",
    experience: "৮ বছর",
    currentWork: "বাড়ি নির্মাণ ও রেনোভেশন",
    skills: [
      "ইটের কাজ",
      "প্লাস্টার",
      "সিমেন্টের কাজ",
      "বাড়ি নির্মাণ",
    ],
    about:
      "দীর্ঘদিন ধরে বাড়ি নির্মাণ, প্লাস্টার ও বিভিন্ন masonry কাজে অভিজ্ঞ।",
    rate: "৳১২০০ / দিন",
    rating: 4.8,
    completedJobs: 126,
    verified: true,
    available: true,
    availability: "এখনই পাওয়া যাবে",
  },

  {
    id: "worker-002",
    name: "করিম মিয়া",
    role: "ইলেকট্রিশিয়ান",
    category: "টেকনিশিয়ান",
    subCategory: "ইলেকট্রিশিয়ান",
    division: "ঢাকা বিভাগ",
    district: "ঢাকা",
    location: "উত্তরা, ঢাকা",
    phone: "01700000002",
    experience: "৬ বছর",
    currentWork: "ইলেকট্রিক্যাল ইনস্টলেশন",
    skills: [
      "হাউস ওয়্যারিং",
      "ইলেকট্রিক মিটার",
      "লাইটিং",
      "সুইচ-সকেট",
    ],
    about:
      "বাসাবাড়ি ও ছোট ব্যবসা প্রতিষ্ঠানের electrical installation এবং maintenance কাজে অভিজ্ঞ।",
    rate: "৳১০০০ / দিন",
    rating: 4.7,
    completedJobs: 94,
    verified: true,
    available: true,
    availability: "এখনই পাওয়া যাবে",
  },

  {
    id: "worker-003",
    name: "জাকির হোসেন",
    role: "প্লাম্বার",
    category: "টেকনিশিয়ান",
    subCategory: "প্লাম্বার",
    division: "ঢাকা বিভাগ",
    district: "ঢাকা",
    location: "মোহাম্মদপুর, ঢাকা",
    phone: "01700000003",
    experience: "৫ বছর",
    currentWork: "প্লাম্বিং ও পাইপলাইন কাজ",
    skills: [
      "পাইপলাইন",
      "বাথরুম ফিটিং",
      "পানির লাইন",
      "স্যানিটারি কাজ",
    ],
    about:
      "বাসাবাড়ির পানির লাইন, স্যানিটারি ফিটিং এবং plumbing maintenance কাজে অভিজ্ঞ।",
    rate: "৳৯০০ / দিন",
    rating: 4.6,
    completedJobs: 81,
    verified: true,
    available: true,
    availability: "এখনই পাওয়া যাবে",
  },

  {
    id: "worker-004",
    name: "সোহেল রানা",
    role: "ওয়েল্ডার",
    category: "টেকনিশিয়ান",
    subCategory: "ওয়েল্ডার",
    division: "ঢাকা বিভাগ",
    district: "গাজীপুর",
    location: "গাজীপুর",
    phone: "01700000004",
    experience: "৭ বছর",
    currentWork: "স্টিল ও মেটাল ওয়েল্ডিং",
    skills: [
      "Arc Welding",
      "Gas Welding",
      "Steel Work",
      "Gate & Grill",
    ],
    about:
      "স্টিল, গেট, গ্রিল এবং বিভিন্ন metal fabrication কাজে দক্ষ।",
    rate: "৳১১০০ / দিন",
    rating: 4.8,
    completedJobs: 112,
    verified: true,
    available: true,
    availability: "এখনই পাওয়া যাবে",
  },

  {
    id: "worker-005",
    name: "শামীম আহমেদ",
    role: "কার্পেন্টার",
    category: "মিস্ত্রি",
    subCategory: "কার্পেন্টার",
    division: "ঢাকা বিভাগ",
    district: "ঢাকা",
    location: "সাভার, ঢাকা",
    phone: "01700000005",
    experience: "৯ বছর",
    currentWork: "ফার্নিচার ও কাঠের কাজ",
    skills: [
      "ফার্নিচার",
      "দরজা",
      "জানালা",
      "কাঠের কাজ",
    ],
    about:
      "বাড়ির দরজা-জানালা, ফার্নিচার এবং custom woodwork তৈরিতে অভিজ্ঞ।",
    rate: "৳১২০০ / দিন",
    rating: 4.9,
    completedJobs: 143,
    verified: true,
    available: true,
    availability: "এখনই পাওয়া যাবে",
  },

  {
    id: "worker-006",
    name: "মোস্তাক হোসেন",
    role: "পেইন্টার",
    category: "মিস্ত্রি",
    subCategory: "পেইন্টার",
    division: "ঢাকা বিভাগ",
    district: "নারায়ণগঞ্জ",
    location: "নারায়ণগঞ্জ",
    phone: "01700000006",
    experience: "৬ বছর",
    currentWork: "বাড়ি ও অফিস পেইন্টিং",
    skills: [
      "Interior Painting",
      "Exterior Painting",
      "Wall Putty",
      "Color Finishing",
    ],
    about:
      "বাড়ি, অফিস ও commercial building-এর interior এবং exterior painting কাজে দক্ষ।",
    rate: "৳৯০০ / দিন",
    rating: 4.7,
    completedJobs: 98,
    verified: true,
    available: true,
    availability: "এখনই পাওয়া যাবে",
  },
];

/* =========================================================
   EMPLOYERS
========================================================= */

export const employers: Employer[] = [
  {
    id: "employer-1",
    name: "Construction Company",
    location: "মিরপুর, ঢাকা",
    phone: "01800000001",
    email: "company@example.com",
    verified: true,
  },

  {
    id: "employer-2",
    name: "ABC Construction Ltd.",
    location: "মিরপুর, ঢাকা",
    phone: "01800000002",
    email: "abc@example.com",
    verified: true,
  },
];

/* =========================================================
   JOBS
========================================================= */

export const jobs: Job[] = [
  {
    id: "job-001",
    employerId: "employer-1",
    title: "রাজমিস্ত্রি প্রয়োজন",
    description:
      "বাড়ি নির্মাণ প্রকল্পের জন্য অভিজ্ঞ রাজমিস্ত্রি প্রয়োজন।",
    location: "মিরপুর, ঢাকা",
    salary: "৳১২০০ / দিন",
    category: "মিস্ত্রি",
    workersNeeded: 3,
    status: "open",
    createdAt: new Date().toISOString(),
  },

  {
    id: "job-002",
    employerId: "employer-1",
    title: "ইলেকট্রিশিয়ান প্রয়োজন",
    description:
      "বিল্ডিং electrical installation কাজের জন্য দক্ষ ইলেকট্রিশিয়ান প্রয়োজন।",
    location: "উত্তরা, ঢাকা",
    salary: "৳১০০০ / দিন",
    category: "টেকনিশিয়ান",
    workersNeeded: 2,
    status: "open",
    createdAt: new Date().toISOString(),
  },
];

/* =========================================================
   APPLICATIONS
========================================================= */

/*
 * IMPORTANT:
 * worker-001 + accepted
 * এই Application-টাই My Jobs-এ দেখাবে।
 */

export const applications: Application[] = [
  {
    id: "application-001",
    jobId: "job-001",
    workerId: "worker-001",
    employerId: "employer-1",
    status: "accepted",
    message:
      "আমি এই কাজের জন্য আবেদন করতে আগ্রহী।",
    appliedAt: new Date().toISOString(),
  },

  {
    id: "application-002",
    jobId: "job-002",
    workerId: "worker-002",
    employerId: "employer-1",
    status: "pending",
    message:
      "ইলেকট্রিক্যাল কাজের জন্য আমি available আছি।",
    appliedAt: new Date().toISOString(),
  },
];

/* =========================================================
   HIRE REQUESTS
========================================================= */

export const hireRequests: HireRequest[] = [];

/* =========================================================
   MARKETPLACE HELPERS
========================================================= */

export const availableWorkers = workers.filter(
  (worker) => worker.available
);

export function getAvailableWorkerCountByDistrict(
  district: string
) {
  return workers.filter(
    (worker) =>
      worker.district === district &&
      worker.available
  ).length;
}

export function getAvailableWorkerCountByCategory(
  category: string
) {
  return workers.filter(
    (worker) =>
      worker.category === category &&
      worker.available
  ).length;
}

export function getAvailableWorkerCountBySubCategory(
  subCategory: string
) {
  return workers.filter(
    (worker) =>
      worker.subCategory === subCategory &&
      worker.available
  ).length;
}

export function getAvailableWorkerCountByDivision(
  division: string
) {
  return workers.filter(
    (worker) =>
      worker.division === division &&
      worker.available
  ).length;
}

/* =========================================================
   SEARCH WORKERS
========================================================= */

export function searchWorkers(query: string) {
  const q = query.toLowerCase().trim();

  if (!q) return workers;

  return workers.filter((worker) =>
    [
      worker.name,
      worker.role,
      worker.category,
      worker.subCategory,
      worker.division,
      worker.district,
      worker.location,
      worker.currentWork,
      worker.about,
      ...worker.skills,
    ]
      .join(" ")
      .toLowerCase()
      .includes(q)
  );
}
