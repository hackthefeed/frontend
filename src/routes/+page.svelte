<script lang="ts">
	import Navbar from '../components/Navbar.svelte';
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

<Navbar loggedIn={key !== null} ghost />

<div
	class="hero min-h-screen"
	style="background-image: url('/images/train.jpg');"
>
	<div class="hero-overlay bg-opacity-70" />
	<div class="hero-content text-center text-neutral-content">
		<div class="max-w-xl">
			<h1 class="mb-5 font-bold text-4xl md:text-6xl lg:text-7xl">
				Welcome to <span class="text-accent">HackTheFeed</span>
			</h1>
			<p class="mb-12 text-md md:text-lg lg:text-xl sm:px-16">
				We're working hard to make this the best cybersecurity news aggregator
				on the web.
			</p>

			{#if key === null}
				<a href="/register" class="btn btn-primary rounded-full">
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
			{/if}
		</div>
	</div>
</div>
