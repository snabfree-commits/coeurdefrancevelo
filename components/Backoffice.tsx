import React, { useState, useEffect } from 'react';
import { Poi, Coordinate, RouteInfo } from '../types';

interface BackofficeProps {
  pois: Poi[];
  routeInfo: RouteInfo | null;
  onSavePoi: (poi: Poi) => Promise<void> | void;
  onDeletePoi: (id: string) => void;
  onUpdateRouteInfo: (info: RouteInfo) => void;
  onClose: () => void;
}

const Backoffice: React.FC<BackofficeProps> = ({ pois, routeInfo, onSavePoi, onDeletePoi, onUpdateRouteInfo, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pois' | 'settings'>('pois');
  const [isSaving, setIsSaving] = useState(false);
  
  // POI State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Poi>>({
    type: 'village',
    position: { lat: 47.2750, lng: 1.5540 }
  });
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Settings State
  const [settingsData, setSettingsData] = useState<RouteInfo>({
    distance: '',
    duration: '',
    difficulty: 'Facile',
    description: '',
    partnerLogos: []
  });

  useEffect(() => {
    if (routeInfo) {
      setSettingsData(routeInfo);
    }
  }, [routeInfo]);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      type: 'village',
      name: '',
      description: '',
      phone: '',
      website: '',
      openingHours: '',
      imageUrl: '',
      address: '',
      zipCode: '',
      city: '',
      position: { lat: 47.2750, lng: 1.5540 }
    });
  };

  const handleEdit = (poi: Poi) => {
    setEditingId(poi.id);
    setFormData({ ...poi });
  };

  const handleSubmitPoi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.position) return;
    setIsSaving(true);

    try {
      const newPoi: Poi = {
        // If we have an editingId, use it. If not, don't set ID, let DB/App handle it.
        // But for Type compliance we might need a temp one if local.
        // App.tsx logic handles creation if ID doesn't exist in DB.
        id: editingId || '', // Empty ID signals creation to App handler
        name: formData.name,
        type: formData.type as any,
        description: formData.description || '',
        position: formData.position,
        imageUrl: formData.imageUrl,
        phone: formData.phone,
        website: formData.website,
        openingHours: formData.openingHours,
        address: formData.address,
        zipCode: formData.zipCode,
        city: formData.city
      };

      await onSavePoi(newPoi);
      resetForm();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRouteInfo(settingsData);
    alert('Paramètres mis à jour (Sauvegarde Cloud active) !');
  };

  const handleGeocode = async () => {
    if (!formData.address || !formData.zipCode) {
      alert("Veuillez remplir l'adresse et le code postal.");
      return;
    }

    setIsGeocoding(true);
    try {
      const query = `${formData.address} ${formData.zipCode} ${formData.city || ''}`;
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=1`);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates;
        setFormData(prev => ({
          ...prev,
          position: { lat, lng },
          city: data.features[0].properties.city
        }));
      } else {
        alert("Adresse introuvable.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Handle Logo Upload (convert to base64)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const promises = files.map((file: File) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) resolve(event.target.result as string);
            else reject('Failed to read file');
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises).then(base64Images => {
        setSettingsData(prev => ({
          ...prev,
          partnerLogos: [...(prev.partnerLogos || []), ...base64Images]
        }));
      });
      e.target.value = '';
    }
  };

  const removeLogo = (index: number) => {
    setSettingsData(prev => {
      const newLogos = [...(prev.partnerLogos || [])];
      newLogos.splice(index, 1);
      return { ...prev, partnerLogos: newLogos };
    });
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-800 text-white p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-4">
             <h2 className="text-xl font-bold flex items-center">
                Administration (Cloud)
             </h2>
             <div className="flex bg-slate-700 rounded-lg p-1">
                <button 
                  onClick={() => setActiveTab('pois')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'pois' ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'}`}
                >
                  Points d'intérêt
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'settings' ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'}`}
                >
                  Paramètres Généraux
                </button>
             </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-gray-50">
          
          {/* TAB: POIs */}
          {activeTab === 'pois' && (
            <>
              {/* List */}
              <div className="w-full md:w-1/3 border-r border-gray-200 bg-white p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-700">Liste ({pois.length})</h3>
                  <button onClick={resetForm} className="text-xs bg-emerald-600 text-white px-2 py-1 rounded hover:bg-emerald-700">+ Nouveau</button>
                </div>
                <div className="space-y-2">
                  {pois.map(poi => (
                    <div 
                      key={poi.id} 
                      className={`p-3 rounded bg-gray-50 shadow-sm border cursor-pointer hover:border-emerald-500 transition-colors ${editingId === poi.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}
                      onClick={() => handleEdit(poi)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-sm text-gray-800">{poi.name}</div>
                          <div className="text-xs text-gray-500 uppercase flex items-center">
                             {poi.type === 'farm' && <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>}
                             {poi.type}
                          </div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDeletePoi(poi.id); }}
                          className="text-red-400 hover:text-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edit Form */}
              <div className="w-full md:w-2/3 p-6 bg-white overflow-y-auto">
                <h3 className="font-bold text-lg text-gray-800 mb-4 pb-2 border-b">
                  {editingId ? `Modifier: ${formData.name}` : 'Ajouter un nouveau point'}
                </h3>
                
                <form onSubmit={handleSubmitPoi} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                      <input 
                        type="text" 
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                        value={formData.name || ''}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded"
                        value={formData.type || 'village'}
                        onChange={e => setFormData({...formData, type: e.target.value as any})}
                      >
                        <option value="castle">Château</option>
                        <option value="nature">Nature</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="village">Village</option>
                        <option value="farm">Producteur / Ferme</option>
                      </select>
                    </div>
                  </div>

                  {/* Geocoding */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-3">
                     <h4 className="font-semibold text-blue-800 text-sm">Localisation auto (Data.gouv)</h4>
                     <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                        <div className="md:col-span-3">
                            <input type="text" className="w-full p-2 text-sm border border-gray-300 rounded" placeholder="Adresse" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} />
                        </div>
                        <div className="md:col-span-1">
                            <input type="text" className="w-full p-2 text-sm border border-gray-300 rounded" placeholder="CP" value={formData.zipCode || ''} onChange={e => setFormData({...formData, zipCode: e.target.value})} />
                        </div>
                        <div className="md:col-span-2">
                            <input type="text" className="w-full p-2 text-sm border border-gray-300 rounded" placeholder="Ville" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} />
                        </div>
                     </div>
                     <button type="button" onClick={handleGeocode} disabled={isGeocoding} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded">
                        {isGeocoding ? 'Recherche...' : 'Calculer GPS'}
                     </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lat</label>
                      <input type="number" step="0.000001" required className="w-full p-2 border border-gray-300 rounded bg-gray-50" value={formData.position?.lat || 0} onChange={e => setFormData({...formData, position: { ...formData.position!, lat: parseFloat(e.target.value) }})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lng</label>
                      <input type="number" step="0.000001" required className="w-full p-2 border border-gray-300 rounded bg-gray-50" value={formData.position?.lng || 0} onChange={e => setFormData({...formData, position: { ...formData.position!, lng: parseFloat(e.target.value) }})} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea className="w-full p-2 border border-gray-300 rounded h-24" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tél</label>
                        <input type="text" className="w-full p-2 border border-gray-300 rounded" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Web</label>
                        <input type="url" className="w-full p-2 border border-gray-300 rounded" value={formData.website || ''} onChange={e => setFormData({...formData, website: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Horaires</label>
                      <textarea className="w-full p-2 border border-gray-300 rounded h-16" value={formData.openingHours || ''} onChange={e => setFormData({...formData, openingHours: e.target.value})}></textarea>
                    </div>
                  </div>

                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input type="url" className="w-full p-2 border border-gray-300 rounded" value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                  </div>

                  <div className="flex justify-end pt-4 space-x-3">
                    <button type="button" onClick={resetForm} className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200">Annuler</button>
                    <button type="submit" disabled={isSaving} className="px-6 py-2 bg-emerald-600 text-white font-medium rounded hover:bg-emerald-700 shadow-md">
                      {isSaving ? 'Sauvegarde...' : (editingId ? 'Mettre à jour' : 'Ajouter')}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}

          {/* TAB: General Settings */}
          {activeTab === 'settings' && (
            <div className="w-full p-6 md:p-8 overflow-y-auto bg-white">
               <h3 className="font-bold text-2xl text-gray-800 mb-6 pb-4 border-b">Paramètres du Parcours</h3>
               
               <form onSubmit={handleSubmitSettings} className="space-y-6 max-w-2xl mx-auto">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-4">Logos Partenaires</h4>
                    <div>
                      <div className="mb-3">
                        <label className="block text-xs text-gray-500 mb-1">Via URL (un lien par ligne)</label>
                        <textarea 
                          placeholder="https://..."
                          className="w-full p-3 border border-gray-300 rounded shadow-sm text-sm font-mono"
                          value={settingsData.partnerLogos?.filter(l => !l.startsWith('data:')).join('\n') || ''}
                          onChange={e => {
                             const textUrls = e.target.value.split('\n').filter(line => line.trim() !== '');
                             const existingBase64 = settingsData.partnerLogos?.filter(l => l.startsWith('data:')) || [];
                             setSettingsData({...settingsData, partnerLogos: [...textUrls, ...existingBase64]});
                          }}
                        ></textarea>
                      </div>
                      <div className="mb-4">
                        <label className="block text-xs text-gray-500 mb-1">Upload Local</label>
                        <input type="file" multiple accept="image/*" onChange={handleLogoUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                      </div>
                      {settingsData.partnerLogos && settingsData.partnerLogos.length > 0 && (
                        <div className="mt-4 flex gap-4 flex-wrap">
                          {settingsData.partnerLogos.map((logo, idx) => (
                             <div key={idx} className="relative group p-2 bg-white rounded border border-gray-200 shadow-sm w-24 h-24 flex items-center justify-center">
                               <img src={logo} alt={`Preview ${idx}`} className="max-w-full max-h-full object-contain" />
                               <button type="button" onClick={() => removeLogo(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow">✕</button>
                             </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-4">Infos</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
                        <input type="text" className="w-full p-3 border border-gray-300 rounded" value={settingsData.distance} onChange={e => setSettingsData({...settingsData, distance: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Durée</label>
                        <input type="text" className="w-full p-3 border border-gray-300 rounded" value={settingsData.duration} onChange={e => setSettingsData({...settingsData, duration: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                     <h4 className="font-semibold text-gray-700 mb-4">Description</h4>
                     <textarea className="w-full p-3 border border-gray-300 rounded h-32" value={settingsData.description} onChange={e => setSettingsData({...settingsData, description: e.target.value})}></textarea>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button type="submit" className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-lg">
                      Sauvegarder
                    </button>
                  </div>
               </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Backoffice;