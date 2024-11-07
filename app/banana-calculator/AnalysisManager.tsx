import React, {useRef, useEffect, useState} from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

import ComparedPriceDIsplay from './ComparedPriceDIsplay';
import { LocationRates, Rates, RateManagerProps } from './Interfaces';

const AnalysisManager: React.FC<RateManagerProps> = ({ rates }) => {
	const [currentRates, setCurrentRates] = useState<Rates>(() => {
    let saved = null;
    if (typeof window !== 'undefined') {
      saved = localStorage.getItem('bananaRealRates');
    }
    return saved ? JSON.parse(saved) : rates;
  });
  const [basePrice, setBasePrice] = useState<string>('');
	const inputRef = useRef<HTMLInputElement>(null);
  const [showAnalysisPrices, setShowAnalysisPrices] = useState<boolean>(false);

	const handleCurrentRateChange = (e: React.ChangeEvent<HTMLInputElement>, loc: string, type: 'green' | 'ripe', key: string) => {
		e.preventDefault();
		e.stopPropagation();
		const value = parseFloat(e.target.value) || 0;
		requestAnimationFrame(() => {
			setCurrentRates(prev => ({
				...prev,
				[loc]: {
					...prev[loc],
					[type]: {
						...prev[loc][type],
						[key]: value
					}
				}
			}));
			// setHasUnsavedChanges(true);
		});
	};
	const handleSaveRates = () => {
		// setRates(editingRates);
		// setHasUnsavedChanges(false);
		if (typeof window !== 'undefined') {
			localStorage.setItem('bananaRealRates', JSON.stringify(currentRates));
		}
	};

	useEffect(() => {
		if (typeof window !== 'undefined') {
				localStorage.setItem('bananaRealRates', JSON.stringify(currentRates));
		}
	}, [currentRates]);
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
													onChange={(e) => handleCurrentRateChange(e, loc, type as 'green' | 'ripe', key)}
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
				onClick={() => setShowAnalysisPrices(!showAnalysisPrices)}
				className="w-full bg-green-700 hover:bg-green-800 text-white"
			>
				<Calculator className="mr-2 h-4 w-4" />
				{showAnalysisPrices ? 'Hide Analysis' : 'Analysis All Prices For Each Location'}
			</Button>
			{showAnalysisPrices &&
			<>
				<h3 className="font-bold text-lg text-green-800">Analysing For Each Location Based Price Per 15kg</h3>
				<div className="grid gap-4">
					{Object.keys(rates).map(loc => (
						<ComparedPriceDIsplay key={loc} loc={loc} rates={rates} basePrice={basePrice} currentRates={currentRates} />
					))}
				</div>
			</>
			}
		</CardContent>
	</Card>;
}

export default AnalysisManager;