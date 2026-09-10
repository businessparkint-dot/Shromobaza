"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Trophy,
  Gamepad2,
  Medal,
  CalendarDays,
  Users,
  Star,
  Play,
  Plus,
  Search,
  Rocket,
  Code2,
  ChevronRight,
  Globe2,
  Target,
  ShieldCheck,
  X,
  UserRound,
  MapPin,
  Zap,
  CircleDot,
  TrendingUp,
  MessageCircle,
  Video,
  Megaphone,
  Building2,
  Award,
  Activity,
  ArrowRight,
} from "lucide-react";

type Sport = {
  id: string;
  name: string;
  icon: string;
};

type Player = {
  id: number;
  name: string;
  sport: string;
  position: string;
  location: string;
  level: string;
  team: string;
  rating: number;
  skills: string;
  available: boolean;
};

type Team = {
  id: number;
  name: string;
  sport: string;
  location: string;
  level: string;
  players: number;
  rating: number;
  status: string;
};

type SportsPost = {
  id: number;
  type: string;
  title: string;
  text: string;
  author: string;
  location: string;
  time: string;
  likes: string;
};

type Game = {
  id: number;
  title: string;
  category: string;
  developer: string;
  players: string;
  rating: number;
  status: string;
  description: string;
};

const sports: Sport[] = [
  { id: "all", name: "All Sports", icon: "🏆" },
  { id: "football", name: "Football", icon: "⚽" },
  { id: "cricket", name: "Cricket", icon: "🏏" },
  { id: "tennis", name: "Tennis", icon: "🎾" },
  { id: "basketball", name: "Basketball", icon: "🏀" },
  { id: "kabaddi", name: "Kabaddi", icon: "🤼" },
  { id: "athletics", name: "Athletics", icon: "🏃" },
  { id: "esports", name: "Esports", icon: "🎮" },
];

const levels = [
  "All Levels",
  "Village",
  "Union",
  "Upazila",
  "District",
  "Division",
  "National",
  "International",
];

const players: Player[] = [
  {
    id: 1,
    name: "Rahim Hasan",
    sport: "Football",
    position: "Forward",
    location: "Saronkhola, Bagerhat",
    level: "District",
    team: "Sundarban United",
    rating: 4.9,
    skills: "Finishing • Speed",
    available: true,
  },
  {
    id: 2,
    name: "Sakib Ahmed",
    sport: "Cricket",
    position: "Fast Bowler",
    location: "Khulna",
    level: "National",
    team: "Khulna XI",
    rating: 4.8,
    skills: "Pace • Swing",
    available: false,
  },
  {
    id: 3,
    name: "Jannatul Ferdous",
    sport: "Athletics",
    position: "Sprinter",
    location: "Barishal",
    level: "Division",
    team: "Barishal Athletics Club",
    rating: 4.7,
    skills: "100m • 200m",
    available: true,
  },
  {
    id: 4,
    name: "Tanvir Rahman",
    sport: "Football",
    position: "Goalkeeper",
    location: "Dhaka",
    level: "National",
    team: "Dhaka United",
    rating: 4.9,
    skills: "Reflex • Handling",
    available: true,
  },
  {
    id: 5,
    name: "Mizanur Rahman",
    sport: "Kabaddi",
    position: "Raider",
    location: "Patuakhali",
    level: "Upazila",
    team: "Coastal Warriors",
    rating: 4.6,
    skills: "Agility • Raid",
    available: true,
  },
  {
    id: 6,
    name: "Nusrat Jahan",
    sport: "Tennis",
    position: "Singles",
    location: "Chattogram",
    level: "National",
    team: "CTG Tennis Club",
    rating: 4.8,
    skills: "Serve • Defense",
    available: false,
  },
];

const teams: Team[] = [
  {
    id: 1,
    name: "Sundarban United",
    sport: "Football",
    location: "Saronkhola, Bagerhat",
    level: "District",
    players: 24,
    rating: 4.8,
    status: "Active",
  },
  {
    id: 2,
    name: "Khulna XI",
    sport: "Cricket",
    location: "Khulna",
    level: "National",
    players: 18,
    rating: 4.9,
    status: "Recruiting",
  },
  {
    id: 3,
    name: "Coastal Warriors",
    sport: "Kabaddi",
    location: "Patuakhali",
    level: "Upazila",
    players: 14,
    rating: 4.6,
    status: "Active",
  },
  {
    id: 4,
    name: "Dhaka United",
    sport: "Football",
    location: "Dhaka",
    level: "National",
    players: 28,
    rating: 4.9,
    status: "Recruiting",
  },
];

const sportsPosts: SportsPost[] = [
  {
    id: 1,
    type: "Achievement",
    title: "Saronkhola's young striker scores 2 goals",
    text: "Local tournament-এ অসাধারণ পারফরম্যান্স করে Rahim Hasan নতুন করে সবার নজরে এসেছে।",
    author: "Sundarban United",
    location: "Saronkhola, Bagerhat",
    time: "18 min ago",
    likes: "124",
  },
  {
    id: 2,
    type: "Player Wanted",
    title: "Fast Bowler Needed",
    text: "Khulna XI একজন pace bowler খুঁজছে। National-level experience preferred.",
    author: "Khulna XI",
    location: "Khulna",
    time: "42 min ago",
    likes: "89",
  },
  {
    id: 3,
    type: "Match",
    title: "District Football Final Tonight",
    text: "Sundarban United বনাম Bagerhat Warriors — রাত ৮টায় final match.",
    author: "Bagerhat Sports",
    location: "Bagerhat",
    time: "1 hr ago",
    likes: "216",
  },
  {
    id: 4,
    type: "Highlight",
    title: "Young athlete breaks personal record",
    text: "Division Athletics Meet-এ নতুন personal best অর্জন করেছে Jannatul Ferdous.",
    author: "Barishal Athletics Club",
    location: "Barishal",
    time: "2 hrs ago",
    likes: "174",
  },
];

const games: Game[] = [
  {
    id: 1,
    title: "Street Football Arena",
    category: "Sports",
    developer: "Shromobazar Studio",
    players: "12K+",
    rating: 4.8,
    status: "Available",
    description: "Fast-paced online street football experience.",
  },
  {
    id: 2,
    title: "Cricket Champions",
    category: "Cricket",
    developer: "PlayBangla",
    players: "8.4K+",
    rating: 4.7,
    status: "Available",
    description: "Compete with players in quick cricket matches.",
  },
  {
    id: 3,
    title: "Battle Racers",
    category: "Racing",
    developer: "NextPixel Games",
    players: "5.2K+",
    rating: 4.6,
    status: "Available",
    description: "Competitive multiplayer racing game.",
  },
  {
    id: 4,
    title: "Football Manager Pro",
    category: "Strategy",
    developer: "GameCraft BD",
    players: "3.1K+",
    rating: 4.5,
    status: "Coming Soon",
    description: "Build your team, manage players and compete.",
  },
];

export default function SmartSportsPage() {
  const [activeSport, setActiveSport] = useState("all");
  const [activeLevel, setActiveLevel] = useState("All Levels");
  const [playerSearch, setPlayerSearch] = useState("");
  const [gameSearch, setGameSearch] = useState("");
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);

  const filteredPlayers = useMemo(() => {
    const query = playerSearch.toLowerCase().trim();

    return players.filter((player) => {
      const matchesSearch =
        !query ||
        player.name.toLowerCase().includes(query) ||
        player.sport.toLowerCase().includes(query) ||
        player.position.toLowerCase().includes(query) ||
        player.location.toLowerCase().includes(query) ||
        player.team.toLowerCase().includes(query);

      const matchesSport =
        activeSport === "all" ||
        player.sport.toLowerCase() === activeSport;

      const matchesLevel =
        activeLevel === "All Levels" ||
        player.level === activeLevel;

      return matchesSearch && matchesSport && matchesLevel;
    });
  }, [playerSearch, activeSport, activeLevel]);

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const matchesSport =
        activeSport === "all" ||
        team.sport.toLowerCase() === activeSport;

      const matchesLevel =
        activeLevel === "All Levels" ||
        team.level === activeLevel;

      return matchesSport && matchesLevel;
    });
  }, [activeSport, activeLevel]);

  const filteredGames = useMemo(() => {
    const query = gameSearch.toLowerCase().trim();

    return games.filter((game) => {
      const matchesSearch =
        !query ||
        game.title.toLowerCase().includes(query) ||
        game.category.toLowerCase().includes(query) ||
        game.developer.toLowerCase().includes(query);

      return matchesSearch;
    });
  }, [gameSearch]);

  const handlePlay = (game: Game) => {
    if (game.status === "Coming Soon") {
      window.alert(`${game.title} — Coming Soon`);
      return;
    }

    window.alert(`${game.title} — Game launch system ready.`);
  };

  const handleSubmitGame = () => {
    setShowDeveloperModal(false);

    window.alert(
      "Game Developer submission system is ready. পরবর্তী ধাপে এটি central database-এর সাথে যুক্ত করা যাবে।"
    );
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_32%),radial-gradient(circle_at_center,rgba(59,130,246,0.10),transparent_38%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.35fr_0.65fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-black text-amber-300">
                <Trophy className="h-4 w-4" />
                SHROMO SPORTS NETWORK
              </div>

              <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
                Find Players.
                <br />
                Build Teams.
                <br />
                <span className="text-amber-400">
                  Discover Champions.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                গ্রামের প্রতিভাবান খেলোয়াড় থেকে National ও International
                athlete—সবাইকে একটি connected sports network-এর মধ্যে নিয়ে
                আসছে Shromobazar।
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#players"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-black text-slate-950 transition hover:bg-amber-300"
                >
                  <Search className="h-5 w-5" />
                  Find Players
                </a>

                <a
                  href="#teams"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/15"
                >
                  <Users className="h-5 w-5" />
                  Explore Teams
                </a>

                <a
                  href="#sports-feed"
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 font-bold text-emerald-300 transition hover:bg-emerald-400/20"
                >
                  <Activity className="h-5 w-5" />
                  Sports Updates
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-amber-400">
                    Sports Network
                  </p>
                  <h2 className="mt-1 text-xl font-black">
                    One Connected World
                  </h2>
                </div>

                <div className="rounded-xl bg-amber-400/10 p-3 text-amber-300">
                  <Globe2 className="h-6 w-6" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  icon={<Users />}
                  value="50K+"
                  label="Players"
                />
                <StatCard
                  icon={<Building2 />}
                  value="2.5K+"
                  label="Teams"
                />
                <StatCard
                  icon={<Trophy />}
                  value="120+"
                  label="Tournaments"
                />
                <StatCard
                  icon={<Globe2 />}
                  value="8"
                  label="Sports Levels"
                />
              </div>

              <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                    <TrendingUp className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-black text-white">
                      Local talent → Global opportunity
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Discover the next champion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPORTS FILTER */}
      <section className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {sports.map((sport) => (
              <button
                key={sport.id}
                onClick={() => setActiveSport(sport.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                  activeSport === sport.id
                    ? "border-amber-400 bg-amber-400 text-slate-950"
                    : "border-white/10 bg-white/[0.05] text-slate-300 hover:bg-white/10"
                }`}
              >
                <span>{sport.icon}</span>
                {sport.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PLAYER DISCOVERY */}
      <section
        id="players"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <SectionHeading
          eyebrow="PLAYER DISCOVERY"
          title="Find Your Next Player"
          description="গ্রাম, উপজেলা, জেলা, National বা International level—sport, position ও skill অনুযায়ী player খুঁজে বের করুন।"
          icon={<UserRound />}
        />

        <div className="mt-7 rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-400/[0.08] via-white/[0.03] to-transparent p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

              <input
                value={playerSearch}
                onChange={(e) => setPlayerSearch(e.target.value)}
                placeholder="Search player, sport, position, team or location..."
                className="w-full rounded-xl border border-white/10 bg-slate-950 py-3.5 pl-12 pr-4 text-white outline-none placeholder:text-slate-600 focus:border-amber-400/50"
              />
            </div>

            <select
              value={activeLevel}
              onChange={(e) => setActiveLevel(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none focus:border-amber-400/50"
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-bold text-slate-400">
              Browse by level:
            </span>

            {levels.slice(1).map((level) => (
              <button
                key={level}
                onClick={() => setActiveLevel(level)}
                className={`rounded-full border px-3 py-1.5 font-bold transition ${
                  activeLevel === level
                    ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                    : "border-white/10 text-slate-500 hover:text-white"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>

        {filteredPlayers.length === 0 && (
          <EmptyState
            icon={<UserRound />}
            title="No players found"
            text="অন্য sport, level, location বা player name দিয়ে চেষ্টা করুন।"
          />
        )}

        <div className="mt-7 flex justify-center">
          <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-slate-300 transition hover:bg-white/10 hover:text-white">
            View All Players
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* LEVEL JOURNEY */}
      <section className="border-y border-white/10 bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="PLAYER JOURNEY"
            title="Local Talent to Global Stage"
            description="একজন খেলোয়াড়ের sports journey এক জায়গায় দেখা যাবে।"
            icon={<TrendingUp />}
          />

          <div className="mt-8 overflow-x-auto pb-3">
            <div className="flex min-w-[900px] items-center justify-between gap-3">
              {[
                ["01", "Village", "🏡"],
                ["02", "Union", "📍"],
                ["03", "Upazila", "🏟️"],
                ["04", "District", "🏆"],
                ["05", "Division", "🌐"],
                ["06", "National", "🇧🇩"],
                ["07", "International", "🌍"],
              ].map(([number, title, emoji], index) => (
                <div
                  key={title}
                  className="flex flex-1 items-center"
                >
                  <div className="w-full">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-2xl shadow-lg shadow-amber-500/5">
                      {emoji}
                    </div>

                    <div className="mt-3 text-center">
                      <p className="text-[10px] font-black text-amber-400">
                        {number}
                      </p>
                      <p className="mt-1 text-sm font-black">
                        {title}
                      </p>
                    </div>
                  </div>

                  {index < 6 && (
                    <div className="mx-2 hidden h-px flex-1 bg-gradient-to-r from-amber-400/30 to-emerald-400/30 sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEAMS */}
      <section
        id="teams"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <SectionHeading
          eyebrow="TEAMS & CLUBS"
          title="Explore Teams & Clubs"
          description="Local team, academy, club থেকে National-level team পর্যন্ত—সবাই নিজের sports identity তৈরি করতে পারবে।"
          icon={<Building2 />}
        />

        <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {filteredTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </section>

      {/* PLAYER / TEAM MARKET */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          <OpportunityCard
            icon={<Megaphone />}
            eyebrow="PLAYER WANTED"
            title="Your Team Needs a Player?"
            text="Position, sport, level ও location দিয়ে player খুঁজুন এবং recruitment opportunity তৈরি করুন।"
            button="Find Players"
          />

          <OpportunityCard
            icon={<Target />}
            eyebrow="TEAM WANTED"
            title="Looking for a Team?"
            text="নিজের player profile তৈরি করে team, club, academy বা tournament-এর নজরে আসুন।"
            button="Create Player Profile"
            secondary
          />
        </div>
      </section>

      {/* SPORTS FEED */}
      <section
        id="sports-feed"
        className="border-y border-white/10 bg-black/20"
      >
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="SPORTS STATUS"
              title="What’s Happening in Sports"
              description="Match, achievement, player update, recruitment, highlights ও tournament update এক জায়গায়।"
              icon={<Activity />}
            />

            <button className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-black text-slate-300 hover:bg-white/10">
              Create Sports Status
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {sportsPosts.map((post) => (
              <SportsPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* MATCHES */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="COMPETITION"
          title="Matches & Results"
          description="Live match, upcoming match এবং completed results."
          icon={<CalendarDays />}
        />

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <MatchCard
            live
            sport="Football"
            teamA="Dhaka United"
            teamB="Chattogram FC"
            scoreA="2"
            scoreB="1"
            time="68'"
          />

          <MatchCard
            sport="Cricket"
            teamA="Bangladesh"
            teamB="Sri Lanka"
            scoreA="184/6"
            scoreB="176/8"
            time="18.4 overs"
          />

          <MatchCard
            sport="Tennis"
            teamA="Player A"
            teamB="Player B"
            scoreA="2"
            scoreB="1"
            time="Final"
          />
        </div>
      </section>

      {/* RANKINGS */}
      <section className="border-y border-white/10 bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="PERFORMANCE"
            title="Top Performers"
            description="Future database integration-এর মাধ্যমে verified statistics ও rankings এখানে আসবে।"
            icon={<Award />}
          />

          <div className="mt-7 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
            {players
              .slice()
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 5)
              .map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center gap-4 border-b border-white/10 p-4 last:border-b-0 sm:p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 font-black text-amber-300">
                    #{index + 1}
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/20 to-emerald-400/20">
                    <UserRound className="h-5 w-5 text-slate-300" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black">
                      {player.name}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {player.sport} • {player.position} •{" "}
                      {player.level}
                    </p>
                  </div>

                  <div className="hidden text-right sm:block">
                    <p className="text-xs text-slate-500">
                      {player.location}
                    </p>
                    <p className="mt-1 text-sm font-black text-amber-300">
                      {player.rating} Rating
                    </p>
                  </div>

                  <ChevronRight className="h-5 w-5 text-slate-600" />
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="SPORTS MEDIA"
          title="Highlights & Stories"
          description="Player highlights, match clips, interviews, stories এবং sports creators."
          icon={<Video />}
        />

        <div className="mt-7 grid gap-5 md:grid-cols-3">
          <MediaCard
            icon={<Play />}
            title="Match Highlights"
            text="সেরা ম্যাচের গুরুত্বপূর্ণ মুহূর্ত দেখুন।"
          />

          <MediaCard
            icon={<UserRound />}
            title="Player Stories"
            text="গ্রামের প্রতিভাবান খেলোয়াড়দের journey জানুন।"
          />

          <MediaCard
            icon={<MessageCircle />}
            title="Sports Interviews"
            text="Player, coach ও sports personalities-এর গল্প।"
          />
        </div>
      </section>

      {/* ONLINE GAMES */}
      <section
        id="games"
        className="border-y border-white/10 bg-slate-900/70"
      >
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-cyan-400">
                DIGITAL SPORTS
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Online Games & Esports
              </h2>

              <p className="mt-2 max-w-2xl text-slate-400">
                Sports ecosystem-এর পাশাপাশি digital gaming, esports এবং
                game developers-এর জন্য আলাদা space।
              </p>
            </div>

            <button
              onClick={() => setShowDeveloperModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 font-bold text-cyan-300 hover:bg-cyan-400/20"
            >
              <Plus className="h-5 w-5" />
              Submit New Game
            </button>
          </div>

          <div className="mb-7 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

              <input
                value={gameSearch}
                onChange={(e) => setGameSearch(e.target.value)}
                placeholder="Search games, categories or developers..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.06] py-3.5 pl-12 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50"
              />
            </div>

            <button
              onClick={() => setGameSearch("")}
              className="rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 font-bold text-slate-300 hover:bg-white/10"
            >
              Clear
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onPlay={() => handlePlay(game)}
              />
            ))}
          </div>

          {filteredGames.length === 0 && (
            <EmptyState
              icon={<Gamepad2 />}
              title="No games found"
              text="Try another game or developer name."
            />
          )}
        </div>
      </section>

      {/* DEVELOPER HUB */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-950/60 via-slate-900 to-slate-950 p-7 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm font-bold text-violet-300">
                <Code2 className="h-4 w-4" />
                Game Developer Hub
              </div>

              <h2 className="text-3xl font-black sm:text-4xl">
                আপনার তৈরি Game
                <span className="text-violet-400"> launch করুন।</span>
              </h2>

              <p className="mt-4 max-w-2xl leading-8 text-slate-300">
                Independent developer, studio অথবা game company—সবাই
                Shromobazar Sports ecosystem-এ নিজের game showcase,
                submit এবং future launch করতে পারবে।
              </p>

              <button
                onClick={() => setShowDeveloperModal(true)}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 font-black text-white hover:bg-violet-400"
              >
                <Rocket className="h-5 w-5" />
                Become a Game Developer
              </button>
            </div>

            <div className="grid gap-3">
              <DeveloperFeature
                icon={<Code2 />}
                title="Submit Your Game"
                text="Game information ও build details submit করুন।"
              />

              <DeveloperFeature
                icon={<Globe2 />}
                title="Reach Players"
                text="আপনার game নতুন audience-এর কাছে showcase করুন।"
              />

              <DeveloperFeature
                icon={<ShieldCheck />}
                title="Developer Profile"
                text="নিজের studio ও published games-এর identity তৈরি করুন।"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SPORTS ECOSYSTEM */}
      <section className="border-t border-white/10 bg-black/20">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="SHROMO SPORTS ECOSYSTEM"
            title="More Than a Sports Page"
            description="Player, team, tournament, media, recruitment ও digital competition—সব এক network-এর অংশ।"
            icon={<Zap />}
          />

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <EcosystemCard
              icon={<UserRound />}
              title="Players"
              text="নিজের sports identity, skills, achievements ও statistics তৈরি করুন।"
            />

            <EcosystemCard
              icon={<Users />}
              title="Teams & Clubs"
              text="Team profile, roster, recruitment ও match history পরিচালনা করুন।"
            />

            <EcosystemCard
              icon={<Trophy />}
              title="Tournaments"
              text="Tournament, fixtures, results, rankings ও competitions।"
            />

            <EcosystemCard
              icon={<Gamepad2 />}
              title="Games & Esports"
              text="Digital games, esports players ও developers-এর জন্য dedicated ecosystem।"
            />
          </div>
        </div>
      </section>

      {/* DEVELOPER MODAL */}
      {showDeveloperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <p className="text-sm font-bold text-violet-400">
                  GAME DEVELOPER HUB
                </p>

                <h3 className="mt-1 text-xl font-black">
                  Launch Your New Game
                </h3>
              </div>

              <button
                onClick={() => setShowDeveloperModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Game Name"
                  placeholder="Your game name"
                />

                <FormField
                  label="Developer / Studio"
                  placeholder="Studio name"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Game Category"
                  placeholder="Sports / Action / Strategy"
                />

                <FormField
                  label="Platform"
                  placeholder="Web / Android / iOS / PC"
                />
              </div>

              <FormField
                label="Game Description"
                placeholder="Tell players about your game..."
                textarea
              />

              <div className="rounded-2xl border border-dashed border-violet-400/30 bg-violet-400/5 p-5">
                <div className="flex items-start gap-3">
                  <Code2 className="mt-1 h-5 w-5 text-violet-400" />

                  <div>
                    <p className="font-bold text-white">
                      Developer Submission
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      পরবর্তী ধাপে এখানে game build, URL, screenshots,
                      trailer, developer profile এবং review/approval workflow
                      যুক্ত করা যাবে।
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmitGame}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 py-3.5 font-black text-white hover:bg-violet-400"
              >
                <Rocket className="h-5 w-5" />
                Submit Game
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
          {icon}
        </div>

        <p className="text-sm font-black uppercase tracking-widest text-amber-400">
          {eyebrow}
        </p>
      </div>

      <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
        {title}
      </h2>

      <p className="mt-3 max-w-3xl leading-7 text-slate-400">
        {description}
      </p>
    </div>
  );
}

function PlayerCard({ player }: { player: Player }) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-amber-400/30 hover:bg-white/[0.06]">
      <div className="relative bg-gradient-to-br from-amber-400/10 via-transparent to-emerald-400/10 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 text-slate-300 shadow-xl">
            <UserRound className="h-8 w-8" />
          </div>

          <div className="flex items-center gap-2">
            {player.available && (
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-black text-emerald-300">
                AVAILABLE
              </span>
            )}

            <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[10px] font-black text-amber-300">
              {player.level}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-xl font-black">{player.name}</h3>

          <p className="mt-1 text-sm font-bold text-amber-300">
            {player.sport} • {player.position}
          </p>
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="h-4 w-4 text-slate-500" />
            {player.location}
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <Users className="h-4 w-4 text-slate-500" />
            {player.team}
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <Zap className="h-4 w-4 text-slate-500" />
            {player.skills}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex items-center gap-1 text-sm font-black text-amber-300">
            <Star className="h-4 w-4 fill-current" />
            {player.rating}
          </div>

          <button className="inline-flex items-center gap-1 text-sm font-black text-slate-300 transition hover:text-white">
            View Profile
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function TeamCard({ team }: { team: Team }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.06]">
      <div className="flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
          <ShieldCheck className="h-7 w-7" />
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
            team.status === "Recruiting"
              ? "bg-amber-400/10 text-amber-300"
              : "bg-emerald-400/10 text-emerald-300"
          }`}
        >
          {team.status}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-black">{team.name}</h3>

      <p className="mt-1 text-sm font-bold text-emerald-300">
        {team.sport} • {team.level}
      </p>

      <div className="mt-4 space-y-2 text-sm text-slate-400">
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {team.location}
        </p>

        <p className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          {team.players} Players
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="flex items-center gap-1 text-sm font-black text-amber-300">
          <Star className="h-4 w-4 fill-current" />
          {team.rating}
        </span>

        <button className="text-sm font-black text-slate-300 hover:text-white">
          Team Profile
        </button>
      </div>
    </div>
  );
}

function OpportunityCard({
  icon,
  eyebrow,
  title,
  text,
  button,
  secondary = false,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  text: string;
  button: string;
  secondary?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border p-7 ${
        secondary
          ? "border-emerald-400/20 bg-emerald-400/[0.06]"
          : "border-amber-400/20 bg-amber-400/[0.06]"
      }`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
          secondary
            ? "bg-emerald-400/10 text-emerald-300"
            : "bg-amber-400/10 text-amber-300"
        }`}
      >
        {icon}
      </div>

      <p
        className={`mt-5 text-xs font-black uppercase tracking-widest ${
          secondary ? "text-emerald-300" : "text-amber-300"
        }`}
      >
        {eyebrow}
      </p>

      <h3 className="mt-2 text-2xl font-black">{title}</h3>

      <p className="mt-3 max-w-xl leading-7 text-slate-400">
        {text}
      </p>

      <button
        className={`mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 font-black ${
          secondary
            ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
            : "bg-amber-400 text-slate-950 hover:bg-amber-300"
        }`}
      >
        {button}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function SportsPostCard({ post }: { post: SportsPost }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20 hover:bg-white/[0.06]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
            {post.type === "Player Wanted" ? (
              <Megaphone className="h-5 w-5" />
            ) : post.type === "Highlight" ? (
              <Video className="h-5 w-5" />
            ) : (
              <Trophy className="h-5 w-5" />
            )}
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-wider text-amber-300">
              {post.type}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {post.time}
            </p>
          </div>
        </div>

        <button className="rounded-lg p-2 text-slate-500 hover:bg-white/10 hover:text-white">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <h3 className="mt-5 text-lg font-black">{post.title}</h3>

      <p className="mt-2 leading-7 text-slate-400">{post.text}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 pt-4 text-xs text-slate-500">
        <span className="font-bold text-slate-300">
          {post.author}
        </span>

        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {post.location}
        </span>

        <span>{post.likes} likes</span>
      </div>
    </div>
  );
}

function MatchCard({
  sport,
  teamA,
  teamB,
  scoreA,
  scoreB,
  time,
  live = false,
}: {
  sport: string;
  teamA: string;
  teamB: string;
  scoreA: string;
  scoreB: string;
  time: string;
  live?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 transition hover:border-white/20 hover:bg-white/[0.07]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
          {sport}
        </span>

        {live ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-black text-red-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
            LIVE
          </span>
        ) : (
          <span className="text-xs font-bold text-slate-500">
            {time}
          </span>
        )}
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold">{teamA}</span>
          <span className="text-xl font-black">{scoreA}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-bold">{teamB}</span>
          <span className="text-xl font-black">{scoreB}</span>
        </div>
      </div>

      <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/10">
        Match Details
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function MediaCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-cyan-400/30">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-black">{title}</h3>

      <p className="mt-2 leading-7 text-slate-400">{text}</p>

      <button className="mt-5 inline-flex items-center gap-1 text-sm font-black text-cyan-300">
        Explore
        <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </button>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-amber-300">
        {icon}
      </div>

      <p className="text-2xl font-black">{value}</p>

      <p className="mt-1 text-xs font-bold text-slate-500">
        {label}
      </p>
    </div>
  );
}

function GameCard({
  game,
  onPlay,
}: {
  game: Game;
  onPlay: () => void;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-950 transition hover:-translate-y-1 hover:border-cyan-400/30">
      <div className="flex h-40 items-center justify-center bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-violet-500/20">
        <Gamepad2 className="h-16 w-16 text-cyan-300 transition group-hover:scale-110" />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-cyan-400">
              {game.category}
            </p>

            <h3 className="mt-1 font-black">{game.title}</h3>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-amber-300">
            <Star className="h-3.5 w-3.5 fill-current" />
            {game.rating}
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">
          {game.description}
        </p>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>{game.developer}</span>
          <span>{game.players} players</span>
        </div>

        <button
          onClick={onPlay}
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-black ${
            game.status === "Available"
              ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
              : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
          }`}
        >
          <Play className="h-4 w-4" />
          {game.status === "Available"
            ? "Play Game"
            : game.status}
        </button>
      </div>
    </div>
  );
}

function DeveloperFeature({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
        {icon}
      </div>

      <div>
        <h3 className="font-black">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-slate-400">
          {text}
        </p>
      </div>
    </div>
  );
}

function EcosystemCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-amber-400/20 hover:bg-white/[0.06]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
        {icon}
      </div>

      <h3 className="mt-4 font-black">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {text}
      </p>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="mt-6 rounded-3xl border border-dashed border-white/10 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-600">
        {icon}
      </div>

      <p className="mt-4 font-black text-slate-300">{title}</p>

      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </div>
  );
}

function FormField({
  label,
  placeholder,
  textarea = false,
}: {
  label: string;
  placeholder: string;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-300">
        {label}
      </span>

      {textarea ? (
        <textarea
          rows={4}
          placeholder={placeholder}
          className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-violet-400/50"
        />
      ) : (
        <input
          placeholder={placeholder}
          className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-violet-400/50"
        />
      )}
    </label>
  );
}