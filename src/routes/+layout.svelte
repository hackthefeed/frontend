<script>
	import Footer from '$/components/Footer.svelte';
	import { page } from '$app/stores';
	import '../app.postcss';
	import { user } from '$/stores/auth';
	import { browser } from '$app/environment';
	import Sidebar from '$/components/Sidebar.svelte';
	import Navbar from '$/components/Navbar.svelte';
	import ThemeItem from '$/components/theme/ThemeItem.svelte';

	if (browser) {
		$user = localStorage.getItem('key');

		user.subscribe(value => {
			if (value) {
				localStorage.setItem('key', value);
			} else {
				localStorage.removeItem('key');
			}
		});
	}
</script>

{#if $page.url.pathname !== '/'}
	<span class="hidden md:block min-h-screen">
		<input type="checkbox" id="theme-modal" class="modal-toggle" />
		<label class="modal" for="theme-modal">
			<label class="modal-box relative" for="">
				<div class="grid grid-cols-1 gap-3 p-3">
					<ThemeItem theme="light" name="Light" />
					<ThemeItem theme="dark" name="Dark" />
					<ThemeItem theme="synthwave" name="Synthwave" />
					<ThemeItem theme="lemonade" name="Lemonade" />
					<ThemeItem theme="autumn" name="Autumn" />
					<ThemeItem theme="valentine" name="Valentine" />
					<ThemeItem theme="aqua" name="Aqua" />
				</div>
			</label>
		</label>

		<Sidebar>
			<slot />

			<Footer />
		</Sidebar>
	</span>

	<span class="block md:hidden">
		<Navbar />

		<div class="min-h-screen">
			<slot />
		</div>

		<Footer />
	</span>
{:else}
	<div class="absolute top-0 left-0 w-full">
		<Navbar />
	</div>

	<slot />
{/if}
