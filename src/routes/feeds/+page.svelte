<script context="module" lang="ts">
	type Producer = {
		id: number;
		name: string;
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
		Checkbox,
		TableSearch,
	} from 'flowbite-svelte';

	let key: string | null = null;
	let producers: Producer[] = [];
	let subscriptions = new Set<number>();

	onMount(() => {
		key = localStorage.getItem('key');

		getProducers();
	});

	// https://api.hackthefeed.com/docs/static/index.html
	// api.hackthefeed.com/me/missing_subscriptions
	// api.hackthefeed.com/feed/subscribe

	async function getProducers() {
		const response = await fetch(
			`https://api.hackthefeed.com/me/missing_subscriptions?key=${key}`
		);

		const data = await response.json();

		producers = data.data;
	}

	function subscribe(id: number) {
		fetch('https://api.hackthefeed.com/feed/subscribe', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				producerId: id,
				key,
			}),
		});

		subscriptions.add(id);
		subscriptions = subscriptions;
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
								on:click={() => subscribe(producer.id)}
								disabled={subscriptions.has(producer.id)}
								>{subscriptions.has(producer.id)
									? 'Subscribed'
									: 'Subscribe'}</Button
							>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	{/if}
{/if}
