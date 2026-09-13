import { NextRequest, NextResponse } from "next/server";

const BPPA_BASE = "https://www.bppa.gov.bd";
const WORKS_URL =
  `${BPPA_BASE}/advertisement-notices/advertisement-works.html`;

type Tender = {
  id: string;
  detailId: string;
  title: string;
  organization: string;
  category: string;
  location: string;
  publishedDate: string;
  deadline: string;
  officialUrl: string;
};

function cleanText(value: string) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#039;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .trim();
}

function absoluteUrl(href: string) {
  if (!href) return "";

  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }

  if (href.startsWith("/")) {
    return `${BPPA_BASE}${href}`;
  }

  return `${BPPA_BASE}/${href.replace(/^\/+/, "")}`;
}

function extractDetailId(url: string) {
  const match = url.match(/details-(\d+)\.html/i);
  return match?.[1] || "";
}

function extractRows(html: string) {
  const rows: Tender[] = [];

  /*
   * BPPA currently renders the Works listing as a normal HTML table.
   * We first find every table row and then inspect its cells.
   */
  const rowMatches = html.match(/<tr\b[\s\S]*?<\/tr>/gi) || [];

  for (const rowHtml of rowMatches) {
    const cellMatches =
      rowHtml.match(/<t[dh]\b[\s\S]*?<\/t[dh]>/gi) || [];

    if (cellMatches.length < 5) {
      continue;
    }

    const cells = cellMatches.map((cell) => cleanText(cell));

    /*
     * Ignore header row.
     */
    const firstCell = cells[0] || "";

    if (
      firstCell.toLowerCase().includes("si no") ||
      firstCell.toLowerCase().includes("title") ||
      firstCell.toLowerCase().includes("sl no")
    ) {
      continue;
    }

    /*
     * SI number can contain spaces/newlines.
     */
    const siMatch = firstCell.match(/\d+/);

    if (!siMatch) {
      continue;
    }

    const si = siMatch[0];

    /*
     * Find the real BPPA detail link anywhere inside the row.
     *
     * IMPORTANT:
     * We do NOT assume that the first link in the row is the tender.
     */
    const hrefMatches =
      rowHtml.match(
        /href\s*=\s*["']([^"']*details-\d+\.html[^"']*)["']/gi
      ) || [];

    let detailUrl = "";

    for (const rawHref of hrefMatches) {
      const match = rawHref.match(
        /href\s*=\s*["']([^"']+)["']/i
      );

      if (match?.[1]) {
        detailUrl = absoluteUrl(
          decodeHtml(match[1])
        );
        break;
      }
    }

    /*
     * If the row doesn't expose a detail URL, don't invent an ID.
     * We simply skip it rather than showing a fake notice.
     */
    if (!detailUrl) {
      continue;
    }

    const detailId = extractDetailId(detailUrl);

    if (!detailId) {
      continue;
    }

    /*
     * Actual BPPA table:
     *
     * SI
     * Title & Reference No.
     * Procuring Entity
     * Issue Date
     * Closing Date
     * Place
     */
    const title = cells[1] || "Tender Notice";
    const organization = cells[2] || "";
    const publishedDate = cells[3] || "";
    const deadline = cells[4] || "";
    const location = cells[5] || "";

    rows.push({
      id: detailId,
      detailId,
      title,
      organization,
      category: "works",
      location,
      publishedDate,
      deadline,
      officialUrl: detailUrl,
    });
  }

  return rows;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const requestedPage = Number(
      searchParams.get("page") || "1"
    );

    const page =
      Number.isFinite(requestedPage) && requestedPage > 0
        ? Math.floor(requestedPage)
        : 1;

    const search = (
      searchParams.get("search") || ""
    )
      .trim()
      .toLowerCase();

    /*
     * IMPORTANT:
     * BPPA does NOT use our old "?page=2" format alone.
     * Its current pagination URL includes the existing filters.
     */
    const sourceUrl =
      `${WORKS_URL}?agencyId.id=&ministryId.id=&page=${page}&procurementMethodId.id=`;

    const response = await fetch(sourceUrl, {
      method: "GET",
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
        "Accept-Language":
          "en-US,en;q=0.9,bn;q=0.8",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `BPPA source returned HTTP ${response.status}`,
          data: [],
        },
        { status: 502 }
      );
    }

    const html = await response.text();

    if (!html || html.length < 1000) {
      return NextResponse.json(
        {
          success: false,
          error: "BPPA returned an empty response.",
          data: [],
        },
        { status: 502 }
      );
    }

    let tenders = extractRows(html);

    /*
     * Local search.
     *
     * We search against title, organization,
     * location and dates.
     */
    if (search) {
      tenders = tenders.filter((tender) => {
        const haystack = [
          tender.title,
          tender.organization,
          tender.location,
          tender.publishedDate,
          tender.deadline,
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(search);
      });
    }

    return NextResponse.json({
      success: true,
      page,
      count: tenders.length,
      data: tenders,
      source: "BPPA",
      sourceUrl,
      officialPortal: "https://www.eprocure.gov.bd/",
      totalAvailable: 9637,
    });
  } catch (error) {
    console.error("Tender API error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Tender API failed.",
        data: [],
      },
      { status: 500 }
    );
  }
}