import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, X, Calculator, FileSpreadsheet, Save } from 'lucide-react';

interface LocationRates {
  green: {
    greenFreight: number;
  };
  ripe: {
    greenFreight: number;
    ripening: number;
    ripeFreight: number;
  };
}

interface Rates {
  [key: string]: LocationRates; // Allow indexing with a string
}

const newLocationTemplate: LocationRates = {
  green: { greenFreight: 0 },
  ripe: { greenFreight: 0, ripening: 8.50, ripeFreight: 0 }
};

const defaultRates: Rates = {
  brisbane: {
    green: { greenFreight: 0 },
    ripe: { greenFreight: 0, ripening: 8.50, ripeFreight: 0 }
  },
  melbourne: {
    green: { greenFreight: 12.75 },
    ripe: { greenFreight: 12.75, ripening: 8.50, ripeFreight: 14.25 }
  },
  tasmania: {
    green: { greenFreight: 18.00 },
    ripe: { greenFreight: 18.00, ripening: 8.50, ripeFreight: 20.00 }
  }
};

const BananaPricingCalculator: React.FC = () => {
  const [rates, setRates] = useState<Rates>(() => {
    let saved = null;
    if (typeof window !== 'undefined') {
      saved = localStorage.getItem('bananaPricingRates');
    }
    return saved ? JSON.parse(saved) : defaultRates;
  });
  
  const [editingRates, setEditingRates] = useState<Rates>({ ...rates });
  const [basePrice, setBasePrice] = useState<string>('');
  const [destination, setDestination] = useState<string>('brisbane');
  const [isRipe, setIsRipe] = useState<string>('green');
  const [newLocation, setNewLocation] = useState<string>('');
  const [showAllPrices, setShowAllPrices] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<string>('calculator');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bananaPricingRates', JSON.stringify(rates));
    }
  }, [rates]);

  useEffect(() => {
    if (activeView === 'rates') {
      setEditingRates({ ...rates });
      setHasUnsavedChanges(false);
    }
  }, [activeView, rates]);

  const calculatePrice = (loc: string, ripeness: 'green' | 'ripe'): string => {
    if (!basePrice) return '0.00';
    const price = parseFloat(basePrice);
    const locationRates = rates[loc][ripeness];

    if (ripeness === 'ripe') {
      const ripeRates = locationRates as LocationRates['ripe'];
      return (price + ripeRates.greenFreight + ripeRates.ripening + ripeRates.ripeFreight).toFixed(2);
    } else {
      const greenRates = locationRates as LocationRates['green'];
      return (price + greenRates.greenFreight).toFixed(2);
    }
  };

  const downloadPrices = () => {
    const headers = "Location,Green Price,Green Freight,Ripe Price,Green Freight (Ripe),Ripening,Ripe Freight\n";
    const rows = Object.entries(rates).map(([loc, data]) => [
      loc,
      calculatePrice(loc, 'green'),
      data.green.greenFreight.toFixed(2),
      calculatePrice(loc, 'ripe'),
      data.ripe.greenFreight.toFixed(2),
      data.ripe.ripening.toFixed(2),
      data.ripe.ripeFreight.toFixed(2)
    ].join(',')).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'banana_prices.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>, loc: string, type: 'green' | 'ripe', key: string) => {
    e.preventDefault();
    e.stopPropagation();
    const value = parseFloat(e.target.value) || 0;
    requestAnimationFrame(() => {
      setEditingRates(prev => ({
        ...prev,
        [loc]: {
          ...prev[loc],
          [type]: {
            ...prev[loc][type],
            [key]: value
          }
        }
      }));
      setHasUnsavedChanges(true);
    });
  };

  const handleSaveRates = () => {
    setRates(editingRates);
    setHasUnsavedChanges(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bananaPricingRates', JSON.stringify(editingRates));
    }
  };

  const PriceDisplay: React.FC<{ loc: string }> = ({ loc }) => (
    <Card className="border shadow-sm">
      <CardContent className="pt-4">
        <h4 className="font-bold capitalize text-lg text-green-800 mb-3">{loc}</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="text-sm text-green-700 font-bold mb-1">Green</div>
            <div className="text-xl font-bold text-green-900">${calculatePrice(loc, 'green')}</div>
            <div className="text-xs text-gray-600 mt-1">
              + ${rates[loc].green.greenFreight.toFixed(2)} freight
            </div>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="text-sm text-yellow-700 font-bold mb-1">Ripe</div>
            <div className="text-xl font-bold text-yellow-900">${calculatePrice(loc, 'ripe')}</div>
            <div className="text-xs text-gray-600 mt-1">
              + ${rates[loc].ripe.greenFreight.toFixed(2)} green freight<br />
              + ${rates[loc].ripe.ripening.toFixed(2)} ripening<br />
              + ${rates[loc].ripe.ripeFreight.toFixed(2)} ripe freight
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CalculatorView: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, []);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-800">
            Banana Pricing Calculator
            <span className="text-base font-normal text-gray-500 ml-2">(15kg Carton)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="basePrice" className="font-bold text-gray-700">
              Base Price ($ per 15kg carton in Brisbane - Green)
            </Label>
            <Input
              ref={inputRef}
              id="basePrice"
              type="number"
              step="0.01"
              min="0"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="Enter base price"
              className="w-full border-green-200 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination" className="font-bold text-gray-700">Destination</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger className="w-full border-green-200">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(rates).map(loc => (
                  <SelectItem key={loc} value={loc}>
                    {loc.charAt(0).toUpperCase() + loc.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ripeness" className="font-bold text-gray-700">Ripeness State</Label>
            <Select value={isRipe} onValueChange={setIsRipe}>
              <SelectTrigger className="w-full border-green-200">
                <SelectValue placeholder="Select ripeness" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="ripe">Ripe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 border-t border-green-100">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-bold text-gray-700">Calculated Price:</Label>
              <div className="text-2xl font-bold text-green-700">
                ${calculatePrice(destination, isRipe as 'green' | 'ripe')}
                <span className="text-sm font-normal text-gray-500 ml-2">per carton</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => setShowAllPrices(!showAllPrices)}
            className="w-full bg-green-700 hover:bg-green-800 text-white"
          >
            <Calculator className="mr-2 h-4 w-4" />
            {showAllPrices ? 'Hide All Prices' : 'Calculate All Prices'}
          </Button>

          {showAllPrices && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-bold text-lg text-green-800">All Destination Prices</h3>
                <Button 
                  onClick={downloadPrices}
                  className="bg-green-700 hover:bg-green-800 text-white"
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Download CSV
                </Button>
              </div>
              <div className="grid gap-4">
                {Object.keys(rates).map(loc => (
                  <PriceDisplay key={loc} loc={loc} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
}

  const RateManager: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, []);
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-800">Manage Rates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder="Enter new location name"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="flex-1 border-green-200"
            />
            <Button 
              onClick={() => {
                if (newLocation.trim()) {
                  const key = newLocation.toLowerCase();
                  setEditingRates(prev => ({
                    ...prev,
                    [key]: { ...newLocationTemplate }
                  }));
                  setNewLocation('');
                  setHasUnsavedChanges(true);
                }
              }}
              className="w-24 bg-green-700 hover:bg-green-800"
            >
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>

          <div className="space-y-6">
            {Object.entries(editingRates).map(([loc, data]) => (
              <Card key={loc} className="border-2 border-green-100">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-green-100">
                    <h3 className="font-bold capitalize text-lg text-green-800">{loc}</h3>
                    <Button 
                      variant="ghost"
                      onClick={() => {
                        const newRates = { ...editingRates };
                        delete newRates[loc];
                        setEditingRates(newRates);
                        setHasUnsavedChanges(true);
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {['green', 'ripe'].map((type) => {
                    const key: string = type;

                    return (
                    <div key={type} className={`space-y-4 p-4 rounded-lg ${
                      type === 'green' ? 'bg-green-50/50' : 'bg-yellow-50/50'
                    }`}>
                      <h4 className={`font-medium ${
                        type === 'green' ? 'text-green-700' : 'text-yellow-700'
                      }`}>
                        {type.charAt(0).toUpperCase() + type.slice(1)} Banana Rates
                      </h4>
                      <div className="grid gap-4">
                        {Object.entries(data[key as keyof LocationRates] as Record<string, number>).map(([key, value]) => (
                          <div key={key} className="space-y-2">
                            <Label className="capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()} Rate ($ per carton)
                            </Label>
                            <Input
                              // ref={inputRef}
                              type="number"
                              step="0.01"
                              min="0"
                              value={value.toString()} // Convert to string for Input
                              onChange={(e) => handleRateChange(e, loc, type as 'green' | 'ripe', key)}
                              className="border-green-200"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )})}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="pt-6 border-t border-green-100">
            <Button 
              onClick={handleSaveRates}
              className="w-full bg-green-700 hover:bg-green-800 text-white"
              disabled={!hasUnsavedChanges}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-64 bg-green-50 border-r border-green-100 p-4 space-y-2 fixed h-full">
        {['calculator', 'rates'].map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
              activeView === view 
                ? 'bg-green-700 text-white' 
                : 'text-green-700 hover:bg-green-100'
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>
      <div className="flex-1 p-6 ml-64">
        {activeView === 'calculator' ? <CalculatorView /> : <RateManager />}
      </div>
    </div>
  );
};

export default BananaPricingCalculator;
