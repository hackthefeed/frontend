// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
}

export type Comment = {
	id: number;
	content: string;
	author: {
		username: string;
		displayName: string;
	};
	createdAt: string;
};

export type Post = {
	id: string;
	title: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	url: string;
	thumbnail?: string;
	source: {
		id: string;
		name: string;
	};
	notes: {
		content: string;
		id: string;
		decrypted?: string;
	}[];
	_count: {
		comments: number;
	};
	comments?: Comment[];
};