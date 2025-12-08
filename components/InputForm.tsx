import React from 'react';
import { AssetType, JewelryType, NecklaceLength, ProductDetails } from '../types';
import { Input, Label, Select, Textarea, Card, Button } from './ui';

interface InputFormProps {
  details: ProductDetails;
  setDetails: React.Dispatch<React.SetStateAction<ProductDetails>>;
  logoFile: File | null;
  setLogoFile: React.Dispatch<React.SetStateAction<File | null>>;
  isLoading: boolean;
  selectedAssets: AssetType[];
}

const AVAILABLE_PROPS = [
  "Gift Box",
  "Woven Basket",
  "Greenery/Leaves",
  "Fresh Flowers",
  "Silk Ribbon",
  "Polished Marble Block",
  "Dried Wheat/Pampas",
  "Pearl Accents",
  "Vintage Book",
  "Linen Fabric"
];

const InputForm: React.FC<InputFormProps> = ({ details, setDetails, logoFile, setLogoFile, isLoading, selectedAssets }) => {
  
  const handleChange = (field: keyof ProductDetails, value: any) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };

  const toggleProp = (prop: string) => {
    const currentProps = details.stagingProps || [];
    const newProps = currentProps.includes(prop)
      ? currentProps.filter(p => p !== prop)
      : [...currentProps, prop];
    handleChange('stagingProps', newProps);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const isStagingSelected = selectedAssets.includes(AssetType.STAGING);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label>Product Name</Label>
          <Input
            type="text"
            value={details.name}
            onChange={(e) => handleChange('name', e.target.value)}
            disabled={isLoading}
            placeholder="e.g. The Royal Amethyst"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Type</Label>
          <Select
            value={details.type}
            onChange={(e) => handleChange('type', e.target.value as JewelryType)}
            disabled={isLoading}
          >
            {Object.values(JewelryType).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </div>
        <div>
           <Label>Material</Label>
           <Input
            type="text"
            value={details.material}
            onChange={(e) => handleChange('material', e.target.value)}
            disabled={isLoading}
            placeholder="e.g. 14k Gold"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Stone Type</Label>
          <Input
            type="text"
            value={details.stone}
            onChange={(e) => handleChange('stone', e.target.value)}
            disabled={isLoading}
            placeholder="e.g. Sapphire"
          />
        </div>
        <div>
          <Label>Stone Shape</Label>
          <Input
            type="text"
            value={details.shape}
            onChange={(e) => handleChange('shape', e.target.value)}
            disabled={isLoading}
            placeholder="e.g. Oval"
          />
        </div>
      </div>

      <div>
        <Label>Visual Characteristic</Label>
        <Textarea
          value={details.visualCharacteristic}
          onChange={(e) => handleChange('visualCharacteristic', e.target.value)}
          disabled={isLoading}
          rows={2}
          placeholder="e.g. deep blue with light refraction"
        />
      </div>

      {/* Conditional Staging Config Section */}
      {isStagingSelected && (
        <Card className="p-4 bg-zinc-50 border-zinc-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <h4 className="text-sm font-bold text-zinc-900 mb-4 flex items-center">
            <span className="bg-zinc-900 text-white rounded p-1 mr-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </span>
            Staging Configuration
          </h4>
          
          <div className="mb-5">
            <Label className="text-zinc-500 mb-3 block">Include Props</Label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_PROPS.map(prop => (
                <label key={prop} className="flex items-center space-x-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={(details.stagingProps || []).includes(prop)}
                    onChange={() => toggleProp(prop)}
                    disabled={isLoading}
                    className="rounded text-zinc-900 focus:ring-zinc-900 border-zinc-300 transition-colors"
                  />
                  <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">{prop}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-zinc-500 mb-2 block">Brand Logo / Tag Image</Label>
            <div className="flex items-center space-x-3">
               <label className="cursor-pointer">
                 <span className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 h-9 px-4 py-2 border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-900 shadow-sm">
                   {logoFile ? "Change Logo" : "Upload Logo"}
                 </span>
                 <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={isLoading} />
               </label>
               {logoFile ? (
                  <span className="text-xs font-medium text-emerald-600 flex items-center bg-emerald-50 px-2 py-1 rounded-full">
                    ✓ {logoFile.name}
                  </span>
               ) : (
                  <span className="text-xs text-zinc-400 italic">Optional</span>
               )}
            </div>
          </div>
        </Card>
      )}

      {details.type === JewelryType.NECKLACE && (
        <Card className="p-4 bg-zinc-50/50">
          <h4 className="text-sm font-semibold text-zinc-900 mb-3">Necklace Specifics</h4>
          <div className="space-y-4">
            <div>
              <Label>Model Drape Length</Label>
              <Select
                value={details.necklaceLength || ''}
                onChange={(e) => handleChange('necklaceLength', e.target.value as NecklaceLength)}
                disabled={isLoading}
              >
                <option value="">-- Select Length --</option>
                {Object.values(NecklaceLength).map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Length (Text)</Label>
                <Input
                  type="text"
                  value={details.necklaceLengthValue || ''}
                  onChange={(e) => handleChange('necklaceLengthValue', e.target.value)}
                  disabled={isLoading}
                  placeholder="e.g. 18"
                />
              </div>
              <div>
                <Label>Clasp Type</Label>
                <Input
                  type="text"
                  value={details.claspType || ''}
                  onChange={(e) => handleChange('claspType', e.target.value)}
                  disabled={isLoading}
                  placeholder="e.g. Lobster"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {details.type === JewelryType.EARRINGS && (
        <Card className="p-4 bg-zinc-50/50">
           <h4 className="text-sm font-semibold text-zinc-900 mb-3">Earring Specifics</h4>
           <div>
              <Label>Hook/Post Type</Label>
              <Input
                type="text"
                value={details.hookType || ''}
                onChange={(e) => handleChange('hookType', e.target.value)}
                disabled={isLoading}
                placeholder="e.g. French Hook"
              />
           </div>
        </Card>
      )}

      <div>
        <Label>Accent Detail</Label>
        <Input
          type="text"
          value={details.accentDetail || ''}
          onChange={(e) => handleChange('accentDetail', e.target.value)}
          disabled={isLoading}
          placeholder="e.g. signature crown charm"
        />
      </div>
    </div>
  );
};

export default InputForm;