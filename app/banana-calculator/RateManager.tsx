import React, {useRef, useEffect, useState} from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X, Save } from 'lucide-react';

interface Rates {
    [key: string]: LocationRates; // Allow indexing with a string
  }
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
  
  const newLocationTemplate: LocationRates = {
    green: { greenFreight: 0 },
    ripe: { greenFreight: 0, ripening: 8.50, ripeFreight: 0 }
  };
  
  
  interface RateManagerProps {
    rates : any,
    setRates : (data: any) => void
  } 
const RateManager: React.FC<RateManagerProps> = ({rates, setRates}) => {
    
    const inputRef = useRef<HTMLInputElement>(null);
    const [newLocation, setNewLocation] = useState<string>('');
    const [editingRates, setEditingRates] = useState<Rates>({ ...rates });
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, []);
    useEffect(() => {
      if (typeof window !== 'undefined') {
          localStorage.setItem('bananaPricingRates', JSON.stringify(rates));
      }
      setEditingRates({ ...rates });
      setHasUnsavedChanges(false);
    }, [rates]);
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
        setRates({
            ...editingRates,
            [loc]: {
              ...editingRates[loc],
              [type]: {
                ...editingRates[loc][type],
                [key]: value
              }
            }
          });
      };
      const handleSaveRates = () => {
        setRates(editingRates);
        setHasUnsavedChanges(false);
        if (typeof window !== 'undefined') {
          localStorage.setItem('bananaPricingRates', JSON.stringify(editingRates));
        }
      };
    
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
export default RateManager;