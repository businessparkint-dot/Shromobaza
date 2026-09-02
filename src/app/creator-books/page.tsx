"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Download,
  Globe2,
  Heart,
  Library,
  MessageCircle,
  Search,
  Sparkles,
  Star,
  User,
  Users,
  X,
} from "lucide-react";

type Book = {
  id: number;
  title: string;
  author: string;
  category: string;
  description: string;
  rating: number;
  readers: string;
  pages: number;
  emoji: string;
  featured?: boolean;
};

type Creator = {
  id: number;
  name: string;
  role: string;
  bio: string;
  books: number;
  followers: string;
  emoji: string;
};

const categories = [
  "সব",
  "দক্ষতা",
  "ব্যবসা",
  "প্রযুক্তি",
  "ক্যারিয়ার",
  "ইতিহাস",
  "জীবন ও সমাজ",
];

const books: Book[] = [
  {
    id: 1,
    title: "ডিজিটাল যুগে ক্যারিয়ার গড়ার কৌশল",
    author: "Shromobazar Knowledge Team",
    category: "ক্যারিয়ার",
    description:
      "আধুনিক কর্মবাজারে নিজের দক্ষতা তৈরি, ব্যক্তিগত ব্র্যান্ড এবং ক্যারিয়ার পরিকল্পনা নিয়ে একটি ব্যবহারিক গাইড।",
    rating: 4.9,
    readers: "12.4K",
    pages: 186,
    emoji: "💼",
    featured: true,
  },
  {
    id: 2,
    title: "ছোট ব্যবসা থেকে বড় উদ্যোগ",
    author: "Business Park Research",
    category: "ব্যবসা",
    description:
      "ছোট পরিসরে ব্যবসা শুরু করা থেকে পরিকল্পনা, মার্কেটিং, কাস্টমার এবং দীর্ঘমেয়াদি প্রবৃদ্ধির ধারণা।",
    rating: 4.8,
    readers: "9.8K",
    pages: 214,
    emoji: "📈",
    featured: true,
  },
  {
    id: 3,
    title: "বাংলার ইতিহাস ও সভ্যতা",
    author: "Civilization Research",
    category: "ইতিহাস",
    description:
      "বাংলার ইতিহাস, সংস্কৃতি, সমাজ এবং সভ্যতার বিকাশ সম্পর্কে সহজ ভাষায় একটি জ্ঞানভিত্তিক বই।",
    rating: 4.9,
    readers: "8.7K",
    pages: 242,
    emoji: "🏛️",
  },
  {
    id: 4,
    title: "কাজের বাজারে প্রয়োজনীয় দক্ষতা",
    author: "Workforce Academy",
    category: "দক্ষতা",
    description:
      "শ্রমিক, টেকনিশিয়ান ও পেশাজীবীদের জন্য বাস্তব কর্মক্ষেত্রে প্রয়োজনীয় soft skill এবং technical skill-এর ধারণা।",
    rating: 4.7,
    readers: "7.5K",
    pages: 168,
    emoji: "🛠️",
  },
  {
    id: 5,
    title: "প্রযুক্তি ও ভবিষ্যৎ কর্মজগৎ",
    author: "Future Tech Lab",
    category: "প্রযুক্তি",
    description:
      "AI, automation, digital platform এবং ভবিষ্যতের workforce সম্পর্কে সহজ ও বাস্তবধর্মী আলোচনা।",
    rating: 4.8,
    readers: "6.9K",
    pages: 198,
    emoji: "🤖",
  },
  {
    id: 6,
    title: "জীবন, সমাজ ও মানুষের গল্প",
    author: "Good Work World",
    category: "জীবন ও সমাজ",
    description:
      "মানুষ, সমাজ, মূল্যবোধ, সহযোগিতা এবং ভালো কাজের প্রভাব নিয়ে অনুপ্রেরণামূলক একটি সংকলন।",
    rating: 4.9,
    readers: "5.6K",
    pages: 154,
    emoji: "🌍",
  },
];

const creators: Creator[] = [
  {
    id: 1,
    name: "Shromobazar Knowledge Team",
    role: "Knowledge Publisher",
    bio: "দক্ষতা, কর্মসংস্থান ও আধুনিক workforce নিয়ে জ্ঞানভিত্তিক কনটেন্ট তৈরি করে।",
    books: 18,
    followers: "24K",
    emoji: "📚",
  },
  {
    id: 2,
    name: "Business Park Research",
    role: "Business Research",
    bio: "ব্যবসা, উদ্যোক্তা ও অর্থনৈতিক উন্নয়ন নিয়ে গবেষণা ও প্রকাশনা করে।",
    books: 12,
    followers: "18K",
    emoji: "💡",
  },
  {
    id: 3,
    name: "Future Tech Lab",
    role: "Technology Creator",
    bio: "প্রযুক্তি, AI এবং ভবিষ্যতের কর্মজগৎ নিয়ে সহজ ভাষায় জ্ঞান তৈরি করে।",
    books: 9,
    followers: "15K",
    emoji: "🚀",
  },
];

export default function CreatorBooksPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("সব");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [showCreatorForm, setShowCreatorForm] = useState(false);
  const [showShareForm, setShowShareForm] = useState(false);

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return books.filter((book) => {
      const matchesCategory =
        category === "সব" || book.category === category;

      const matchesSearch =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  const featuredBooks = books.filter((book) => book.featured);

  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.16),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300">
                <BookOpen className="h-4 w-4" />
                Creator & Books Library
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                জ্ঞান, বই ও{" "}
                <span className="text-emerald-400">Creator Economy</span>
                <br />
                একসাথে।
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                জ্ঞানভিত্তিক বই পড়ুন, লেখক ও creators আবিষ্কার করুন এবং নিজের
                জ্ঞান ও বই প্রকাশ করে একটি নতুন digital creator journey শুরু
                করুন।
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() =>
                    document
                      .getElementById("books")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 font-bold text-white transition hover:bg-emerald-400"
                >
                  <BookOpen className="h-5 w-5" />
                  বই দেখুন
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setShowCreatorForm(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
                >
                  <Sparkles className="h-5 w-5 text-emerald-400" />
                  Creator হিসেবে যোগ দিন
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15">
                  <Library className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="font-black">Knowledge Library</p>
                  <p className="text-sm text-slate-400">
                    Learn • Create • Publish
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <StatCard value="120+" label="বই" />
                <StatCard value="48+" label="Creators" />
                <StatCard value="35K+" label="Readers" />
                <StatCard value="18" label="Categories" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-3">
          <QuickLink
            icon={<BookOpen className="h-5 w-5" />}
            title="বই আবিষ্কার করুন"
            text="দক্ষতা ও জ্ঞান বাড়ানোর বই"
            onClick={() =>
              document
                .getElementById("books")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          />

          <QuickLink
            icon={<Users className="h-5 w-5" />}
            title="Creators"
            text="লেখক ও জ্ঞান নির্মাতাদের দেখুন"
            onClick={() =>
              document
                .getElementById("creators")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          />

          <QuickLink
            icon={<Sparkles className="h-5 w-5" />}
            title="Share Knowledge"
            text="নিজের জ্ঞান প্রকাশ করুন"
            onClick={() => setShowShareForm(true)}
          />
        </div>
      </section>

      {/* Books */}
      <section
        id="books"
        className="mx-auto max-w-7xl scroll-mt-20 px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
              Explore Library
            </p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              Featured & Popular Books
            </h2>
            <p className="mt-2 text-slate-400">
              আপনার প্রয়োজন অনুযায়ী বই খুঁজে নিন।
            </p>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="বই, লেখক বা বিষয় খুঁজুন..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.06] py-3.5 pl-12 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/50"
            />
          </div>
        </div>

        <div className="mb-7 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
                category === item
                  ? "bg-emerald-500 text-white"
                  : "border border-white/10 bg-white/[0.05] text-slate-300 hover:bg-white/10"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredBooks.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-slate-600" />
            <h3 className="mt-4 text-xl font-bold">কোনো বই পাওয়া যায়নি</h3>
            <p className="mt-2 text-slate-400">
              অন্য keyword বা category দিয়ে চেষ্টা করুন।
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                favorite={favorites.includes(book.id)}
                onFavorite={() => toggleFavorite(book.id)}
                onOpen={() => setSelectedBook(book)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-400/10 bg-gradient-to-br from-emerald-500/10 via-white/[0.03] to-blue-500/10 p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-emerald-400">
                EDITOR'S PICK
              </p>
              <h2 className="mt-1 text-2xl font-black">
                এই সপ্তাহের নির্বাচিত বই
              </h2>
            </div>

            <Sparkles className="h-7 w-7 text-emerald-400" />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {featuredBooks.map((book) => (
              <button
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className="group flex gap-5 rounded-2xl border border-white/10 bg-black/20 p-5 text-left transition hover:border-emerald-400/30 hover:bg-black/30"
              >
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-4xl">
                  {book.emoji}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-300">
                      {book.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Star className="h-3.5 w-3.5 fill-current text-yellow-400" />
                      {book.rating}
                    </span>
                  </div>

                  <h3 className="mt-2 text-lg font-black group-hover:text-emerald-300">
                    {book.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    {book.author}
                  </p>
                </div>

                <ChevronRight className="ml-auto mt-2 h-5 w-5 shrink-0 text-slate-600 group-hover:text-emerald-400" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Creators */}
      <section
        id="creators"
        className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mb-7">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
            Creator Network
          </p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">
            Knowledge Creators
          </h2>
          <p className="mt-2 text-slate-400">
            যারা জ্ঞান তৈরি করছেন, তাদের সঙ্গে যুক্ত হন।
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {creators.map((creator) => (
            <button
              key={creator.id}
              onClick={() => setSelectedCreator(creator)}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left transition hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.06]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-3xl">
                  {creator.emoji}
                </div>

                <div>
                  <h3 className="font-black group-hover:text-emerald-300">
                    {creator.name}
                  </h3>
                  <p className="text-sm text-emerald-400">{creator.role}</p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-400">
                {creator.bio}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <MiniStat value={String(creator.books)} label="Books" />
                <MiniStat value={creator.followers} label="Followers" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Creator Economy CTA */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 p-7 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15">
                  <Sparkles className="h-6 w-6 text-emerald-400" />
                </div>
                <p className="font-black text-emerald-300">
                  Creator Economy
                </p>
              </div>

              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                আপনার জ্ঞানকে একটি সম্পদে পরিণত করুন।
              </h2>

              <p className="mt-4 max-w-2xl leading-8 text-slate-300">
                বই লিখুন, knowledge content প্রকাশ করুন এবং ভবিষ্যতে
                Shromobazar-এর creator ecosystem-এর মাধ্যমে আপনার audience
                তৈরি করুন।
              </p>
            </div>

            <button
              onClick={() => setShowCreatorForm(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 font-bold transition hover:bg-emerald-400"
            >
              Apply as Creator
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Future Ecosystem */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div className="mb-7">
            <p className="text-sm font-bold text-emerald-400">
              FUTURE ECOSYSTEM
            </p>
            <h2 className="mt-2 text-2xl font-black">
              Creator & Books-এর ভবিষ্যৎ
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FutureCard
              icon={<BookOpen className="h-5 w-5" />}
              title="Digital Books"
              text="Digital reading & publishing"
            />
            <FutureCard
              icon={<Users className="h-5 w-5" />}
              title="Creator Profiles"
              text="Personal creator identity"
            />
            <FutureCard
              icon={<Globe2 className="h-5 w-5" />}
              title="Global Readers"
              text="Reach readers worldwide"
            />
            <FutureCard
              icon={<Download className="h-5 w-5" />}
              title="Premium Content"
              text="Future paid content system"
            />
          </div>
        </div>
      </section>

      {/* Book Modal */}
      {selectedBook && (
        <Modal onClose={() => setSelectedBook(null)}>
          <div className="flex items-start justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                {selectedBook.emoji}
              </div>

              <div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  {selectedBook.category}
                </span>
                <h2 className="mt-2 text-2xl font-black">
                  {selectedBook.title}
                </h2>
              </div>
            </div>

            <button
              onClick={() => setSelectedBook(null)}
              className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-6 leading-8 text-slate-300">
            {selectedBook.description}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <ModalStat
              icon={<Star className="h-4 w-4" />}
              value={selectedBook.rating.toString()}
              label="Rating"
            />
            <ModalStat
              icon={<Users className="h-4 w-4" />}
              value={selectedBook.readers}
              label="Readers"
            />
            <ModalStat
              icon={<BookOpen className="h-4 w-4" />}
              value={String(selectedBook.pages)}
              label="Pages"
            />
            <ModalStat
              icon={<Clock className="h-4 w-4" />}
              value="6h"
              label="Reading"
            />
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() =>
                window.alert(
                  "Reading experience will be connected with the central library in the next phase."
                )
              }
              className="flex-1 rounded-xl bg-emerald-500 px-5 py-3.5 font-bold hover:bg-emerald-400"
            >
              Read Preview
            </button>

            <button
              onClick={() =>
                window.alert(
                  "Download feature will be connected after the digital library backend is ready."
                )
              }
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 font-bold hover:bg-white/10"
            >
              <Download className="mr-2 inline-block h-4 w-4" />
              Download
            </button>
          </div>
        </Modal>
      )}

      {/* Creator Modal */}
      {selectedCreator && (
        <Modal onClose={() => setSelectedCreator(null)}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-3xl">
                {selectedCreator.emoji}
              </div>

              <div>
                <h2 className="text-2xl font-black">
                  {selectedCreator.name}
                </h2>
                <p className="text-emerald-400">{selectedCreator.role}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedCreator(null)}
              className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-6 leading-8 text-slate-300">
            {selectedCreator.bio}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <MiniStat value={String(selectedCreator.books)} label="Books" />
            <MiniStat
              value={selectedCreator.followers}
              label="Followers"
            />
          </div>

          <button
            onClick={() =>
              window.alert(
                "Creator profile connection will be linked with the central social and chat system."
              )
            }
            className="mt-7 w-full rounded-xl bg-emerald-500 px-5 py-3.5 font-bold hover:bg-emerald-400"
          >
            <MessageCircle className="mr-2 inline-block h-4 w-4" />
            Connect with Creator
          </button>
        </Modal>
      )}

      {/* Creator Application Modal */}
      {showCreatorForm && (
        <Modal onClose={() => setShowCreatorForm(false)}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-emerald-400">
                CREATOR APPLICATION
              </p>
              <h2 className="mt-1 text-2xl font-black">
                Creator হিসেবে যোগ দিন
              </h2>
            </div>

            <button
              onClick={() => setShowCreatorForm(false)}
              className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <Input label="আপনার নাম" placeholder="পূর্ণ নাম লিখুন" />
            <Input
              label="আপনার profession / expertise"
              placeholder="যেমন: Writer, Engineer, Teacher"
            />
            <Input
              label="আপনার content সম্পর্কে"
              placeholder="আপনি কী ধরনের জ্ঞান বা বই প্রকাশ করতে চান?"
            />
          </div>

          <button
            onClick={() => {
              setShowCreatorForm(false);
              window.alert(
                "Creator application UI ready. Central creator database integration will be added in the backend phase."
              );
            }}
            className="mt-6 w-full rounded-xl bg-emerald-500 px-5 py-3.5 font-bold hover:bg-emerald-400"
          >
            <Check className="mr-2 inline-block h-4 w-4" />
            Submit Application
          </button>
        </Modal>
      )}

      {/* Share Knowledge Modal */}
      {showShareForm && (
        <Modal onClose={() => setShowShareForm(false)}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-emerald-400">
                SHARE KNOWLEDGE
              </p>
              <h2 className="mt-1 text-2xl font-black">
                আপনার জ্ঞান শেয়ার করুন
              </h2>
            </div>

            <button
              onClick={() => setShowShareForm(false)}
              className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <Input label="Title" placeholder="আপনার knowledge-এর title" />

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-300">
                Content
              </span>
              <textarea
                rows={5}
                placeholder="আপনার জ্ঞান বা অভিজ্ঞতা লিখুন..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
              />
            </label>
          </div>

          <button
            onClick={() => {
              setShowShareForm(false);
              window.alert(
                "Knowledge submission UI ready. Publishing workflow will be connected with the central Knowledge + Creator system."
              );
            }}
            className="mt-6 w-full rounded-xl bg-emerald-500 px-5 py-3.5 font-bold hover:bg-emerald-400"
          >
            Publish Knowledge
          </button>
        </Modal>
      )}
    </main>
  );
}

function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </div>
  );
}

function MiniStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
      <p className="font-black text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}

function QuickLink({
  icon,
  title,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-emerald-400/30 hover:bg-white/[0.07]"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="font-bold">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{text}</p>
      </div>

      <ChevronRight className="ml-auto h-5 w-5 text-slate-600" />
    </button>
  );
}

function BookCard({
  book,
  favorite,
  onFavorite,
  onOpen,
}: {
  book: Book;
  favorite: boolean;
  onFavorite: () => void;
  onOpen: () => void;
}) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.06]">
      <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-emerald-500/10 to-blue-500/10">
        <div className="text-7xl transition duration-300 group-hover:scale-110">
          {book.emoji}
        </div>

        <button
          onClick={onFavorite}
          aria-label="Favorite"
          className="absolute right-4 top-4 rounded-xl border border-white/10 bg-black/20 p-2.5 backdrop-blur hover:bg-black/40"
        >
          <Heart
            className={`h-5 w-5 ${
              favorite
                ? "fill-current text-rose-400"
                : "text-slate-300"
            }`}
          />
        </button>

        {book.featured && (
          <span className="absolute left-4 top-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-black">
            Featured
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
            {book.category}
          </span>

          <span className="flex items-center gap-1 text-sm text-slate-400">
            <Star className="h-4 w-4 fill-current text-yellow-400" />
            {book.rating}
          </span>
        </div>

        <h3 className="mt-4 line-clamp-2 text-xl font-black">
          {book.title}
        </h3>

        <p className="mt-2 text-sm font-medium text-emerald-400">
          {book.author}
        </p>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">
          {book.description}
        </p>

        <div className="mt-5 flex items-center gap-4 text-xs text-slate-500">
          <span>{book.readers} readers</span>
          <span>•</span>
          <span>{book.pages} pages</span>
        </div>

        <button
          onClick={onOpen}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-bold transition hover:bg-emerald-500 hover:text-white"
        >
          View Book
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

function FutureCard({
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
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
        {icon}
      </div>
      <h3 className="mt-4 font-black">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </div>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl sm:p-8">
        {children}
      </div>
    </div>
  );
}

function ModalStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
      <div className="flex items-center gap-2 text-emerald-400">
        {icon}
        <span className="font-black">{value}</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}

function Input({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-300">
        {label}
      </span>
      <input
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
      />
    </label>
  );
}