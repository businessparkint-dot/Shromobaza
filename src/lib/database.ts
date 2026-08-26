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
    | "শীঘ্রই পাওয়া যাবে"
    | "ব্যস্ত";
};

export type Employer = {
  id: string;
  name: string;
  location: string;
  phone?: string;
  email?: string;
  verified?: boolean;
};

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

export const locations = {
  "ঢাকা বিভাগ": [
    "ঢাকা",
    "ফরিদপুর",
    "গাজীপুর",
    "গোপালগঞ্জ",
    "কিশোরগঞ্জ",
    "মাদারীপুর",
    "মানিকগঞ্জ",
    "মুন্সিগঞ্জ",
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

export const workers: Worker[] = [];

export const employers: Employer[] = [];

export const jobs: Job[] = [];

export const applications: Application[] = [];

export const hireRequests: HireRequest[] = [];

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