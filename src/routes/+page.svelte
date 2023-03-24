<script lang="ts">
	import Header from '../components/Header.svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	let key: string | null = $page.url.searchParams.get('key');

	if (browser) {
		if (key) {
			$page.url.searchParams.delete('key');
			localStorage.setItem('key', key);
		} else {
			key = localStorage.getItem('key');
		}
	}
</script>

<svelte:head>
	<title>HackTheFeed</title>
</svelte:head>

<Header loggedIn={key !== null} />

<div class="w-2/3 max-w-4xl m-auto mt-28 h-screen">
	<span class="text-center flex gap-10 flex-col">
		<h1 class="text-4xl md:text-6xl lg:text-8xl font-bold">
			Welcome to <span class="text-primary">HackTheFeed</span>
		</h1>
		<p class="mb-6 text-md md:text-lg lg:text-xl sm:px-16 text-left">
			We're glad you're here. We're working hard to make this the best
			cybersecurity news aggregator on the web.
		</p>
	</span>

	{#if key === null}
		<div class="flex flex-row justify-center gap-2">
			<a href="/register" class="btn btn-accent rounded-full">
				Create an account
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
			</a>
		</div>
	{/if}
</div>
