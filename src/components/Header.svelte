<script context="module" lang="ts">
	export type Route = 'home' | 'feeds' | 'subscriptions' | 'none';
</script>

<script lang="ts">
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Button,
	} from 'flowbite-svelte';

	export let route: Route = 'home';
</script>

<Navbar let:hidden let:toggle>
	<NavBrand href="/">
		<img
			src="/logo.png"
			class="mr-3 h-6 sm:h-9 rounded-full"
			alt="HackTheFeed logo"
		/>
		<span
			class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
		>
			HackTheFeed
		</span>
	</NavBrand>
	<div class="flex md:order-2">
		<Button size="sm" href="/login">Login</Button>
		<NavHamburger on:click={toggle} />
	</div>
	<NavUl {hidden} class="order-1">
		<NavLi href="/" active={route === 'home'}>Home</NavLi>
		<NavLi href="/feeds" active={route === 'feeds'}>Feeds</NavLi>
		<NavLi href="/subscriptions" active={route === 'subscriptions'}
			>Subscriptions</NavLi
		>
		<NavLi href="https://api.hackthefeed.com/docs">API</NavLi>
	</NavUl>
</Navbar>
