"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  CreditCard,
  History,
  LockKeyhole,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Wallet,
  Zap,
} from "lucide-react";

const paymentServices = [
  {
    title: "Wallet",
    description: "আপনার balance ও financial activity পরিচালনা করুন।",
    href: "/wallet",
    icon: Wallet,
    badge: "Available",
  },
  {
    title: "Subscriptions",
    description:
      "Shop, Office, Business ও premium services-এর subscription payment।",
    href: "/subscription",
    icon: RefreshCw,
    badge: "Coming Soon",
  },
  {
    title: "Marketplace",
    description:
      "Marketplace deal-এর payment flow ভবিষ্যতে এখান থেকে connect হবে।",
    href: "/marketplace",
    icon: ShoppingBag,
    badge: "Planned",
  },
  {
    title: "Jobs & Hire",
    description:
      "Workforce deal ও hiring payment-এর financial layer।",
    href: "/jobs",
    icon: BriefcaseBusiness,
    badge: "Planned",
  },
];

const paymentMethods = [
  {
    title: "Shromobazar Wallet",
    description: "আপনার internal wallet balance",
    icon: Wallet,
  },
  {
    title: "Payment Gateway",
    description: "Gateway integration পরে যুক্ত হবে",
    icon: CreditCard,
  },
  {
    title: "Subscription",
    description: "Recurring platform services",
    icon: RefreshCw,
  },
];

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[72px] sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-xs font-black text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
              <CreditCard className="h-5 w-5" />
            </div>

            <div className="leading-none">
              <p className="text-sm font-black text-[#07152d]">
                Payment Center
              </p>

              <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Shromobazar
              </p>
            </div>
          </div>

          <Link
            href="/wallet"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-[10px] font-black text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500"
          >
            <Wallet className="h-3.5 w-3.5" />
            Wallet
          </Link>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}
      <section className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
        {/* =====================================================
            HERO
        ====================================================== */}
        <div className="overflow-hidden rounded-[2rem] bg-[#07152d] p-6 text-white shadow-xl sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-green-400" />

                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-300">
                  Secure Payment Center
                </span>
              </div>

              <h1 className="mt-5 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Shromobazar Payment
                <span className="text-orange-400"> Center</span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Wallet, subscription, marketplace এবং workforce
                transactions-এর payment system এক জায়গা থেকে
                পরিচালনা করার জন্য এই কেন্দ্রটি তৈরি করা হয়েছে।
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/wallet"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-orange-500 px-5 text-xs font-black text-white transition hover:bg-orange-400"
                >
                  <Wallet className="h-4 w-4" />
                  Open Wallet
                </Link>

                <Link
                  href="/marketplace"
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 text-xs font-black text-white transition hover:bg-white/10"
                >
                  Marketplace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative flex h-48 w-48 items-center justify-center rounded-[2.5rem] border border-white/10 bg-white/5 shadow-2xl sm:h-56 sm:w-56">
                <div className="absolute inset-5 rounded-[2rem] border border-white/5" />

                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500 shadow-xl">
                  <CreditCard className="h-10 w-10 text-white" />
                </div>

                <div className="absolute bottom-6 left-6 flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5">
                  <LockKeyhole className="h-3 w-3 text-green-400" />

                  <span className="text-[8px] font-black uppercase tracking-wider text-slate-300">
                    Secure Layer
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            STATUS
        ====================================================== */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatusCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Secure Architecture"
            text="Payment data flow নিরাপদভাবে layer করা হবে।"
          />

          <StatusCard
            icon={<Wallet className="h-5 w-5" />}
            title="Wallet Connected"
            text="Wallet financial layer হিসেবে প্রস্তুত।"
          />

          <StatusCard
            icon={<Zap className="h-5 w-5" />}
            title="Gateway Ready"
            text="Real gateway পরে safely integrate করা যাবে।"
          />
        </div>

        {/* =====================================================
            PAYMENT SERVICES
        ====================================================== */}
        <div className="mt-8">
          <div className="mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
              Payment Ecosystem
            </p>

            <h2 className="mt-2 text-xl font-black text-[#07152d] sm:text-2xl">
              Payment Services
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Shromobazar-এর বিভিন্ন financial service এখান থেকে
              connect হবে।
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {paymentServices.map((service) => {
              const Icon = service.icon;

              return (
                <Link
                  key={service.title}
                  href={service.href}
                  className="group rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 transition group-hover:bg-orange-500 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <span
                      className={`rounded-lg px-2 py-1 text-[8px] font-black uppercase tracking-wider ${
                        service.badge === "Available"
                          ? "bg-green-50 text-green-600"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="mt-4 text-sm font-black text-[#07152d]">
                    {service.title}
                  </h3>

                  <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">
                    {service.description}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-black text-orange-500">
                    Open
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* =====================================================
            PAYMENT METHODS
        ====================================================== */}
        <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <CreditCard className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-black text-[#07152d]">
                  Payment Methods
                </h2>

                <p className="mt-1 text-[10px] text-slate-400">
                  Available and planned payment channels
                </p>
              </div>
            </div>
          </div>

          <div className="grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {paymentMethods.map((method) => {
              const Icon = method.icon;

              return (
                <div
                  key={method.title}
                  className="p-5 sm:p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 text-xs font-black text-[#07152d]">
                    {method.title}
                  </h3>

                  <p className="mt-1 text-[10px] leading-5 text-slate-400">
                    {method.description}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />

                    <span className="text-[9px] font-black text-slate-500">
                      Architecture Ready
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================================
            TRANSACTION FLOW
        ====================================================== */}
        <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <ReceiptText className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-black text-[#07152d]">
                Shromobazar Transaction Flow
              </h2>

              <p className="mt-1 text-[10px] leading-5 text-slate-400">
                Future marketplace/workforce financial architecture
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-5">
            <FlowStep
              number="01"
              title="Deal"
              text="Buyer & Seller / Employer & Worker"
            />

            <FlowArrow />

            <FlowStep
              number="02"
              title="Chat"
              text="Deal details & communication"
            />

            <FlowArrow />

            <FlowStep
              number="03"
              title="Payment"
              text="Wallet / Gateway"
            />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-5">
            <FlowStep
              number="04"
              title="Invoice"
              text="Digital transaction record"
            />

            <FlowArrow />

            <FlowStep
              number="05"
              title="Complete"
              text="Completion & review"
            />

            <div className="hidden sm:block" />

            <div className="hidden sm:block" />
          </div>
        </div>

        {/* =====================================================
            SUBSCRIPTION
        ====================================================== */}
        <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-orange-100 bg-orange-50 p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-orange-500 shadow-sm">
                <RefreshCw className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-orange-500">
                  Future Revenue Layer
                </p>

                <h2 className="mt-1 text-base font-black text-[#07152d]">
                  Subscription Payments
                </h2>

                <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-600">
                  Shromobazar-এর business model commission-based নয়।
                  Shop, Office, Business এবং premium visibility-এর
                  জন্য subscription-based payment system ভবিষ্যতে
                  এই Payment Center-এর সাথে যুক্ত হবে।
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-orange-100 bg-white px-4 py-3">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                Model
              </p>

              <p className="mt-1 text-xs font-black text-[#07152d]">
                Subscription + Premium Services
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            SECURITY
        ====================================================== */}
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <LockKeyhole className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-black text-[#07152d]">
                  Financial Safety
                </h3>

                <p className="mt-1 text-[10px] text-slate-400">
                  Safe transaction architecture
                </p>
              </div>
            </div>

            <ul className="mt-4 space-y-2.5">
              <SafetyItem text="Payment success কখনো UI দিয়ে fake করা হবে না।" />
              <SafetyItem text="Real gateway response-এর ভিত্তিতে transaction complete হবে।" />
              <SafetyItem text="Wallet balance সরাসরি client-side পরিবর্তন করা হবে না।" />
              <SafetyItem text="Invoice ও transaction record আলাদা financial trail হিসেবে রাখা যাবে।" />
            </ul>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <History className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-black text-[#07152d]">
                  Payment Records
                </h3>

                <p className="mt-1 text-[10px] text-slate-400">
                  Future financial documentation
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <RecordItem
                title="Transaction"
                text="Payment activity"
              />

              <RecordItem
                title="Invoice"
                text="Deal document"
              />

              <RecordItem
                title="Reference"
                text="Transaction identity"
              />

              <RecordItem
                title="Status"
                text="Payment state"
              />
            </div>
          </div>
        </div>

        {/* =====================================================
            COMMISSION POLICY
        ====================================================== */}
        <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-[#07152d] p-5 text-white sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-orange-400">
              <Wallet className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-sm font-black">
                Commission-Free Business Model
              </h2>

              <p className="mt-2 text-xs leading-5 text-slate-300">
                Shromobazar marketplace বা workforce transaction-এর
                উপর commission নেওয়ার পরিকল্পনা নেই। Platform-এর
                revenue subscription, premium visibility এবং
                value-added services-এর মাধ্যমে তৈরি হবে।
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}
        <div className="py-8 text-center">
          <p className="text-[10px] font-bold text-slate-400">
            Shromobazar Payment Center • Secure Financial Layer
          </p>
        </div>
      </section>
    </main>
  );
}

function StatusCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
        {icon}
      </div>

      <h3 className="mt-3 text-sm font-black text-[#07152d]">
        {title}
      </h3>

      <p className="mt-1 text-[11px] leading-5 text-slate-400">
        {text}
      </p>
    </div>
  );
}

function FlowStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <span className="text-[9px] font-black text-orange-500">
        {number}
      </span>

      <h3 className="mt-2 text-xs font-black text-[#07152d]">
        {title}
      </h3>

      <p className="mt-1 text-[9px] leading-4 text-slate-400">
        {text}
      </p>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="hidden items-center justify-center sm:flex">
      <ArrowRight className="h-4 w-4 text-slate-300" />
    </div>
  );
}

function SafetyItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-[10px] leading-5 text-slate-500">
      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
      <span>{text}</span>
    </li>
  );
}

function RecordItem({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[10px] font-black text-[#07152d]">
        {title}
      </p>

      <p className="mt-1 text-[9px] text-slate-400">
        {text}
      </p>
    </div>
  );
}
