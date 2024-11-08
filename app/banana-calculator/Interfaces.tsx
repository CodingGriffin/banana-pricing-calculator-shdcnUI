export interface LocationRates {
	green: {
		greenFreight: number;
	};
	ripe: {
		greenFreight: number;
		ripening: number;
		ripeFreight: number;
	};
}
export interface Rates {
	[key: string]: LocationRates; // Allow indexing with a string
}
export interface CurrentPrices {
	[key: string]: number; // Allow indexing with a string
}

export interface RateManagerProps {
  rates : any,
  setRates : (data: any) => void,
  basePrice: any
}

export interface PriceManagerProps {
	rates : any,
	loc : string,
	basePrice: string,
}
export interface CurrentPriceManagerProps {
	rates : any,
	loc : string,
	basePrice: string,
	currentPrices : any,
}
