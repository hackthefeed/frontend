<script>
	import Footer from '$/components/Footer.svelte';
	import { page } from '$app/stores';
	import '../app.postcss';
</script>

{#if $page.url.pathname !== '/'}
	<div class="min-h-screen">
		<slot />
	</div>

	<Footer />
{:else}
	<slot />
{/if}
