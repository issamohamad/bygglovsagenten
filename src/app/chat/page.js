'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hej! Jag är Bygglovsagenten. Jag kan hjälpa dig att ta reda på om du behöver bygglov för ditt projekt. Vad är fastighetsbeteckningen eller adressen för tomten du vill bygga på?', isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('fastighet');
  const [formData, setFormData] = useState({
    fastighet: {
      fastighet_beteckning: '',
      adress: '',
      kommun: 'Varberg'
    },
    byggplan: {
      typ: '',
      beskrivning: '',
      area: null,
      hojd: null,
      placering: ''
    },
    tillaggsinformation: ''
  });
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Simulerad API-funktion - för statisk export använder vi hårdkodade svar
  const analyseraByggplan = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Skapa ett resultat baserat på byggplanstyp
        const isAttefall = data.byggplan.typ.toLowerCase().includes('attefall');
        
        const result = {
          status: isAttefall ? "tillåtet_utan_bygglov" : "kräver_bygglov",
          detaljplan_info: {
            planid: "DP_2015_12",
            plannamn: "Detaljplan för Getakärr 5:1 m.fl."
          },
          regler_info: {
            byggtyp: data.byggplan.typ || "Attefallshus",
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
        
        resolve(result);
      }, 2000);
    });
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // Lägg till användarens meddelande
    const userMessage = { id: messages.length + 1, text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    // Hantera olika steg i konversationen
    setTimeout(() => {
      processUserInput(input);
    }, 500);
  };
  
  const processUserInput = async (userInput) => {
    try {
      switch (currentStep) {
        case 'fastighet':
          // Försök identifiera om det är en fastighetsbeteckning eller adress
          if (userInput.match(/\d+:\d+/) || userInput.toUpperCase().includes('VARBERG')) {
            setFormData(prev => ({
              ...prev,
              fastighet: {
                ...prev.fastighet,
                fastighet_beteckning: userInput,
                adress: ''
              }
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              fastighet: {
                ...prev.fastighet,
                fastighet_beteckning: '',
                adress: userInput
              }
            }));
          }
          
          setMessages(prev => [...prev, {
            id: messages.length + 2,
            text: 'Tack! Vad planerar du att bygga?',
            isUser: false
          }]);
          setCurrentStep('byggplan');
          setIsLoading(false);
          break;
          
        case 'byggplan':
          // Identifiera byggtyp från beskrivningen
          let byggtyp = '';
          if (userInput.toLowerCase().includes('attefall')) {
            byggtyp = 'Attefallshus';
          } else if (userInput.toLowerCase().includes('tillbyggnad')) {
            byggtyp = 'Tillbyggnad';
          } else if (userInput.toLowerCase().includes('garage')) {
            byggtyp = 'Garage';
          } else {
            byggtyp = 'Annat';
          }
          
          setFormData(prev => ({
            ...prev,
            byggplan: {
              ...prev.byggplan,
              typ: byggtyp,
              beskrivning: userInput
            }
          }));
          
          setMessages(prev => [...prev, {
            id: messages.length + 2,
            text: 'Har du någon ytterligare information om projektet, t.ex. storlek, höjd eller placering?',
            isUser: false
          }]);
          setCurrentStep('tillaggsinformation');
          setIsLoading(false);
          break;
          
        case 'tillaggsinformation':
          // Försök extrahera area och höjd från tilläggsinformationen
          const areaMatch = userInput.match(/(\d+)\s*(?:kvm|m2|kvadratmeter|kvadrat)/i);
          const hojdMatch = userInput.match(/(\d+(?:\.\d+)?)\s*(?:m|meter)\s*(?:hög|höjd|högt)/i);
          
          const updatedBuildingPlan = { ...formData.byggplan };
          if (areaMatch) {
            updatedBuildingPlan.area = parseFloat(areaMatch[1]);
          }
          if (hojdMatch) {
            updatedBuildingPlan.hojd = parseFloat(hojdMatch[1]);
          }
          
          updatedBuildingPlan.placering = userInput;
          
          setFormData(prev => ({
            ...prev,
            byggplan: updatedBuildingPlan,
            tillaggsinformation: userInput
          }));
          
          setMessages(prev => [...prev, {
            id: messages.length + 2,
            text: 'Tack för informationen! Jag analyserar nu ditt ärende...',
            isUser: false
          }]);
          setCurrentStep('analyserar');
          
          // Förbered data för analys
          const requestData = {
            fastighet: formData.fastighet,
            byggplan: {
              ...updatedBuildingPlan,
              beskrivning: formData.byggplan.beskrivning
            },
            tillaggsinformation: userInput
          };
          
          try {
            // Anropa analysfunktion (simulerad)
            const result = await analyseraByggplan(requestData);
            
            // Visa resultat i chatten
            const statusText = {
              'tillåtet_utan_bygglov': 'tillåtet utan bygglov',
              'kräver_bygglov': 'i behov av bygglov',
              'kräver_granngodkännande': 'i behov av granngodkännande',
              'ej_tillåtet': 'inte tillåtet enligt detaljplanen',
              'osäkert': 'osäkert att bedöma'
            }[result.status] || result.status;
            
            setMessages(prev => [...prev, {
              id: messages.length + 3,
              text: `Baserat på min analys är ditt projekt ${statusText}. ${result.rekommendation}`,
              isUser: false
            }]);
            
            // Spara resultatet
            setAnalysisResult(result);
            setAnalysisComplete(true);
          } catch (error) {
            console.error('Fel vid analys:', error);
            setError('Det uppstod ett fel vid analysen. Vänligen försök igen eller kontakta support.');
            setCurrentStep('fastighet'); // Återställ till början
          }
          
          setIsLoading(false);
          break;
          
        default:
          setIsLoading(false);
          break;
      }
    } catch (error) {
      console.error('Fel vid bearbetning av användarinput:', error);
      setError('Det uppstod ett fel. Vänligen försök igen.');
      setIsLoading(false);
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
              setMessages([
                { id: 1, text: 'Hej! Jag är Bygglovsagenten. Jag kan hjälpa dig att ta reda på om du behöver bygglov för ditt projekt. Vad är fastighetsbeteckningen eller adressen för tomten du vill bygga på?', isUser: false }
              ]);
              setCurrentStep('fastighet');
              setFormData({
                fastighet: { fastighet_beteckning: '', adress: '', kommun: 'Varberg' },
                byggplan: { typ: '', beskrivning: '', area: null, hojd: null, placering: '' },
                tillaggsinformation: ''
              });
              setAnalysisComplete(false);
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
      
      <h1 className="text-3xl font-bold mb-6 text-primary-600">Chattgränssnitt</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-primary-600 text-white p-4">
          <h2 className="text-xl font-semibold">Bygglovsagenten</h2>
          <p className="text-sm">Ställ frågor om ditt byggprojekt</p>
        </div>
        
        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`mb-4 ${message.isUser ? 'text-right' : ''}`}
            >
              <div 
                className={`inline-block p-3 rounded-lg max-w-xs md:max-w-md ${
                  message.isUser 
                    ? 'bg-primary-600 text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 rounded-bl-none'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          
          {error && (
            <div className="mb-4">
              <div className="inline-block p-3 rounded-lg bg-red-100 border border-red-300 text-red-800">
                {error}
              </div>
            </div>
          )}
          
          {isLoading && (
            <div className="mb-4 flex items-center text-gray-500">
              <span>Bygglovsagenten skriver...</span>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Skriv ditt meddelande här..."
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isLoading || analysisComplete}
          />
          <button
            type="submit"
            className="bg-primary-600 text-white p-2 rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={!input.trim() || isLoading || analysisComplete}
          >
            Skicka
          </button>
        </form>
      </div>
      
      {analysisComplete && renderResult()}
    </div>
  );
}
