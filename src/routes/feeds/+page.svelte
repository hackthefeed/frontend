<script context="module" lang="ts">
	type Producer = {
		id: number;
		name: string;
		subscribed: boolean;
	};
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$/stores/auth';
	import { onMount } from 'svelte';

	let producers: Producer[] | null = null;

	onMount(() => {
		if ($user === null) {
			goto('/login');
		} else {
			getProducers();
		}
	});

	async function getProducers() {
		const response = await fetch(
			`https://api.hackthefeed.com/me/subscriptions`,
			{
				headers: {
					Authorization: $user!,
				},
			}
		);

		const data = await response.json();

		producers = data.data;
	}

	function subscribe(producer: Producer) {
		fetch(`https://api.hackthefeed.com/sources/${producer.id}/subscribe`, {
			headers: {
				Authorization: $user!,
			},
		});

		producer.subscribed = true;
		producers = producers;
	}

	function unsubscribe(producer: Producer) {
		fetch(`https://api.hackthefeed.com/sources/${producer.id}/unsubscribe`, {
			headers: {
				Authorization: $user!,
			},
		});

		producer.subscribed = false;
		producers = producers;
	}
</script>

<svelte:head>
	<title>Feeds</title>
</svelte:head>

{#if $user}
	{#if producers !== null && producers.length > 0}
		<div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each producers as producer}
					<div class="card card-bordered border-neutral bg-base-100">
						<div class="card-body flex justify-between">
							<h2 class="card-title">{producer.name}</h2>
							<div class="card-actions justify-end">
								<button
									class="btn {producer.subscribed
										? 'btn-error'
										: 'btn-success'}"
									on:click={() =>
										producer.subscribed
											? unsubscribe(producer)
											: subscribe(producer)}
									color={producer.subscribed ? 'dark' : 'blue'}
								>
									{producer.subscribed ? 'Unsubscribe' : 'Subscribe'}
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else if producers !== null && producers.length === 0}
		<div class="grid text-center h-screen place-items-center -mt-8">
			<span>
				<h1 class="text-4xl font-bold">No producers found</h1>
				<p>Please try again later.</p>
			</span>
		</div>
	{:else}
		<div class="grid place-items-center w-full min-h-screen">
			<div
				class="animate-spin inline-block border-[3px] border-current border-t-transparent rounded-full text-accent w-8 h-8"
				role="status"
				aria-label="loading"
			/>
		</div>
	{/if}
{:else}
	<div class="grid place-items-center w-full min-h-screen">
		<div
			class="animate-spin inline-block border-[3px] border-current border-t-transparent rounded-full text-accent w-8 h-8"
			role="status"
			aria-label="loading"
		/>
	</div>
{/if}
