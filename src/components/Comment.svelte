<script lang="ts">
	import type { Comment } from '$/app';
	import { user } from '$/stores/auth';
	import Time from 'svelte-time/src/Time.svelte';

	export let comment: Comment;
	export let postId: string;
	export let depth = 0;

	let content = '';

	async function reply() {
		const response = await fetch(
			`https://api.hackthefeed.com/posts/${postId}/comments/${comment.id}/reply`,
			{
				method: 'POST',
				body: JSON.stringify({
					content,
				}),
				headers: {
					'Content-Type': 'application/json',
					Authorization: $user!,
				},
			}
		);

		const json = await response.json();

		if (!json.success) return;

		if (comment.children) {
			comment.children.unshift(json.data);
		} else {
			comment.children = [json.data];
		}

		content = '';
		comment = comment;
	}
</script>

<input type="checkbox" id="new-reply-modal-{comment.id}" class="modal-toggle" />
<label for="new-reply-modal-{comment.id}" class="modal cursor-pointer">
	<label class="modal-box relative" for="">
		<h3 class="text-lg font-bold">
			Replying to {comment.author.displayName ?? comment.author.username}
		</h3>

		<label class="label" for="comment-content">
			<span class="label-text">Your comment</span>
		</label>
		<textarea
			id="comment-content"
			placeholder="Write here..."
			rows="4"
			class="textarea textarea-bordered w-full"
			bind:value={content}
		/>

		{#if content}
			<div class="modal-action">
				<label
					class="btn btn-success"
					for="new-reply-modal-{comment.id}"
					on:click={reply}
					on:keydown
				>
					Reply
				</label>
			</div>
		{/if}
	</label>
</label>

<div class="flex flex-row">
	<label
		for="new-reply-modal-{comment.id}"
		class="btn btn-ghost w-12 h-12 p-0 mr-2"
	>
		<svg class="fill-current w-6 h-6" viewBox="0 0 24 24">
			<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
		</svg>
	</label>

	<div class="flex flex-col gap-1">
		<span>
			<h1 class="text-lg font-bold text-primary inline">
				{comment.author.displayName || comment.author.username}
			</h1>
			<Time timestamp={comment.createdAt} relative class="text-sm inline" />
		</span>

		<p class="text-lg">{comment.content}</p>

		{#if comment.children?.length}
			{#each comment.children as child}
				<svelte:self comment={child} depth={depth + 1} {postId} />
			{/each}
		{/if}
	</div>
</div>
