<script lang="ts">
	import { user } from '$/stores/auth';
</script>

<div class="drawer drawer-mobile">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<slot />
	</div>
	<div class="drawer-side border-r-1 border border-base-200">
		<label for="my-drawer" class="drawer-overlay" />
		<ul
			class="menu p-4 w-80 bg-base-100 text-base-content flex justify-between"
		>
			<span>
				<a class="btn btn-ghost w-full text-xl mb-5" href="/">
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

				<li>
					<a href="/feeds">
						<svg class="fill-current w-6 h-6 -mb-1" viewBox="0 0 24 24">
							<path
								d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
							/>
						</svg>
						Feeds
					</a>
				</li>
				<li>
					<a href="/feed">
						<svg class="fill-current w-6 h-6 -mb-1" viewBox="0 0 24 24">
							<path
								d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
							/>
						</svg>
						My Feed
					</a>
				</li>
				<li>
					<a href="/faq">
						<svg class="fill-current w-6 h-6 -mb-1" viewBox="0 0 24 24">
							<path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z" />
							<path
								d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5.99 13c-.59 0-1.05-.47-1.05-1.05 0-.59.47-1.04 1.05-1.04.59 0 1.04.45 1.04 1.04-.01.58-.45 1.05-1.04 1.05zm2.5-6.17c-.63.93-1.23 1.21-1.56 1.81-.13.24-.18.4-.18 1.18h-1.52c0-.41-.06-1.08.26-1.65.41-.73 1.18-1.16 1.63-1.8.48-.68.21-1.94-1.14-1.94-.88 0-1.32.67-1.5 1.23l-1.37-.57C11.51 5.96 12.52 5 13.99 5c1.23 0 2.08.56 2.51 1.26.37.61.58 1.73.01 2.57z"
							/>
						</svg>
						FAQ
					</a>
				</li>
			</span>

			<span>
				<li>
					<label for="theme-modal">
						<svg
							width="20"
							height="20"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="inline-block h-5 w-5 stroke-current md:h-6 md:w-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
							/>
						</svg>
						<span class="hidden md:inline">Theme</span>
					</label>
				</li>
				<li>
					{#if $user === null}
						<a href="/login">
							<svg class="fill-current w-6 h-6 -mb-1" viewBox="0 0 24 24">
								<path
									d="M11 7 9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"
								/>
							</svg>

							Log in
						</a>
					{:else}
						<a on:click={() => ($user = null)} href="/login">
							<svg class="fill-current w-6 h-6 -mb-1" viewBox="0 0 24 24">
								<path
									d="m17 7-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
								/>
							</svg>
							Log out
						</a>
					{/if}
				</li>
			</span>
		</ul>
	</div>
</div>
