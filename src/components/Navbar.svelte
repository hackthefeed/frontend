<script lang="ts">
	import Theme from './theme/Theme.svelte';

	export let loggedIn = false;
</script>

<div class="navbar bg-base-100 z-50 relative bg-opacity-20">
	<div class="navbar-start">
		<div class="dropdown">
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label tabindex="0" class="btn btn-ghost lg:hidden">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h8m-8 6h16"
					/>
				</svg>
			</label>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<ul
				tabindex="0"
				class="menu menu-compact dropdown-content mt-3 p-2 shadow rounded-box w-52 bg-base-100 bg-opacity-50 backdrop-blur-sm"
			>
				<li><a href="/">Home</a></li>
				<li><a href="/feeds">Feeds</a></li>
				<li><a href="/feed">My Feed</a></li>
				<li><a href="/faq">FAQ</a></li>
				<li><a href="https://api.hackthefeed.com/docs">API</a></li>
			</ul>
		</div>
		<a class="btn btn-ghost normal-case text-xl" href="/">
			<svg
				class="mr-3 h-6 sm:h-9 fill-primary"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path
					d="M21,11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1L21,5V11M12,21C15.75,20 19,15.54 19,11.22V6.3L12,3.18V21Z"
				/>
			</svg>
			<span class="text-primary">Hack</span>TheFeed
		</a>
	</div>
	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal px-1">
			<li><a href="/">Home</a></li>
			<li><a href="/feeds">Feeds</a></li>
			<li><a href="/feed">My Feed</a></li>
			<li><a href="/faq">FAQ</a></li>
			<li><a href="https://api.hackthefeed.com/docs">API</a></li>
		</ul>
	</div>
	<div class="navbar-end flex gap-2">
		<Theme />
		{#if !loggedIn}
			<a class="btn btn-ghost" href="/login">Log in</a>
		{:else}
			<a
				class="btn btn-ghost"
				on:click={() => localStorage.removeItem('key')}
				href="/login"
			>
				Log out
			</a>
		{/if}
	</div>
</div>
