export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

interface DetaljplanFeature {
  type: string;
  properties: {
    planid?: string;
    plannamn?: string;
    [key: string]: any;
  };
}

interface GeoServerResponse {
  type: string;
  features: DetaljplanFeature[];
}

interface GeocodingResult {
  lat: string;
  lon: string;
  display_name: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  try {
    // 1. Geocode to WGS84
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`);
    const geoData: GeocodingResult[] = await geoRes.json();

    if (!geoData || geoData.length === 0) {
      return NextResponse.json({ error: "Kunde inte hitta koordinater för adressen." }, { status: 404 });
    }

    const lat = parseFloat(geoData[0].lat);
    const lon = parseFloat(geoData[0].lon);

    // 2. Transform WGS84 (EPSG:4326) to SWEREF99 TM (EPSG:3006)
    const transformRes = await fetch(`https://epsg.io/trans?x=${lon}&y=${lat}&s_srs=4326&t_srs=3006`);
    const transformData = await transformRes.json();

    // Defensive: Check type and presence of x/y!
    let x: number | undefined, y: number | undefined;
    if (transformData && typeof transformData.x === "number" && typeof transformData.y === "number") {
      x = transformData.x;
      y = transformData.y;
    } else if (
      transformData &&
      typeof transformData.x === "string" &&
      typeof transformData.y === "string"
    ) {
      x = parseFloat(transformData.x);
      y = parseFloat(transformData.y);
    }

    if (!x || !y || isNaN(x) || isNaN(y)) {
      return NextResponse.json({ error: "Kunde inte transformera koordinater." }, { status: 500 });
    }

    // 3. Query geoserver
    const url = `https://karta.varberg.se/geoserver/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=planer:Detaljplan&outputFormat=application/json&srsName=EPSG:3006&bbox=${x},${y},${x},${y},EPSG:3006`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Kunde inte hämta data från geoserver");

    const data: GeoServerResponse = await res.json();

    if (!data.features || data.features.length === 0) {
      return NextResponse.json({
        message: "Ingen detaljplan hittades för angiven plats.",
        recommend: "Kontakta kommunen."
      });
    }

    const plan = data.features[0].properties;

    return NextResponse.json({
      status: "kräver_bygglov",
      detaljplan_info: {
        planid: plan.planid || "okänt",
        plannamn: plan.plannamn || "okänt"
      },
      regler_info: {
        byggtyp: "Altan",
        krav_bygglov: true,
        krav_anmalan: true
      },
      rekommendation: "Ansök om bygglov hos kommunen.",
      nasta_steg: [
        "Ansök om bygglov hos kommunen",
        "Bifoga situationsplan, fasadritningar och planritningar",
        "Invänta bygglov och startbesked innan byggnation påbörjas"
      ]
    });
  } catch (error) {
    return NextResponse.json({
      error: "Ett fel uppstod vid analysen.",
      details: error instanceof Error ? error.message : "Okänt fel"
    }, { status: 500 });
  }
}
