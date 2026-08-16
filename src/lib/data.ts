import type { LucideIcon } from "lucide-react";

import {
  Briefcase,
  Code2,
  Globe2,
  Hammer,
  Headphones,
  HeartPulse,
  Palette,
  ShieldCheck,
  Truck,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";

/* ==========================================
   SITE CONFIG
========================================== */

export const siteConfig = {
  name: "Shromobazar",
  tagline: "Global Workforce Platform",
  description:
    "Shromobazar connects skilled workers and employers worldwide. Find talent, discover jobs, and build your global career on one trusted platform.",
  url: "https://shromobazar.com",

  links: {
    twitter: "https://twitter.com/shromobazar",
    linkedin: "https://linkedin.com/company/shromobazar",
    facebook: "https://facebook.com/shromobazar",
  },
};

/* ==========================================
   COMMON TYPES
========================================== */

export type Stat = {
  value: string;
  label: string;
  suffix?: string;
};

export type Category = {
  id: string;
  name: string;
  count: number;
  icon: LucideIcon;
};

export type Feature = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

/* ==========================================
   NAVIGATION
========================================== */

export const navLinks = [
  {
    label: "Find Workers",
    href: "#workers",
  },
  {
    label: "Browse Jobs",
    href: "#jobs",
  },
  {
    label: "Categories",
    href: "#categories",
  },
  {
    label: "Why Us",
    href: "#why-us",
  },
];

/* ==========================================
   STATISTICS
========================================== */

export const statistics: Stat[] = [
  {
    value: "2.4",
    suffix: "M+",
    label: "Active Workers",
  },
  {
    value: "180",
    suffix: "+",
    label: "Countries",
  },
  {
    value: "850",
    suffix: "K+",
    label: "Jobs Posted",
  },
  {
    value: "98",
    suffix: "%",
    label: "Employer Satisfaction",
  },
];

/* ==========================================
   CATEGORIES
========================================== */

export const categories: Category[] = [
  {
    id: "tech",
    name: "Technology",
    count: 12400,
    icon: Code2,
  },
  {
    id: "health",
    name: "Healthcare",
    count: 8900,
    icon: HeartPulse,
  },
  {
    id: "construction",
    name: "Construction",
    count: 15600,
    icon: Hammer,
  },
  {
    id: "design",
    name: "Design & Creative",
    count: 6700,
    icon: Palette,
  },
  {
    id: "logistics",
    name: "Logistics",
    count: 9800,
    icon: Truck,
  },
  {
    id: "hospitality",
    name: "Hospitality",
    count: 11200,
    icon: UtensilsCrossed,
  },
  {
    id: "business",
    name: "Business Services",
    count: 7400,
    icon: Briefcase,
  },
  {
    id: "global",
    name: "Remote & Global",
    count: 18900,
    icon: Globe2,
  },
];

/* ==========================================
   HOMEPAGE WORKERS
========================================== */

export type Worker = {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  reviews: number;
  rate: string;
  image: string;
  skills: string[];
  verified: boolean;
};

export const featuredWorkers: Worker[] = [
  {
    id: "1",
    name: "Amara Okafor",
    role: "Senior Full-Stack Developer",
    location: "Lagos, Nigeria",
    rating: 4.9,
    reviews: 127,
    rate: "$45/hr",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    skills: ["React", "Node.js", "AWS"],
    verified: true,
  },
  {
    id: "2",
    name: "Marco Silva",
    role: "Licensed Electrician",
    location: "São Paulo, Brazil",
    rating: 4.8,
    reviews: 89,
    rate: "$38/hr",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    skills: ["Commercial", "Residential", "Solar"],
    verified: true,
  },
  {
    id: "3",
    name: "Priya Sharma",
    role: "UX/UI Designer",
    location: "Bangalore, India",
    rating: 5.0,
    reviews: 64,
    rate: "$52/hr",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    skills: ["Figma", "Design Systems", "Research"],
    verified: true,
  },
  {
    id: "4",
    name: "James Chen",
    role: "Data Analyst",
    location: "Toronto, Canada",
    rating: 4.7,
    reviews: 52,
    rate: "$41/hr",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    skills: ["Python", "SQL", "Tableau"],
    verified: true,
  },
];

/* ==========================================
   HOMEPAGE JOBS
========================================== */

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  salary: string;
  posted: string;
  logo: string;
  tags: string[];
};

export const latestJobs: Job[] = [
  {
    id: "1",
    title: "Senior React Developer",
    company: "TechFlow Inc.",
    location: "Remote · Global",
    type: "Remote",
    salary: "$90K – $130K",
    posted: "2 hours ago",
    logo:
      "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=80&h=80&fit=crop",
    tags: ["React", "TypeScript", "Remote"],
  },
  {
    id: "2",
    title: "Registered Nurse",
    company: "HealthFirst Group",
    location: "Dubai, UAE",
    type: "Full-time",
    salary: "$55K – $72K",
    posted: "5 hours ago",
    logo:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=80&h=80&fit=crop",
    tags: ["Healthcare", "ICU", "Visa Sponsored"],
  },
  {
    id: "3",
    title: "Construction Site Manager",
    company: "BuildRight Co.",
    location: "London, UK",
    type: "Full-time",
    salary: "£48K – £62K",
    posted: "1 day ago",
    logo:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=80&h=80&fit=crop",
    tags: ["Management", "Commercial", "PMP"],
  },
  {
    id: "4",
    title: "Digital Marketing Specialist",
    company: "GrowthLab",
    location: "Berlin, Germany",
    type: "Contract",
    salary: "€45K – €58K",
    posted: "1 day ago",
    logo:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=80&h=80&fit=crop",
    tags: ["SEO", "Paid Ads", "Analytics"],
  },
];

/* ==========================================
   FEATURES
========================================== */

export const features: Feature[] = [
  {
    id: "verified",
    title: "Verified Professionals",
    description:
      "Every worker undergoes identity verification and skill assessment before joining the platform.",
    icon: ShieldCheck,
  },
  {
    id: "global",
    title: "Global Reach, Local Expertise",
    description:
      "Access talent across 180+ countries with localized compliance and payment support built in.",
    icon: Globe2,
  },
  {
    id: "secure",
    title: "Secure Payments",
    description:
      "Escrow-protected transactions with milestone-based releases keep both parties protected.",
    icon: Wallet,
  },
  {
    id: "support",
    title: "24/7 Support",
    description:
      "Dedicated support teams in multiple time zones to help you hire, work, and grow with confidence.",
    icon: Headphones,
  },
];

/* ==========================================
   SHROMOBAZAR WORKER DATABASE
========================================== */

export type WorkerProfile = {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  completedJobs: number;
  experience: string;
  rate: string;
  phone: string;
  about: string;
  skills: string[];
  verified: boolean;
};

export const workers: WorkerProfile[] = [
  {
    id: "worker-1",
    name: "রহিম মিয়া",
    role: "দক্ষ রাজমিস্ত্রি",
    location: "ঢাকা",
    rating: 4.8,
    completedJobs: 24,
    experience: "৫ বছর",
    rate: "৳১২০০/দিন",
    phone: "01700000000",
    about:
      "৫ বছরের অভিজ্ঞতাসম্পন্ন দক্ষ রাজমিস্ত্রি। আবাসিক ও বাণিজ্যিক ভবনের নির্মাণ কাজে অভিজ্ঞ।",
    skills: [
      "ইটের কাজ",
      "প্লাস্টার",
      "টাইলস",
      "ভবন নির্মাণ",
    ],
    verified: true,
  },
];

/* ==========================================
   EMPLOYERS
========================================== */

export type Employer = {
  id: string;
  name: string;
  location: string;
};

export const employers: Employer[] = [
  {
    id: "employer-1",
    name: "Construction Company",
    location: "ঢাকা",
  },
];

/* ==========================================
   HIRING JOBS
========================================== */

export type HiringJob = {
  id: string;
  title: string;
  company: string;
  employerId: string;
  location: string;
  salary: string;
  workers: string;
  description: string;
  requirements: string[];
};

export const jobs: HiringJob[] = [
  {
    id: "job-1",
    title: "দক্ষ রাজমিস্ত্রি প্রয়োজন",
    company: "Construction Company",
    employerId: "employer-1",
    location: "ঢাকা",
    salary: "৳১২০০/দিন",
    workers: "৫ জন",
    description:
      "বিল্ডিং নির্মাণ কাজের জন্য অভিজ্ঞ রাজমিস্ত্রি প্রয়োজন।",
    requirements: [
      "৩+ বছরের অভিজ্ঞতা",
      "ইটের কাজ জানতে হবে",
      "সময়মতো কাজ সম্পন্ন করার সক্ষমতা",
    ],
  },
];

/* ==========================================
   APPLICATIONS
========================================== */

export type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected";

export type Application = {
  id: string;
  jobId: string;
  workerId: string;
  status: ApplicationStatus;
};

export const applications: Application[] = [
  {
    id: "apply-1",
    jobId: "job-1",
    workerId: "worker-1",
    status: "pending",
  },
];