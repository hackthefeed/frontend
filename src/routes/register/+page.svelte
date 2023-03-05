<script context="module" lang="ts">
	type RegisterResponse =
		| {
				success: true;
				user: {
					key: string;
				};
		  }
		| {
				success: false;
				message: string;
		  };
</script>

<script lang="ts">
	import Header from '$/components/Header.svelte';
	import { goto } from '$app/navigation';
	import { Input, Label, Button, Heading, P } from 'flowbite-svelte';

	let displayName = '';
	let username = '';
	let email = '';
	let password = '';

	let error: string | undefined;

	async function register() {
		const response = await fetch('https://api.hackthefeed.com/register', {
			method: 'POST',
			body: JSON.stringify({
				username: username,
				email: email,
				password: password,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const data: RegisterResponse = await response.json();

		if (data.success) {
			localStorage.setItem('key', data.user.key);

			goto('/feed');
		} else {
			error = data.message;
		}
	}
</script>

<Header route="none" />

<div
	class="w-96 w-max-1/2 mt-32 mx-auto bg-gray-200 dark:bg-slate-800 p-5 rounded-lg"
>
	<form>
		<Heading class="text-center">Register</Heading>
		<div class="grid gap-6 mb-6 md:grid-cols-2 mt-6">
			<div>
				<Label for="first_name" class="mb-2">Display name</Label>
				<Input
					type="text"
					id="first_name"
					placeholder="Hack The Feed"
					required
					bind:value={displayName}
				/>
			</div>
			<div>
				<Label for="last_name" class="mb-2">Username</Label>
				<Input
					type="text"
					id="last_name"
					placeholder="hackthefeed"
					required
					bind:value={username}
				/>
			</div>
		</div>
		<div class="mb-6">
			<Label for="email" class="mb-2">Email address</Label>
			<Input
				type="email"
				id="email"
				placeholder="hello@hackthefeed.com"
				required
				bind:value={email}
			/>
		</div>
		<div class="mb-6">
			<Label for="password" class="mb-2">Password</Label>
			<Input
				type="password"
				id="password"
				placeholder="•••••••••"
				required
				bind:value={password}
			/>
		</div>
		<div class="grid gap-2">
			<Button type="submit" on:click={register} color="green">Register</Button>

			<span class="mx-auto">
				<a href="/login">
					<P
						color="hover:underline hover:cursor-pointer text-gray-400 dark:text-gray-300 text-sm"
					>
						Already registered? Log in.
					</P>
				</a>
			</span>
		</div>
	</form>
</div>
