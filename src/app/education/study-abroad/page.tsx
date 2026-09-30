"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileText,
  GraduationCap,
  Globe2,
  Landmark,
  Search,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

type Country = "Canada" | "UK" | "USA" | "Australia";

type ApplicationStatus =
  | "Planning"
  | "University Shortlisted"
  | "Application Submitted"
  | "Offer Received"
  | "Documents Ready"
  | "Visa Applied"
  | "Decision";

const countries: {
  name: Country;
  flag: string;
  description: string;
}[] = [
  {
    name: "Canada",
    flag: "🇨🇦",
    description: "University search, admission and study-permit roadmap",
  },
  {
    name: "UK",
    flag: "🇬🇧",
    description: "University application and Student visa roadmap",
  },
  {
    name: "USA",
    flag: "🇺🇸",
    description: "University application and student-visa roadmap",
  },
  {
    name: "Australia",
    flag: "🇦🇺",
    description: "Course search, admission and student-visa roadmap",
  },
];

const statuses: ApplicationStatus[] = [
  "Planning",
  "University Shortlisted",
  "Application Submitted",
  "Offer Received",
  "Documents Ready",
  "Visa Applied",
  "Decision",
];

const officialLinks: Record<Country, string> = {
  Canada:
    "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html",
  UK: "https://www.gov.uk/student-visa",
  USA:
    "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html",
  Australia:
    "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
};

export default function StudyAbroadPage() {
  const [country, setCountry] = useState<Country>("Canada");
  const [studyLevel, setStudyLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [academicResult, setAcademicResult] = useState("");
  const [englishTest, setEnglishTest] = useState("");
  const [budget, setBudget] = useState("");
  const [studyGap, setStudyGap] = useState("");
  const [status, setStatus] =
    useState<ApplicationStatus>("Planning");
  const [matched, setMatched] = useState(false);

  const selectedCountry = useMemo(
    () => countries.find((item) => item.name === country),
    [country]
  );

  function runEligibilityCheck() {
    setMatched(true);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/education"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Education
          </Link>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                <Globe2 className="h-4 w-4" />
                STUDY ABROAD
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Study Abroad
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                নিজে বুঝে, official route-এ study abroad journey
                পরিকল্পনা করুন — University Search থেকে Application,
                Financial Documents এবং Student Visa roadmap পর্যন্ত।
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "University Search",
                  "Eligibility",
                  "Application",
                  "Financial Preparation",
                  "Student Visa",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-blue-700" />

                <div>
                  <h2 className="font-bold text-slate-900">
                    Official Route First
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Shromobazar information, checklist, matching এবং
                    tracking-এ সাহায্য করবে। Admission বা visa decision
                    University এবং Immigration Authority-র।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Country */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5">
          <h2 className="text-xl font-black text-slate-900">
            1. Choose Destination
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            আপনার target country নির্বাচন করুন।
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {countries.map((item) => {
            const active = country === item.name;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  setCountry(item.name);
                  setMatched(false);
                }}
                className={`rounded-2xl border p-5 text-left transition ${
                  active
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="text-3xl">{item.flag}</div>

                <div className="mt-3 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">
                    {item.name}
                  </h3>

                  {active && (
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  )}
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Eligibility */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-start gap-3">
            <Search className="mt-1 h-6 w-6 text-blue-600" />

            <div>
              <h2 className="text-xl font-black text-slate-900">
                2. Eligibility & Study Plan
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                আপনার academic information দিয়ে সম্ভাব্য route
                বুঝে নিন।
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Field label="Study Level">
              <select
                value={studyLevel}
                onChange={(e) => setStudyLevel(e.target.value)}
                className="input"
              >
                <option value="">Select level</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Masters">Masters</option>
                <option value="PhD">PhD</option>
                <option value="Diploma">Diploma</option>
                <option value="Certificate">Certificate</option>
              </select>
            </Field>

            <Field label="Subject / Course">
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Computer Science"
                className="input"
              />
            </Field>

            <Field label="Academic Result">
              <input
                value={academicResult}
                onChange={(e) => setAcademicResult(e.target.value)}
                placeholder="e.g. CGPA 3.50 / 5.00"
                className="input"
              />
            </Field>

            <Field label="English Test">
              <select
                value={englishTest}
                onChange={(e) => setEnglishTest(e.target.value)}
                className="input"
              >
                <option value="">Select status</option>
                <option value="IELTS">IELTS</option>
                <option value="PTE">PTE</option>
                <option value="TOEFL">TOEFL</option>
                <option value="Duolingo">Duolingo</option>
                <option value="Not yet taken">Not yet taken</option>
                <option value="Not required">Not sure / May not be required</option>
              </select>
            </Field>

            <Field label="Approx. Study Budget">
              <input
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. ৳10,00,000"
                className="input"
              />
            </Field>

            <Field label="Study Gap">
              <input
                value={studyGap}
                onChange={(e) => setStudyGap(e.target.value)}
                placeholder="e.g. 2 years"
                className="input"
              />
            </Field>
          </div>

          <button
            type="button"
            onClick={runEligibilityCheck}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
          >
            Check My Study Plan
            <ArrowRight className="h-4 w-4" />
          </button>

          {matched && (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />

                <div>
                  <h3 className="font-bold text-slate-900">
                    Study plan information saved for this session
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Destination: {country}
                    {studyLevel ? ` • ${studyLevel}` : ""}
                    {subject ? ` • ${subject}` : ""}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    এটি admission বা visa guarantee নয়। Published
                    university এবং immigration requirements যাচাই করে
                    final decision নিতে হবে।
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Journey */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mb-5">
          <h2 className="text-xl font-black text-slate-900">
            3. Your Study Abroad Journey
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <JourneyCard
            icon={<GraduationCap className="h-5 w-5" />}
            number="01"
            title="University & Course"
            text="University, course, intake ও published requirements খুঁজুন।"
          />

          <JourneyCard
            icon={<FileText className="h-5 w-5" />}
            number="02"
            title="Application"
            text="Application documents প্রস্তুত করে official university route ব্যবহার করুন।"
          />

          <JourneyCard
            icon={<WalletCards className="h-5 w-5" />}
            number="03"
            title="Financial Preparation"
            text="Tuition, living cost এবং প্রয়োজনীয় financial documents-এর checklist রাখুন।"
          />

          <JourneyCard
            icon={<Landmark className="h-5 w-5" />}
            number="04"
            title="Student Visa"
            text="Official immigration instructions অনুযায়ী visa application প্রস্তুত করুন।"
          />
        </div>
      </section>

      {/* Application Tracker */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-start gap-3">
            <FileText className="mt-1 h-6 w-6 text-blue-600" />

            <div>
              <h2 className="text-xl font-black text-slate-900">
                4. Application Tracker
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                আপনার current application stage নির্বাচন করুন।
              </p>
            </div>
          </div>

          <div className="mt-5">
            <label className="text-xs font-bold text-slate-600">
              Current Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as ApplicationStatus)
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 sm:max-w-md"
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 overflow-x-auto">
            <div className="flex min-w-[760px] items-center">
              {statuses.map((item, index) => {
                const active = item === status;
                const currentIndex = statuses.indexOf(status);
                const completed = index <= currentIndex;

                return (
                  <div
                    key={item}
                    className="flex flex-1 items-center"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black ${
                          completed
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <span
                        className={`mt-2 max-w-[110px] text-[10px] font-bold ${
                          active
                            ? "text-blue-700"
                            : "text-slate-500"
                        }`}
                      >
                        {item}
                      </span>
                    </div>

                    {index < statuses.length - 1 && (
                      <div
                        className={`mx-2 h-1 flex-1 rounded-full ${
                          index < currentIndex
                            ? "bg-blue-500"
                            : "bg-slate-100"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Official Sources */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm sm:p-7">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-6 w-6 text-blue-300" />

            <div>
              <h2 className="text-xl font-black">
                Official Immigration Source
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-300">
                Visa information সবসময় সংশ্লিষ্ট দেশের official
                immigration source থেকে যাচাই করুন।
              </p>
            </div>
          </div>

          <a
            href={officialLinks[country]}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 hover:bg-slate-100"
          >
            Open {country} Official Visa Information
            <ExternalLink className="h-4 w-4" />
          </a>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs leading-6 text-slate-300">
              <strong className="text-white">
                Important:
              </strong>{" "}
              কোনো fake document, fake bank statement, fake offer
              letter বা false information ব্যবহার করা যাবে না।
              Shromobazar কোনো admission বা visa guarantee দেয় না।
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(226 232 240);
          background: white;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          outline: none;
        }

        .input:focus {
          border-color: rgb(59 130 246);
          box-shadow: 0 0 0 3px rgb(59 130 246 / 0.08);
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-slate-600">
        {label}
      </label>

      <div className="mt-2">{children}</div>
    </div>
  );
}

function JourneyCard({
  icon,
  number,
  title,
  text,
}: {
  icon: React.ReactNode;
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <span className="text-xs font-black text-slate-300">
          {number}
        </span>
      </div>

      <h3 className="mt-4 font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}