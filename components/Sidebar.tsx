import React, { useEffect, useState } from 'react';
import { RouteInfo, Poi } from '../types';
import { getPoiDetails } from '../services/geminiService';

interface SidebarProps {
  routeInfo: RouteInfo | null;
  selectedPoi: Poi | null;
  onClosePoi: () => void;
  onUpdatePoi?: (poi: Poi) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ routeInfo, selectedPoi, onClosePoi, onUpdatePoi }) => {
  const [loadingAi, setLoadingAi] = useState(false);

  // Auto-generate description if missing
  useEffect(() => {
    const fetchDescription = async () => {
      if (selectedPoi && !selectedPoi.description && !loadingAi) {
        setLoadingAi(true);
        try {
          const desc = await getPoiDetails(selectedPoi.name, selectedPoi.type, selectedPoi.city || "");
          if (onUpdatePoi) {
             onUpdatePoi({ ...selectedPoi, description: desc });
          }
        } finally {
          setLoadingAi(false);
        }
      }
    };

    fetchDescription();
  }, [selectedPoi, onUpdatePoi]);

  return (
    <div className="h-full flex flex-col bg-white shadow-xl z-[1000] max-w-md w-full md:w-96 border-r border-gray-200">
      {/* Header */}
      <div className="bg-emerald-700 text-white p-4 shrink-0 shadow-md relative z-10">
        <h1 className="text-xl font-bold">Cœur de France à Vélo</h1>
        <p className="text-sm opacity-80 mb-2">Châtillon-sur-Cher ➔ Gièvres</p>
        
        {/* Custom Logos Display */}
        {routeInfo?.partnerLogos && routeInfo.partnerLogos.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-4 bg-white/10 rounded-lg p-2 backdrop-blur-sm">
             {routeInfo.partnerLogos.map((logo, index) => (
               <img 
                 key={index}
                 src={logo} 
                 alt={`Partenaire ${index + 1}`} 
                 className="h-12 object-contain bg-white/50 rounded px-1"
               />
             ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className="flex-1 py-3 text-sm font-medium text-emerald-700 border-b-2 border-emerald-700 bg-emerald-50"
        >
          Informations
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-6">
          {/* Selected POI View */}
          {selectedPoi ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
                <div className="relative h-48">
                  <img 
                  src={selectedPoi.imageUrl || "https://picsum.photos/400/200"} 
                  alt={selectedPoi.name} 
                  className="w-full h-full object-cover"
                  />
                  <button 
                  onClick={onClosePoi}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center transition-colors backdrop-blur-sm"
                  >
                    ✕
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold text-white uppercase tracking-wider mb-1 ${selectedPoi.type === 'farm' ? 'bg-green-600' : 'bg-emerald-600'}`}>
                      {selectedPoi.type === 'castle' ? 'Château' : 
                       selectedPoi.type === 'nature' ? 'Nature' : 
                       selectedPoi.type === 'restaurant' ? 'Restauration' : 
                       selectedPoi.type === 'farm' ? 'Producteur / Ferme' : 'Village'}
                    </span>
                    <h3 className="text-xl font-bold text-white">{selectedPoi.name}</h3>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Practical Info Section */}
                  {(selectedPoi.phone || selectedPoi.website || selectedPoi.openingHours || selectedPoi.address) && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-sm space-y-2">
                      <h4 className="font-semibold text-gray-700 mb-2 border-b pb-1">Informations Pratiques</h4>
                      
                      {selectedPoi.address && (
                        <div className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600 mt-0.5 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-600">{selectedPoi.address}{selectedPoi.zipCode ? `, ${selectedPoi.zipCode}` : ''} {selectedPoi.city}</span>
                        </div>
                      )}

                      {selectedPoi.openingHours && (
                        <div className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600 mt-0.5 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-600 whitespace-pre-line">{selectedPoi.openingHours}</span>
                        </div>
                      )}

                      {selectedPoi.phone && (
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <a href={`tel:${selectedPoi.phone}`} className="text-emerald-700 hover:underline font-medium">{selectedPoi.phone}</a>
                        </div>
                      )}

                      {selectedPoi.website && (
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                          <a href={selectedPoi.website} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline truncate">
                            Site internet officiel
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Description Section */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                    {loadingAi ? (
                      <div className="flex items-center space-x-2 text-emerald-600 text-sm animate-pulse">
                         <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                         <span>Génération de la description via IA...</span>
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                         {selectedPoi.description || "Aucune description disponible."}
                      </p>
                    )}
                  </div>

                  {/* Return Button */}
                  <button 
                    onClick={onClosePoi}
                    className="w-full mt-4 flex items-center justify-center space-x-2 py-2 border border-emerald-600 text-emerald-700 rounded hover:bg-emerald-50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Retourner à la description principale</span>
                  </button>
                </div>
            </div>
          ) : (
            /* Route Summary View */
            <>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">Résumé du Parcours</h3>
                {routeInfo ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-2 bg-emerald-50 rounded text-center">
                      <span className="block text-2xl font-bold text-emerald-700">{routeInfo.distance}</span>
                      <span className="text-xs text-gray-600 uppercase">Distance</span>
                    </div>
                    <div className="p-2 bg-blue-50 rounded text-center">
                      <span className="block text-2xl font-bold text-blue-700">{routeInfo.duration}</span>
                      <span className="text-xs text-gray-600 uppercase">Durée</span>
                    </div>
                    <div className="col-span-2 p-3 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600 italic leading-relaxed whitespace-pre-line">
                        {routeInfo.description}
                      </p>
                    </div>
                  </div>
                ) : (
                    <div className="flex justify-center p-4">
                      <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Points d'intérêt</h3>
                <p className="text-sm text-gray-500 mb-4">Cliquez sur les marqueurs de la carte pour plus de détails.</p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span> Châtillon-sur-Cher (Départ)
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span> Sites Touristiques
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-green-600 mr-2"></span> Producteurs / Fermes
                  </li>
                    <li className="flex items-center text-sm text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span> Gièvres (Arrivée)
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;