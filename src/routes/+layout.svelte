<script>
	import Footer from '$/components/Footer.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import '../app.postcss';
	import { user } from '$/stores/auth';

	onMount(() => {
		$user = localStorage.getItem('key');

		user.subscribe(value => {
			if (value) {
				localStorage.setItem('key', value);
			} else {
				localStorage.removeItem('key');
			}
		});
	});
</script>

{#if $page.url.pathname !== '/'}
	<div class="min-h-screen">
		<slot />
	</div>

	<Footer />
{:else}
	<slot />
{/if}
