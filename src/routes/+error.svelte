<script>
	import Header from '../components/Header.svelte';
	import { page } from '$app/stores';
	import { Button, Heading, P } from 'flowbite-svelte';
	import { browser } from '$app/environment';

	const key = $page.url.searchParams.get('key');

	if (key && browser) {
		$page.url.searchParams.delete('key');
		localStorage.setItem('key', key);
	}
</script>

<Header route="home" loggedIn={key !== null} />

<div
	class="mx-auto max-w-[85rem] px-20 gap-10 my-20 text-left grid md:grid-cols-2"
>
	<span>
		<Heading customSize="text-10xl font-bold">404</Heading>
		<P
			color="text-gray-900 dark:text-gray-300 lg:text-4xl sm:text-3xl text-2xl -translate-y-16 font-semibold"
			>You're not supposed to be here.</P
		>

		<span class="float-middle">
			<Button pill href="/">
				<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
					<path
						transform="scale(-1, 1) translate(-20, 0)"
						fill-rule="evenodd"
						d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
				Go back to safety
			</Button>
		</span>
	</span>
</div>
