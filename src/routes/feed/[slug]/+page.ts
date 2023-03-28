import type { Post } from '$/app';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export type Output = {
	props: {
		post: Post;
	};
};

export const load: PageLoad = async ({ params }) => {
	const response = await fetch(`https://api.hackthefeed.com/posts/${params.slug}`);

	if (response.ok) {
		const post = await response.json();

		return {
			props: {
				post: post.data
			}
		};
	}

	throw error(404, 'Not found');
};