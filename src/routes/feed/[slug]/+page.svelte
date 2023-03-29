<script lang="ts">
	import Navbar from '$/components/Navbar.svelte';
	import Time from 'svelte-time';
	import type { PageData } from './$types';

	export let data: PageData;

	let comment = '';

	async function postComment() {
		const response = await fetch(
			`https://api.hackthefeed.com/posts/${data.props.post.id}/comments`,
			{
				method: 'POST',
				body: JSON.stringify({
					content: comment,
				}),
				headers: {
					'Content-Type': 'application/json',
					Authorization: localStorage.getItem('key')!,
				},
			}
		);

		const json = await response.json();

		if (!json.success) return;

		data.props.post.comments?.unshift(json.data);

		comment = '';
		data = data;
	}
</script>

<Navbar />

<div class="px-12 max-w-4xl mx-auto flex flex-col gap-3 min-h-screen">
	<div class="my-12">
		{#if data.props.post.thumbnail}
			<img
				class="w-full object-cover rounded-xl mb-4"
				src={data.props.post.thumbnail}
				alt=""
			/>
		{/if}

		<a href={data.props.post.url}>
			<h1 class="text-2xl font-bold hover:underline mb-4">
				{@html data.props.post.title}
			</h1>
		</a>

		<p class="text-lg">{@html data.props.post.content}</p>
	</div>

	<div class="w-full mb-16" id="comments">
		<div class="relative mb-12">
			<form>
				<input
					type="search"
					id="search"
					class="input input-bordered w-full rounded-full block"
					placeholder="Write a comment"
					required
					bind:value={comment}
				/>

				<button
					type="submit"
					class="absolute right-3 bottom-3"
					on:click={postComment}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24"
						viewBox="0 0 24 24"
						width="24"
						class="fill-current"
					>
						<path d="M0 0h24v24H0z" fill="none" />
						<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
					</svg>
				</button>
			</form>
		</div>

		<div class="flex flex-col gap-6 mt-3">
			{#each data.props.post.comments ?? [] as comment}
				<div class="flex flex-col gap-1">
					<span>
						<h1 class="text-lg font-bold text-accent inline">
							{comment.author.displayName || comment.author.username}
						</h1>
						<Time
							timestamp={comment.createdAt}
							relative
							class="text-sm inline"
						/>
					</span>

					<p class="text-lg">{@html comment.content}</p>
				</div>
			{/each}
		</div>
	</div>
</div>
