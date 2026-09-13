"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileText,
  Globe2,
  Landmark,
  MapPin,
  ShieldCheck,
} from "lucide-react";

type Tender = {
  id: string;
  detailId?: string;
  title?: string;
  invitationFor?: string;
  ministry?: string;
  agency?: string;
  organization?: string;
  district?: string;
  referenceNo?: string;
  procurementMethod?: string;
  fundingSource?: string;
  developmentPartner?: string;
  projectName?: string;
  packageNo?: string;
  packageName?: string;
  publicationDate?: string;
  lastSellingDate?: string;
  closingDate?: string;
  openingDate?: string;
  eligibility?: string;
  completionDate?: string;
  documentPrice?: string;
  description?: string;
  officialUrl?: string;
};

export default function TenderDetailsPage() {
  const [tender, setTender] = useState<Tender | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTender() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/tenders/${window.location.pathname.split("/").pop()}`, {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result?.success || !result?.data) {
          throw new Error(result?.error || "Tender notice পাওয়া যায়নি।");
        }

        setTender(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Tender notice load করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    loadTender();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-700" />
            <p className="mt-4 text-sm font-medium text-slate-600">
              Tender notice loading হচ্ছে...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !tender) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <FileText className="mx-auto h-10 w-10 text-red-500" />

            <h1 className="mt-4 text-xl font-bold text-slate-900">
              Tender notice পাওয়া যায়নি
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error || "এই notice-এর public information পাওয়া যাচ্ছে না।"}
            </p>

            <Link
              href="/tenders"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Tender Notice-এ ফিরে যান
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const officialUrl =
    tender.officialUrl ||
    (tender.detailId
      ? `https://www.bppa.gov.bd/advertisement-works/details-${tender.detailId}.html`
      : "https://www.eprocure.gov.bd/");

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/tenders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          সব Tender Notice
        </Link>

        {/* Header */}
        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5 sm:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm font-bold text-blue-700">
                  <FileText className="h-5 w-5" />
                  Tender Opportunity
                </div>

                <h1 className="mt-3 text-xl font-bold leading-8 text-slate-900 sm:text-2xl">
                  {tender.title || tender.packageName || "Tender Notice"}
                </h1>

                {tender.referenceNo && (
                  <p className="mt-3 text-sm text-slate-500">
                    Reference No:{" "}
                    <span className="font-semibold text-slate-700">
                      {tender.referenceNo}
                    </span>
                  </p>
                )}
              </div>

              {/* OFFICIAL E-GP BUTTON */}
              <a
                href="https://www.eprocure.gov.bd/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Globe2 className="h-4 w-4" />
                e-GP / Official
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick information */}
          <div className="grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              icon={<CalendarDays className="h-5 w-5" />}
              label="Publication"
              value={tender.publicationDate || "—"}
            />

            <InfoCard
              icon={<CalendarDays className="h-5 w-5" />}
              label="Closing Date"
              value={tender.closingDate || "—"}
            />

            <InfoCard
              icon={<MapPin className="h-5 w-5" />}
              label="District"
              value={tender.district || "—"}
            />

            <InfoCard
              icon={<Landmark className="h-5 w-5" />}
              label="Procurement"
              value={tender.procurementMethod || "—"}
            />
          </div>
        </section>

        {/* Notice source */}
        <section className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />

            <div>
              <h2 className="text-sm font-bold text-green-900">
                Official Source
              </h2>

              <p className="mt-1 text-sm leading-6 text-green-800">
                এই Tender-এর public information সরকারি BPPA source থেকে
                দেখানো হচ্ছে। Tender submission বা restricted e-GP action
                Shromobazar থেকে করা হয় না।
              </p>

              <a
                href={officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-green-700 hover:text-green-900"
              >
                BPPA Official Notice
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Main information */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <FileText className="h-5 w-5 text-blue-700" />
              Tender Information
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            <DetailRow
              label="Ministry / Division"
              value={tender.ministry}
            />

            <DetailRow
              label="Agency"
              value={tender.agency}
            />

            <DetailRow
              label="Procuring Entity"
              value={tender.organization}
            />

            <DetailRow
              label="District"
              value={tender.district}
            />

            <DetailRow
              label="Invitation For"
              value={tender.invitationFor}
            />

            <DetailRow
              label="Reference No."
              value={tender.referenceNo}
            />

            <DetailRow
              label="Procurement Method"
              value={tender.procurementMethod}
            />

            <DetailRow
              label="Funding Source"
              value={tender.fundingSource}
            />

            <DetailRow
              label="Development Partner"
              value={tender.developmentPartner}
            />

            <DetailRow
              label="Project / Programme"
              value={tender.projectName}
            />

            <DetailRow
              label="Tender Package No."
              value={tender.packageNo}
            />

            <DetailRow
              label="Tender Package Name"
              value={tender.packageName}
            />

            <DetailRow
              label="Publication Date"
              value={tender.publicationDate}
            />

            <DetailRow
              label="Last Selling Date"
              value={tender.lastSellingDate}
            />

            <DetailRow
              label="Closing Date & Time"
              value={tender.closingDate}
            />

            <DetailRow
              label="Opening Date & Time"
              value={tender.openingDate}
            />

            <DetailRow
              label="Completion Time"
              value={tender.completionDate}
            />

            <DetailRow
              label="Tender Document Price"
              value={tender.documentPrice}
            />
          </div>
        </section>

        {/* Eligibility */}
        {tender.eligibility && (
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Eligibility of Tenderer
              </h2>
            </div>

            <div className="whitespace-pre-line p-5 text-sm leading-7 text-slate-700">
              {tender.eligibility}
            </div>
          </section>
        )}

        {/* Description */}
        {tender.description && (
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-bold text-slate-900">
                Brief Description
              </h2>
            </div>

            <div className="whitespace-pre-line p-5 text-sm leading-7 text-slate-700">
              {tender.description}
            </div>
          </section>
        )}

        {/* Bottom action */}
        <section className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-slate-900">
              Tender করতে official portal ব্যবহার করুন
            </p>
            <p className="mt-1 text-sm text-slate-500">
              e-GP registration/login এবং tender submission সরকারি portal-এ
              সম্পন্ন হবে।
            </p>
          </div>

          <a
            href="https://www.eprocure.gov.bd/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-700"
          >
            <Globe2 className="h-4 w-4" />
            e-GP / Official
            <ExternalLink className="h-4 w-4" />
          </a>
        </section>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white p-4">
      <div className="flex items-center gap-2 text-blue-700">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
        {value}
      </p>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  if (!value) return null;

  return (
    <div className="grid gap-2 px-5 py-4 sm:grid-cols-[220px_1fr] sm:gap-6">
      <div className="text-sm font-bold text-slate-500">
        {label}
      </div>

      <div className="whitespace-pre-line text-sm leading-6 text-slate-800">
        {value}
      </div>
    </div>
  );
}