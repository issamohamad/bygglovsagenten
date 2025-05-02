export const dynamic = 'force-static';

import { NextResponse } from 'next/server';

// Simulerad API-funktion för att analysera byggplaner
export async function POST() {
  // För statisk export kan vi inte hantera POST-anrop dynamiskt
  // Istället returnerar vi ett statiskt svar
  
  const result = {
    status: "tillåtet_utan_bygglov",
    detaljplan_info: {
      planid: "DP_2015_12",
      plannamn: "Detaljplan för Getakärr 5:1 m.fl."
    },
    regler_info: {
      byggtyp: "Attefallshus",
      krav_bygglov: false,
      krav_anmalan: true
    },
    rekommendation: "Gör en anmälan till kommunen och invänta startbesked innan byggnation",
    nasta_steg: [
      "Gör en anmälan till kommunen",
      "Bifoga situationsplan, fasadritningar och planritningar",
      "Invänta startbesked innan byggnation påbörjas"
    ],
    pdf_url: "/bygglovsrapport_exempel.pdf"
  };
  
  return NextResponse.json(result);
}
