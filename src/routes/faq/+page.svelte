<script lang="ts">
	import Header from '$/components/Header.svelte';
	import { page } from '$app/stores';
	import {
		Accordion,
		AccordionItem,
		Button,
		Heading,
		P,
	} from 'flowbite-svelte';
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

<Header route="faq" loggedIn={key !== null} />

<div class="w-2/3 max-w-4xl m-auto mt-24">
	<Heading customSize="text-9xl text-center font-bold mb-16">FAQ</Heading>
	<Accordion multiple>
		<AccordionItem bind:open={items[0]}>
			<span slot="header">Is the service free?</span>
			<p>Yes, HackTheFeed will always be free... until the domain expires.</p>
		</AccordionItem>
		<AccordionItem bind:open={items[1]}>
			<div slot="header">How do I sign up?</div>
			<p>
				{#if key === null}
					You can sign up by <a href="/register" class="underline"
						>clicking here</a
					> or the "Log in" in the top right.
				{:else}
					You're already logged in!
				{/if}
			</p>
		</AccordionItem>
		<AccordionItem bind:open={items[2]}>
			<div slot="header">How do I use it?</div>
			<p class="mb-2 text-gray-500 dark:text-gray-400">
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
		</AccordionItem>
	</Accordion>
</div>
