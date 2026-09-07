"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  FileCheck2,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  MessageCircle,
  Package,
  Plus,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Store,
  Upload,
  Users,
  Video,
  X,
} from "lucide-react";
import { ChangeEvent, ReactNode, useRef, useState } from "react";

type BusinessType = "shop" | "office";
type PostType = "sell" | "buy" | "job" | "update" | "event";
type Visibility = "public" | "network" | "private";

type MediaItem = {
  id: string;
  name: string;
  type: "image" | "video";
  url: string;
};

const products = [
  {
    id: 1,
    name: "Premium Electrical Cable",
    price: "৳1,250",
    stock: 24,
  },
  {
    id: 2,
    name: "LED Panel Light",
    price: "৳850",
    stock: 42,
  },
  {
    id: 3,
    name: "Digital Multimeter",
    price: "৳1,650",
    stock: 12,
  },
  {
    id: 4,
    name: "Safety Helmet",
    price: "৳550",
    stock: 65,
  },
];

const services = [
  "Electrical Installation",
  "Building Maintenance",
  "Technical Consultancy",
  "Supply & Procurement",
];

const complianceDocuments = [
  {
    key: "tradeLicense",
    title: "Trade License",
    icon: FileCheck2,
  },
  {
    key: "tin",
    title: "TIN Certificate",
    icon: FileText,
  },
  {
    key: "tax",
    title: "Tax Information",
    icon: FileText,
  },
  {
    key: "bin",
    title: "BIN / VAT",
    icon: FileText,
  },
  {
    key: "registration",
    title: "Business Registration",
    icon: Building2,
  },
  {
    key: "other",
    title: "Other License",
    icon: FileText,
  },
];

export default function EmartShowroomPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  /*
   * IMPORTANT:
   * Production database should provide business_type.
   *
   * business_type:
   *   "shop"   = Digital Shop / eMart
   *   "office" = Corporate Office / Company Website
   *
   * This fallback is only for the current UI/demo.
   */
  const [businessType] = useState<BusinessType>(
    slug.toLowerCase().includes("office") ||
      slug.toLowerCase().includes("company")
      ? "office"
      : "shop"
  );

  const isShop = businessType === "shop";

  const [activeSection, setActiveSection] = useState("home");
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [postType, setPostType] = useState<PostType>("sell");
  const [visibility, setVisibility] =
    useState<Visibility>("public");

  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);

  const [documents, setDocuments] = useState<
    Record<string, boolean>
  >({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const business = isShop
    ? {
        name: "Rahman Electronics",
        subtitle: "Digital Shop & eMart",
        description:
          "Electrical, electronics, tools and professional supplies — all in one trusted digital showroom.",
      }
    : {
        name: "Rahman Engineering & Construction",
        subtitle: "Corporate Business Office",
        description:
          "Construction, engineering, maintenance, supply and consultancy services.",
      };

  const navigation = isShop
    ? [
        ["home", "Home", Store],
        ["products", "Products", Package],
        ["categories", "Categories", ShoppingBag],
        ["orders", "Orders", ShoppingCart],
        ["contact", "Contact", MessageCircle],
      ]
    : [
        ["home", "Home", Building2],
        ["about", "About Company", FileText],
        ["services", "Services", BriefcaseBusiness],
        ["projects", "Projects", Package],
        ["jobs", "Jobs", Users],
        ["contact", "Contact", MessageCircle],
      ];

  const dashboardItems = isShop
    ? [
        "Overview",
        "Products",
        "Inventory",
        "Orders",
        "Posts",
        "Customers",
        "Chat",
        "Settings",
      ]
    : [
        "Overview",
        "Services",
        "Projects",
        "Jobs",
        "Posts",
        "Business Contacts",
        "Chat",
        "Settings",
      ];

  function handleMediaUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files || []);

    const selectedMedia: MediaItem[] = files
      .filter(
        (file) =>
          file.type.startsWith("image/") ||
          file.type.startsWith("video/")
      )
      .map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        name: file.name,
        type: file.type.startsWith("video/")
          ? "video"
          : "image",
        url: URL.createObjectURL(file),
      }));

    setMedia((current) => [
      ...current,
      ...selectedMedia,
    ]);

    event.target.value = "";
  }

  function removeMedia(id: string) {
    setMedia((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  function publishPost() {
    if (
      visibility !== "private" &&
      !caption.trim() &&
      media.length === 0
    ) {
      alert("পোস্টে লেখা অথবা ছবি/ভিডিও দিন।");
      return;
    }

    /*
     * BACKEND CONNECTION POINT
     *
     * এখানে production version-এ:
     *
     * 1. Post database-এ save হবে
     * 2. Media Supabase Storage-এ upload হবে
     * 3. Post/media relationship save হবে
     * 4. Visibility save হবে
     * 5. Smart Distribution চালু হবে
     */

    setPostOpen(false);
    setCaption("");
    setMedia([]);

    alert(
      visibility === "private"
        ? "Only Me পোস্ট হিসেবে সংরক্ষণ করা হয়েছে।"
        : "পোস্ট তৈরি হয়েছে। Smart Distribution প্রস্তুত।"
    );
  }

  function handleDocumentSelect(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files || []);

    if (files.length > 0) {
      alert(
        `${files.length}টি document নির্বাচন করা হয়েছে। Production version-এ এগুলো private storage-এ upload হবে।`
      );
    }

    event.target.value = "";
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">

          <div className="flex min-w-0 items-center gap-3">

            <Link
              href="/"
              className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
              {isShop ? (
                <Store className="h-5 w-5" />
              ) : (
                <Building2 className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <h1 className="truncate font-bold">
                  {business.name}
                </h1>

                <BadgeCheck className="h-4 w-4 shrink-0 text-blue-600" />

              </div>

              <p className="truncate text-xs text-slate-500">
                {business.subtitle}
              </p>

            </div>

          </div>

          <div className="hidden items-center gap-2 md:flex">

            <Link
              href={`/chat?business=${encodeURIComponent(slug)}`}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              <MessageCircle className="h-4 w-4" />
              Chat
            </Link>

            <button
              onClick={() => setPostOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Create Post
            </button>

            <button
              onClick={() => setDashboardOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              <LayoutDashboard className="h-4 w-4" />
              Owner Dashboard
            </button>

          </div>

        </div>

        {/* NAVIGATION */}

        <div className="overflow-x-auto border-t border-slate-100">

          <nav className="mx-auto flex max-w-7xl min-w-max gap-1 px-4 lg:px-6">

            {navigation.map(
              ([id, label, Icon]) => (
                <button
                  key={String(id)}
                  onClick={() =>
                    setActiveSection(String(id))
                  }
                  className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold ${
                    activeSection === id
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              )
            )}

          </nav>

        </div>

      </header>

      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden bg-slate-900 text-white">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,.25),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">

          <div className="max-w-3xl">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold">

              <BadgeCheck className="h-4 w-4 text-emerald-400" />

              Verified Business

            </div>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              {business.name}
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              {business.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              {isShop ? (
                <>
                  <button
                    onClick={() =>
                      setActiveSection("products")
                    }
                    className="rounded-2xl bg-white px-5 py-3 font-bold text-slate-900 hover:bg-slate-100"
                  >
                    Browse Products
                  </button>

                  <Link
                    href="/marketplace/buy-requests"
                    className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 font-bold hover:bg-white/15"
                  >
                    Buy Requests
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() =>
                      setActiveSection("services")
                    }
                    className="rounded-2xl bg-white px-5 py-3 font-bold text-slate-900 hover:bg-slate-100"
                  >
                    Our Services
                  </button>

                  <button
                    onClick={() =>
                      setActiveSection("jobs")
                    }
                    className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 font-bold hover:bg-white/15"
                  >
                    Company Jobs
                  </button>
                </>
              )}

              <button
                onClick={() => setChatOpen(true)}
                className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 font-bold hover:bg-white/15"
              >
                <MessageCircle className="h-4 w-4" />
                Chat with Business
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* ================= MAIN CONTENT ================= */}

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">

        {isShop ? (
          <>
            <SectionTitle
              title="Products"
              subtitle="Your digital eMart product showroom."
              icon={<Package className="h-5 w-5" />}
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {products.map((product) => (

                <article
                  key={product.id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >

                  <div className="flex aspect-square items-center justify-center bg-slate-100">
                    <Package className="h-14 w-14 text-slate-300" />
                  </div>

                  <div className="p-5">

                    <h3 className="font-bold">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-lg font-black">
                      {product.price}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Stock: {product.stock}
                    </p>

                    <button
                      onClick={() => setChatOpen(true)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Ask / Order
                    </button>

                  </div>

                </article>

              ))}

            </div>

            <div className="mt-14">

              <SectionTitle
                title="Categories"
                subtitle="Organize products into your own showroom categories."
                icon={<ShoppingBag className="h-5 w-5" />}
              />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {[
                  "Electrical",
                  "Electronics",
                  "Tools",
                  "Safety",
                ].map((category) => (

                  <button
                    key={category}
                    className="rounded-2xl border border-slate-200 bg-white p-5 text-left font-bold shadow-sm hover:border-slate-400"
                  >
                    {category}

                    <ChevronRight className="float-right h-5 w-5 text-slate-400" />
                  </button>

                ))}

              </div>

            </div>

          </>
        ) : (
          <>
            <SectionTitle
              title="Our Services"
              subtitle="Corporate service catalogue."
              icon={<BriefcaseBusiness className="h-5 w-5" />}
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {services.map((service) => (

                <article
                  key={service}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >

                  <BriefcaseBusiness className="h-7 w-7" />

                  <h3 className="mt-5 font-bold">
                    {service}
                  </h3>

                  <button
                    onClick={() => setChatOpen(true)}
                    className="mt-5 flex items-center gap-2 text-sm font-bold"
                  >
                    Discuss Service
                    <ChevronRight className="h-4 w-4" />
                  </button>

                </article>

              ))}

            </div>

            <div className="mt-14 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

              <SectionTitle
                title="About Company"
                subtitle="Company profile, projects, team and business information."
                icon={<Building2 className="h-5 w-5" />}
              />

              <p className="max-w-3xl leading-8 text-slate-600">
                This Office showroom works like a corporate
                website. Customers, workers and business
                contacts can discover the company, services,
                projects and jobs.
              </p>

            </div>

          </>
        )}

        {/* ================= POST CTA ================= */}

        <div className="mt-14 rounded-3xl bg-slate-900 p-7 text-white lg:p-9">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>

              <h3 className="text-2xl font-black">
                Publish from your business
              </h3>

              <p className="mt-2 text-slate-300">
                Image, video, sell, buy request, job or
                business update — one smart post engine.
              </p>

            </div>

            <button
              onClick={() => setPostOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-slate-900"
            >
              <Plus className="h-4 w-4" />
              Create Post
            </button>

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="mt-10 bg-slate-950 px-4 py-12 text-slate-300">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-8 md:flex-row">

            <div>

              <div className="flex items-center gap-3 text-white">

                {isShop ? (
                  <Store />
                ) : (
                  <Building2 />
                )}

                <span className="text-xl font-black">
                  {business.name}
                </span>

              </div>

              <p className="mt-3 max-w-xl text-sm leading-6">
                {business.subtitle} powered by
                Shromobazar.
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <Link
                href={`/chat?business=${encodeURIComponent(slug)}`}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/5"
              >
                Business Chat
              </Link>

              <Link
                href="/notifications"
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/5"
              >
                Notifications
              </Link>

              <Link
                href="/social"
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/5"
              >
                Social Hub
              </Link>

            </div>

          </div>

          <div className="mt-10 border-t border-white/10 pt-5 text-xs text-slate-500">
            © {new Date().getFullYear()} {business.name}.
            All rights reserved.
          </div>

        </div>

      </footer>

      {/* ================= MOBILE BUTTONS ================= */}

      <div className="fixed bottom-4 left-4 right-4 z-30 flex gap-2 md:hidden">

        <button
          onClick={() => setChatOpen(true)}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 font-bold shadow-xl ring-1 ring-slate-200"
        >
          <MessageCircle className="h-5 w-5" />
          Chat
        </button>

        <button
          onClick={() => setPostOpen(true)}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-bold text-white shadow-xl"
        >
          <Plus className="h-5 w-5" />
          Post
        </button>

        <button
          onClick={() => setDashboardOpen(true)}
          className="rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-slate-200"
        >
          <LayoutDashboard className="h-5 w-5" />
        </button>

      </div>

      {/* ================= CREATE POST ================= */}

      {postOpen && (
        <Modal
          title="Create Business Post"
          onClose={() => setPostOpen(false)}
        >

          <div className="space-y-5">

            {/* POST TYPE */}

            <div>

              <label className="mb-2 block text-sm font-bold">
                Post Type
              </label>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">

                {(
                  [
                    ["sell", "Sell"],
                    ["buy", "Buy Request"],
                    ["job", "Job"],
                    ["update", "Update"],
                    ["event", "Event"],
                  ] as [PostType, string][]
                ).map(([value, label]) => (

                  <button
                    key={value}
                    onClick={() => setPostType(value)}
                    className={`rounded-xl border px-3 py-2 text-xs font-bold ${
                      postType === value
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    {label}
                  </button>

                ))}

              </div>

            </div>

            {/* CAPTION */}

            <div>

              <label className="mb-2 block text-sm font-bold">
                Caption / Description
              </label>

              <textarea
                value={caption}
                onChange={(event) =>
                  setCaption(event.target.value)
                }
                rows={4}
                placeholder="আপনার পোস্টের বিস্তারিত লিখুন..."
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
              />

            </div>

            {/* ================= IMAGE VIDEO UPLOAD ================= */}

            <div>

              <label className="mb-2 block text-sm font-bold">
                Image / Video Upload
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleMediaUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-slate-500 hover:bg-slate-100"
              >

                <div className="flex gap-3">

                  <span className="rounded-xl bg-white p-3 shadow-sm">
                    <ImageIcon className="h-6 w-6" />
                  </span>

                  <span className="rounded-xl bg-white p-3 shadow-sm">
                    <Video className="h-6 w-6" />
                  </span>

                </div>

                <span className="mt-3 font-bold">
                  ছবি অথবা ভিডিও নির্বাচন করুন
                </span>

                <span className="mt-1 text-xs text-slate-500">
                  একসাথে একাধিক Image / Video যোগ করা যাবে
                </span>

              </button>

              {/* MEDIA PREVIEW */}

              {media.length > 0 && (

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">

                  {media.map((item) => (

                    <div
                      key={item.id}
                      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                    >

                      {item.type === "image" ? (
                        <img
                          src={item.url}
                          alt={item.name}
                          className="aspect-square w-full object-cover"
                        />
                      ) : (
                        <video
                          src={item.url}
                          controls
                          className="aspect-square w-full object-cover"
                        />
                      )}

                      <button
                        onClick={() =>
                          removeMedia(item.id)
                        }
                        className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 text-[10px] text-white">
                        {item.type === "image"
                          ? "IMAGE"
                          : "VIDEO"}
                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

            {/* VISIBILITY */}

            <div>

              <label className="mb-2 block text-sm font-bold">
                Visibility
              </label>

              <div className="grid gap-2 sm:grid-cols-3">

                {(
                  [
                    ["public", "Public"],
                    ["network", "Shromo Network"],
                    ["private", "Only Me"],
                  ] as [Visibility, string][]
                ).map(([value, label]) => (

                  <button
                    key={value}
                    onClick={() =>
                      setVisibility(value)
                    }
                    className={`rounded-xl border px-3 py-3 text-sm font-bold ${
                      visibility === value
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200"
                    }`}
                  >
                    {label}
                  </button>

                ))}

              </div>

              {visibility === "private" && (
                <p className="mt-2 text-xs font-semibold text-amber-700">
                  Only Me পোস্ট Social Hub,
                  Marketplace বা public showroom-এ
                  যাবে না।
                </p>
              )}

            </div>

            {/* SMART DISTRIBUTION */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

              <div className="flex items-center gap-2 font-bold">
                <Bell className="h-4 w-4" />
                Smart Distribution
              </div>

              <p className="mt-1 text-xs leading-5 text-slate-500">

                {visibility === "private"
                  ? "Private post — কোনো public distribution হবে না।"
                  : postType === "sell"
                  ? "Marketplace + Showroom + Social Hub + interested buyers"
                  : postType === "buy"
                  ? "Buy Requests + Social Hub + relevant sellers"
                  : postType === "job"
                  ? "Jobs + Social Hub + relevant workers"
                  : postType === "event"
                  ? "Event + Social Hub + relevant notifications"
                  : "Showroom + Social Hub + followers/customers"}

              </p>

            </div>

            <button
              onClick={publishPost}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 font-bold text-white hover:bg-slate-800"
            >
              <Upload className="h-4 w-4" />
              Publish Post
            </button>

          </div>

        </Modal>
      )}

      {/* ================= OWNER DASHBOARD ================= */}

      {dashboardOpen && (

        <Modal
          title={`${business.name} — Owner Dashboard`}
          onClose={() => setDashboardOpen(false)}
          wide
        >

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {dashboardItems.map((item) => (

              <button
                key={item}
                onClick={() => {

                  if (item === "Chat") {
                    setDashboardOpen(false);
                    setChatOpen(true);
                  }

                  if (item === "Settings") {
                    setSettingsOpen(true);
                  }

                }}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left font-bold hover:border-slate-400"
              >

                <span>{item}</span>

                <ChevronRight className="h-5 w-5 text-slate-400" />

              </button>

            ))}

          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <StatCard
              title={isShop ? "Products" : "Services"}
              value={isShop ? "24" : "12"}
            />

            <StatCard
              title={isShop ? "Orders" : "Projects"}
              value={isShop ? "86" : "18"}
            />

            <StatCard
              title="Messages"
              value="34"
            />

          </div>

          <button
            onClick={() => setSettingsOpen(true)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 font-bold"
          >
            <Settings className="h-4 w-4" />
            Business Settings & Verification
          </button>

        </Modal>

      )}

      {/* ================= SETTINGS ================= */}

      {settingsOpen && (

        <Modal
          title="Business Settings & Verification"
          onClose={() => setSettingsOpen(false)}
          wide
        >

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

            <div className="flex items-center gap-2 font-bold text-emerald-800">

              <BadgeCheck className="h-5 w-5" />

              Verified Business

            </div>

            <p className="mt-1 text-xs text-emerald-700">
              Public showroom-এ শুধু verification
              status/badge দেখানো হবে। Uploaded
              documents public করা হবে না।
            </p>

          </div>

          <div className="mt-6">

            <h3 className="font-black">
              Optional Business Documents
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              নতুন বা ছোট ব্যবসার জন্য এগুলো optional।
              Missing document-এর কারণে showroom
              বন্ধ হবে না।
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">

              {complianceDocuments.map(
                ({ key, title, icon: Icon }) => (

                  <label
                    key={key}
                    className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 hover:border-slate-400"
                  >

                    <div className="flex items-center gap-3">

                      <Icon className="h-5 w-5" />

                      <div>

                        <div className="font-bold">
                          {title}
                        </div>

                        <div className="text-xs text-slate-500">
                          Optional • Private document
                        </div>

                      </div>

                    </div>

                    <input
                      type="checkbox"
                      checked={Boolean(
                        documents[key]
                      )}
                      onChange={(event) =>
                        setDocuments((current) => ({
                          ...current,
                          [key]:
                            event.target.checked,
                        }))
                      }
                      className="h-5 w-5"
                    />

                  </label>

                )
              )}

            </div>

            {/* REAL DOCUMENT INPUT */}

            <input
              ref={documentInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              multiple
              onChange={handleDocumentSelect}
              className="hidden"
            />

            <div className="mt-5 rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center">

              <Upload className="mx-auto h-7 w-7 text-slate-400" />

              <p className="mt-2 font-bold">
                Upload selected documents
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Documents will remain private.
              </p>

              <button
                onClick={() =>
                  documentInputRef.current?.click()
                }
                className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white"
              >
                Select Documents
              </button>

            </div>

          </div>

        </Modal>

      )}

      {/* ================= CHAT ================= */}

      {chatOpen && (

        <div className="fixed inset-0 z-50 bg-black/40">

          <div className="absolute bottom-0 right-0 top-0 flex w-full max-w-md flex-col bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 p-4">

              <div>

                <h3 className="font-black">
                  Business Chat
                </h3>

                <p className="text-xs text-slate-500">
                  {business.name}
                </p>

              </div>

              <button
                onClick={() => setChatOpen(false)}
                className="rounded-xl p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">

              <div className="rounded-2xl rounded-tl-sm bg-white p-4 text-sm shadow-sm">
                Hello! How can we help you?
              </div>

              <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-slate-900 p-4 text-sm text-white">
                I want to know more about your{" "}
                {isShop ? "product" : "service"}.
              </div>

            </div>

            <div className="border-t border-slate-200 p-4">

              <Link
                href={`/chat?business=${encodeURIComponent(slug)}`}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-bold text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Open Full Chat
              </Link>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

/* ================= COMPONENTS ================= */

function SectionTitle({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start gap-3">

      <div className="rounded-xl bg-slate-900 p-2 text-white">
        {icon}
      </div>

      <div>

        <h2 className="text-2xl font-black">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {subtitle}
        </p>

      </div>

    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <p className="text-xs font-semibold text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-black">
        {value}
      </p>

    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">

      <div
        className={`max-h-[94vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl ${
          wide ? "max-w-4xl" : "max-w-2xl"
        }`}
      >

        <div className="mb-5 flex items-center justify-between gap-4">

          <h2 className="text-xl font-black">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {children}

      </div>

    </div>
  );
}