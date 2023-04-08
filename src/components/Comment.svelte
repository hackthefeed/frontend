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

<div class="flex flex-col gap-1">
	<span>
		<h1 class="text-lg font-bold text-primary inline">
			{comment.author.displayName || comment.author.username}
		</h1>
		<Time timestamp={comment.createdAt} relative class="text-sm inline" />
	</span>

	<p class="text-lg">{comment.content}</p>
	<label for="new-reply-modal-{comment.id}" class="btn btn-ghost">Reply</label>

	{#if comment.children?.length}
		<div style="margin-left: {(depth + 1) * 1.5}rem">
			{#each comment.children as child}
				<svelte:self comment={child} depth={depth + 1} />
			{/each}
		</div>
	{/if}
</div>
