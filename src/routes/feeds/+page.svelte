<script context="module" lang="ts">
	type Producer = {
		id: number;
		name: string;
		subscribed: boolean;
	};
</script>

<script lang="ts">
	import Header from '$/components/Header.svelte';
	import { onMount } from 'svelte/internal';
	import {
		Button,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
	} from 'flowbite-svelte';
	import { goto } from '$app/navigation';

	let key: string | null = null;
	let producers: Producer[] = [];

	onMount(() => {
		key = localStorage.getItem('key');

		if (key === null) {
			return goto('/login');
		}

		getProducers();
	});

	async function getProducers() {
		const response = await fetch(
			`https://api.hackthefeed.com/me/subscriptions?key=${key}`
		);

		const data = await response.json();

		producers = data.data;
	}

	function subscribe(producer: Producer) {
		fetch('https://api.hackthefeed.com/feed/subscribe', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				producerId: producer.id,
				key,
			}),
		});

		producer.subscribed = true;
		producers = producers;
	}

	function unsubscribe(producer: Producer) {
		fetch('https://api.hackthefeed.com/feed/unsubscribe', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				producerId: producer.id,
				key,
			}),
		});

		producer.subscribed = false;
		producers = producers;
	}
</script>

<Header route="feeds" />

{#if key}
	{#if producers.length > 0}
		<Table>
			<TableHead>
				<TableHeadCell>ID</TableHeadCell>
				<TableHeadCell>Feed</TableHeadCell>
				<TableHeadCell />
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each producers as producer}
					<TableBodyRow>
						<TableBodyCell>{producer.id}</TableBodyCell>
						<TableBodyCell>{producer.name}</TableBodyCell>
						<TableBodyCell>
							<Button
								on:click={() =>
									producer.subscribed
										? unsubscribe(producer)
										: subscribe(producer)}
								color={producer.subscribed ? 'dark' : 'blue'}
								>{producer.subscribed ? 'Unsubscribe' : 'Subscribe'}</Button
							>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	{/if}
{/if}
