'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FormPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fastighet: {
      fastighet_beteckning: '',
      adress: '',
      kommun: 'Varberg'
    },
    byggplan: {
      typ: '',
      beskrivning: '',
      area: '',
      hojd: '',
      placering: ''
    },
    tillaggsinformation: ''
  });
  const [analysisResult, setAnalysisResult] = useState(null);
  
  const handleInputChange = (step, field, value) => {
    setFormData(prev => ({
      ...prev,
      [step]: typeof prev[step] === 'object' 
        ? { ...prev[step], [field]: value }
        : value
    }));
  };
  
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    // För statisk export använder vi simulerad data istället för API-anrop
    setTimeout(() => {
      // Skapa ett resultat baserat på byggplanstyp
      const isAttefall = formData.byggplan.typ.toLowerCase().includes('attefall');
      
      const result = {
        status: isAttefall ? "tillåtet_utan_bygglov" : "kräver_bygglov",
        detaljplan_info: {
          planid: "DP_2015_12",
          plannamn: "Detaljplan för Getakärr 5:1 m.fl."
        },
        regler_info: {
          byggtyp: formData.byggplan.typ || "Attefallshus",
          krav_bygglov: !isAttefall,
          krav_anmalan: true
        },
        rekommendation: isAttefall 
          ? "Gör en anmälan till kommunen och invänta startbesked innan byggnation"
          : "Ansök om bygglov hos kommunen",
        nasta_steg: isAttefall 
          ? [
              "Gör en anmälan till kommunen",
              "Bifoga situationsplan, fasadritningar och planritningar",
              "Invänta startbesked innan byggnation påbörjas"
            ]
          : [
              "Ansök om bygglov hos kommunen",
              "Bifoga situationsplan, fasadritningar och planritningar",
              "Invänta bygglov och startbesked innan byggnation påbörjas"
            ],
        pdf_url: "/bygglovsrapport_exempel.pdf"
      };
      
      setAnalysisResult(result);
      setIsLoading(false);
    }, 2000);
  };
  
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.fastighet.fastighet_beteckning.trim() !== '' || 
               formData.fastighet.adress.trim() !== '';
      case 2:
        return formData.byggplan.typ !== '' && 
               formData.byggplan.beskrivning.trim() !== '';
      case 3:
        return true; // Tilläggsinformation är valfritt
      default:
        return false;
    }
  };
  
  // Funktion för att visa resultat
  const renderResult = () => {
    if (!analysisResult) return null;
    
    const statusText = {
      'tillåtet_utan_bygglov': 'Tillåtet utan bygglov',
      'kräver_bygglov': 'Kräver bygglov',
      'kräver_granngodkännande': 'Kräver granngodkännande',
      'ej_tillåtet': 'Ej tillåtet enligt detaljplan',
      'osäkert': 'Osäker bedömning'
    }[analysisResult.status] || analysisResult.status;
    
    const statusColor = {
      'tillåtet_utan_bygglov': 'bg-green-100 border-l-4 border-green-500',
      'kräver_bygglov': 'bg-yellow-100 border-l-4 border-yellow-500',
      'kräver_granngodkännande': 'bg-yellow-100 border-l-4 border-yellow-500',
      'ej_tillåtet': 'bg-red-100 border-l-4 border-red-500',
      'osäkert': 'bg-blue-100 border-l-4 border-blue-500'
    }[analysisResult.status] || 'bg-gray-100 border-l-4 border-gray-500';
    
    return (
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className={`p-4 mb-6 rounded-md ${statusColor}`}>
          <h2 className="text-xl font-bold">{statusText}</h2>
          <p>{analysisResult.rekommendation}</p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-primary-600 border-b pb-1">Nästa steg</h3>
          <ol className="list-decimal pl-5 space-y-1">
            {analysisResult.nasta_steg.map((steg, index) => (
              <li key={index}>{steg}</li>
            ))}
          </ol>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-primary-600 border-b pb-1">Detaljplansinformation</h3>
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 w-1/3 text-secondary-600">Plan-ID</th>
                <td className="py-2">{analysisResult.detaljplan_info.planid}</td>
              </tr>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 w-1/3 text-secondary-600">Plannamn</th>
                <td className="py-2">{analysisResult.detaljplan_info.plannamn}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-primary-600 border-b pb-1">Byggregler</h3>
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 w-1/3 text-secondary-600">Byggtyp</th>
                <td className="py-2">{analysisResult.regler_info.byggtyp}</td>
              </tr>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 w-1/3 text-secondary-600">Kräver bygglov</th>
                <td className="py-2">{analysisResult.regler_info.krav_bygglov ? 'Ja' : 'Nej'}</td>
              </tr>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 w-1/3 text-secondary-600">Kräver anmälan</th>
                <td className="py-2">{analysisResult.regler_info.krav_anmalan ? 'Ja' : 'Nej'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-6">
          <a 
            href={analysisResult.pdf_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            Ladda ner PDF-rapport
          </a>
          
          <button 
            onClick={() => {
              setCurrentStep(1);
              setFormData({
                fastighet: { fastighet_beteckning: '', adress: '', kommun: 'Varberg' },
                byggplan: { typ: '', beskrivning: '', area: '', hojd: '', placering: '' },
                tillaggsinformation: ''
              });
              setAnalysisResult(null);
            }}
            className="btn btn-secondary bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            Starta ny analys
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-md text-sm text-gray-600">
          <p><strong>Observera:</strong> Denna bedömning är preliminär och inte juridiskt bindande. Kommunen gör alltid den slutgiltiga bedömningen i varje enskilt fall. Lokala bestämmelser och tolkningar kan variera.</p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="text-primary-600 hover:underline flex items-center gap-2">
          Tillbaka till startsidan
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6 text-primary-600">Formulärgränssnitt</h1>
      
      {!analysisResult ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between mb-8 relative">
            <div className="flex-1 text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                currentStep === 1 ? 'bg-primary-600 text-white' : currentStep > 1 ? 'bg-green-500 text-white' : 'bg-gray-300'
              }`}>
                {currentStep > 1 ? '✓' : 1}
              </div>
              <div className="text-sm">Fastighet</div>
            </div>
            
            <div className="flex-1 text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                currentStep === 2 ? 'bg-primary-600 text-white' : currentStep > 2 ? 'bg-green-500 text-white' : 'bg-gray-300'
              }`}>
                {currentStep > 2 ? '✓' : 2}
              </div>
              <div className="text-sm">Byggplan</div>
            </div>
            
            <div className="flex-1 text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                currentStep === 3 ? 'bg-primary-600 text-white' : 'bg-gray-300'
              }`}>
                3
              </div>
              <div className="text-sm">Tilläggsinformation</div>
            </div>
            
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-300 -z-10">
              <div 
                className="h-full bg-primary-600 transition-all duration-300" 
                style={{ width: `${(currentStep - 1) * 50}%` }}
              ></div>
            </div>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}
          
          {/* Steg 1: Fastighetsinformation */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Fastighetsinformation</h2>
              <p className="mb-6 text-gray-600">Ange fastighetsbeteckning eller adress för tomten du vill bygga på.</p>
              
              <div className="mb-4">
                <label htmlFor="fastighetsbeteckning" className="block mb-2 font-medium">
                  Fastighetsbeteckning
                </label>
                <input 
                  type="text" 
                  id="fastighetsbeteckning" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.fastighet.fastighet_beteckning}
                  onChange={(e) => handleInputChange('fastighet', 'fastighet_beteckning', e.target.value)}
                  placeholder="T.ex. VARBERG GETAKÄRR 5:1"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="adress" className="block mb-2 font-medium">
                  Adress
                </label>
                <input 
                  type="text" 
                  id="adress" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.fastighet.adress}
                  onChange={(e) => handleInputChange('fastighet', 'adress', e.target.value)}
                  placeholder="T.ex. Drottninggatan 12, Varberg"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="kommun" className="block mb-2 font-medium">
                  Kommun
                </label>
                <select 
                  id="kommun" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.fastighet.kommun}
                  onChange={(e) => handleInputChange('fastighet', 'kommun', e.target.value)}
                >
                  <option value="Varberg">Varberg</option>
                  <option value="Stockholm" disabled>Stockholm (kommer snart)</option>
                  <option value="Göteborg" disabled>Göteborg (kommer snart)</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Steg 2: Byggplansinformation */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Byggplansinformation</h2>
              <p className="mb-6 text-gray-600">Beskriv vad du planerar att bygga.</p>
              
              <div className="mb-4">
                <label htmlFor="byggtyp" className="block mb-2 font-medium">
                  Typ av byggnad
                </label>
                <select 
                  id="byggtyp" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.byggplan.typ}
                  onChange={(e) => handleInputChange('byggplan', 'typ', e.target.value)}
                >
                  <option value="">Välj typ av byggnad</option>
                  <option value="Attefallshus">Attefallshus</option>
                  <option value="Tillbyggnad">Tillbyggnad</option>
                  <option value="Garage">Garage</option>
                  <option value="Carport">Carport</option>
                  <option value="Förråd">Förråd</option>
                  <option value="Annat">Annat</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="beskrivning" className="block mb-2 font-medium">
                  Beskrivning
                </label>
                <textarea 
                  id="beskrivning" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]"
                  value={formData.byggplan.beskrivning}
                  onChange={(e) => handleInputChange('byggplan', 'beskrivning', e.target.value)}
                  placeholder="Beskriv vad du vill bygga..."
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="area" className="block mb-2 font-medium">
                    Area (m²)
                  </label>
                  <input 
                    type="number" 
                    id="area" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.byggplan.area}
                    onChange={(e) => handleInputChange('byggplan', 'area', e.target.value)}
                    placeholder="T.ex. 30"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="hojd" className="block mb-2 font-medium">
                    Höjd (m)
                  </label>
                  <input 
                    type="number" 
                    id="hojd" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.byggplan.hojd}
                    onChange={(e) => handleInputChange('byggplan', 'hojd', e.target.value)}
                    placeholder="T.ex. 3.5"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Steg 3: Tilläggsinformation */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Tilläggsinformation</h2>
              <p className="mb-6 text-gray-600">Ange eventuell tilläggsinformation som kan vara relevant för bedömningen.</p>
              
              <div className="mb-4">
                <label htmlFor="placering" className="block mb-2 font-medium">
                  Placering
                </label>
                <input 
                  type="text" 
                  id="placering" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.byggplan.placering}
                  onChange={(e) => handleInputChange('byggplan', 'placering', e.target.value)}
                  placeholder="T.ex. 5 meter från tomtgräns i söder"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="tillaggsinformation" className="block mb-2 font-medium">
                  Övrig information
                </label>
                <textarea 
                  id="tillaggsinformation" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]"
                  value={formData.tillaggsinformation}
                  onChange={(e) => handleInputChange('tillaggsinformation', '', e.target.value)}
                  placeholder="Ange eventuell övrig information som kan vara relevant..."
                ></textarea>
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-8">
            <button 
              onClick={handleBack} 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              disabled={currentStep === 1 || isLoading}
            >
              Tillbaka
            </button>
            
            <button 
              onClick={handleNext} 
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center gap-2 disabled:bg-gray-400"
              disabled={!validateStep(currentStep) || isLoading}
            >
              {isLoading ? (
                <>
                  Analyserar...
                </>
              ) : currentStep === 3 ? (
                <>
                  Skicka
                </>
              ) : (
                <>
                  Nästa
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        renderResult()
      )}
    </div>
  );
}
