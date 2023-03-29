<script context="module" lang="ts">
	type RegisterResponse =
		| {
				success: true;
				data: string;
		  }
		| {
				success: false;
				message: string;
		  };
</script>

<script lang="ts">
	import { Turnstile } from 'svelte-turnstile';
	import Navbar from '$/components/Navbar.svelte';
	import { goto } from '$app/navigation';

	let displayName = '';
	let username = '';
	let email = '';
	let password = '';
	let token: string | undefined;

	let error: string | undefined;

	async function register() {
		const response = await fetch('https://api.hackthefeed.com/auth/register', {
			method: 'POST',
			body: JSON.stringify({
				username,
				email,
				password,
				token,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const data: RegisterResponse = await response.json();

		if (data.success) {
			error = undefined;
			localStorage.setItem('key', `Bearer ${data.data}`);

			goto('/feed');
		} else {
			error = data.message;
		}
	}
</script>

<svelte:head>
	<title>Register</title>
</svelte:head>

<Navbar />

<div class="w-96 w-max-1/2 mt-16 mx-auto h-screen">
	<form class="flex flex-col gap-6">
		<Turnstile
			siteKey="0x4AAAAAAADkoUBguXE2CRSD"
			on:turnstile-callback={event => (token = event.detail.token)}
		/>

		<h1 class="text-center text-4xl font-bold">Create an account</h1>
		<div class="grid gap-6 md:grid-cols-2">
			<div class="form-control w-full">
				<label class="label" for="display-name">
					<span class="label-text">Display name</span>
				</label>
				<input
					type="text"
					id="display-name"
					placeholder="Hack the Feed"
					required
					class="input input-bordered w-full input-primary"
					bind:value={displayName}
				/>
			</div>

			<div class="form-control w-full">
				<label class="label" for="username">
					<span class="label-text">Username</span>
				</label>
				<input
					type="text"
					id="username"
					placeholder="hackthefeed"
					required
					class="input input-bordered w-full input-primary"
					bind:value={username}
				/>
			</div>
		</div>

		<div class="form-control w-full">
			<label class="label" for="email">
				<span class="label-text">Email address</span>
			</label>
			<input
				type="email"
				id="email"
				placeholder="hello@hackthefeed.com"
				required
				class="input input-bordered w-full {error
					? 'input-error'
					: 'input-primary'}"
				bind:value={email}
			/>
			{#if error}
				<label class="label" for="email">
					<span class="label-text-alt text-error">{error}</span>
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
				required
				class="input input-bordered w-full input-primary"
				bind:value={password}
			/>
		</div>

		<div class="grid gap-2">
			<button
				type="submit"
				on:click={register}
				color="green"
				class="btn btn-accent">Register</button
			>

			<span class="mx-auto">
				<a href="/login">
					<p class="hover:underline hover:cursor-pointer text-sm">
						Already registered? Log in.
					</p>
				</a>
			</span>
		</div>
	</form>
</div>
