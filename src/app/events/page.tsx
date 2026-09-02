"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Globe2,
  Heart,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
  Video,
  X,
} from "lucide-react";

type EventItem = {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  description: string;
  attendees: number;
  online: boolean;
  featured: boolean;
  verified: boolean;
};

const categories = [
  "সব",
  "Business",
  "Jobs & Career",
  "Community",
  "Education",
  "Sports",
  "Culture",
  "Technology",
  "Charity",
];

const events: EventItem[] = [
  {
    id: 1,
    title: "Bangladesh Business & Investment Summit",
    category: "Business",
    date: "18 Sep 2026",
    time: "10:00 AM – 5:00 PM",
    location: "Dhaka, Bangladesh",
    organizer: "Business Park International",
    description:
      "দেশি-বিদেশি উদ্যোক্তা, ব্যবসায়ী ও বিনিয়োগকারীদের জন্য networking এবং business opportunity event.",
    attendees: 850,
    online: false,
    featured: true,
    verified: true,
  },
  {
    id: 2,
    title: "Global Bangladeshi Career Meetup",
    category: "Jobs & Career",
    date: "25 Sep 2026",
    time: "7:00 PM – 9:30 PM",
    location: "Online",
    organizer: "Probashi Network",
    description:
      "দেশ ও বিদেশের চাকরি, career development এবং professional networking নিয়ে বিশেষ আয়োজন.",
    attendees: 1250,
    online: true,
    featured: true,
    verified: true,
  },
  {
    id: 3,
    title: "Youth Technology & Innovation Forum",
    category: "Technology",
    date: "03 Oct 2026",
    time: "9:00 AM – 4:00 PM",
    location: "Chattogram, Bangladesh",
    organizer: "Innovation Community",
    description:
      "তরুণ উদ্যোক্তা, developer, researcher এবং technology enthusiast-দের মিলনমেলা.",
    attendees: 430,
    online: false,
    featured: false,
    verified: true,
  },
  {
    id: 4,
    title: "Bangladesh Cultural Evening",
    category: "Culture",
    date: "10 Oct 2026",
    time: "6:00 PM – 10:00 PM",
    location: "London, United Kingdom",
    organizer: "Bangladesh Community UK",
    description:
      "প্রবাসী বাংলাদেশিদের জন্য সাংস্কৃতিক অনুষ্ঠান, networking এবং community gathering.",
    attendees: 620,
    online: false,
    featured: true,
    verified: false,
  },
  {
    id: 5,
    title: "Smart Sports Community Meetup",
    category: "Sports",
    date: "17 Oct 2026",
    time: "3:00 PM – 7:00 PM",
    location: "Dhaka, Bangladesh",
    organizer: "Smart Sports",
    description:
      "Football, cricket এবং অন্যান্য sports community নিয়ে networking ও friendly activities.",
    attendees: 350,
    online: false,
    featured: false,
    verified: true,
  },
  {
    id: 6,
    title: "Education & Skills Development Workshop",
    category: "Education",
    date: "24 Oct 2026",
    time: "11:00 AM – 2:00 PM",
    location: "Online",
    organizer: "Shromobazar Learning",
    description:
      "দক্ষতা উন্নয়ন, career preparation এবং future workforce নিয়ে interactive workshop.",
    attendees: 760,
    online: true,
    featured: false,
    verified: true,
  },
  {
    id: 7,
    title: "Community Charity & Good Work Day",
    category: "Charity",
    date: "01 Nov 2026",
    time: "9:00 AM – 3:00 PM",
    location: "Khulna, Bangladesh",
    organizer: "Good Work World",
    description:
      "স্থানীয় মানুষের জন্য সামাজিক সহায়তা, volunteer activity এবং community development.",
    attendees: 280,
    online: false,
    featured: false,
    verified: true,
  },
];

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("সব");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const [createOpen, setCreateOpen] = useState(false);

  const [eventTitle, setEventTitle] = useState("");
  const [eventCategory, setEventCategory] = useState("Business");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventOnline, setEventOnline] = useState(false);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesCategory =
        category === "সব" || event.category === category;

      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.organizer.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  const featuredEvents = events.filter((event) => event.featured);

  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleRegister = (event: EventItem) => {
    window.alert(
      `${event.title}-এ আপনার registration request গ্রহণ করা হয়েছে।`
    );
  };

  const handleCreateEvent = () => {
    if (!eventTitle || !eventDate || !eventLocation) {
      window.alert(
        "দয়া করে Event Title, Date এবং Location পূরণ করুন।"
      );
      return;
    }

    window.alert(
      "আপনার Event submission গ্রহণ করা হয়েছে। Verification-এর পর Event প্রকাশ করা হবে।"
    );

    setCreateOpen(false);
    setEventTitle("");
    setEventCategory("Business");
    setEventDate("");
    setEventLocation("");
    setEventDescription("");
    setEventOnline(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,114,182,0.20),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-pink-400/30 bg-pink-400/10 px-4 py-2 text-sm font-bold text-pink-300">
                <CalendarDays className="h-4 w-4" />
                Events & Experiences
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                মানুষ, কমিউনিটি ও
                <span className="block text-pink-400">
                  সুযোগকে এক জায়গায় যুক্ত করুন।
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Business, career, education, sports, culture, technology,
                community এবং charity—সব ধরনের event খুঁজুন, join করুন এবং
                নিজের event organize করুন।
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setCreateOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-pink-500/20 transition hover:bg-pink-400"
                >
                  <Plus className="h-5 w-5" />
                  Organize an Event
                </button>

                <button
                  onClick={() =>
                    document
                      .getElementById("event-list")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/15"
                >
                  Explore Events
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                ["Events", "5K+", CalendarDays],
                ["Participants", "500K+", Users],
                ["Cities", "80+", MapPin],
                ["Online Events", "1.2K+", Video],
              ].map(([label, value, Icon]) => {
                const StatIcon = Icon as typeof CalendarDays;

                return (
                  <div
                    key={label as string}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl"
                  >
                    <StatIcon className="h-6 w-6 text-pink-400" />

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

      {/* EVENT TYPES */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Business Events",
              text: "Networking, summit ও investment",
              icon: Globe2,
              category: "Business",
            },
            {
              title: "Career Events",
              text: "Jobs, skills ও professional meetup",
              icon: Users,
              category: "Jobs & Career",
            },
            {
              title: "Community Events",
              text: "স্থানীয় ও global community",
              icon: Users,
              category: "Community",
            },
            {
              title: "Education",
              text: "Workshop, training ও learning",
              icon: Sparkles,
              category: "Education",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                onClick={() => {
                  setCategory(item.category);

                  document
                    .getElementById("event-list")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-pink-300 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-4 font-black">{item.title}</h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {item.text}
                </p>

                <div className="mt-3 flex items-center text-sm font-bold text-pink-600">
                  Explore
                  <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm font-bold text-pink-600">
            <Sparkles className="h-4 w-4" />
            Featured Events
          </div>

          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            এই মুহূর্তের বিশেষ আয়োজন
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {featuredEvents.map((event) => (
            <article
              key={event.id}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-40 overflow-hidden bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.22),transparent_25%)]" />

                <div className="relative flex h-full flex-col justify-between p-5">
                  <div className="flex justify-between">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                      {event.category}
                    </span>

                    <button
                      onClick={() => toggleFavorite(event.id)}
                      className="rounded-full bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          favorites.includes(event.id)
                            ? "fill-white"
                            : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <CalendarDays className="h-4 w-4" />
                    {event.date}
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h3 className="line-clamp-2 text-lg font-black">
                  {event.title}
                </h3>

                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </div>

                <button
                  onClick={() => setSelectedEvent(event)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  View Event
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SEARCH + LIST */}
      <section
        id="event-list"
        className="border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-7">
            <div className="flex items-center gap-2 text-sm font-bold text-pink-600">
              <CalendarDays className="h-4 w-4" />
              Explore Events
            </div>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Find your next event
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search event, organizer, city..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                />
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-pink-400"
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {filteredEvents.map((event) => (
              <article
                key={event.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-pink-200 hover:shadow-lg"
              >
                <div className="grid gap-5 lg:grid-cols-[110px_1fr_auto] lg:items-center">
                  <div className="rounded-2xl bg-pink-50 p-4 text-center">
                    <CalendarDays className="mx-auto h-7 w-7 text-pink-600" />

                    <div className="mt-2 text-xs font-black text-pink-700">
                      {event.date}
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-black text-pink-700">
                        {event.category}
                      </span>

                      {event.online && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
                          <Video className="h-3.5 w-3.5" />
                          Online
                        </span>
                      )}

                      {event.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-xl font-black">
                      {event.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-4 w-4" />
                        {event.time}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        {event.attendees.toLocaleString()} attending
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-500">
                      {event.description}
                    </p>

                    <div className="mt-3 text-xs font-bold text-slate-400">
                      Organized by{" "}
                      <span className="text-slate-600">
                        {event.organizer}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-row gap-2 lg:flex-col">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 lg:flex-none"
                    >
                      Details
                    </button>

                    <button
                      onClick={() => handleRegister(event)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-pink-600 lg:flex-none"
                    >
                      <Ticket className="h-4 w-4" />
                      Join
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {filteredEvents.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                <CalendarDays className="mx-auto h-10 w-10 text-slate-300" />

                <h3 className="mt-4 font-black">
                  কোনো event পাওয়া যায়নি
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Search অথবা category পরিবর্তন করে আবার চেষ্টা করুন।
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ORGANIZER CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-purple-950 to-pink-950 p-7 text-white sm:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-pink-200">
                <Sparkles className="h-4 w-4" />
                Event Organizer
              </div>

              <h2 className="mt-5 text-3xl font-black sm:text-4xl">
                আপনার event—
                <span className="block text-pink-300">
                  হাজার মানুষের কাছে পৌঁছে দিন।
                </span>
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                Business meetup, training, workshop, sports, cultural
                program, charity অথবা community event—Shromobazar-এর
                Events platform-এ আপনার আয়োজন publish করার সুযোগ।
              </p>

              <button
                onClick={() => setCreateOpen(true)}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 font-bold text-slate-900 transition hover:bg-pink-50"
              >
                <Plus className="h-5 w-5" />
                Create Event
              </button>
            </div>

            <div className="hidden lg:flex h-36 w-36 items-center justify-center rounded-full border border-pink-400/20 bg-pink-400/10">
              <CalendarDays className="h-16 w-16 text-pink-300" />
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
              title: "Verified Organizers",
              text: "ভবিষ্যতে organizer ও event verification-এর মাধ্যমে trust তৈরি করা হবে।",
            },
            {
              icon: Ticket,
              title: "Easy Registration",
              text: "এক জায়গা থেকে event details দেখা এবং অংশগ্রহণের সুযোগ।",
            },
            {
              icon: Globe2,
              title: "Local & Global",
              text: "বাংলাদেশের পাশাপাশি international এবং online event-এর জন্য প্রস্তুত।",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
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

      {/* EVENT DETAILS MODAL */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-black text-pink-700">
                    {selectedEvent.category}
                  </span>

                  {selectedEvent.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-2xl font-black">
                  {selectedEvent.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="rounded-full p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                <CalendarDays className="h-5 w-5 text-pink-500" />
                <div>
                  <div className="text-xs font-bold text-slate-400">
                    DATE
                  </div>
                  <div className="font-black">
                    {selectedEvent.date}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                <Clock3 className="h-5 w-5 text-pink-500" />
                <div>
                  <div className="text-xs font-bold text-slate-400">
                    TIME
                  </div>
                  <div className="font-black">
                    {selectedEvent.time}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                <MapPin className="h-5 w-5 text-pink-500" />
                <div>
                  <div className="text-xs font-bold text-slate-400">
                    LOCATION
                  </div>
                  <div className="font-black">
                    {selectedEvent.location}
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-600">
              {selectedEvent.description}
            </p>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <div className="text-xs font-bold text-slate-400">
                ORGANIZER
              </div>

              <div className="mt-1 font-black">
                {selectedEvent.organizer}
              </div>

              <div className="mt-1 text-sm text-slate-500">
                {selectedEvent.attendees.toLocaleString()} people interested
              </div>
            </div>

            <button
              onClick={() => {
                handleRegister(selectedEvent);
                setSelectedEvent(null);
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-pink-500 px-5 py-3.5 font-bold text-white hover:bg-pink-600"
            >
              <Ticket className="h-5 w-5" />
              Register / Join Event
            </button>
          </div>
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-black">
                  Organize an Event
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  আপনার event-এর basic information দিন।
                </p>
              </div>

              <button
                onClick={() => setCreateOpen(false)}
                className="rounded-full p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Event Title
                </label>

                <input
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="যেমন: Business Networking Summit"
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Category
                </label>

                <select
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-pink-400"
                >
                  {categories.slice(1).map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Date
                </label>

                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Location
                </label>

                <input
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="City / Venue / Online"
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-pink-400"
                />
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  checked={eventOnline}
                  onChange={(e) => setEventOnline(e.target.checked)}
                  className="h-4 w-4 accent-pink-500"
                />

                <div>
                  <div className="text-sm font-black">
                    Online Event
                  </div>

                  <div className="text-xs text-slate-500">
                    Eventটি online হলে select করুন।
                  </div>
                </div>
              </label>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Description
                </label>

                <textarea
                  value={eventDescription}
                  onChange={(e) =>
                    setEventDescription(e.target.value)
                  }
                  placeholder="Event সম্পর্কে সংক্ষিপ্ত বিবরণ..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 p-4 outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                />
              </div>
            </div>

            <button
              onClick={handleCreateEvent}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-pink-500 px-5 py-3.5 font-bold text-white hover:bg-pink-600"
            >
              <Plus className="h-5 w-5" />
              Submit Event
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-slate-400">
              Event publish করার আগে organizer verification করা হবে।
            </p>
          </div>
        </div>
      )}
    </main>
  );
}