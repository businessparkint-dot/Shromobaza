"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  FlaskConical,
  Lightbulb,
  MapPin,
  MessageSquare,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trash2,
  Users,
  X,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/lib/client";

type Concept = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  concept_type: string;
  support_needed: string[];
  category: string | null;
  location: string | null;
  status: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

const conceptTypes = [
  { value: "all", label: "All" },
  { value: "idea", label: "Idea" },
  { value: "innovation", label: "Innovation" },
  { value: "talent", label: "Talent" },
  { value: "dream", label: "Dream" },
  { value: "story", label: "Story" },
  { value: "research", label: "Research" },
  { value: "project", label: "Project Concept" },
  { value: "content", label: "Content Concept" },
  { value: "business", label: "Business Concept" },
];

const supportOptions = [
  "Mentor",
  "Funding",
  "Training",
  "Job",
  "Equipment",
  "Team",
  "Market Access",
  "Promotion",
  "Education",
  "Technology",
  "Legal Help",
  "Production Support",
];

const typeIcons: Record<string, typeof Lightbulb> = {
  idea: Lightbulb,
  innovation: FlaskConical,
  talent: Star,
  dream: Target,
  story: BookOpen,
  research: FlaskConical,
  project: BriefcaseBusiness,
  content: Sparkles,
  business: TrendingUp,
};

function getErrorMessage(error: unknown) {
  if (!error) return "Unknown error";

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object") {
    const e = error as {
      message?: string;
      details?: string;
      hint?: string;
      code?: string;
    };

    return [
      e.message,
      e.details,
      e.hint,
      e.code ? `Code: ${e.code}` : "",
    ]
      .filter(Boolean)
      .join(" | ");
  }

  return String(error);
}

function getTypeLabel(type: string) {
  return (
    conceptTypes.find((item) => item.value === type)?.label ||
    "Concept"
  );
}

export default function ResearchMarketPage() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [conceptType, setConceptType] = useState("idea");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [supportNeeded, setSupportNeeded] = useState<string[]>([]);

  const [error, setError] = useState("");

  async function loadConcepts() {
    setLoading(true);
    setError("");

    try {
      const { data, error: queryError } = await supabase
        .from("research_concepts")
        .select("*")
        .eq("is_public", true)
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (queryError) {
        throw queryError;
      }

      setConcepts((data || []) as Concept[]);
    } catch (err) {
      console.error("RESEARCH MARKET ERROR:", err);

      setError(
        `Concept load করা যায়নি। ${getErrorMessage(err)}`
      );
    } finally {
      setLoading(false);
    }
  }

  async function getCurrentUser() {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("AUTH ERROR:", authError);
      }

      if (user) {
        setUserId(user.id);
      }
    } catch (err) {
      console.error("USER SESSION ERROR:", err);
    }

    await loadConcepts();
  }

  useEffect(() => {
    getCurrentUser();
  }, []);

  const filteredConcepts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return concepts.filter((concept) => {
      const matchesType =
        selectedType === "all" ||
        concept.concept_type === selectedType;

      const searchableText = [
        concept.title,
        concept.description,
        concept.category,
        concept.location,
        concept.concept_type,
        ...(concept.support_needed || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !keyword || searchableText.includes(keyword);

      return matchesType && matchesSearch;
    });
  }, [concepts, search, selectedType]);

  function toggleSupport(value: string) {
    setSupportNeeded((current) => {
      if (current.includes(value)) {
        return current.filter((item) => item !== value);
      }

      return [...current, value];
    });
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setConceptType("idea");
    setCategory("");
    setLocation("");
    setSupportNeeded([]);
    setError("");
  }

  async function publishConcept() {
    if (!userId) {
      setError(
        "Concept publish করার জন্য আগে আপনার account দিয়ে login করুন।"
      );
      return;
    }

    if (!title.trim()) {
      setError("Concept title দিন।");
      return;
    }

    if (!description.trim()) {
      setError("Concept description দিন।");
      return;
    }

    if (supportNeeded.length === 0) {
      setError(
        "কমপক্ষে একটি Support Needed নির্বাচন করুন।"
      );
      return;
    }

    setSaving(true);
    setError("");

    try {
      const { data, error: insertError } = await supabase
        .from("research_concepts")
        .insert({
          user_id: userId,
          title: title.trim(),
          description: description.trim(),
          concept_type: conceptType,
          support_needed: supportNeeded,
          category: category.trim() || null,
          location: location.trim() || null,
          status: "published",
          is_public: true,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      if (data) {
        setConcepts((current) => [
          data as Concept,
          ...current,
        ]);
      }

      resetForm();
      setShowPublishModal(false);
    } catch (err) {
      console.error("PUBLISH CONCEPT ERROR:", err);

      setError(
        `Concept publish করা যায়নি। ${getErrorMessage(err)}`
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteConcept(id: string) {
    if (!userId) return;

    const confirmed = window.confirm(
      "আপনি কি এই concept টি delete করতে চান?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const { error: deleteError } = await supabase
        .from("research_concepts")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (deleteError) {
        throw deleteError;
      }

      setConcepts((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.error("DELETE CONCEPT ERROR:", err);

      setError(
        `Concept delete করা যায়নি। ${getErrorMessage(err)}`
      );
    }
  }

  function handleContact() {
    alert(
      "Central Communication System পরবর্তী ধাপে যুক্ত হবে। এখানে Creator-এর সাথে secure contact, collaboration, sponsorship, investment এবং concept purchase flow থাকবে।"
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HERO */}
      <section className="overflow-hidden border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
                <Sparkles className="h-4 w-4" />
                Research & Concept Market
              </div>

              <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                ভালো মানুষ,
                <br />
                ভালো ধারণা,
                <br />
                <span className="text-orange-600">
                  সঠিক মানুষের কাছে পৌঁছাক।
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Idea, innovation, talent, dream, story, research,
                project concept এবং business concept এক জায়গায়
                প্রকাশ করুন। Mentor, investor, researcher,
                employer, producer ও supporter যেন সহজে খুঁজে
                পান।
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setError("");
                    setShowPublishModal(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-orange-700"
                >
                  <Plus className="h-5 w-5" />
                  Publish Your Concept
                </button>

                <button
                  onClick={() =>
                    document
                      .getElementById("concept-discovery")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      })
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Discover Ideas
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-orange-100 bg-orange-50 p-7">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm">
                <Lightbulb className="h-7 w-7" />
              </div>

              <h2 className="mt-5 text-2xl font-black">
                Discovery without waiting for an event
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Talent hunt, innovation competition বা বড় event-এর
                অপেক্ষা না করেও মানুষ, গল্প ও ধারণা discover করা
                যাবে।
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  ["Ideas", Lightbulb],
                  ["Talent", Star],
                  ["Research", FlaskConical],
                  ["Stories", BookOpen],
                ].map(([label, Icon]) => {
                  const Component = Icon as typeof Lightbulb;

                  return (
                    <div
                      key={String(label)}
                      className="rounded-2xl bg-white p-4"
                    >
                      <Component className="h-5 w-5 text-orange-600" />

                      <p className="mt-2 text-sm font-bold">
                        {String(label)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-6">
              <Users className="h-7 w-7 text-orange-600" />

              <h3 className="mt-4 text-lg font-black">
                People Discovery
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Hidden talent, young entrepreneur, researcher,
                creator এবং unique people খুঁজে পাওয়া।
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <Target className="h-7 w-7 text-orange-600" />

              <h3 className="mt-4 text-lg font-black">
                Need-based Matching
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                কে Mentor, Funding, Team, Training বা Market
                Access চায় তা পরিষ্কারভাবে দেখা যাবে।
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <Building2 className="h-7 w-7 text-orange-600" />

              <h3 className="mt-4 text-lg font-black">
                Opportunity Discovery
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Investor, company, media, employer, researcher ও
                supporter relevant concept খুঁজে নিতে পারবেন।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DISCOVERY */}
      <section
        id="concept-discovery"
        className="py-12"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-orange-600">
                Discovery Market
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Find Ideas, Talent & Opportunities
              </h2>

              <p className="mt-2 text-slate-500">
                Search করুন অথবা category দিয়ে discovery করুন।
              </p>
            </div>

            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search ideas, talent, research..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-orange-500"
              />
            </div>
          </div>

          {/* CATEGORY FILTER */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
            {conceptTypes.map((type) => (
              <button
                key={type.value}
                onClick={() =>
                  setSelectedType(type.value)
                }
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
                  selectedType === type.value
                    ? "bg-orange-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* RESULTS */}
          {loading ? (
            <div className="py-20 text-center text-slate-500">
              Discovering concepts...
            </div>
          ) : filteredConcepts.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <Lightbulb className="mx-auto h-12 w-12 text-slate-300" />

              <h3 className="mt-4 text-xl font-black">
                No concept found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Search পরিবর্তন করুন অথবা প্রথম concept
                publish করুন।
              </p>

              <button
                onClick={() => {
                  setError("");
                  setShowPublishModal(true);
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 font-bold text-white hover:bg-orange-700"
              >
                <Plus className="h-5 w-5" />
                Publish First Concept
              </button>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredConcepts.map((concept) => {
                const Icon =
                  typeIcons[concept.concept_type] ||
                  Lightbulb;

                const isOwner =
                  concept.user_id === userId;

                return (
                  <article
                    key={concept.id}
                    className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                        <Icon className="h-6 w-6" />
                      </div>

                      <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                        {getTypeLabel(
                          concept.concept_type
                        )}
                      </span>
                    </div>

                    <h3 className="mt-5 line-clamp-2 text-xl font-black">
                      {concept.title}
                    </h3>

                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-500">
                      {concept.description}
                    </p>

                    {/* SUPPORT */}
                    {concept.support_needed?.length > 0 && (
                      <div className="mt-5">
                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                          Support Needed
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {concept.support_needed
                            .slice(0, 6)
                            .map((support) => (
                              <span
                                key={support}
                                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                              >
                                {support}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* META */}
                    {(concept.category ||
                      concept.location) && (
                      <div className="mt-5 space-y-2 text-xs text-slate-500">
                        {concept.category && (
                          <div className="flex items-center gap-2">
                            <BriefcaseBusiness className="h-3.5 w-3.5" />
                            {concept.category}
                          </div>
                        )}

                        {concept.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5" />
                            {concept.location}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ACTIONS */}
                    <div className="mt-6 border-t pt-5">
                      <div className="flex gap-2">
                        <button
                          onClick={handleContact}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 px-3 py-2.5 text-sm font-bold text-white hover:bg-orange-700"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Contact Creator
                        </button>

                        <button
                          onClick={() => {
                            alert(
                              "Collaboration flow পরবর্তী Central Communication System-এর সাথে যুক্ত হবে।"
                            );
                          }}
                          className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-600 hover:bg-slate-50"
                          title="Collaborate"
                        >
                          <Users className="h-4 w-4" />
                        </button>

                        {isOwner && (
                          <button
                            onClick={() =>
                              deleteConcept(concept.id)
                            }
                            className="rounded-xl border border-red-200 px-3 py-2.5 text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* SUPPORT ECOSYSTEM */}
      <section className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wider text-orange-600">
              Support Ecosystem
            </p>

            <h2 className="mt-2 text-3xl font-black">
              A concept should clearly say what it needs
            </h2>

            <p className="mt-3 text-slate-600">
              Creator নিজের প্রয়োজন স্পষ্টভাবে জানালে সঠিক ব্যক্তি
              বা প্রতিষ্ঠান তাকে সহজে খুঁজে পেতে পারবে।
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            {supportOptions.map((support) => (
              <div
                key={support}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                {support}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY DISCOVERY */}
      <section className="border-t bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-orange-300">
                Story Discovery
              </div>

              <h2 className="mt-5 text-3xl font-black sm:text-4xl">
                এমন গল্প খুঁজে বের করা,
                <br />
                যেগুলো এখনো কেউ দেখেনি।
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-300">
                Rural innovator, young talent, struggling
                entrepreneur, researcher, creator, unique life
                story বা documentary-worthy মানুষের গল্প—একটি
                structured discovery system-এর মাধ্যমে সামনে
                আনা যাবে।
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Hidden Talent", Star],
                ["Young Innovator", FlaskConical],
                ["Untold Story", BookOpen],
                ["Future Entrepreneur", TrendingUp],
              ].map(([label, Icon]) => {
                const Component = Icon as typeof Star;

                return (
                  <div
                    key={String(label)}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <Component className="h-6 w-6 text-orange-400" />

                    <p className="mt-3 font-bold">
                      {String(label)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PUBLISH MODAL */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {/* MODAL HEADER */}
            <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-black">
                  Publish Your Concept
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  আপনার idea, talent, research বা story সামনে
                  নিয়ে আসুন।
                </p>
              </div>

              <button
                onClick={() => {
                  setShowPublishModal(false);
                  resetForm();
                }}
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              {/* TITLE */}
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Title *
                </label>

                <input
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Give your idea / story / research a clear title"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* TYPE */}
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Concept Type
                </label>

                <select
                  value={conceptType}
                  onChange={(event) =>
                    setConceptType(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-500"
                >
                  {conceptTypes
                    .filter(
                      (item) => item.value !== "all"
                    )
                    .map((item) => (
                      <option
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </option>
                    ))}
                </select>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Description *
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  rows={6}
                  placeholder="Explain your idea, research, talent, story or concept..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* CATEGORY + LOCATION */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Category
                  </label>

                  <input
                    value={category}
                    onChange={(event) =>
                      setCategory(event.target.value)
                    }
                    placeholder="e.g. Agriculture, Technology"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Location
                  </label>

                  <input
                    value={location}
                    onChange={(event) =>
                      setLocation(event.target.value)
                    }
                    placeholder="e.g. Dhaka, Bangladesh"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* SUPPORT */}
              <div>
                <div className="mb-3">
                  <label className="text-sm font-bold">
                    What support do you need? *
                  </label>

                  <p className="mt-1 text-xs text-slate-500">
                    একাধিক option নির্বাচন করতে পারবেন।
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {supportOptions.map((support) => {
                    const selected =
                      supportNeeded.includes(support);

                    return (
                      <button
                        key={support}
                        type="button"
                        onClick={() =>
                          toggleSupport(support)
                        }
                        className={`rounded-full border px-3 py-2 text-xs font-bold transition ${
                          selected
                            ? "border-orange-600 bg-orange-600 text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {selected && (
                          <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />
                        )}

                        {support}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PRIVACY */}
              <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                <div className="flex gap-3">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-orange-600" />

                  <p className="text-sm leading-6 text-orange-900">
                    Public concept publish করার আগে NID, password,
                    financial information বা অন্য sensitive
                    personal information দেবেন না। ভবিষ্যতে
                    secure collaboration ও negotiation system
                    যুক্ত হবে।
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => {
                    setShowPublishModal(false);
                    resetForm();
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={publishConcept}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 font-bold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Pencil className="h-4 w-4" />
                      Publish Concept
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}