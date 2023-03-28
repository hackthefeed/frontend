<script lang="ts">
	import Navbar from '$/components/Navbar.svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	let key: string | null = $page.url.searchParams.get('key');
	const items = Array(3);

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
	<title>FAQ</title>
</svelte:head>

<Navbar loggedIn={key !== null} />

<div class="w-2/3 max-w-4xl m-auto mt-24 h-screen">
	<h1 class="text-9xl text-center font-bold mb-16">FAQ</h1>

	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div
		tabindex="0"
		class="collapse collapse-plus border border-base-300 bg-base-100 rounded-box"
	>
		<div class="collapse-title text-xl font-medium">Is the service free?</div>
		<div class="collapse-content">
			<p>Yes, HackTheFeed will always be free... until the domain expires.</p>
		</div>
	</div>

	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div
		tabindex="0"
		class="collapse collapse-plus border border-base-300 bg-base-100 rounded-box"
	>
		<div class="collapse-title text-xl font-medium">How do I sign up?</div>
		<div class="collapse-content">
			<p>
				{#if key === null}
					You can sign up by <a href="/register" class="underline"
						>clicking here</a
					> or the "Log in" button in the top right.
				{:else}
					You're already logged in!
				{/if}
			</p>
		</div>
	</div>

	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div
		tabindex="0"
		class="collapse collapse-plus border border-base-300 bg-base-100 rounded-box"
	>
		<div class="collapse-title text-xl font-medium">How do I use it?</div>
		<div class="collapse-content">
			<p>
				HackTheFeed is an RSS aggregator, which means it collects news and blog
				posts from various sources and displays them in one place. You can
				subscribe to any RSS feed by clicking the "Subscribe" button on the <a
					href="/feeds"
					class="underline">Feeds</a
				>
				page.
			</p>
			<p>
				Then, go to <a href="/feed" class="underline">My Feed</a> to view all of
				the posts from the feeds you've subscribed to.
			</p>
		</div>
	</div>
</div>
