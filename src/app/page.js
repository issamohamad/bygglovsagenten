import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-primary-600 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image 
                src="/logo.svg" 
                alt="Bygglovsagenten Logo" 
                width={40} 
                height={40}
                className="mr-2"
              />
              <h1 className="text-2xl font-bold">Bygglovsagenten</h1>
            </div>
            <nav>
              <ul className="flex space-x-6">
                <li><Link href="/" className="hover:underline">Hem</Link></li>
                <li><Link href="/om" className="hover:underline">Om tjänsten</Link></li>
                <li><Link href="/kontakt" className="hover:underline">Kontakt</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bygglovsrådgivning med AI</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Få vägledning om bygglov för ditt projekt. Snabbt, enkelt och utan krångel.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/chat" className="btn btn-primary bg-white text-blue-700 hover:bg-gray-100 text-lg px-6 py-3">
              Starta chatten
            </Link>
            <Link href="/formular" className="btn btn-secondary bg-blue-600 border border-white hover:bg-blue-800 text-lg px-6 py-3">
              Använd formulär
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Hur det fungerar</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Beskriv ditt projekt</h3>
              <p className="text-gray-600">
                Berätta om din fastighet och vad du planerar att bygga.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-analys</h3>
              <p className="text-gray-600">
                Vår AI analyserar ditt projekt mot detaljplaner och byggregler.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Få svar och vägledning</h3>
              <p className="text-gray-600">
                Få en bedömning och tydliga instruktioner om nästa steg.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Vad användare säger</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card bg-gray-50">
              <p className="italic mb-4">
                "Bygglovsagenten sparade mig mycket tid och frustration. Jag fick snabbt veta att mitt Attefallshus inte krävde bygglov, bara anmälan."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Anna Svensson</h4>
                  <p className="text-sm text-gray-600">Husägare, Varberg</p>
                </div>
              </div>
            </div>
            
            <div className="card bg-gray-50">
              <p className="italic mb-4">
                "Tydlig och enkel att använda. Jag fick en detaljerad PDF med alla steg jag behövde ta för att ansöka om bygglov för min tillbyggnad."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Johan Bergström</h4>
                  <p className="text-sm text-gray-600">Villaägare, Göteborg</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Redo att komma igång?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Få svar på dina bygglovsfrågor redan idag.
          </p>
          <Link href="/chat" className="btn btn-primary bg-white text-blue-700 hover:bg-gray-100 text-lg px-6 py-3">
            Starta chatten nu
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Bygglovsagenten</h3>
              <p className="text-gray-400">AI-driven bygglovsrådgivning</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h4 className="font-semibold mb-2">Länkar</h4>
                <ul className="space-y-1">
                  <li><Link href="/" className="text-gray-400 hover:text-white">Hem</Link></li>
                  <li><Link href="/om" className="text-gray-400 hover:text-white">Om tjänsten</Link></li>
                  <li><Link href="/kontakt" className="text-gray-400 hover:text-white">Kontakt</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Juridiskt</h4>
                <ul className="space-y-1">
                  <li><Link href="/villkor" className="text-gray-400 hover:text-white">Användarvillkor</Link></li>
                  <li><Link href="/integritet" className="text-gray-400 hover:text-white">Integritetspolicy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Bygglovsagenten. Alla rättigheter förbehållna.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
