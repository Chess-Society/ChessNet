export interface NetsTransaction {
	id: string;
	userId: string;
	amount: number;
	type: 'EARN' | 'SPEND' | 'STAKE_LOCK' | 'STAKE_REFUND' | 'STAKE_WIN' | 'TIP_SEND' | 'TIP_RECEIVE' | 'CHALLENGE_BET' | 'CHALLENGE_WIN' | 'ADJUST';
	reason: string;
	metadata?: Record<string, any>;
	createdAt: Date | any;
}

export interface UserBattlePass {
	seasonId: string;
	currentXp: number;
	currentTier: number;
	isPremium: boolean;
	claimedTiers: number[];
	dailyChallenges: Record<string, { progress: number; total: number; claimed: boolean; xp: number; resetAt: any }>;
	weeklyChallenges: Record<string, { progress: number; total: number; claimed: boolean; xp: number; resetAt: any }>;
}

export interface UserEconomy {
	netsBalance: number;
	totalNetsEarned: number;
	tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
	battlePass?: UserBattlePass;
	lastUpdated?: Date | any;
}
