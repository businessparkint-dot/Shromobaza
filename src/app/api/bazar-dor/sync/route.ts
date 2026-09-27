import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DAM_SOURCE =
  "https://market.dam.gov.bd/?L=E";

const DAM_REPORT_SOURCE =
  "https://market.dam.gov.bd/market_daily_price_report/print";

const DAM_GRAPH_SOURCE =
  "https://market.dam.gov.bd/price_graphical_report?L=E";

type DamItem = {
  product_name: string;
  product_name_bn: string;
  price_min: number;
  price_max: number;
  unit: string;
};

type ExistingBazarDor = {
  id: string | number;
  product_name: string | null;
  product_name_bn: string | null;
  price: number | string | null;
  price_min: number | string | null;
  price_max: number | string | null;
  previous_price: number | string | null;
  market_name: string | null;
  market_name_bn: string | null;
  district: string | null;
  district_bn: string | null;
  unit: string | null;
  currency: string | null;
  price_type: string | null;
};

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

const PRODUCT_MAP: Record<
  string,
  {
    product_name: string;
    product_name_bn: string;
  }
> = {
  "aman-fine": {
    product_name: "Aman Rice - Fine",
    product_name_bn: "আমন চাল - চিকন",
  },

  "aman-medium": {
    product_name: "Aman Rice - Medium",
    product_name_bn: "আমন চাল - মাঝারি",
  },

  "aman-coarse": {
    product_name: "Aman Rice - Coarse",
    product_name_bn: "আমন চাল - মোটা",
  },

  "boro-fine": {
    product_name: "Boro Rice - Fine",
    product_name_bn: "বোরো চাল - চিকন",
  },

  "boro-medium": {
    product_name: "Boro Rice - Medium",
    product_name_bn: "বোরো চাল - মাঝারি",
  },

  "boro-coarse": {
    product_name: "Boro Rice - Coarse",
    product_name_bn: "বোরো চাল - মোটা",
  },

  "ata (packet)": {
    product_name: "Ata (Packet)",
    product_name_bn: "আটা (প্যাকেট)",
  },

  "farm-raised hen": {
    product_name: "Farm-raised Hen",
    product_name_bn: "ফার্মের মুরগি",
  },

  beef: {
    product_name: "Beef",
    product_name_bn: "গরুর মাংস",
  },

  "egg farm-red": {
    product_name: "Egg Farm-Red",
    product_name_bn: "ফার্মের লাল ডিম",
  },

  "sugar (local)": {
    product_name: "Sugar (Local)",
    product_name_bn: "চিনি (দেশি)",
  },

  "iodized salt (packed)": {
    product_name: "Iodized Salt (Packed)",
    product_name_bn:
      "আয়োডিনযুক্ত লবণ (প্যাকেট)",
  },

  mung: {
    product_name: "Mung",
    product_name_bn: "মুগ ডাল",
  },

  "gram-whole": {
    product_name: "Gram-Whole",
    product_name_bn: "ছোলা",
  },

  soybean: {
    product_name: "Soybean",
    product_name_bn: "সয়াবিন",
  },

  "onion-local": {
    product_name: "Onion",
    product_name_bn: "পেঁয়াজ",
  },

  "garlic-local": {
    product_name: "Garlic",
    product_name_bn: "রসুন",
  },

  "garlic-imported": {
    product_name: "Garlic - Imported",
    product_name_bn: "রসুন - আমদানি",
  },

  "green chili": {
    product_name: "Green Chili",
    product_name_bn: "কাঁচা মরিচ",
  },

  "ginger-local": {
    product_name: "Ginger",
    product_name_bn: "আদা",
  },

  "ginger-imported": {
    product_name: "Ginger - Imported",
    product_name_bn: "আদা - আমদানি",
  },

  mutton: {
    product_name: "Mutton",
    product_name_bn: "খাসির মাংস",
  },
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function parseRange(value: string) {
  const matches =
    value.match(/\d+(?:\.\d+)?/g);

  if (!matches || matches.length < 2) {
    return null;
  }

  const first = Number(matches[0]);
  const second = Number(matches[1]);

  if (
    !Number.isFinite(first) ||
    !Number.isFinite(second)
  ) {
    return null;
  }

  return {
    min: Math.min(first, second),
    max: Math.max(first, second),
  };
}

function parseDamHome(html: string): DamItem[] {
  const text = html
    .replace(
      /<script[\s\S]*?<\/script>/gi,
      " "
    )
    .replace(
      /<style[\s\S]*?<\/style>/gi,
      " "
    )
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();

  const normalizedText = normalize(text);

  const results: DamItem[] = [];

  for (const [key, mapped] of Object.entries(
    PRODUCT_MAP
  )) {
    const normalizedKey = normalize(key);

    const start =
      normalizedText.indexOf(
        normalizedKey
      );

    if (start === -1) {
      continue;
    }

    const nearby =
      normalizedText.slice(
        start,
        start + 180
      );

    const rangeMatch = nearby.match(
      /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/i
    );

    if (!rangeMatch) {
      continue;
    }

    const range = parseRange(
      rangeMatch[0]
    );

    if (!range) {
      continue;
    }

    results.push({
      product_name:
        mapped.product_name,
      product_name_bn:
        mapped.product_name_bn,
      price_min: range.min,
      price_max: range.max,
      unit: "kg",
    });
  }

  return results;
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",

      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/153 Safari/537.36",

      "Accept-Language":
        "en-US,en;q=0.9",

      "Cache-Control":
        "no-cache",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `${url} returned HTTP ${response.status}`
    );
  }

  return response.text();
}

function extractReportDate(
  html: string
) {
  const match = html.match(
    /Report Date:\s*(\d{1,2}\s+[A-Za-z]+\s+\d{4})/i
  );

  return match?.[1] ?? null;
}

export async function GET(
  request: NextRequest
) {
  try {
    const syncSecret =
      process.env.BAZAR_DOR_SYNC_SECRET;

    if (syncSecret) {
      const authorization =
        request.headers.get(
          "authorization"
        );

      if (
        authorization !==
        `Bearer ${syncSecret}`
      ) {
        return NextResponse.json(
          {
            ok: false,
            error: "Unauthorized",
          },
          { status: 401 }
        );
      }
    }

    const supabase =
      getAdminClient();

    /*
     * 1. Read current official DAM homepage.
     */

    const damHtml =
      await fetchText(
        DAM_SOURCE
      );

    /*
     * 2. Parse only real
     *    product/range values.
     */

    const damItems =
      parseDamHome(damHtml);

    /*
     * NEVER modify database
     * if parsing failed.
     */

    if (!damItems.length) {
      return NextResponse.json(
        {
          ok: false,
          synced: 0,
          parsed_from_dam: 0,
          message:
            "DAM page reached, but no recognized official prices were found. Database was not changed.",
          source: DAM_SOURCE,
          report_source:
            DAM_REPORT_SOURCE,
          graphical_source:
            DAM_GRAPH_SOURCE,
        },
        { status: 422 }
      );
    }

    /*
     * 3. Get official report date.
     */

    let reportDate =
      new Date()
        .toISOString()
        .slice(0, 10);

    let reportDateLabel:
      | string
      | null = null;

    try {
      const reportHtml =
        await fetchText(
          DAM_REPORT_SOURCE
        );

      reportDateLabel =
        extractReportDate(
          reportHtml
        );

      if (reportDateLabel) {
        const parsedDate =
          new Date(
            reportDateLabel
          );

        if (
          !Number.isNaN(
            parsedDate.getTime()
          )
        ) {
          reportDate =
            parsedDate
              .toISOString()
              .slice(0, 10);
        }
      }
    } catch {
      /*
       * Price data is still
       * official DAM data.
       *
       * If report-date endpoint
       * fails, keep today's
       * server date as fallback.
       */
    }

    let synced = 0;
    let historyCreated = 0;

    const errors: string[] = [];

    for (const item of damItems) {
      const {
        data: existingData,
        error: existingError,
      } = await supabase
        .from("bazar_dor")
        .select(
          [
            "id",
            "product_name",
            "product_name_bn",
            "price",
            "price_min",
            "price_max",
            "previous_price",
            "market_name",
            "market_name_bn",
            "district",
            "district_bn",
            "unit",
            "currency",
            "price_type",
          ].join(",")
        )
        .eq(
          "product_name",
          item.product_name
        )
        .eq(
          "price_type",
          "retail"
        )
        .limit(1)
        .maybeSingle();

      const existing =
        existingData as
          | ExistingBazarDor
          | null;

      if (existingError) {
        errors.push(
          `${item.product_name}: ${existingError.message}`
        );

        continue;
      }

      const changed =
        !existing ||
        Number(
          existing.price_min ??
            -1
        ) !== item.price_min ||
        Number(
          existing.price_max ??
            -1
        ) !== item.price_max;

      /*
       * Save old official range
       * into history only when
       * official value changes.
       */

      if (
        existing &&
        changed
      ) {
        const {
          error: historyError,
        } = await supabase
          .from(
            "bazar_dor_history"
          )
          .insert({
            bazar_dor_id:
              existing.id,

            product_name:
              existing.product_name,

            product_name_bn:
              existing.product_name_bn ??
              item.product_name_bn,

            market_name:
              existing.market_name ??
              null,

            market_name_bn:
              existing.market_name_bn ??
              null,

            district:
              existing.district ??
              null,

            district_bn:
              existing.district_bn ??
              null,

            price:
              Number(
                existing.price ?? 0
              ),

            previous_price:
              existing.previous_price !=
              null
                ? Number(
                    existing.previous_price
                  )
                : null,

            change_value: 0,

            change_percent: 0,

            price_min:
              existing.price_min !=
              null
                ? Number(
                    existing.price_min
                  )
                : null,

            price_max:
              existing.price_max !=
              null
                ? Number(
                    existing.price_max
                  )
                : null,

            unit:
              existing.unit ??
              item.unit,

            currency:
              existing.currency ??
              "BDT",

            price_type:
              existing.price_type ??
              "retail",

            source_name:
              "Department of Agricultural Marketing (DAM)",

            source_url:
              DAM_SOURCE,

            source_report_date:
              reportDate,

            recorded_at:
              new Date().toISOString(),
          });

        if (historyError) {
          errors.push(
            `${item.product_name} history: ${historyError.message}`
          );

          continue;
        }

        historyCreated++;
      }

      /*
       * No average is calculated.
       *
       * Legacy "price" field
       * keeps official minimum.
       *
       * UI should display:
       *
       * price_min - price_max
       */

      const nextPrice =
        item.price_min;

      const payload = {
        product_name:
          item.product_name,

        product_name_bn:
          item.product_name_bn,

        price: nextPrice,

        price_min:
          item.price_min,

        price_max:
          item.price_max,

        previous_price:
          existing?.price !=
          null
            ? Number(
                existing.price
              )
            : null,

        change_value:
          existing?.price !=
          null
            ? nextPrice -
              Number(
                existing.price
              )
            : 0,

        change_percent:
          existing?.price !=
            null &&
          Number(
            existing.price
          ) !== 0
            ? ((nextPrice -
                Number(
                  existing.price
                )) /
                Number(
                  existing.price
                )) *
              100
            : 0,

        unit: item.unit,

        currency: "BDT",

        price_type: "retail",

        source_name:
          "Department of Agricultural Marketing (DAM)",

        source_url:
          DAM_SOURCE,

        source_type:
          "official",

        source_report_date:
          reportDate,

        market_status:
          "OPEN",

        is_active: true,

        updated_at:
          new Date().toISOString(),
      };

      if (existing) {
        const { error } =
          await supabase
            .from("bazar_dor")
            .update(payload)
            .eq(
              "id",
              existing.id
            );

        if (error) {
          errors.push(
            `${item.product_name}: ${error.message}`
          );

          continue;
        }
      } else {
        const { error } =
          await supabase
            .from("bazar_dor")
            .insert(payload);

        if (error) {
          errors.push(
            `${item.product_name}: ${error.message}`
          );

          continue;
        }
      }

      synced++;
    }

    return NextResponse.json({
      ok: true,

      synced,

      history_created:
        historyCreated,

      parsed_from_dam:
        damItems.length,

      report_date:
        reportDate,

      report_date_label:
        reportDateLabel,

      source:
        DAM_SOURCE,

      report_source:
        DAM_REPORT_SOURCE,

      graphical_source:
        DAM_GRAPH_SOURCE,

      errors,
    });
  } catch (error) {
    console.error(
      "Bazar Dor sync error:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown sync error",
      },
      { status: 500 }
    );
  }
}
