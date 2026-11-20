export interface User {
	id: number;
	username: string;
	email: string;
	avatarUrl: string | null;
	avatarPublicId: string | null;
	coverUrl: string | null;
	coverPublicId: string | null;
	bio: string | null;
	createdAt: Date;
}