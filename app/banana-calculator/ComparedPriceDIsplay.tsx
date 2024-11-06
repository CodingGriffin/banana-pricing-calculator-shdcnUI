import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, ChevronLeft } from 'lucide-react';

import { PriceManagerProps, LocationRates } from './Interfaces';

const ComparedPriceDIsplay: React.FC<PriceManagerProps> = ({ rates, loc }) => {
	
  const [basePrice, setBasePrice] = useState<string>('');

  const calculateExpectedPrice = (loc: string, ripeness: 'green' | 'ripe'): string => {
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
			<div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
				<div className="p-3 bg-green-50 rounded-lg border border-green-100">
					<div className="text-sm text-green-700 font-bold mb-1">Green</div>
					<div className="grid grid-cols-3 mt-4 h-[75%]">
						<div className="relative border border-green-500 rounded-lg p-3">
							<label className="absolute cursor-text bg-green-50 px-1 left-2.5 -top-2.5 text-black text-sm transition-all transform origin-left">
								Managed Price
							</label>
							<div className="text-xl font-bold text-green-900">${calculateExpectedPrice(loc, 'green')}</div>
							<div className="text-xs text-gray-600 mt-1">
								+ ${rates[loc].green.greenFreight.toFixed(2)} freight
							</div>
						</div>
						<div className='flex flex-col justify-center items-center'>
								<ChevronRight size={50} color='red' />
								<div className="text-md text-red">- $0.00</div>
						</div>
						<div className="relative border border-red-500 rounded-lg p-3">
							<label className="absolute cursor-text bg-green-50 px-1 left-2.5 -top-2.5 text-black text-sm transition-all transform origin-left">
								Real Price
							</label>
							<div className="text-xl font-bold text-green-900">${calculateExpectedPrice(loc, 'green')}</div>
							<div className="text-xs text-gray-600 mt-1">
								+ ${rates[loc].green.greenFreight.toFixed(2)} freight
							</div>
						</div>
					</div>
				</div>
				<div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
					<div className="text-sm text-yellow-700 font-bold mb-1">Ripe</div>
					<div className="grid grid-cols-3 mt-4 h-[75%]">
						<div className="relative border border-yellow-500 rounded-lg p-3">
							<label className="absolute cursor-text bg-yellow-50 px-1 left-2.5 -top-2.5 text-black text-sm transition-all transform origin-left">
								Managed Price
							</label>
							<div className="text-xl font-bold text-yellow-900">${calculateExpectedPrice(loc, 'ripe')}</div>
							<div className="text-xs text-gray-600 mt-1">
								+ ${rates[loc].ripe.greenFreight.toFixed(2)} green freight<br />
								+ ${rates[loc].ripe.ripening.toFixed(2)} ripening<br />
								+ ${rates[loc].ripe.ripeFreight.toFixed(2)} ripe freight
							</div>
						</div>
						<div className='flex flex-col justify-center items-center'>
							<ChevronLeft size={50} color='green' />
							<label className="text-green">+ $0.00</label>
						</div>
						<div className="relative border border-red-500 rounded-lg p-3">
							<label className="absolute cursor-text bg-yellow-50 px-1 left-2.5 -top-2.5 text-black text-sm transition-all transform origin-left">
								Real Price
							</label>
							<div className="text-xl font-bold text-yellow-900">${calculateExpectedPrice(loc, 'ripe')}</div>
							<div className="text-xs text-gray-600 mt-1">
								+ ${rates[loc].ripe.greenFreight.toFixed(2)} green freight<br />
								+ ${rates[loc].ripe.ripening.toFixed(2)} ripening<br />
								+ ${rates[loc].ripe.ripeFreight.toFixed(2)} ripe freight
							</div>
						</div>
					</div>
				</div>
			</div>
		</CardContent>
	</Card>
}

export default ComparedPriceDIsplay;