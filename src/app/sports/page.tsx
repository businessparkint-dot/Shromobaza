"use client";

import { useMemo, useState } from "react";
import {
  Trophy,
  Gamepad2,
  Swords,
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
  Clock3,
  Globe2,
  Target,
  ShieldCheck,
  X,
} from "lucide-react";

type Sport = {
  id: string;
  name: string;
  icon: string;
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
  { id: "esports", name: "Esports", icon: "🎮" },
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
  const [gameSearch, setGameSearch] = useState("");
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [showGames, setShowGames] = useState(true);

  const filteredGames = useMemo(() => {
    const query = gameSearch.toLowerCase().trim();

    return games.filter((game) => {
      const matchesSearch =
        !query ||
        game.title.toLowerCase().includes(query) ||
        game.category.toLowerCase().includes(query) ||
        game.developer.toLowerCase().includes(query);

      const matchesSport =
        activeSport === "all" ||
        (activeSport === "football" && game.category === "Sports") ||
        (activeSport === "cricket" && game.category === "Cricket") ||
        activeSport === "esports" ||
        activeSport === "tennis" ||
        activeSport === "basketball";

      return matchesSearch && matchesSport;
    });
  }, [activeSport, gameSearch]);

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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.20),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_0.8fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-bold text-amber-300">
                <Trophy className="h-4 w-4" />
                Smart Sports
              </div>

              <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
                Sports, Games &{" "}
                <span className="text-amber-400">Digital Competition</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                খেলাধুলা, অনলাইন গেম, esports এবং game developers—সবকিছুকে
                একটি connected sports ecosystem-এর মধ্যে আনার জন্য Smart Sports।
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => setShowGames(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-black text-slate-950 transition hover:bg-amber-300"
                >
                  <Gamepad2 className="h-5 w-5" />
                  Explore Games
                </button>

                <button
                  onClick={() => setShowDeveloperModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/15"
                >
                  <Rocket className="h-5 w-5" />
                  Launch Your Game
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl">
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  icon={<Trophy />}
                  value="24+"
                  label="Sports"
                />
                <StatCard
                  icon={<Gamepad2 />}
                  value="120+"
                  label="Games"
                />
                <StatCard
                  icon={<Users />}
                  value="50K+"
                  label="Players"
                />
                <StatCard
                  icon={<Code2 />}
                  value="80+"
                  label="Developers"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPORTS NAV */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {sports.map((sport) => (
            <button
              key={sport.id}
              onClick={() => setActiveSport(sport.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${
                activeSport === sport.id
                  ? "border-amber-400 bg-amber-400 text-slate-950"
                  : "border-white/10 bg-white/[0.06] text-slate-200 hover:bg-white/10"
              }`}
            >
              <span>{sport.icon}</span>
              {sport.name}
            </button>
          ))}
        </div>
      </section>

      {/* LIVE / UPCOMING */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
              Competition
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Matches & Results
            </h2>
          </div>

          <button className="hidden items-center gap-1 text-sm font-bold text-slate-300 hover:text-white sm:flex">
            View all
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
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

      {/* ONLINE GAMES */}
      <section
        id="games"
        className="border-y border-white/10 bg-slate-900/70"
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-cyan-400">
                Online Gaming
              </p>
              <h2 className="mt-2 text-3xl font-black">
                Online Games
              </h2>
              <p className="mt-2 max-w-2xl text-slate-400">
                খেলোয়াড়রা গেম খুঁজবে, খেলবে এবং rate করবে। Developers নতুন
                game submit ও launch করতে পারবে।
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

          {/* SEARCH */}
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

          {showGames && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onPlay={() => handlePlay(game)}
                />
              ))}
            </div>
          )}

          {filteredGames.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
              <Gamepad2 className="mx-auto h-10 w-10 text-slate-600" />
              <p className="mt-4 font-bold text-slate-300">
                No games found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try another game or developer name.
              </p>
            </div>
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
                Shromobazar Smart Sports ecosystem-এ নিজের game showcase,
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

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
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
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-7">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-400">
              Smart Ecosystem
            </p>
            <h2 className="mt-2 text-3xl font-black">
              One Sports Community
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <EcosystemCard
              icon={<Trophy />}
              title="Sports"
              text="Sports information, matches and competitions."
            />

            <EcosystemCard
              icon={<Gamepad2 />}
              title="Online Games"
              text="Discover and play digital games."
            />

            <EcosystemCard
              icon={<Users />}
              title="Players"
              text="Build player profiles and communities."
            />

            <EcosystemCard
              icon={<Rocket />}
              title="Developers"
              text="Create, showcase and launch games."
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
                <FormField label="Game Name" placeholder="Your game name" />
                <FormField label="Developer / Studio" placeholder="Studio name" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Game Category" placeholder="Sports / Action / Strategy" />
                <FormField label="Platform" placeholder="Web / Android / iOS / PC" />
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

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-amber-300">
        {icon}
      </div>
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs font-bold text-slate-500">{label}</p>
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
          <span className="text-xs font-bold text-slate-500">{time}</span>
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
            <p className="text-xs font-bold text-cyan-400">{game.category}</p>
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
          {game.status === "Available" ? "Play Game" : game.status}
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
  icon: React.ReactNode;
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
        <p className="mt-1 text-sm leading-6 text-slate-400">{text}</p>
      </div>
    </div>
  );
}

function EcosystemCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
        {icon}
      </div>

      <h3 className="mt-4 font-black">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
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