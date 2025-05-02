export const dynamic = 'force-static';

import { NextResponse } from 'next/server';

// Simulerad PDF-generering och hämtning
export function GET() {
  try {
    // För statisk export måste vi använda absoluta URL:er
    return NextResponse.redirect('https://example.com/bygglovsrapport_exempel.pdf');
  } catch (error) {
    console.error('Fel vid generering av PDF:', error);
    return NextResponse.json(
      { error: 'Ett internt fel uppstod' },
      { status: 500 }
    );
  }
}
