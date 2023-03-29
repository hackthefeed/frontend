<script>
	import Footer from '$/components/Footer.svelte';
	import { page } from '$app/stores';
	import '../app.postcss';
</script>

<slot />

{#if $page.url.pathname !== '/'}
	<Footer />
{/if}
