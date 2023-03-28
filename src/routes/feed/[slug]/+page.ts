import type { Post } from '$/app';
import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export type Output = {
	props: {
		post: Post;
	};
};

export const load: PageLoad = async ({ params }) => {
	const key = localStorage.getItem('key');

	if (key === null) return redirect(302, '/login');

	const response = await fetch(`https://api.hackthefeed.com/posts/${params.slug}`, {
		headers: {
			Authorization: key,
		}
	});

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