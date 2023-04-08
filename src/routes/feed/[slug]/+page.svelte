<script lang="ts">
	import Navbar from '$/components/Navbar.svelte';
	import Time from 'svelte-time';
	import type { PageData } from './$types';
	import { user } from '$/stores/auth';

	export let data: PageData;

	let comment = '';
	let insights: string[] | null = null;

	function sleep(ms: number) {
		return new Promise(r => setTimeout(r, ms));
	}

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
					Authorization: $user!,
				},
			}
		);

		const json = await response.json();

		if (!json.success) return;

		data.props.post.comments?.unshift(json.data);

		comment = '';
		data = data;
	}

	async function fetchInsights() {
		if (insights !== null) return;
		insights = [];

		const response = await fetch(
			`https://api.hackthefeed.com/posts/${data.props.post.id}/insights`
		);

		const stream = response.body!;
		const reader = stream.getReader();

		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;

			const raw = new TextDecoder('utf-8').decode(value);

			for (const word of raw.split(/(?<=\s)/g)) {
				insights.push(word);
				insights = insights;

				await sleep(100);
			}
		}
	}
</script>

<Navbar />

<div class="px-12 max-w-4xl mx-auto flex flex-col gap-10 min-h-screen my-16">
	<div>
		{#if data.props.post.thumbnail}
			<img
				class="w-full object-cover rounded-xl mb-4"
				src={data.props.post.thumbnail}
				alt=""
			/>
		{/if}

		<a href={data.props.post.url}>
			<h1 class="text-2xl font-bold hover:underline mb-4 text-primary">
				{@html data.props.post.title}
			</h1>
		</a>

		<p class="text-lg whitespace-pre-line prose">
			{@html data.props.post.content}
		</p>
	</div>

	<div>
		{#if insights === null}
			<button class="btn btn-accent" on:click={fetchInsights}>
				View insights
				<svg
					aria-hidden="true"
					class="ml-2 -mr-1 w-5 h-5"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill-rule="evenodd"
						d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		{:else if insights.length === 0}
			<button class="btn btn-accent loading"> View insights </button>
		{:else}
			<h1 class="text-2xl font-bold mb-4">Your personalized insights</h1>

			<div class="text-lg whitespace-pre-line prose">
				{@html insights.join('')}
			</div>
		{/if}
	</div>

	{#if $user}
		<div class="w-full" id="comments">
			<div class="relative mb-12">
				<form>
					<input
						type="text"
						id="comment"
						class="input input-bordered w-full rounded-full block"
						placeholder="Write a comment"
						required
						bind:value={comment}
					/>

					<button
						type="submit"
						class="absolute right-3 bottom-3"
						disabled={!comment}
						on:click|preventDefault={postComment}
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
							<h1 class="text-lg font-bold text-primary inline">
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
	{/if}
</div>
