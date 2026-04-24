export type PostType = 'GAME_ANALYSIS' | 'EXERCISE' | 'ACHIEVEMENT' | 'SCHOOL_UPDATE' | 'NOTICE' | 'LICHESS_GAME';

export interface SocialPost {
	id: string;
	authorId: string;
	authorName: string;
	authorPhotoUrl?: string;
	authorAvatar?: string; // Legacy field
	type: PostType | string;
	title?: string;
	content: string;
	
	// Chess specific data
	fen?: string;
	lichessUrl?: string;
	pgn?: string;
	
	// Social
	reactions: Record<string, string[]>; // emoji_id -> list of userIds
	votes: {
		up: string[]; // list of userIds
		down: string[]; // list of userIds
	};
	tipsTotal: number;
	metadata?: Record<string, any>;
	
	isFeatured?: boolean; // Destacado (Admin)
	createdAt: Date | any;
	updatedAt?: Date | any;
}

// Alias for legacy code
export type FacultyPost = SocialPost;
export type FacultyPostType = PostType | string;

export interface PostReaction {
	postId: string;
	userId: string;
	emoji: string;
}
