"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BedDouble,
  CalendarDays,
  Camera,
  Car,
  ChevronRight,
  Compass,
  Hotel,
  MapPin,
  Plane,
  Search,
  Send,
  Star,
  Ticket,
  Users,
  Utensils,
  Waves,
} from "lucide-react";

type TourismPlace = {
  id: number;
  name: string;
  location: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  image: string;
  tag: string;
};

const categories = [
  { id: "all", label: "All", icon: Compass },
  { id: "places", label: "Places", icon: MapPin },
  { id: "hotels", label: "Hotels", icon: Hotel },
  { id: "travel", label: "Travel", icon: Plane },
  { id: "experience", label: "Experiences", icon: Ticket },
  { id: "food", label: "Food", icon: Utensils },
];

const places: TourismPlace[] = [
  {
    id: 1,
    name: "Cox's Bazar Sea Beach",
    location: "Cox's Bazar, Bangladesh",
    category: "places",
    description:
      "Discover the world's famous natural sandy coastline, sunset and relaxing sea views.",
    rating: 4.8,
    reviews: 1240,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    tag: "Popular",
  },
  {
    id: 2,
    name: "Sundarbans",
    location: "Khulna Division, Bangladesh",
    category: "places",
    description:
      "Explore mangrove forests, rivers, wildlife and one of Bangladesh's greatest natural treasures.",
    rating: 4.9,
    reviews: 860,
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    tag: "Nature",
  },
  {
    id: 3,
    name: "Sajek Valley",
    location: "Rangamati, Bangladesh",
    category: "places",
    description:
      "Mountain landscapes, clouds, peaceful surroundings and unforgettable hill experiences.",
    rating: 4.8,
    reviews: 980,
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    tag: "Trending",
  },
  {
    id: 4,
    name: "Luxury Beach Resort",
    location: "Cox's Bazar, Bangladesh",
    category: "hotels",
    description:
      "A comfortable stay with modern rooms, family facilities and easy beach access.",
    rating: 4.6,
    reviews: 430,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    tag: "Hotel",
  },
  {
    id: 5,
    name: "Hill View Eco Resort",
    location: "Bandarban, Bangladesh",
    category: "hotels",
    description:
      "Enjoy mountain views, quiet surroundings and a peaceful escape from city life.",
    rating: 4.7,
    reviews: 315,
    image:
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
    tag: "Eco Stay",
  },
  {
    id: 6,
    name: "River & Forest Adventure",
    location: "Sundarbans, Bangladesh",
    category: "experience",
    description:
      "Experience rivers, forest trails, wildlife and local culture with guided exploration.",
    rating: 4.9,
    reviews: 280,
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80",
    tag: "Adventure",
  },
];

export default function TourismPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filteredPlaces = useMemo(() => {
    const query = search.trim().toLowerCase();

    return places.filter((place) => {
      const matchesCategory =
        category === "all" || place.category === category;

      const matchesSearch =
        !query ||
        place.name.toLowerCase().includes(query) ||
        place.location.toLowerCase().includes(query) ||
        place.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-cyan-600" />

                <h1 className="text-lg font-black tracking-tight text-[#07152d]">
                  SHROMO TOURISM
                </h1>
              </div>

              <p className="text-[11px] font-medium text-slate-500">
                Discover places. Plan experiences.
              </p>
            </div>
          </div>

          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-cyan-700"
          >
            <Send className="h-4 w-4" />

            <span className="hidden sm:inline">
              Connect
            </span>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-700 via-blue-700 to-indigo-800 p-6 text-white shadow-xl sm:p-10">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-black backdrop-blur">
              <Compass className="h-4 w-4" />
              TRAVEL & EXPERIENCE
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
              Explore More.
              <br />
              Experience More.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              Discover beautiful places, hotels, travel
              services, local experiences and memorable
              destinations through Shromobazar.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
                Places
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
                Hotels
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
                Travel
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
                Experiences
              </span>
            </div>
          </div>

          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 right-20 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
        </div>

        {/* Search */}

        <div className="mt-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search places, hotels, travel, experiences..."
              className="h-13 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />
          </div>
        </div>

        {/* Categories */}

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => {
            const Icon = item.icon;
            const active = category === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-black transition ${
                  active
                    ? "border-cyan-600 bg-cyan-600 text-white shadow-lg"
                    : "border-slate-200 bg-white text-slate-600 hover:border-cyan-300 hover:text-cyan-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Quick Categories */}

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickCard
            icon={MapPin}
            title="Places"
            text="Discover destinations"
          />

          <QuickCard
            icon={BedDouble}
            title="Hotels"
            text="Find places to stay"
          />

          <QuickCard
            icon={Plane}
            title="Travel"
            text="Plan your journey"
          />

          <QuickCard
            icon={Waves}
            title="Experiences"
            text="Create memories"
          />
        </div>

        {/* Discover */}

        <div className="mt-9">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600">
                Discover
              </p>

              <h3 className="mt-1 text-xl font-black text-[#07152d]">
                Places & Experiences
              </h3>
            </div>

            <div className="text-xs font-bold text-slate-400">
              {filteredPlaces.length} results
            </div>
          </div>

          {filteredPlaces.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <Compass className="mx-auto h-12 w-12 text-slate-300" />

              <h4 className="mt-4 text-lg font-black text-slate-700">
                No destination found
              </h4>

              <p className="mt-2 text-sm text-slate-400">
                Try another place, hotel or experience.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPlaces.map((place) => (
                <article
                  key={place.id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image */}

                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black text-cyan-700 shadow-sm">
                      {place.tag}
                    </div>

                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-slate-950/70 px-2.5 py-1 text-[10px] font-black text-white">
                      <Star className="h-3 w-3 fill-current" />
                      {place.rating}
                    </div>
                  </div>

                  {/* Content */}

                  <div className="p-5">
                    <h4 className="text-lg font-black text-[#07152d]">
                      {place.name}
                    </h4>

                    <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <MapPin className="h-3.5 w-3.5" />
                      {place.location}
                    </div>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                      {place.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Users className="h-4 w-4" />
                        {place.reviews.toLocaleString("en-BD")} reviews
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          alert(
                            "Tourism details and booking flow will be connected to the real Tourism database."
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-xl bg-cyan-600 px-3 py-2 text-xs font-black text-white transition hover:bg-cyan-700"
                      >
                        Explore
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Tourism Services */}

        <div className="mt-10">
          <div className="mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600">
              Tourism Network
            </p>

            <h3 className="mt-1 text-xl font-black text-[#07152d]">
              Build Your Travel Business
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <ServiceCard
              icon={Hotel}
              title="Hotel & Resort"
              description="List your hotel, resort or accommodation business."
              button="Open Your Business"
              href="/global-business"
            />

            <ServiceCard
              icon={Car}
              title="Travel Service"
              description="Connect travel operators, transport and local guides."
              button="Explore Services"
              href="/marketplace"
            />

            <ServiceCard
              icon={Camera}
              title="Creator & Guide"
              description="Share destinations, stories, photography and experiences."
              button="Join Shromo"
              href="/social"
            />
          </div>
        </div>

        {/* CTA */}

        <div className="mt-10 overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600">
                Shromo Tourism
              </p>

              <h3 className="mt-2 text-2xl font-black text-[#07152d]">
                Your next journey starts here.
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Discover destinations, connect with local
                businesses and create better travel experiences.
              </p>
            </div>

            <Link
              href="/marketplace"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
            >
              Explore Marketplace
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function QuickCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Compass;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
        <Icon className="h-5 w-5" />
      </div>

      <h4 className="mt-3 text-sm font-black text-[#07152d]">
        {title}
      </h4>

      <p className="mt-1 text-xs font-medium text-slate-400">
        {text}
      </p>
    </div>
  );
}

function ServiceCard({
  icon: Icon,
  title,
  description,
  button,
  href,
}: {
  icon: typeof Hotel;
  title: string;
  description: string;
  button: string;
  href: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
        <Icon className="h-5 w-5" />
      </div>

      <h4 className="mt-4 text-lg font-black text-[#07152d]">
        {title}
      </h4>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-1 text-xs font-black text-cyan-700 transition hover:text-cyan-900"
      >
        {button}
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}