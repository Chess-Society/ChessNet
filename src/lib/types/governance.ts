export type MarketStatus = 'OPEN' | 'PENDING' | 'DISPUTED' | 'RESOLVED' | 'CANCELLED';

export interface PredictionMarket {
	id: string;
	schoolId: string;
	creatorId: string; // Typically the Director
	question: string;
	description?: string;
	endDate: Date | any;
	status: MarketStatus;
	
	totalPool: number; // In Nets
	options: {
		id: string;
		text: string;
		totalStaked: number;
		totalShares: number; // The "shares" outstanding for this option
	}[];
	
	resultOptionId?: string;
	resolutionProposedAt?: Date | any;
	resolvedAt?: Date | any;
	disputedBy?: string[];
	createdAt: Date | any;
	oracleType: 'MANUAL' | 'LICHESS' | 'SYSTEM';
	oracleConfig: {
		externalId?: string;
		validationSource?: string;
		tournamentId?: string;
		roundId?: string;
		[key: string]: any;
	};
}

export interface PredictionBet {
	id: string;
	marketId: string;
	userId: string;
	optionId: string;
	amount: number; // Total Nets invested in this position
	sharesOwned: number; // Number of "Yes" or "No" shares held
	potentialPayout: number;
	createdAt: Date | any;
}
