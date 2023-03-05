<script context="module" lang="ts">
	export type Post = {
		id: string;
		title: string;
		content: string;
		createdAt: string;
		updatedAt: string;
		url: string;
		thumbnail?: string;
		producer: {
			name: string;
		};
		notes: {
			content: string;
			id: number;
			decrypted?: string;
		}[];
	};
</script>

<script lang="ts">
	import Header from '$/components/Header.svelte';
	import {
		Button,
		Heading,
		Hr,
		Modal,
		Textarea,
		Label,
		Input,
	} from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { io } from 'socket.io-client';
	import Time from 'svelte-time';

	import type { Socket } from 'socket.io-client';

	let key: string | null = null;
	let posts: Post[] = [];
	let socket: Socket;

	if (browser) {
		key = localStorage.getItem('key');

		if (key === null) {
			goto('/login');
		} else {
			socket = io('ws://api.hackthefeed.com/socket', {
				query: {
					key,
				},
			});

			socket.on('postCreated', (post: Post) => {
				posts.unshift(post);
				posts = posts;
			});

			fetchSubscriptions();
		}
	}

	async function fetchSubscriptions() {
		const response = await fetch(
			`https://api.hackthefeed.com/me/posts?key=${key}`
		);

		const data = await response.json();

		posts = data.data;
	}

	let noteData: Post | null = null;
	let openNoteModal = false;
	let openNoteCreationModal = false;

	function viewNotes(post: Post) {
		noteData = post;
		openNoteModal = true;
		openNoteCreationModal = false;
	}

	function createNote() {
		openNoteModal = false;
		openNoteCreationModal = true;
	}

	let noteContent = '';
	let encryptionKey = '';
	let decryptionKey = '';

	async function submitNoteCreation() {
		const encryptedContent = encrypt(noteContent, encryptionKey);

		const response = await fetch('https://api.hackthefeed.com/post/note', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				key,
				postId: noteData?.id,
				content: encryptedContent,
			}),
		});

		const data = await response.json();

		noteData?.notes.unshift({
			content: encryptedContent,
			id: data.data,
		});

		noteData = noteData;
		openNoteModal = true;
		openNoteCreationModal = false;
	}

	function encrypt(content: string, key: string) {
		// convert key to char numbers
		const keyNumber = key.split('').map(char => char.charCodeAt(0));
		const limit = 0xffff;

		// cycle through the key, offsetting the char of the current content
		// character by the current key number
		const encrypted = content
			.split('')
			.map((char, index) => {
				const charCode: number = char.charCodeAt(0);
				const offset = keyNumber[index % keyNumber.length];
				const newCharCode = charCode + offset;

				// if the new char code is greater than the limit, cycle it
				// back to the start
				if (newCharCode > limit) {
					return String.fromCharCode(newCharCode - limit);
				}

				return String.fromCharCode(newCharCode);
			})
			.join('');

		return encrypted;
	}

	function decrypt(content: string, key: string) {
		// convert key to char numbers
		const keyNumber = key.split('').map(char => char.charCodeAt(0));
		const limit = 0xffff;

		// cycle through the key, offsetting the char of the current content
		// character by the current key number
		const decrypted = content
			.split('')
			.map((char, index) => {
				const charCode: number = char.charCodeAt(0);
				const offset = keyNumber[index % keyNumber.length];
				const newCharCode = charCode - offset;

				// if the new char code is greater than the limit, cycle it
				// back to the start
				if (newCharCode < 0) {
					return String.fromCharCode(newCharCode + limit);
				}

				return String.fromCharCode(newCharCode);
			})
			.join('');

		return decrypted;
	}
</script>

<Header route="subscriptions" loggedIn={key !== null} />

<Modal title="Your note" bind:open={openNoteModal} size="xl">
	{#if noteData?.notes?.[0] !== undefined}
		<div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg w-96">
			<p
				class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight"
			>
				{noteData.notes[0].decrypted ?? noteData.notes[0].content}
			</p>
		</div>
	{:else}
		<p
			class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight w-96"
		>
			You don't have any notes.
		</p>
	{/if}

	<span>
		<Label for="website" class="mb-2 mt-2">Decryption key</Label>
		<Input
			type="password"
			id="key"
			placeholder="•••••••••"
			required
			bind:value={decryptionKey}
		/>
	</span>

	<svelte:fragment slot="footer">
		<Button on:click={createNote} color="green">New note</Button>
		<Button
			on:click={() => {
				const note = noteData?.notes[0];

				if (note) {
					note.decrypted = decrypt(note.content, decryptionKey);
					noteData = noteData;
				}
			}}
			color="red">Decrypt</Button
		>
	</svelte:fragment>
</Modal>

<Modal title="Create new note" bind:open={openNoteCreationModal} size="xl">
	<span>
		<Label for="textarea-id" class="w-96 mb-2">Your note content</Label>
		<Textarea
			id="textarea-id"
			placeholder="Write here..."
			rows="4"
			name="message"
			bind:value={noteContent}
		/>
	</span>

	<span>
		<Label for="website" class="mb-2 mt-2">Encryption key</Label>
		<Input
			type="password"
			id="key"
			placeholder="•••••••••"
			required
			bind:value={encryptionKey}
		/>
	</span>

	<svelte:fragment slot="footer">
		<Button on:click={submitNoteCreation} color="green">Create note</Button>
	</svelte:fragment>
</Modal>

{#if key}
	<div class="m-auto w-1/2 mt-1/4 grid gap-6 justify-center">
		{#if posts.length > 0}
			{#each posts as post}
				<div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
					<a href={post.url}>
						<h5
							class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white hover:underline"
						>
							{@html post.title}
						</h5>
					</a>
					<p
						class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight"
					>
						{@html post.content}
					</p>

					<Hr hrClass="my-2 bg-gray-200 rounded border-0 dark:bg-gray-700" />

					<div class="float-left">
						<Button size="sm" on:click={() => viewNotes(post)}>Edit note</Button
						>
					</div>

					<ul class="text-xs text-white/[.8] float-right">
						<li
							class="inline-block relative pr-6 last:pr-0 last-of-type:before:hidden before:absolute before:top-1/2 before:right-2 before:-translate-y-1/2 before:w-1 before:h-1 before:bg-gray-300 before:rounded-full dark:text-gray-300 dark:before:bg-gray-500"
						>
							{post.producer.name}
						</li>
						<li
							class="inline-block relative pr-6 last:pr-0 last-of-type:before:hidden before:absolute before:top-1/2 before:right-2 before:-translate-y-1/2 before:w-1 before:h-1 before:bg-gray-300 before:rounded-full dark:text-gray-300 dark:before:bg-gray-500"
						>
							<Time timestamp={post.createdAt} relative />
						</li>
					</ul>
				</div>
			{/each}
		{:else}
			<Heading customSize="text-4xl font-bold sm:mt-8 md:mt-16 lg:mt-32">
				You don't have any news yet!
			</Heading>
			<Button href="/feeds">
				View available feeds
				<svg
					aria-hidden="true"
					class="ml-2 -mr-1 w-5 h-5"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill-rule="evenodd"
						d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</Button>
		{/if}
	</div>
{/if}
