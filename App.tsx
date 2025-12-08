import React, { useState } from 'react';
import { AssetType, GeneratedAsset, JewelryType, ProductDetails } from './types';
import InputForm from './components/InputForm';
import AssetCard from './components/AssetCard';
import { generateAsset } from './services/geminiService';
import { Card, Button, Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui';

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("visuals");
  
  // Selection state - Default to nothing or just Description to prompt user action
  const [selectedAssets, setSelectedAssets] = useState<AssetType[]>([AssetType.WHITE_BG]);

  const [details, setDetails] = useState<ProductDetails>({
    name: '',
    type: JewelryType.NECKLACE,
    stone: '',
    shape: '',
    material: '',
    visualCharacteristic: '',
    necklaceLengthValue: '',
    accentDetail: '',
    stagingProps: [],
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const toggleAssetSelection = (type: AssetType) => {
    setSelectedAssets(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleGenerate = async () => {
    if (files.length === 0) {
      setError("Please upload at least one image.");
      return;
    }
    if (selectedAssets.length === 0) {
      setError("Please select at least one asset type to generate.");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Switch to visuals tab initially if any visual asset is selected, otherwise copy
    const hasVisuals = selectedAssets.some(a => [AssetType.STAGING, AssetType.MODEL, AssetType.WHITE_BG].includes(a));
    setActiveTab(hasVisuals ? "visuals" : "copy");

    try {
      const promises = selectedAssets.map(assetType => 
        generateAsset(files, assetType, details, logoFile)
      );

      const results = await Promise.allSettled(promises);
      
      const successfulAssets: GeneratedAsset[] = [];
      const errors: string[] = [];

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          successfulAssets.push(result.value);
        } else {
          errors.push(result.reason?.message || "Unknown error");
        }
      });

      setGeneratedAssets(successfulAssets);

      if (errors.length > 0) {
        setError(`Some assets failed to generate: ${errors.join(', ')}`);
      }

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const visualAssets = generatedAssets.filter(a => a.isImage);
  const textAssets = generatedAssets.filter(a => !a.isImage);

  // Group assets for better display
  const visualTypes = [AssetType.WHITE_BG, AssetType.STAGING, AssetType.MODEL];
  const copyTypes = [AssetType.DESCRIPTION, AssetType.SOCIAL_POST];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Header */}
      <header className="bg-zinc-900 text-white sticky top-0 z-50 shadow-md h-16">
        <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white font-serif font-bold border border-white/20">J</div>
            <h1 className="text-lg font-serif tracking-wide text-zinc-50">Jewelry GenAI Studio</h1>
          </div>
          <div className="text-xs text-zinc-400 font-medium border border-zinc-700 rounded-full px-3 py-1 bg-zinc-800/50">
            Powered by Gemini Nano
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR - WIZARD INPUTS */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* STEP 1: SCOPE */}
            <Card className="p-6">
               <div className="flex items-center justify-between mb-4">
                 <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">1. Project Scope</h2>
               </div>
               
               <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-900 mb-2">Visual Assets</h3>
                    <div className="grid grid-cols-1 gap-2">
                       {visualTypes.map((type) => (
                         <div 
                           key={type} 
                           onClick={() => !isLoading && toggleAssetSelection(type)}
                           className={`
                             relative flex items-center p-3 rounded-lg border cursor-pointer transition-all
                             ${selectedAssets.includes(type) ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700'}
                           `}
                         >
                            <div className={`w-4 h-4 rounded border mr-3 flex items-center justify-center ${selectedAssets.includes(type) ? 'border-white bg-white' : 'border-zinc-400'}`}>
                               {selectedAssets.includes(type) && <div className="w-2 h-2 bg-zinc-900 rounded-sm"></div>}
                            </div>
                            <span className="text-sm font-medium">{type}</span>
                         </div>
                       ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-zinc-900 mb-2">Copywriting</h3>
                    <div className="grid grid-cols-1 gap-2">
                       {copyTypes.map((type) => (
                         <div 
                           key={type} 
                           onClick={() => !isLoading && toggleAssetSelection(type)}
                           className={`
                             relative flex items-center p-3 rounded-lg border cursor-pointer transition-all
                             ${selectedAssets.includes(type) ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700'}
                           `}
                         >
                            <div className={`w-4 h-4 rounded border mr-3 flex items-center justify-center ${selectedAssets.includes(type) ? 'border-white bg-white' : 'border-zinc-400'}`}>
                               {selectedAssets.includes(type) && <div className="w-2 h-2 bg-zinc-900 rounded-sm"></div>}
                            </div>
                            <span className="text-sm font-medium">{type}</span>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
            </Card>

            {/* STEP 2: IMAGERY */}
            <Card className="p-6">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">2. Visual Context</h2>
              <div className="border-2 border-dashed border-zinc-200 rounded-lg p-6 text-center hover:bg-zinc-50 transition-all hover:border-zinc-300 cursor-pointer relative group">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  id="file-upload"
                  disabled={isLoading}
                />
                <div className="flex flex-col items-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center mb-2 group-hover:bg-zinc-200 transition-colors">
                    <svg className="h-5 w-5 text-zinc-400 group-hover:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <span className="block text-sm font-medium text-zinc-900">
                    {files.length > 0 ? `${files.length} images` : "Upload photos"}
                  </span>
                </div>
              </div>
              
              {files.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {files.map((file, idx) => (
                    <div key={idx} className="relative aspect-square bg-zinc-100 rounded-md overflow-hidden border border-zinc-200">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* STEP 3: DETAILS */}
            <Card className="p-6 border-zinc-300 shadow-md">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">3. Product Intelligence</h2>
              <InputForm 
                details={details} 
                setDetails={setDetails} 
                logoFile={logoFile}
                setLogoFile={setLogoFile}
                isLoading={isLoading} 
                selectedAssets={selectedAssets}
              />

              <div className="mt-6 pt-4 border-t border-zinc-100">
                <Button
                    onClick={handleGenerate}
                    disabled={isLoading || files.length === 0 || selectedAssets.length === 0}
                    className="w-full h-12 text-base bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/10"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Crafting Assets...
                      </span>
                    ) : 'Generate Assets'}
                  </Button>
                   
                 {error && (
                   <div className="mt-3 p-2 bg-red-50 text-red-600 text-xs rounded border border-red-200 text-center">
                     {error}
                   </div>
                 )}
              </div>
            </Card>

          </div>

          {/* RIGHT CONTENT - RESULTS */}
          <div className="lg:col-span-8 relative">
             <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                {/* Sticky Header for Results */}
                <div className="sticky top-16 z-30 bg-zinc-50 py-4 border-b border-zinc-200 mb-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-xl font-serif text-zinc-900 whitespace-nowrap">Generated Assets</h2>
                    <TabsList className="w-full md:w-auto bg-zinc-100 p-1">
                      <TabsTrigger value="visuals" activeValue={activeTab} onClick={setActiveTab} className="flex-1 md:flex-none px-6">Visual Studio</TabsTrigger>
                      <TabsTrigger value="copy" activeValue={activeTab} onClick={setActiveTab} className="flex-1 md:flex-none px-6">Copywriting</TabsTrigger>
                    </TabsList>
                  </div>
                </div>

                <div className="flex-grow min-h-[500px]">
                   {/* LOADING STATE */}
                   {isLoading && (
                      <div className="h-[600px] flex flex-col items-center justify-center bg-white rounded-xl border border-zinc-200 border-dashed animate-pulse">
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin"></div>
                          <div className="absolute inset-0 flex items-center justify-center font-serif font-bold text-zinc-900">J</div>
                        </div>
                        <p className="mt-6 text-lg font-medium text-zinc-900">Generating your collection</p>
                        <p className="text-sm text-zinc-500">This requires complex AI reasoning, please wait...</p>
                      </div>
                   )}

                   {/* EMPTY STATE */}
                   {!isLoading && generatedAssets.length === 0 && (
                      <div className="h-[600px] flex flex-col items-center justify-center bg-zinc-50 rounded-xl border border-zinc-200 border-dashed">
                         <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                         </div>
                         <h3 className="text-lg font-medium text-zinc-900">Workspace Ready</h3>
                         <p className="text-zinc-500 max-w-sm text-center mt-2">
                           Start by selecting your Project Scope on the left.
                         </p>
                      </div>
                   )}

                   {/* VISUALS TAB */}
                   <TabsContent value="visuals" activeValue={activeTab} className="mt-0 h-full">
                      {!isLoading && generatedAssets.length > 0 && (
                        <>
                          {visualAssets.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                              {visualAssets.map((asset, index) => (
                                <AssetCard key={`visual-${index}`} asset={asset} />
                              ))}
                            </div>
                          ) : (
                            <div className="h-64 flex items-center justify-center text-zinc-400 bg-white rounded-xl border border-zinc-100">
                              No visual assets generated yet.
                            </div>
                          )}
                        </>
                      )}
                   </TabsContent>

                   {/* COPY TAB */}
                   <TabsContent value="copy" activeValue={activeTab} className="mt-0 h-full">
                      {!isLoading && generatedAssets.length > 0 && (
                        <>
                          {textAssets.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 pb-20">
                              {textAssets.map((asset, index) => (
                                <AssetCard key={`text-${index}`} asset={asset} />
                              ))}
                            </div>
                          ) : (
                            <div className="h-64 flex items-center justify-center text-zinc-400 bg-white rounded-xl border border-zinc-100">
                              No text assets generated yet.
                            </div>
                          )}
                        </>
                      )}
                   </TabsContent>
                </div>
             </Tabs>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;