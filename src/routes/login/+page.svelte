<script context="module" lang="ts">
	export type LoginResponse =
		| {
				success: false;
				message: string;
		  }
		| {
				success: true;
				key: string;
		  };
</script>

<script lang="ts">
	import Header from '$/components/Header.svelte';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let error = false;

	async function logIn() {
		const response = await fetch('https://api.hackthefeed.com/login', {
			method: 'POST',
			body: JSON.stringify({
				username: email,
				password: password,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const data: LoginResponse = await response.json();

		if (!data.success) return (error = true);

		error = false;
		localStorage.setItem('key', data.key);

		goto('/feed');
	}
</script>

<Header />

<div class="w-96 w-max-1/2 mt-16 mx-auto mb-64">
	<form class="flex flex-col gap-6">
		<h1 class="text-center text-4xl font-bold">Log in</h1>
		<div class="form-control w-full">
			<label class="label" for="email">
				<span class="label-text">Email address or username</span>
			</label>
			<input
				type="email"
				id="email"
				placeholder="hello@hackthefeed.com"
				class="input input-bordered w-full {error
					? 'input-error'
					: 'input-primary'}"
				bind:value={email}
			/>
			{#if error}
				<label class="label" for="email">
					<span class="label-text-alt text-error"
						>Invalid username or password.</span
					>
				</label>
			{/if}
		</div>

		<div class="form-control w-full">
			<label class="label" for="password">
				<span class="label-text">Password</span>
			</label>
			<input
				type="password"
				id="password"
				placeholder="•••••••••"
				class="input input-bordered w-full {error
					? 'input-error'
					: 'input-primary'}"
				bind:value={password}
			/>
			{#if error}
				<label class="label" for="password">
					<span class="label-text-alt text-error"
						>Invalid username or password.</span
					>
				</label>
			{/if}
		</div>

		<div class="grid gap-2">
			<a
				class="btn btn-ms"
				href="https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=11b61ecc-d611-4cc6-bed4-6d4940b5c1ea&response_type=code&scope=User.Read,offline_access&redirect_uri=https://api.hackthefeed.com/auth/microsoft"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 23 23"
					class="w-5 h-5 mr-1"
				>
					<path fill="#ffffff" d="M1 1h10v10H1z" />
					<path fill="#ffffff" d="M12 1h10v10H12z" />
					<path fill="#ffffff" d="M1 12h10v10H1z" />
					<path fill="#ffffff" d="M12 12h10v10H12z" />
				</svg>
				Log in with Microsoft
			</a>

			<button type="submit" on:click={logIn} class="btn btn-accent"
				>Log in</button
			>

			<span class="mx-auto">
				<a href="/register">
					<p
						class="hover:underline hover:cursor-pointer text-gray-400 dark:text-gray-300 text-sm"
					>
						No account? Register here.
					</p>
				</a>
			</span>
		</div>
	</form>
</div>
