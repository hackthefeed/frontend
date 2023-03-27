<script context="module" lang="ts">
	export type Comment = {
		id: number;
		content: string;
		author: {
			username: string;
			displayName: string;
		};
	};

	export type Post = {
		id: string;
		title: string;
		content: string;
		createdAt: string;
		updatedAt: string;
		url: string;
		thumbnail?: string;
		source: {
			id: string;
			name: string;
		};
		notes: {
			content: string;
			id: string;
			decrypted?: string;
		}[];
		_count: {
			comments: number;
		};
		comments?: Comment[];
	};
</script>

<script lang="ts">
	import Header from '$/components/Header.svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { io } from 'socket.io-client';
	import Time from 'svelte-time';
	import InfiniteScroll from 'svelte-infinite-scroll';

	import type { Socket } from 'socket.io-client';

	let key: string | null = null;
	let posts: Post[] | null = null;
	let socket: Socket;
	let page = 1;
	let loading = false;
	let end = false;

	if (browser) {
		key = localStorage.getItem('key');

		if (key === null) {
			goto('/login');
		} else {
			socket = io('wss://api.hackthefeed.com', {
				path: '/ws',
				query: {
					key,
				},
			});

			socket.on('postCreated', (post: Post) => {
				if (posts !== null) {
					posts.unshift(post);
					posts = posts;
				}
			});

			fetchSubscriptions();
		}
	}

	async function fetchSubscriptions() {
		// don't fetch if we're already loading
		if (loading || end) return;

		const usePage = page++;

		loading = true;

		const response = await fetch(
			`https://api.hackthefeed.com/me/feed?page=${usePage}`,
			{
				headers: {
					key: key!,
				},
			}
		);

		const data = await response.json();

		if (data.data.length === 0) {
			end = true;
		}

		if (posts === null) {
			posts = data.data;
		} else {
			posts.push(...data.data);
			posts = posts;
		}

		loading = false;
	}

	let noteData: Post | null = null;
	let postData: Post | null = null;

	async function viewComments(post: Post) {
		postData = post;
		postData.comments = await fetch(
			`https://api.hackthefeed.com/posts/${post.id}/comments`,
			{
				headers: {
					key: key!,
				},
			}
		)
			.then(res => res.json())
			.then(data => data.data);

		postData = postData;
	}

	function viewNotes(post: Post) {
		noteData = post;
	}

	let commentContent = '';
	let noteContent = '';
	let encryptionKey = '';
	let decryptionKey = '';

	async function submitCommentCreation() {
		const response = await fetch(
			`https://api.hackthefeed.com/posts/${postData?.id}/comments`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					key: key!,
				},
				body: JSON.stringify({
					content: commentContent,
				}),
			}
		);

		const data = await response.json();

		if (postData !== null) {
			if (postData.comments === undefined) {
				postData.comments = [data.data];
			} else {
				postData.comments.unshift(data.data);
			}

			postData._count.comments++;
		}

		postData = postData;
		posts = posts;
	}

	async function submitNoteCreation() {
		const encryptedContent = encrypt(noteContent, encryptionKey);

		const response = await fetch(
			`https://api.hackthefeed.com/posts/${noteData?.id}/notes`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					key: key!,
				},
				body: JSON.stringify({
					content: encryptedContent,
				}),
			}
		);

		const data = await response.json();

		noteData?.notes.unshift({
			content: encryptedContent,
			id: data.data,
		});

		noteData = noteData;
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

<svelte:head>
	<title>My Feed</title>
</svelte:head>

<Header loggedIn={key !== null} />

<input type="checkbox" id="view-comments-modal" class="modal-toggle" />
<div class="modal">
	<div class="modal-box relative">
		<label
			for="view-comments-modal"
			class="btn btn-sm btn-circle absolute right-2 top-2">✕</label
		>

		<h3 class="font-bold text-lg">
			Comments ({postData?._count?.comments ?? 0})
		</h3>

		{#if postData?.comments !== undefined}
			{#each postData.comments as comment}
				<div class="p-4 rounded-lg w-96">
					<h2 class="text-bold text-accent">
						{comment.author.displayName || comment.author.username}
					</h2>
					<p class="whitespace-pre-line">
						{comment.content}
					</p>
				</div>
			{/each}
		{/if}

		<div class="modal-action">
			<label for="new-comment-modal" class="btn btn-success">New comment</label>
		</div>
	</div>
</div>

<input type="checkbox" id="new-comment-modal" class="modal-toggle" />
<div class="modal">
	<div class="modal-box relative">
		<label
			for="new-comment-modal"
			class="btn btn-sm btn-circle absolute right-2 top-2">✕</label
		>

		<h3 class="font-bold text-lg pb-4">Create new comment</h3>

		<span>
			<textarea
				id="comment-content"
				placeholder="Write here..."
				rows="4"
				class="textarea textarea-bordered w-full"
				bind:value={commentContent}
			/>
		</span>

		{#if commentContent}
			<div class="modal-action">
				<label
					for="new-comment-modal"
					on:click={submitCommentCreation}
					on:keydown
					class="btn btn-success">Create comment</label
				>
			</div>
		{/if}
	</div>
</div>

<input type="checkbox" id="edit-note-modal" class="modal-toggle" />
<div class="modal">
	<div class="modal-box relative">
		<label
			for="edit-note-modal"
			class="btn btn-sm btn-circle absolute right-2 top-2">✕</label
		>

		<h3 class="font-bold text-lg">Your note</h3>
		{#if noteData?.notes?.[0] !== undefined}
			<div class="p-4 rounded-lg w-96">
				<p>
					{noteData.notes[0].decrypted ?? noteData.notes[0].content}
				</p>
			</div>
			<label class="label" for="password">
				<span class="label-text">Decryption key</span>
			</label>
			<input
				type="password"
				id="password"
				placeholder="•••••••••"
				class="input input-bordered w-full"
				bind:value={decryptionKey}
			/>
		{:else}
			<p>You don't have any notes.</p>
		{/if}
		<div class="modal-action">
			<label for="new-note-modal" class="btn btn-success">New note</label>

			{#if decryptionKey && noteData?.notes.length}
				<button
					on:click={() => {
						const note = noteData?.notes[0];

						if (note) {
							note.decrypted = decrypt(note.content, decryptionKey);
							noteData = noteData;
						}
					}}
					class="btn btn-error"
				>
					Decrypt
				</button>
			{/if}
		</div>
	</div>
</div>

<input type="checkbox" id="new-note-modal" class="modal-toggle" />
<div class="modal">
	<div class="modal-box relative">
		<label
			for="new-note-modal"
			class="btn btn-sm btn-circle absolute right-2 top-2">✕</label
		>

		<h3 class="font-bold text-lg pb-4">Create new note</h3>

		<span>
			<label class="label" for="note-content">
				<span class="label-text">Note content</span>
			</label>
			<textarea
				id="note-content"
				placeholder="Write here..."
				rows="4"
				class="textarea textarea-bordered w-full"
				bind:value={noteContent}
			/>
		</span>

		<span>
			<label class="label" for="note-key">
				<span class="label-text">Encryption key</span>
			</label>
			<input
				type="password"
				id="note-key"
				placeholder="•••••••••"
				required
				class="input input-bordered w-full"
				bind:value={encryptionKey}
			/>
		</span>

		{#if noteContent && encryptionKey}
			<div class="modal-action">
				<label
					for="new-note-modal"
					on:click={submitNoteCreation}
					on:keydown
					class="btn btn-success">Create note</label
				>
			</div>
		{/if}
	</div>
</div>

{#if key}
	{#if posts !== null && posts.length > 0}
		<div class="mx-auto w-full sm:max-w-prose my-16 grid gap-6 justify-center">
			{#each posts as post}
				<div class="bg-base-200 p-4 rounded-lg">
					<a href={post.url}>
						<h5 class="mb-2 text-2xl font-bold tracking-tight hover:underline">
							{@html post.title}
						</h5>
					</a>
					<p
						class="mb-3 font-normal leading-tight mx-auto w-full sm:max-w-prose"
					>
						{@html post.content}
					</p>

					<div class="float-left flex flex-row gap-2">
						<label
							for="edit-note-modal"
							class="btn btn-sm btn-primary"
							on:click={() => viewNotes(post)}
							on:keydown
						>
							Edit note
						</label>
						<label
							class="btn btn-sm gap-2"
							for="view-comments-modal"
							on:click={() => viewComments(post)}
							on:keydown
						>
							Comments
							{#if post._count.comments}
								<span class="badge badge-sm badge-secondary">
									{post._count.comments > 99 ? '99+' : post._count.comments}
								</span>
							{/if}
						</label>
					</div>

					<ul class="text-xs float-right">
						<li
							class="inline-block relative pr-6 last:pr-0 last-of-type:before:hidden before:absolute before:top-1/2 before:right-2 before:-translate-y-1/2 before:w-1 before:h-1 before:rounded-full"
						>
							{post.source.name}
						</li>
						<li
							class="inline-block relative pr-6 last:pr-0 last-of-type:before:hidden before:absolute before:top-1/2 before:right-2 before:-translate-y-1/2 before:w-1 before:h-1 before:rounded-full"
						>
							<Time timestamp={post.createdAt} relative />
						</li>
					</ul>
				</div>
			{/each}
		</div>
		{#if loading}
			<div class="grid place-items-center w-screen h-32 -mt-8">
				<div
					class="animate-spin inline-block border-[3px] border-current border-t-transparent rounded-full text-primary w-8 h-8"
					role="status"
					aria-label="loading"
				/>
			</div>
		{:else}
			<InfiniteScroll
				threshold={1_000}
				on:loadMore={fetchSubscriptions}
				window
			/>
		{/if}
	{:else if posts !== null && posts.length === 0}
		<div class="h-screen w-screen grid place-items-center -mt-8">
			<span>
				<h1 class="text-4xl font-bold">You don't have any news yet!</h1>
				<a href="/feeds" class="btn btn-primary w-full">
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
				</a>
			</span>
		</div>
	{:else}
		<div class="grid place-items-center w-screen h-screen -mt-8">
			<div
				class="animate-spin inline-block border-[3px] border-current border-t-transparent rounded-full text-primary w-8 h-8"
				role="status"
				aria-label="loading"
			/>
		</div>
	{/if}
{/if}
