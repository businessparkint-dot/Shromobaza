"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Globe2,
  Heart,
  Landmark,
  MapPin,
  MessageCircle,
  Network,
  Plane,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";

type NetworkMember = {
  id: number;
  name: string;
  country: string;
  city: string;
  profession: string;
  category: string;
  company: string;
  bio: string;
  verified: boolean;
  online: boolean;
};

type Opportunity = {
  id: number;
  title: string;
  company: string;
  country: string;
  city: string;
  type: string;
  category: string;
  description: string;
  verified: boolean;
};

const countries = [
  "সব দেশ",
  "Saudi Arabia",
  "United Arab Emirates",
  "Qatar",
  "Kuwait",
  "Oman",
  "Malaysia",
  "Singapore",
  "United Kingdom",
  "Italy",
  "Canada",
  "Australia",
];

const categories = [
  "সব",
  "Jobs",
  "Business",
  "Services",
  "Community",
  "Investment",
];

const members: NetworkMember[] = [
  {
    id: 1,
    name: "Abdul Karim",
    country: "Saudi Arabia",
    city: "Riyadh",
    profession: "Construction Supervisor",
    category: "Jobs",
    company: "Al Noor Construction",
    bio: "Construction management, workforce coordination and project supervision.",
    verified: true,
    online: true,
  },
  {
    id: 2,
    name: "Mohammad Hasan",
    country: "United Arab Emirates",
    city: "Dubai",
    profession: "Business Owner",
    category: "Business",
    company: "Hasan Trading LLC",
    bio: "Import-export, construction materials and Bangladesh-UAE business connection.",
    verified: true,
    online: true,
  },
  {
    id: 3,
    name: "Rashed Ahmed",
    country: "Qatar",
    city: "Doha",
    profession: "Electrician",
    category: "Services",
    company: "Independent Service",
    bio: "Electrical installation, maintenance and technical support.",
    verified: true,
    online: false,
  },
  {
    id: 4,
    name: "Sabbir Hossain",
    country: "Malaysia",
    city: "Kuala Lumpur",
    profession: "Restaurant Manager",
    category: "Community",
    company: "Local Hospitality Group",
    bio: "Hospitality professional helping Bangladeshi workers connect with local communities.",
    verified: false,
    online: true,
  },
  {
    id: 5,
    name: "Tanvir Islam",
    country: "United Kingdom",
    city: "London",
    profession: "IT Consultant",
    category: "Business",
    company: "Global Tech Solutions",
    bio: "Technology consulting and digital business development.",
    verified: true,
    online: false,
  },
  {
    id: 6,
    name: "Jamal Uddin",
    country: "Oman",
    city: "Muscat",
    profession: "Mechanical Technician",
    category: "Services",
    company: "Gulf Technical Services",
    bio: "Mechanical maintenance and industrial technical services.",
    verified: true,
    online: true,
  },
];

const opportunities: Opportunity[] = [
  {
    id: 1,
    title: "Construction Supervisor",
    company: "Gulf Construction Group",
    country: "Saudi Arabia",
    city: "Riyadh",
    type: "Full Time",
    category: "Jobs",
    description:
      "Experienced construction supervisor required for commercial building projects.",
    verified: true,
  },
  {
    id: 2,
    title: "Restaurant Business Partnership",
    company: "Bangla Food Network",
    country: "United Arab Emirates",
    city: "Dubai",
    type: "Partnership",
    category: "Business",
    description:
      "Looking for Bangladeshi partners interested in expanding food business operations.",
    verified: true,
  },
  {
    id: 3,
    title: "Electrical Maintenance Service",
    company: "Qatar Technical Team",
    country: "Qatar",
    city: "Doha",
    type: "Service",
    category: "Services",
    description:
      "Professional electrical maintenance and emergency support for businesses.",
    verified: true,
  },
  {
    id: 4,
    title: "Bangladesh Investment Meetup",
    company: "Probashi Business Circle",
    country: "United Kingdom",
    city: "London",
    type: "Event",
    category: "Investment",
    description:
      "Networking event for expatriate Bangladeshis interested in investing in Bangladesh.",
    verified: false,
  },
];

const countryFlags: Record<string, string> = {
  "Saudi Arabia": "🇸🇦",
  "United Arab Emirates": "🇦🇪",
  Qatar: "🇶🇦",
  Kuwait: "🇰🇼",
  Oman: "🇴🇲",
  Malaysia: "🇲🇾",
  Singapore: "🇸🇬",
  "United Kingdom": "🇬🇧",
  Italy: "🇮🇹",
  Canada: "🇨🇦",
  Australia: "🇦🇺",
};

export default function ProbashiNetworkPage() {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("সব দেশ");
  const [category, setCategory] = useState("সব");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedMember, setSelectedMember] =
    useState<NetworkMember | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);

  const [joinOpen, setJoinOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);

  const [joinName, setJoinName] = useState("");
  const [joinCountry, setJoinCountry] = useState("");
  const [joinProfession, setJoinProfession] = useState("");

  const [postTitle, setPostTitle] = useState("");
  const [postCompany, setPostCompany] = useState("");
  const [postCountry, setPostCountry] = useState("");
  const [postType, setPostType] = useState("Job");

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesCountry =
        country === "সব দেশ" || member.country === country;

      const matchesCategory =
        category === "সব" || member.category === category;

      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        member.country.toLowerCase().includes(query) ||
        member.city.toLowerCase().includes(query) ||
        member.profession.toLowerCase().includes(query) ||
        member.company.toLowerCase().includes(query);

      return matchesCountry && matchesCategory && matchesSearch;
    });
  }, [search, country, category]);

  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleJoin = () => {
    if (!joinName || !joinCountry || !joinProfession) {
      window.alert("দয়া করে নাম, দেশ এবং পেশা পূরণ করুন।");
      return;
    }

    window.alert(
      "আপনার Probashi Network joining request গ্রহণ করা হয়েছে।"
    );

    setJoinOpen(false);
    setJoinName("");
    setJoinCountry("");
    setJoinProfession("");
  };

  const handlePost = () => {
    if (!postTitle || !postCompany || !postCountry) {
      window.alert("দয়া করে প্রয়োজনীয় তথ্য পূরণ করুন।");
      return;
    }

    window.alert(
      "আপনার opportunity submission গ্রহণ করা হয়েছে। Verification-এর পর প্রকাশ করা হবে।"
    );

    setPostOpen(false);
    setPostTitle("");
    setPostCompany("");
    setPostCountry("");
    setPostType("Job");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300">
                <Globe2 className="h-4 w-4" />
                Probashi Network
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                প্রবাসীদের জন্য
                <span className="block text-emerald-400">
                  একটি বিশ্বব্যাপী নেটওয়ার্ক।
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                বিশ্বের বিভিন্ন দেশে থাকা বাংলাদেশিদের এক জায়গায় যুক্ত করুন—
                চাকরি, ব্যবসা, সেবা, কমিউনিটি, বিনিয়োগ এবং বাংলাদেশের সঙ্গে
                নতুন সুযোগ তৈরি করার জন্য।
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setJoinOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
                >
                  <Network className="h-5 w-5" />
                  Join Probashi Network
                </button>

                <button
                  onClick={() => setPostOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/15"
                >
                  <Plus className="h-5 w-5" />
                  Post Opportunity
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                ["Countries", "120+", Globe2],
                ["Members", "250K+", Users],
                ["Opportunities", "18K+", BriefcaseBusiness],
                ["Connections", "1M+", Network],
              ].map(([label, value, Icon]) => {
                const StatIcon = Icon as typeof Globe2;

                return (
                  <div
                    key={label as string}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl"
                  >
                    <StatIcon className="h-6 w-6 text-emerald-400" />
                    <div className="mt-4 text-2xl font-black text-white">
                      {value as string}
                    </div>
                    <div className="mt-1 text-sm text-slate-400">
                      {label as string}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* QUICK AREAS */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            {
              title: "বিদেশে Jobs",
              text: "নতুন চাকরি ও career opportunities",
              icon: BriefcaseBusiness,
            },
            {
              title: "Probashi Business",
              text: "ব্যবসা ও partnership",
              icon: Building2,
            },
            {
              title: "Services",
              text: "প্রবাসীদের প্রয়োজনীয় সেবা",
              icon: ShieldCheck,
            },
            {
              title: "Community",
              text: "দেশভিত্তিক community",
              icon: Users,
            },
            {
              title: "Bangladesh Investment",
              text: "দেশে বিনিয়োগের সুযোগ",
              icon: Landmark,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                onClick={() => {
                  if (item.title === "বিদেশে Jobs") {
                    setCategory("Jobs");
                  } else if (item.title === "Probashi Business") {
                    setCategory("Business");
                  } else if (item.title === "Services") {
                    setCategory("Services");
                  } else if (item.title === "Community") {
                    setCategory("Community");
                  } else {
                    setCategory("Investment");
                  }

                  window.scrollTo({
                    top: 650,
                    behavior: "smooth",
                  });
                }}
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-4 font-black text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {item.text}
                </p>

                <div className="mt-3 flex items-center text-sm font-bold text-emerald-600">
                  Explore
                  <ChevronRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* SEARCH */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search member, country, city, profession..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-emerald-400"
            >
              {countries.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-emerald-400"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* MEMBERS */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
              <Users className="h-4 w-4" />
              Global Community
            </div>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Featured Probashi Members
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              বিভিন্ন দেশ ও পেশার প্রবাসীদের সঙ্গে connect করুন।
            </p>
          </div>

          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
            {filteredMembers.length} members found
          </div>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Globe2 className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-4 text-lg font-black">No members found</h3>
            <p className="mt-2 text-sm text-slate-500">
              Search বা filter পরিবর্তন করে আবার চেষ্টা করুন।
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.map((member) => (
              <article
                key={member.id}
                className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-cyan-100 text-lg font-black text-emerald-700">
                      {member.name.charAt(0)}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-black text-slate-900">
                          {member.name}
                        </h3>

                        {member.verified && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        )}
                      </div>

                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {countryFlags[member.country] || "🌍"}{" "}
                        {member.city}, {member.country}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFavorite(member.id)}
                    className="rounded-full p-2 transition hover:bg-slate-100"
                    aria-label="favorite"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        favorites.includes(member.id)
                          ? "fill-rose-500 text-rose-500"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm font-black text-slate-900">
                    {member.profession}
                  </div>

                  <div className="mt-1 text-xs font-semibold text-emerald-600">
                    {member.company}
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                    {member.bio}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                      member.online ? "text-emerald-600" : "text-slate-400"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        member.online ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                    {member.online ? "Online" : "Offline"}
                  </span>

                  <button
                    onClick={() => setSelectedMember(member)}
                    className="inline-flex items-center gap-1 text-sm font-black text-emerald-600"
                  >
                    View Profile
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* OPPORTUNITIES */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                <Sparkles className="h-4 w-4" />
                Opportunities
              </div>

              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                Jobs, Business & Services
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                প্রবাসীদের জন্য নতুন opportunity এক জায়গায়।
              </p>
            </div>

            <button
              onClick={() => setPostOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Post Opportunity
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {opportunities.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-200 hover:bg-white hover:shadow-lg"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                        {item.category}
                      </span>

                      <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
                        {item.type}
                      </span>

                      {item.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 text-xl font-black text-slate-900">
                      {item.title}
                    </h3>

                    <div className="mt-2 text-sm font-bold text-slate-700">
                      {item.company}
                    </div>

                    <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin className="h-4 w-4" />
                      {countryFlags[item.country] || "🌍"} {item.city},{" "}
                      {item.country}
                    </div>

                    <p className="mt-4 text-sm leading-7 text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedOpportunity(item)}
                    className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-emerald-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-emerald-50"
                  >
                    Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BANGLADESH CONNECTION */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 p-7 text-white sm:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-emerald-200">
                🇧🇩 Bangladesh Connection
              </div>

              <h2 className="mt-5 text-3xl font-black sm:text-4xl">
                প্রবাসী থেকে বাংলাদেশ—
                <span className="block text-emerald-300">
                  সম্পর্ক হোক আরও শক্তিশালী।
                </span>
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/75 sm:text-base">
                বাংলাদেশে বিনিয়োগ, ব্যবসা, দক্ষতা transfer, family support,
                local services এবং নতুন উদ্যোগের মাধ্যমে প্রবাসী ও
                বাংলাদেশের মধ্যে একটি শক্তিশালী digital connection তৈরি করা।
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {[
                  "Investment",
                  "Business",
                  "Skill Transfer",
                  "Local Support",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="flex h-36 w-36 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-300/10">
                  <Globe2 className="h-12 w-12 text-emerald-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Verified Profiles",
              text: "ভবিষ্যতে identity/business verification-এর মাধ্যমে trust layer তৈরি করা হবে।",
            },
            {
              icon: MessageCircle,
              title: "Direct Connection",
              text: "প্রবাসী, business owner, employer ও service provider-এর মধ্যে সরাসরি যোগাযোগ।",
            },
            {
              icon: Network,
              title: "Global Network",
              text: "দেশের সীমা ছাড়িয়ে Bangladesh-focused global community তৈরি করা।",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 font-black">{item.title}</h3>

                <p className="mt-2 text-sm leading-7 text-slate-500">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* MEMBER MODAL */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-black text-emerald-700">
                  {selectedMember.name.charAt(0)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black">
                      {selectedMember.name}
                    </h3>

                    {selectedMember.verified && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {countryFlags[selectedMember.country] || "🌍"}{" "}
                    {selectedMember.city}, {selectedMember.country}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMember(null)}
                className="rounded-full p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Profession
                </div>
                <div className="mt-1 font-black">
                  {selectedMember.profession}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Organization
                </div>
                <div className="mt-1 font-black">
                  {selectedMember.company}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  About
                </div>
                <div className="mt-1 text-sm leading-7 text-slate-600">
                  {selectedMember.bio}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                window.alert(
                  `${selectedMember.name}-এর সাথে connection request পাঠানো হয়েছে।`
                );
                setSelectedMember(null);
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 font-bold text-white hover:bg-emerald-600"
            >
              <MessageCircle className="h-5 w-5" />
              Connect
            </button>
          </div>
        </div>
      )}

      {/* OPPORTUNITY MODAL */}
      {selectedOpportunity && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedOpportunity(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                    {selectedOpportunity.category}
                  </span>

                  {selectedOpportunity.verified && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
                      Verified
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-2xl font-black">
                  {selectedOpportunity.title}
                </h3>

                <p className="mt-2 text-sm font-bold text-slate-600">
                  {selectedOpportunity.company}
                </p>
              </div>

              <button
                onClick={() => setSelectedOpportunity(null)}
                className="rounded-full p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="h-4 w-4" />
              {countryFlags[selectedOpportunity.country] || "🌍"}{" "}
              {selectedOpportunity.city}, {selectedOpportunity.country}
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-600">
              {selectedOpportunity.description}
            </p>

            <button
              onClick={() => {
                window.alert(
                  "Interest request পাঠানো হয়েছে। বিস্তারিত যোগাযোগের ব্যবস্থা ভবিষ্যৎ backend integration-এর মাধ্যমে হবে।"
                );
                setSelectedOpportunity(null);
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 font-bold text-white hover:bg-slate-800"
            >
              I&apos;m Interested
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* JOIN MODAL */}
      {joinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-black">
                  Join Probashi Network
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  আপনার basic information দিন।
                </p>
              </div>

              <button
                onClick={() => setJoinOpen(false)}
                className="rounded-full p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <input
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
                placeholder="আপনার নাম"
                className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-emerald-400"
              />

              <select
                value={joinCountry}
                onChange={(e) => setJoinCountry(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-emerald-400"
              >
                <option value="">দেশ নির্বাচন করুন</option>
                {countries.slice(1).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <input
                value={joinProfession}
                onChange={(e) => setJoinProfession(e.target.value)}
                placeholder="Profession / Business"
                className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-emerald-400"
              />
            </div>

            <button
              onClick={handleJoin}
              className="mt-6 w-full rounded-xl bg-emerald-500 px-5 py-3.5 font-bold text-white hover:bg-emerald-600"
            >
              Join Network
            </button>
          </div>
        </div>
      )}

      {/* POST MODAL */}
      {postOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-black">
                  Post Opportunity
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Job, business, service বা event পোস্ট করুন।
                </p>
              </div>

              <button
                onClick={() => setPostOpen(false)}
                className="rounded-full p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <input
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Opportunity title"
                className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-emerald-400"
              />

              <input
                value={postCompany}
                onChange={(e) => setPostCompany(e.target.value)}
                placeholder="Company / Organization"
                className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-emerald-400"
              />

              <select
                value={postCountry}
                onChange={(e) => setPostCountry(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-emerald-400"
              >
                <option value="">Country</option>
                {countries.slice(1).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-emerald-400"
              >
                <option>Job</option>
                <option>Business</option>
                <option>Service</option>
                <option>Investment</option>
                <option>Event</option>
              </select>
            </div>

            <button
              onClick={handlePost}
              className="mt-6 w-full rounded-xl bg-slate-900 px-5 py-3.5 font-bold text-white hover:bg-slate-800"
            >
              Submit Opportunity
            </button>
          </div>
        </div>
      )}
    </main>
  );
}