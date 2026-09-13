"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  GraduationCap,
  Languages,
  Library,
  Lightbulb,
  MapPin,
  Search,
  ShieldCheck,
  Stethoscope,
  Users,
  WalletCards,
  X,
  Building2,
  School,
  Wrench,
  Palette,
  Globe2,
  FileText,
} from "lucide-react";

import { supabase } from "@/lib/client";

/* =========================================================
   TYPES
========================================================= */

type InstitutionCategory =
  | "All"
  | "Kindergarten"
  | "Primary"
  | "High School"
  | "College"
  | "Open University"
  | "National University"
  | "Public University"
  | "Private University"
  | "Medical"
  | "Engineering"
  | "Diploma"
  | "BSc"
  | "Skill Development"
  | "Language"
  | "Art & Drama";

type MainTool =
  | "none"
  | "scholarship"
  | "admission"
  | "visa"
  | "application";

type ApplicationType = "Scholarship" | "Admission" | "Visa";

type ApplicationStatus =
  | "Draft"
  | "Preparing"
  | "Applied"
  | "Under Review"
  | "Completed";

type InstituteRow = {
  id: string;
  name: string;
  category?: string | null;
  district?: string | null;
  location?: string | null;
  description?: string | null;
  website?: string | null;
  verified?: boolean | null;
};

type ApplicationItem = {
  id: string;
  type: ApplicationType;
  title: string;
  institution: string;
  deadline: string;
  status: ApplicationStatus;
};

/* =========================================================
   CATEGORY DATA
========================================================= */

const institutionCategories: {
  value: InstitutionCategory;
  label: string;
  group: string;
  icon: ReactNode;
}[] = [
  {
    value: "Kindergarten",
    label: "Kindergarten",
    group: "School",
    icon: <School className="h-3.5 w-3.5" />,
  },
  {
    value: "Primary",
    label: "Primary",
    group: "School",
    icon: <BookOpen className="h-3.5 w-3.5" />,
  },
  {
    value: "High School",
    label: "High School",
    group: "School",
    icon: <GraduationCap className="h-3.5 w-3.5" />,
  },
  {
    value: "College",
    label: "College",
    group: "College & University",
    icon: <Library className="h-3.5 w-3.5" />,
  },
  {
    value: "Open University",
    label: "Open University",
    group: "College & University",
    icon: <Globe2 className="h-3.5 w-3.5" />,
  },
  {
    value: "National University",
    label: "National University",
    group: "College & University",
    icon: <UniversityIcon />,
  },
  {
    value: "Public University",
    label: "Public University",
    group: "College & University",
    icon: <Building2 className="h-3.5 w-3.5" />,
  },
  {
    value: "Private University",
    label: "Private University",
    group: "College & University",
    icon: <Building2 className="h-3.5 w-3.5" />,
  },
  {
    value: "Medical",
    label: "Medical",
    group: "Professional",
    icon: <Stethoscope className="h-3.5 w-3.5" />,
  },
  {
    value: "Engineering",
    label: "Engineering",
    group: "Professional",
    icon: <Wrench className="h-3.5 w-3.5" />,
  },
  {
    value: "Diploma",
    label: "Diploma",
    group: "Professional",
    icon: <FileText className="h-3.5 w-3.5" />,
  },
  {
    value: "BSc",
    label: "BSc",
    group: "Professional",
    icon: <GraduationCap className="h-3.5 w-3.5" />,
  },
  {
    value: "Skill Development",
    label: "Skill",
    group: "Skill & Creative",
    icon: <Wrench className="h-3.5 w-3.5" />,
  },
  {
    value: "Language",
    label: "Language",
    group: "Skill & Creative",
    icon: <Languages className="h-3.5 w-3.5" />,
  },
  {
    value: "Art & Drama",
    label: "Art & Drama",
    group: "Skill & Creative",
    icon: <Palette className="h-3.5 w-3.5" />,
  },
];

const categoryGroups = [
  "School",
  "College & University",
  "Professional",
  "Skill & Creative",
];

/* =========================================================
   OFFICIAL LINKS
========================================================= */

const officialLinks = {
  scholarship:
    "https://pmeat.gov.bd/",
  educationScholarship:
    "https://shed.gov.bd/",
  canada:
    "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html",
  uk:
    "https://www.gov.uk/student-visa",
  usa:
    "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html",
  australia:
    "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
};

/* =========================================================
   MAIN PAGE
========================================================= */

export default function EducationPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<InstitutionCategory>("All");

  const [instituteSearch, setInstituteSearch] = useState("");
  const [district, setDistrict] = useState("");

  const [institutes, setInstitutes] = useState<InstituteRow[]>([]);
  const [instituteLoading, setInstituteLoading] = useState(false);
  const [instituteSearched, setInstituteSearched] = useState(false);
  const [instituteError, setInstituteError] = useState("");

  const [mainTool, setMainTool] = useState<MainTool>("none");

  const [applications, setApplications] = useState<ApplicationItem[]>([]);

  const [connectTarget, setConnectTarget] = useState<
    "Institute" | "Teacher" | "Tutor" | null
  >(null);

  const [connectSent, setConnectSent] = useState(false);

  /* =======================================================
     APPLICATION TRACKER
  ======================================================= */

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(
        "shromobazar_education_applications"
      );

      if (saved) {
        setApplications(JSON.parse(saved));
      }
    } catch {
      setApplications([]);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "shromobazar_education_applications",
        JSON.stringify(applications)
      );
    } catch {
      // localStorage may be unavailable in restricted browser mode
    }
  }, [applications]);

  /* =======================================================
     ESC + BODY LOCK FOR MODALS
  ======================================================= */

  useEffect(() => {
    const modalOpen =
      mainTool !== "none" || connectTarget !== null;

    if (!modalOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMainTool("none");
        setConnectTarget(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mainTool, connectTarget]);

  /* =======================================================
     INSTITUTE SEARCH
  ======================================================= */

  const searchInstitutes = async () => {
    setInstituteLoading(true);
    setInstituteError("");
    setInstituteSearched(true);

    try {
      let query = supabase
        .from("institutes")
        .select(
          "id,name,category,district,location,description,website,verified"
        )
        .limit(50);

      if (selectedCategory !== "All") {
        query = query.eq("category", selectedCategory);
      }

      if (district.trim()) {
        query = query.ilike("district", `%${district.trim()}%`);
      }

      if (instituteSearch.trim()) {
        query = query.ilike("name", `%${instituteSearch.trim()}%`);
      }

      const { data, error } = await query;

      if (error) {
        /*
          Important:
          We do NOT create fake/demo institutes.
          If the institutes table is not created yet, the UI
          clearly reports that instead of showing fake results.
        */
        setInstitutes([]);
        setInstituteError(
          "Institute database এখনো connected নয়। Database table/API connect করলে real institute results এখানে আসবে।"
        );
        return;
      }

      setInstitutes((data ?? []) as InstituteRow[]);
    } catch {
      setInstitutes([]);
      setInstituteError(
        "Institute search করা যাচ্ছে না। পরে আবার চেষ্টা করুন।"
      );
    } finally {
      setInstituteLoading(false);
    }
  };

  const clearInstituteSearch = () => {
    setSelectedCategory("All");
    setInstituteSearch("");
    setDistrict("");
    setInstitutes([]);
    setInstituteSearched(false);
    setInstituteError("");
  };

  /* =======================================================
     APPLICATION FUNCTIONS
  ======================================================= */

  const addApplication = (
    type: ApplicationType,
    title: string,
    institution = ""
  ) => {
    const newItem: ApplicationItem = {
      id: crypto.randomUUID(),
      type,
      title,
      institution,
      deadline: "",
      status: "Draft",
    };

    setApplications((previous) => [newItem, ...previous]);
    setMainTool("application");
  };

  const updateApplicationStatus = (
    id: string,
    status: ApplicationStatus
  ) => {
    setApplications((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const deleteApplication = (id: string) => {
    setApplications((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  /* =======================================================
     CONNECT
  ======================================================= */

  const openConnect = (
    target: "Institute" | "Teacher" | "Tutor"
  ) => {
    setConnectTarget(target);
    setConnectSent(false);
  };

  const closeConnect = () => {
    setConnectTarget(null);
    setConnectSent(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* ===================================================
          HERO
      =================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-orange-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-white blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-orange-300 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              <GraduationCap className="h-4 w-4" />
              SHROMO EDUCATION
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
              শিক্ষা নিজের হাতে
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
              Institute খুঁজুন, নিজের শিক্ষা profile তৈরি করুন,
              scholarship ও admission information দেখুন এবং
              প্রয়োজন হলে official source থেকে নিজেই এগিয়ে যান।
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/education/student-profile"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-blue-950 shadow-lg transition hover:bg-blue-50"
              >
                My Student Profile
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById("institute-search")
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Find Institute
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          MY EDUCATION
      =================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          icon={<GraduationCap className="h-5 w-5" />}
          title="My Education"
          subtitle="আপনার শিক্ষা journey এক জায়গায়"
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <EducationCard
            icon={<GraduationCap className="h-5 w-5" />}
            title="Student Profile"
            text="আপনার personal education identity"
            href="/education/student-profile"
          />

          <EducationCard
            icon={<CalendarDays className="h-5 w-5" />}
            title="Class & Routine"
            text="Class, batch ও routine"
            href="/education/student-profile"
          />

          <EducationCard
            icon={<Award className="h-5 w-5" />}
            title="Results"
            text="Result ও academic record"
            href="/education/student-profile"
          />

          <EducationCard
            icon={<WalletCards className="h-5 w-5" />}
            title="Tuition Fee"
            text="Fee, paid ও due information"
            href="/education/student-profile"
          />
        </div>
      </section>

      {/* ===================================================
          INSTITUTE SEARCH
      =================================================== */}

      <section
        id="institute-search"
        className="scroll-mt-6 border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              icon={<Search className="h-5 w-5" />}
              title="Find Your Institute"
              subtitle="Category select করুন → District/City দিন → Institute search করুন"
            />

            {instituteSearched && (
              <button
                type="button"
                onClick={clearInstituteSearch}
                className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>

          {/* Compact category groups */}

          <div className="space-y-4">
            {categoryGroups.map((group) => {
              const groupItems = institutionCategories.filter(
                (item) => item.group === group
              );

              return (
                <div key={group}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                    {group}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {groupItems.map((item) => {
                      const active =
                        selectedCategory === item.value;

                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() =>
                            setSelectedCategory(item.value)
                          }
                          className={[
                            "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-bold transition sm:text-xs",
                            active
                              ? "border-blue-700 bg-blue-700 text-white shadow-sm"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50",
                          ].join(" ")}
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search form */}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
            <div className="grid gap-3 md:grid-cols-[1fr_0.7fr_auto]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={instituteSearch}
                  onChange={(event) =>
                    setInstituteSearch(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      searchInstitutes();
                    }
                  }}
                  placeholder={
                    selectedCategory === "All"
                      ? "Institute name লিখুন"
                      : `${selectedCategory} institute খুঁজুন`
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={district}
                  onChange={(event) =>
                    setDistrict(event.target.value)
                  }
                  placeholder="District / City"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="button"
                onClick={searchInstitutes}
                disabled={instituteLoading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {instituteLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Search
                  </>
                )}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Real registered institute data only
              <span>•</span>
              No fake/demo institute
              <span>•</span>
              Category:
              <strong className="text-slate-700">
                {selectedCategory === "All"
                  ? "All"
                  : selectedCategory}
              </strong>
            </div>
          </div>

          {/* Search error */}

          {instituteError && (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

                <div>
                  <p className="text-sm font-bold text-amber-900">
                    Real institute database connection needed
                  </p>

                  <p className="mt-1 text-xs leading-6 text-amber-800">
                    {instituteError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Search results */}

          {instituteSearched &&
            !instituteError &&
            !instituteLoading && (
              <div className="mt-6">
                {institutes.length > 0 ? (
                  <>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-800">
                        {institutes.length} institute found
                      </p>

                      <span className="text-xs text-slate-500">
                        Real database results
                      </span>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {institutes.map((institute) => (
                        <InstituteCard
                          key={institute.id}
                          institute={institute}
                          onConnect={() => openConnect("Institute")}
                          onAdmission={() =>
                            addApplication(
                              "Admission",
                              `Admission — ${institute.name}`,
                              institute.name
                            )
                          }
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
                    <Building2 className="mx-auto h-8 w-8 text-slate-300" />

                    <h3 className="mt-3 text-sm font-bold text-slate-800">
                      No verified institute found
                    </h3>

                    <p className="mx-auto mt-1 max-w-md text-xs leading-6 text-slate-500">
                      আপনার search অনুযায়ী এখন কোনো real registered
                      institute পাওয়া যায়নি।
                    </p>
                  </div>
                )}
              </div>
            )}
        </div>
      </section>

      {/* ===================================================
          SMART CONNECTION
      =================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
        <SectionHeading
          icon={<Users className="h-5 w-5" />}
          title="Smart Connection"
          subtitle="Right institute, right teacher, right learning"
        />

        <div className="grid gap-3 md:grid-cols-3">
          <ConnectionCard
            icon={<Building2 className="h-5 w-5" />}
            title="Institute"
            text="Institute, course, class ও academic information"
            button="Connect Institute"
            onClick={() => openConnect("Institute")}
          />

          <ConnectionCard
            icon={<GraduationCap className="h-5 w-5" />}
            title="Teacher"
            text="Subject, learning ও academic support"
            button="Connect Teacher"
            onClick={() => openConnect("Teacher")}
          />

          <ConnectionCard
            icon={<Users className="h-5 w-5" />}
            title="Tutor"
            text="Tuition ও personal learning support"
            button="Connect Tutor"
            onClick={() => openConnect("Tutor")}
          />
        </div>
      </section>

      {/* ===================================================
          EDUCATION TOOLS
      =================================================== */}

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
          <SectionHeading
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Self-Service Education"
            subtitle="তথ্য যাচাই করে নিজের কাজ নিজে এগিয়ে নিন"
          />

          <div className="grid gap-3 md:grid-cols-3">
            <ToolCard
              icon={<Award className="h-5 w-5" />}
              title="Scholarship"
              description="Scholarship information ও official source"
              button="Open Scholarship"
              onClick={() => setMainTool("scholarship")}
            />

            <ToolCard
              icon={<FileText className="h-5 w-5" />}
              title="Admission"
              description="Admission preparation ও application tracking"
              button="Start Admission"
              onClick={() => setMainTool("admission")}
            />

            <ToolCard
              icon={<Globe2 className="h-5 w-5" />}
              title="Study Abroad & Visa"
              description="Canada, UK, USA ও Australia official routes"
              button="Open Visa Guide"
              onClick={() => setMainTool("visa")}
            />
          </div>
        </div>
      </section>

      {/* ===================================================
          EDUCATION TYPES
      =================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
        <SectionHeading
          icon={<Library className="h-5 w-5" />}
          title="Learn Your Way"
          subtitle="Education শুধু degree নয়"
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SimpleFeature
            icon={<BookOpen className="h-5 w-5" />}
            title="Courses"
            text="Academic ও professional courses"
          />

          <SimpleFeature
            icon={<CalendarDays className="h-5 w-5" />}
            title="Classes"
            text="Class, batch ও routine"
          />

          <SimpleFeature
            icon={<Lightbulb className="h-5 w-5" />}
            title="Skills"
            text="Practical skill ও training"
          />

          <SimpleFeature
            icon={<Library className="h-5 w-5" />}
            title="Research"
            text="Books, research ও knowledge"
          />
        </div>
      </section>

      {/* ===================================================
          LEARN TO WORK
      =================================================== */}

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 to-slate-900 p-6 text-white sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-300">
                <BriefcaseBusiness className="h-4 w-4" />
                Education → Opportunity
              </div>

              <h2 className="mt-2 text-2xl font-black">
                Learn → Skill → Opportunity → Work
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Education শেষ হওয়ার পর skill ও opportunity-কে
                কাজের সাথে connect করার লক্ষ্য।
              </p>
            </div>

            <Link
              href="/jobs"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              Explore Jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <strong className="text-slate-800">
              Shromobazar Education
            </strong>
            <span className="mx-2">•</span>
            Education for everyone
          </div>

          <div>
            Business Park International
          </div>
        </div>
      </footer>

      {/* ===================================================
          MAIN TOOL MODAL
      =================================================== */}

      {mainTool !== "none" && (
        <ModalShell
          onClose={() => setMainTool("none")}
        >
          {mainTool === "scholarship" && (
            <ScholarshipPanel
              onClose={() => setMainTool("none")}
              onAdd={() =>
                addApplication(
                  "Scholarship",
                  "Scholarship Application"
                )
              }
            />
          )}

          {mainTool === "admission" && (
            <AdmissionPanel
              onClose={() => setMainTool("none")}
              onAdd={() =>
                addApplication(
                  "Admission",
                  "Admission Application"
                )
              }
            />
          )}

          {mainTool === "visa" && (
            <VisaPanel
              onClose={() => setMainTool("none")}
              onAdd={() =>
                addApplication(
                  "Visa",
                  "Study Abroad / Visa Application"
                )
              }
            />
          )}

          {mainTool === "application" && (
            <ApplicationPanel
              applications={applications}
              onClose={() => setMainTool("none")}
              onStatusChange={updateApplicationStatus}
              onDelete={deleteApplication}
            />
          )}
        </ModalShell>
      )}

      {/* ===================================================
          CONNECT MODAL
      =================================================== */}

      {connectTarget && (
        <ModalShell onClose={closeConnect}>
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                Smart Connection
              </p>

              <h2 className="mt-1 text-lg font-black text-slate-900">
                Connect {connectTarget}
              </h2>
            </div>

            <button
              type="button"
              onClick={closeConnect}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {!connectSent ? (
            <div className="p-5">
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />

                  <div>
                    <h3 className="text-sm font-bold text-blue-950">
                      Permission-based connection
                    </h3>

                    <p className="mt-1 text-xs leading-6 text-blue-900">
                      প্রয়োজনীয় information ছাড়া অতিরিক্ত
                      private data access করা হবে না।
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                {connectTarget === "Institute" && (
                  <>
                    <PermissionLine
                      title="Class & Routine"
                      text="Class, batch ও routine information"
                    />
                    <PermissionLine
                      title="Results"
                      text="Published result ও grade"
                    />
                    <PermissionLine
                      title="Tuition Fee"
                      text="Fee, paid ও due information"
                    />
                    <PermissionLine
                      title="Notices"
                      text="Important institute notices"
                    />
                  </>
                )}

                {connectTarget === "Teacher" && (
                  <>
                    <PermissionLine
                      title="Subject"
                      text="Subject ও course information"
                    />
                    <PermissionLine
                      title="Class"
                      text="Class ও learning schedule"
                    />
                    <PermissionLine
                      title="Learning"
                      text="Learning material ও guidance"
                    />
                  </>
                )}

                {connectTarget === "Tutor" && (
                  <>
                    <PermissionLine
                      title="Subject"
                      text="Tuition subject ও level"
                    />
                    <PermissionLine
                      title="Schedule"
                      text="Class time ও routine"
                    />
                    <PermissionLine
                      title="Support"
                      text="Learning support"
                    />
                  </>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeConnect}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => setConnectSent(true)}
                  className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800"
                >
                  Send Connect Request
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-7 w-7 text-emerald-600" />
              </div>

              <h3 className="mt-4 text-lg font-black text-slate-900">
                Request Ready
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {connectTarget}-এর সাথে connection request
                foundation প্রস্তুত হয়েছে।
              </p>

              <button
                type="button"
                onClick={closeConnect}
                className="mt-6 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800"
              >
                Back to Education
              </button>
            </div>
          )}
        </ModalShell>
      )}
    </main>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
          {icon}
        </div>

        <h2 className="text-xl font-black text-slate-900">
          {title}
        </h2>
      </div>

      <p className="mt-2 text-sm text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}

/* =========================================================
   EDUCATION CARD
========================================================= */

function EducationCard({
  icon,
  title,
  text,
  href,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          {icon}
        </div>

        <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
      </div>

      <h3 className="mt-3 text-sm font-black text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {text}
      </p>
    </Link>
  );
}

/* =========================================================
   INSTITUTE CARD
========================================================= */

function InstituteCard({
  institute,
  onConnect,
  onAdmission,
}: {
  institute: InstituteRow;
  onConnect: () => void;
  onAdmission: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <Building2 className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="truncate text-sm font-black text-slate-900">
              {institute.name}
            </h3>

            {institute.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>

          {institute.category && (
            <p className="mt-1 text-[11px] font-semibold text-blue-700">
              {institute.category}
            </p>
          )}
        </div>
      </div>

      {(institute.district || institute.location) && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5" />
          {institute.district || institute.location}
        </div>
      )}

      {institute.description && (
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
          {institute.description}
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onConnect}
          className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100"
        >
          Connect
        </button>

        <button
          type="button"
          onClick={onAdmission}
          className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-bold text-white hover:bg-blue-800"
        >
          Admission
        </button>
      </div>

      {institute.website && (
        <a
          href={institute.website}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-blue-700"
        >
          Official website
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}

/* =========================================================
   CONNECTION CARD
========================================================= */

function ConnectionCard({
  icon,
  title,
  text,
  button,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  button: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
        {icon}
      </div>

      <h3 className="mt-3 text-sm font-black text-slate-900">
        {title}
      </h3>

      <p className="mt-1 min-h-10 text-xs leading-5 text-slate-500">
        {text}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-blue-800"
      >
        {button}
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* =========================================================
   TOOL CARD
========================================================= */

function ToolCard({
  icon,
  title,
  description,
  button,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  button: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
        {icon}
      </div>

      <h3 className="mt-3 text-sm font-black text-slate-900">
        {title}
      </h3>

      <p className="mt-1 min-h-10 text-xs leading-5 text-slate-500">
        {description}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-800"
      >
        {button}
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* =========================================================
   SIMPLE FEATURE
========================================================= */

function SimpleFeature({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        {icon}
      </div>

      <h3 className="mt-3 text-sm font-black text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   MODAL SHELL
========================================================= */

function ModalShell({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex min-h-full items-center justify-center py-4">
        <div className="relative max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl sm:max-h-[calc(100vh-3rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SCHOLARSHIP PANEL
========================================================= */

function ScholarshipPanel({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: () => void;
}) {
  return (
    <div>
      <ModalHeader
        eyebrow="Self-Service"
        title="Scholarship"
        subtitle="Official source থেকে scholarship information যাচাই করুন"
        onClose={onClose}
      />

      <div className="space-y-4 p-5">
        <OfficialSourceCard
          icon={<Award className="h-5 w-5" />}
          title="PMEAT"
          description="প্রধানমন্ত্রীর শিক্ষা সহায়তা ট্রাস্টের official information ও e-service."
          href={officialLinks.scholarship}
        />

        <OfficialSourceCard
          icon={<Library className="h-5 w-5" />}
          title="Ministry of Education"
          description="Scholarship notice ও education-related official information."
          href={officialLinks.educationScholarship}
        />

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-bold text-amber-900">
            Important
          </p>

          <p className="mt-1 text-xs leading-6 text-amber-800">
            Scholarship-এর eligibility, deadline ও required
            documents সবসময় official notice থেকে যাচাই করবেন।
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Back
          </button>

          <button
            type="button"
            onClick={onAdd}
            className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800"
          >
            Add Application Tracker
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ADMISSION PANEL
========================================================= */

function AdmissionPanel({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: () => void;
}) {
  return (
    <div>
      <ModalHeader
        eyebrow="Self-Service"
        title="Admission"
        subtitle="Institute খুঁজুন এবং নিজের admission journey track করুন"
        onClose={onClose}
      />

      <div className="space-y-4 p-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <StepBox
            number="01"
            title="Search"
            text="Institute & category"
          />

          <StepBox
            number="02"
            title="Prepare"
            text="Documents & requirements"
          />

          <StepBox
            number="03"
            title="Apply"
            text="Official application"
          />
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm font-bold text-blue-950">
            Admission Tracker
          </p>

          <p className="mt-1 text-xs leading-6 text-blue-900">
            আপনি কোন admission কোথায় পর্যন্ত করেছেন তা
            browser-এর local tracker-এ রাখতে পারবেন।
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Back
          </button>

          <button
            type="button"
            onClick={onAdd}
            className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800"
          >
            Create Admission Tracker
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   VISA PANEL
========================================================= */

function VisaPanel({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: () => void;
}) {
  return (
    <div>
      <ModalHeader
        eyebrow="Study Abroad"
        title="Study Abroad & Visa"
        subtitle="Official government route আগে দেখুন, তারপর সিদ্ধান্ত নিন"
        onClose={onClose}
      />

      <div className="space-y-3 p-5">
        <VisaCountry
          country="Canada"
          description="Study permit official information"
          href={officialLinks.canada}
        />

        <VisaCountry
          country="United Kingdom"
          description="Student visa official information"
          href={officialLinks.uk}
        />

        <VisaCountry
          country="United States"
          description="Student visa official information"
          href={officialLinks.usa}
        />

        <VisaCountry
          country="Australia"
          description="Student visa official information"
          href={officialLinks.australia}
        />

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

            <div>
              <p className="text-sm font-bold text-emerald-950">
                Dalal-free information first
              </p>

              <p className="mt-1 text-xs leading-6 text-emerald-900">
                যেখানে official self-application available,
                সেখানে আগে official source পড়ে নিজের eligibility
                ও process বুঝে নিন। প্রয়োজন হলে qualified
                professional advice নিন।
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Back
          </button>

          <button
            type="button"
            onClick={onAdd}
            className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800"
          >
            Add Visa Tracker
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   APPLICATION PANEL
========================================================= */

function ApplicationPanel({
  applications,
  onClose,
  onStatusChange,
  onDelete,
}: {
  applications: ApplicationItem[];
  onClose: () => void;
  onStatusChange: (
    id: string,
    status: ApplicationStatus
  ) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div>
      <ModalHeader
        eyebrow="My Tracker"
        title="Application Tracker"
        subtitle="Scholarship, admission ও visa application status"
        onClose={onClose}
      />

      <div className="p-5">
        {applications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
            <Clock3 className="mx-auto h-8 w-8 text-slate-300" />

            <h3 className="mt-3 text-sm font-black text-slate-800">
              No application yet
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Scholarship, Admission বা Visa tool থেকে tracker
              তৈরি করুন।
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">
                        {item.type}
                      </span>

                      <h3 className="text-sm font-black text-slate-900">
                        {item.title}
                      </h3>
                    </div>

                    {item.institution && (
                      <p className="mt-1 text-xs text-slate-500">
                        {item.institution}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={item.status}
                      onChange={(event) =>
                        onStatusChange(
                          item.id,
                          event.target.value as ApplicationStatus
                        )
                      }
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold outline-none"
                    >
                      <option>Draft</option>
                      <option>Preparing</option>
                      <option>Applied</option>
                      <option>Under Review</option>
                      <option>Completed</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MODAL HEADER
========================================================= */

function ModalHeader({
  eyebrow,
  title,
  subtitle,
  onClose,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  onClose: () => void;
}) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-600">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-lg font-black text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          {subtitle}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

/* =========================================================
   OFFICIAL SOURCE CARD
========================================================= */

function OfficialSourceCard({
  icon,
  title,
  description,
  href,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:bg-blue-50"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-black text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <ExternalLink className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-700" />
    </a>
  );
}

/* =========================================================
   VISA COUNTRY
========================================================= */

function VisaCountry({
  country,
  description,
  href,
}: {
  country: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:bg-blue-50"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        <Globe2 className="h-5 w-5" />
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-black text-slate-900">
          {country}
        </h3>

        <p className="mt-0.5 text-xs text-slate-500">
          {description}
        </p>
      </div>

      <ExternalLink className="h-4 w-4 text-slate-400" />
    </a>
  );
}

/* =========================================================
   STEP BOX
========================================================= */

function StepBox({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <span className="text-[10px] font-black text-blue-600">
        {number}
      </span>

      <h3 className="mt-2 text-sm font-black text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   PERMISSION LINE
========================================================= */

function PermissionLine({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100">
        <CheckCircle2 className="h-3.5 w-3.5 text-blue-700" />
      </div>

      <div>
        <p className="text-xs font-bold text-slate-800">
          {title}
        </p>

        <p className="mt-0.5 text-[11px] leading-5 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   SMALL UNIVERSITY ICON
========================================================= */

function UniversityIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M3 10l9-6 9 6" />
      <path d="M5 10v8" />
      <path d="M9 10v8" />
      <path d="M15 10v8" />
      <path d="M19 10v8" />
      <path d="M3 20h18" />
    </svg>
  );
}