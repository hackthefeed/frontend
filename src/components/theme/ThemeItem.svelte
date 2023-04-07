<script lang="ts">
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';

	export let theme: string;
	export let name: string;

	onMount(() => {
		themeChange(false);
	});
</script>

<button
	class="outline-base-content overflow-hidden rounded-lg text-left"
	data-set-theme={theme}
	data-act-class="[&amp;_svg]:visible"
>
	<div
		data-theme={theme}
		class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
	>
		<div class="grid grid-cols-5 grid-rows-3">
			<div
				class="col-span-5 row-span-3 row-start-1 flex gap-2 py-3 px-4 items-center"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="w-3 h-3 invisible"
					><path
						d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"
					/></svg
				>
				<div class="flex-grow text-sm font-bold">{name}</div>
				<div class="flex flex-shrink-0 flex-wrap gap-1 h-full">
					<div class="bg-accent w-2 rounded" />
					<div class="bg-secondary w-2 rounded" />
					<div class="bg-primary w-2 rounded" />
					<div class="bg-neutral w-2 rounded" />
				</div>
			</div>
		</div>
	</div>
</button>
