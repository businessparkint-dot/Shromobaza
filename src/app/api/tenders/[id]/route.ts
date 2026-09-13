import { NextRequest, NextResponse } from "next/server";

const BPPA_BASE =
  "https://www.bppa.gov.bd";

function decodeHtml(text: string) {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#039;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(text: string) {
  return decodeHtml(
    text
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<\/div>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  );
}

/*
 * BPPA currently renders rows like:
 *
 * Ministry/Division : : Ministry of ...
 *
 * We use the complete visible text instead of relying
 * on a specific number of <td> elements.
 */
function getField(
  text: string,
  label: string,
  nextLabels: string[]
) {
  const escapedLabel = label.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const escapedNext = nextLabels
    .map((item) =>
      item.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      )
    )
    .join("|");

  const regex = new RegExp(
    `${escapedLabel}\\s*:?\\s*:?\\s*(.*?)(?=\\s+(?:${escapedNext})\\s*:?|$)`,
    "i"
  );

  const match = text.match(regex);

  if (!match?.[1]) {
    return "";
  }

  return match[1]
    .replace(/^[:：\s]+/, "")
    .trim();
}

function getTitle(html: string) {
  const match = html.match(
    /<h[1-6][^>]*>\s*Invitation\s+for\s+Tender[\s\S]*?<\/h[1-6]>/i
  );

  if (match) {
    return stripHtml(match[0])
      .replace(/\s+/g, " ")
      .trim();
  }

  return "Invitation for Tender";
}

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const tenderId = String(id || "").trim();

    if (!/^\d+$/.test(tenderId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid tender ID.",
        },
        { status: 400 }
      );
    }

    const officialUrl =
      `${BPPA_BASE}/advertisement-works/details-${tenderId}.html`;

    const response = await fetch(officialUrl, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `BPPA returned HTTP ${response.status}`,
        },
        { status: 404 }
      );
    }

    const html = await response.text();

    if (!html || html.length < 1000) {
      return NextResponse.json(
        {
          success: false,
          error: "BPPA notice page is empty.",
        },
        { status: 404 }
      );
    }

    const text = stripHtml(html);

    /*
     * Only check for the actual BPPA title.
     * Do NOT require another field because BPPA markup can change.
     */
    if (
      !/Invitation\s+for\s+Tender/i.test(text)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "এই ID-এর জন্য valid public tender notice পাওয়া যায়নি।",
        },
        { status: 404 }
      );
    }

    const labels = [
      "Ministry/Division",
      "Agency",
      "Procuring Entity Name",
      "Procuring Entity District",
      "Invitation For",
      "Invitation Reference No",
      "Procurement Method",
      "Budget and Source of Funds",
      "Development Partner",
      "Project/Programme Code",
      "Project/Programme Name",
      "Tender Package No",
      "Tender Package Name",
      "Tender Publication Date",
      "Tender Last Selling Date",
      "Tender Closing Date and Time",
      "Tender Opening Date and Time",
      "Eligibility of Tenderer",
      "Brief Description of Goods or Works",
      "Tender Document Price",
      "Completion Time",
    ];

    const ministry = getField(
      text,
      "Ministry/Division",
      labels.slice(1)
    );

    const agency = getField(
      text,
      "Agency",
      labels.slice(2)
    );

    const organization = getField(
      text,
      "Procuring Entity Name",
      labels.slice(3)
    );

    const district = getField(
      text,
      "Procuring Entity District",
      labels.slice(4)
    );

    const invitationFor = getField(
      text,
      "Invitation For",
      labels.slice(5)
    );

    const referenceNo = getField(
      text,
      "Invitation Reference No",
      labels.slice(6)
    );

    const procurementMethod = getField(
      text,
      "Procurement Method",
      labels.slice(7)
    );

    const fundingSource = getField(
      text,
      "Budget and Source of Funds",
      labels.slice(8)
    );

    const developmentPartner = getField(
      text,
      "Development Partner",
      labels.slice(9)
    );

    const projectName = getField(
      text,
      "Project/Programme Name",
      labels.slice(11)
    );

    const packageNo = getField(
      text,
      "Tender Package No",
      labels.slice(12)
    );

    const packageName = getField(
      text,
      "Tender Package Name",
      labels.slice(13)
    );

    const publicationDate = getField(
      text,
      "Tender Publication Date",
      labels.slice(14)
    );

    const lastSellingDate = getField(
      text,
      "Tender Last Selling Date",
      labels.slice(15)
    );

    const closingDate = getField(
      text,
      "Tender Closing Date and Time",
      labels.slice(16)
    );

    const openingDate = getField(
      text,
      "Tender Opening Date and Time",
      labels.slice(17)
    );

    const eligibility = getField(
      text,
      "Eligibility of Tenderer",
      labels.slice(18)
    );

    const description = getField(
      text,
      "Brief Description of Goods or Works",
      labels.slice(19)
    );

    const documentPrice = getField(
      text,
      "Tender Document Price",
      labels.slice(20)
    );

    /*
     * Completion Time is inside the Lot table.
     * BPPA currently shows "5 month" there.
     */
    const completionMatch = text.match(
      /Completion\s+Time\s+in\s+Weeks\/Months\s+([0-9]+\s*(?:month|months|week|weeks))/i
    );

    const completionDate =
      completionMatch?.[1]?.trim() || "";

    const title = getTitle(html);

    const data = {
      id: tenderId,
      detailId: tenderId,

      title,

      ministry,
      agency,
      organization,
      district,

      invitationFor,
      referenceNo,

      procurementMethod,
      fundingSource,
      developmentPartner,

      projectName,
      packageNo,
      packageName,

      publicationDate,
      lastSellingDate,
      closingDate,
      openingDate,

      eligibility,
      completionDate,
      documentPrice,
      description,

      officialUrl,

      egpUrl:
        "https://www.eprocure.gov.bd/",
    };

    return NextResponse.json({
      success: true,
      data,
      source: "BPPA",
    });
  } catch (error) {
    console.error(
      "Tender detail error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Tender detail API failed.",
      },
      { status: 500 }
    );
  }
}