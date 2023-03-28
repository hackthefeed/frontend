import type { Load } from '@sveltejs/kit';
import type { Post } from '$/app';

type RouteParams = {
	slug: string;
}

export type PageLoad = Load<RouteParams>;
export type PageData = {
	props: {
		post: Post;
	}
}