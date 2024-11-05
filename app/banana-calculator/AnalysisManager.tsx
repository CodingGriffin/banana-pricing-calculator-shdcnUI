import React, {useRef, useEffect, useState} from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X, Save } from 'lucide-react';
import { Calculator, FileSpreadsheet } from 'lucide-react';

interface Rates {
  [key: string]: LocationRates; // Allow indexing with a string
}

interface RateManagerProps {
	rates : any,
	// setRates : (data: any) => void
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



const AnalysisManager: React.FC<RateManagerProps> = ({ rates }) => {
	const [currentRates, setCurrentRates] = useState<Rates>({ ...rates });
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

  const PriceDisplay: React.FC<{ loc: string }> = ({ loc }) => (
    <Card className="border shadow-sm">
      <CardContent className="pt-4">
        <h4 className="font-bold capitalize text-lg text-green-800 mb-3">{loc}</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="text-sm text-green-700 font-bold mb-1">Green</div>
						<div className="grid grid-cols-2">
							<div>
								{/* <div className="w-full max-w-sm min-w-[200px]">
									<div className="relative">
										<input
											className="peer w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
										/>
										<label className="absolute cursor-text bg-green-50 px-1 left-2.5 top-2.5 text-slate-400 text-sm transition-all transform origin-left peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90">
											Type Here...
										</label>
									</div>
								</div> */}
								<div className="text-xl font-bold text-green-900">${calculateExpectedPrice(loc, 'green')}</div>
								<div className="text-xs text-gray-600 mt-1">
									+ ${rates[loc].green.greenFreight.toFixed(2)} freight
								</div>
							</div>
							<div>
								<div className="text-xl font-bold text-green-900">${calculateExpectedPrice(loc, 'green')}</div>
								<div className="text-xs text-gray-600 mt-1">
									+ ${rates[loc].green.greenFreight.toFixed(2)} freight
								</div>
							</div>
						</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="text-sm text-yellow-700 font-bold mb-1">Ripe</div>
						<div className="grid grid-cols-2">
							<div>
								<div className="text-xl font-bold text-yellow-900">${calculateExpectedPrice(loc, 'ripe')}</div>
								<div className="text-xs text-gray-600 mt-1">
									+ ${rates[loc].ripe.greenFreight.toFixed(2)} green freight<br />
									+ ${rates[loc].ripe.ripening.toFixed(2)} ripening<br />
									+ ${rates[loc].ripe.ripeFreight.toFixed(2)} ripe freight
								</div>
							</div>
							<div>
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
  );

	return <Card>
		<CardHeader>
			<CardTitle className="text-2xl font-bold text-green-800">
				Banana Pricing Analysis
				<span className="text-base font-normal text-gray-500 ml-2">(15kg Carton)</span>
			</CardTitle>
		</CardHeader>
		<CardContent className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="basePrice" className="font-bold text-gray-700">
					Base Price for Analysis
				</Label>
				<Input
					// ref={inputRef}
					id="basePrice"
					type="number"
					step="0.01"
					min="0"
					// value={basePrice}
					// onChange={(e) => setBasePrice(e.target.value)}
					placeholder="Enter base price"
					className="w-full border-green-200 focus:border-green-500 focus:ring-green-500"
				/>
			</div>

			<div className="space-y-6">
				<Label htmlFor="basePrice" className="font-bold text-gray-700">
					Real Price for Each Location
				</Label>
				{Object.entries(currentRates).map(([loc, data]) => (
					<Card key={loc} className="border-2 border-green-100">
						<CardContent className="pt-6 space-y-4">
							<div className="flex justify-between items-center pb-2 border-b border-green-100">
								<h3 className="font-bold capitalize text-lg text-green-800">{loc}</h3>
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
													// onChange={(e) => handleRateChange(e, loc, type as 'green' | 'ripe', key)}
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
			<Button 
				// onClick={() => setShowAllPrices(!showAllPrices)}
				className="w-full bg-green-700 hover:bg-green-800 text-white"
			>
				<Calculator className="mr-2 h-4 w-4" />
				{'Analysis All Prices For Each Location'}
			</Button>
			<h3 className="font-bold text-lg text-green-800">Analysing For Each Location Based Price Per 15kg</h3>
			<div className="grid gap-4">
				{Object.keys(rates).map(loc => (
					<PriceDisplay key={loc} loc={loc} />
				))}
			</div>
		</CardContent>
	</Card>;
}

export default AnalysisManager;