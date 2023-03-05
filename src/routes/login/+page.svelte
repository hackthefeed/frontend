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
	import { Input, Label, Button, Heading, Helper, P } from 'flowbite-svelte';

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

<Header route="none" />

<div
	class="w-96 w-max-1/2 mt-32 mx-auto bg-gray-200 dark:bg-slate-800 p-5 rounded-lg"
>
	<Heading class="text-center">Log in</Heading>
	<form>
		<div class="mb-6 mt-6">
			<Label for="email" class="mb-2" color={error ? 'red' : undefined}
				>Email address or username</Label
			>
			<Input
				type="email"
				id="email"
				placeholder="hello@hackthefeed.com"
				required
				bind:value={email}
			/>
			{#if error}
				<Helper class="mt-2" color="red">Invalid username or password.</Helper>
			{/if}
		</div>
		<div class="mb-6">
			<Label for="password" class="mb-2" color={error ? 'red' : undefined}
				>Password</Label
			>
			<Input
				type="password"
				id="password"
				placeholder="•••••••••"
				required
				bind:value={password}
			/>
			{#if error}
				<Helper class="mt-2" color="red">Invalid username or password.</Helper>
			{/if}
		</div>
	</form>

	<div class="grid gap-2">
		<Button type="submit" on:click={logIn} color="green">Log in</Button>
		<Button
			type="submit"
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
			Login with Microsoft
		</Button>

		<span class="mx-auto">
			<a href="/register">
				<P
					color="hover:underline hover:cursor-pointer text-gray-400 dark:text-gray-300 text-sm"
				>
					No account? Register here.
				</P>
			</a>
		</span>
	</div>
</div>
