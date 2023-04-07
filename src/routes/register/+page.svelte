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
	let widgetId: string;

	const messages: Record<string, string> = {
		invalid_captcha: 'Invalid captcha token',
		invalid_email: 'Invalid email address',
		password_too_common: 'Password is too common',
		email_or_username_taken: 'Email or username is already taken',
	};

	let errors = {
		username: undefined as string | undefined,
		email: undefined as string | undefined,
		password: undefined as string | undefined,
	};

	async function register() {
		if (password.length < 8) {
			errors.password = 'Password must be at least 8 characters long';
			errors = errors;

			return;
		} else {
			errors.password = undefined;
			errors = errors;
		}

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
			errors.email = undefined;
			errors.username = undefined;

			localStorage.setItem('key', `Bearer ${data.data}`);

			goto('/feed');
		} else {
			window.turnstile.reset(widgetId);

			if (data.message === 'invalid_captcha') {
				errors.email = messages[data.message];
				errors.username = messages[data.message];
				errors.password = messages[data.message];
			} else if (data.message === 'invalid_email') {
				errors.email = messages[data.message];
				errors.username = undefined;
				errors.password = undefined;
			} else if (data.message === 'password_too_common') {
				errors.email = undefined;
				errors.username = undefined;
				errors.password = messages[data.message];
			} else if (data.message === 'email_or_username_taken') {
				errors.email = messages[data.message];
				errors.username = messages[data.message];
				errors.password = undefined;
			}

			errors = errors;
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
			bind:widgetId
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
					class="input input-bordered w-full input-accent"
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
					class="input input-bordered w-full {errors.username
						? 'input-error'
						: 'input-accent'}"
					bind:value={username}
				/>
				{#if errors.username}
					<label class="label" for="username">
						<span class="label-text-alt text-error">{errors.username}</span>
					</label>
				{/if}
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
				class="input input-bordered w-full {errors.email
					? 'input-error'
					: 'input-accent'}"
				bind:value={email}
			/>
			{#if errors.email}
				<label class="label" for="email">
					<span class="label-text-alt text-error">{errors.email}</span>
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
				class="input input-bordered w-full {errors.password
					? 'input-error'
					: 'input-accent'}"
				bind:value={password}
			/>
			{#if errors.password}
				<label class="label" for="password">
					<span class="label-text-alt text-error">{errors.password}</span>
				</label>
			{/if}
		</div>

		<div class="grid gap-2">
			<button
				type="submit"
				on:click={register}
				color="green"
				class="btn btn-primary">Register</button
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
