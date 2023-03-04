<script>
	import Header from '../components/Header.svelte';
	import { page } from '$app/stores';
	import { Button, ButtonGroup, Heading, P } from 'flowbite-svelte';

	const key = $page.url.searchParams.get('key');

	if (key) {
		$page.url.searchParams.delete('key');
		localStorage.setItem('key', key);
	}
</script>

<Header route="home" />

<div class="w-2/3 max-w-4xl m-auto mt-24">
	<span class="text-center flex gap-10 flex-col">
		<Heading customSize="text-8xl font-bold">Welcome to HackTheFeed</Heading>
		<P class="mb-6 text-lg lg:text-xl sm:px-16 dark:text-slate-300">
			We're glad you're here. We're working hard to make this the best
			cybersecurity news aggregator on the web.
		</P>
	</span>

	<div class="flex flex-row justify-center gap-2">
		<Button href="/register" color="blue" size="xl" pill>
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
		</Button>
	</div>
</div>
