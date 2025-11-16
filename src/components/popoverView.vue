<!--© 2025 Maxime Météyé — Released under the MIT License-->
<template setup>
<div popover id="popoverWindow" class="popover glass">
	<button class="close_button glass btn theme-danger" popovertarget="popoverWindow" title="Close this window"><span class="material-symbols-outlined">close</span></button>
	<div class="slot_container">
		<slot></slot>
	</div>
</div>
</template>
<style scoped>

.popover:popover-open{
	transition: bottom 0.2s;
	margin-inline: auto;
	margin-block: auto;
	height: 40vh;
	max-width: 100vw;
	max-width: 100dvw;
	bottom: 0;
	border-radius: 1em;
	backdrop-filter: blur(8px);

	@starting-style{
		transition: bottom 0.2s;
		bottom: -200%;
	}
}

.popover::backdrop{
	backdrop-filter: blur(4px);
}

.slot_container{
	max-height: 70%;
	overflow-y: scroll;
	padding:1em;
}

.close_button{
	margin: 1em;
	margin-left: 75%;
	background-color: var(--background-color);
}
.theme-danger{
	--background-color : #d227
}

</style>