import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

import { PriceManagerProps, LocationRates } from './Interfaces';

const CalculatedPriceDisplay: React.FC<PriceManagerProps> = ({ rates, loc, basePrice }) => {

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

    return <Card className="border shadow-sm">
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
}

export default CalculatedPriceDisplay