<script context="module" lang="ts">
	export type Post = {
		id: string;
		title: string;
		content: string;
		createdAt: string;
		updatedAt: string;
		url: string;
	};
</script>

<script lang="ts">
	import Header from '$/components/Header.svelte';
	import { onMount } from 'svelte/internal';
	import { Card, Button, Toggle, Heading } from 'flowbite-svelte';
	import { goto } from '$app/navigation';

	let key: string | null = null;
	let posts: Post[] = [];
	let socket: WebSocket;

	onMount(() => {
		key = localStorage.getItem('key');

		if (key === null) {
			return goto('/login');
		}

		socket = new WebSocket(`ws://api.hackthefeed.com/socket?key=${key}`);

		socket.addEventListener('message', event => {
			console.log(event);
		});

		fetchSubscriptions();
	});

	async function fetchSubscriptions() {
		const response = await fetch(
			`https://api.hackthefeed.com/me/posts?key=${key}`
		);

		const data = await response.json();

		posts = data.data;
	}
</script>

<Header route="subscriptions" />

{#if key}
	<div class="m-auto w-1/2 mt-1/4 grid gap-6 justify-center">
		{#if posts.length > 0}
			{#each posts as post}
				<div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
					<a href={post.url}>
						<h5
							class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
						>
							{@html post.title}
						</h5>
					</a>
					<p
						class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight"
					>
						{@html post.content}
					</p>
				</div>
			{/each}
		{:else}
			<Heading customSize="text-4xl font-bold">
				You don't have any subscriptions yet!
			</Heading>
			<Button href="/feeds">
				View available feeds
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
			</Button>
		{/if}
	</div>
{/if}
