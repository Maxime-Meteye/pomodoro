<!--© 2025 Maxime Météyé — Released under the MIT License-->
<template setup>
<div popover id="popoverWindow" class="popover glass">
	<div class="slot_container">
		<button class="close_button glass btn theme-danger" popovertarget="popoverWindow" title="Close this window"><span class="material-symbols-outlined">close</span></button>
		<slot></slot>
	</div>
</div>
</template>
<style scoped>

.popover:popover-open{
	transition: bottom 0.2s;
	margin-inline: auto;
	margin-block: auto;
	height: 80vh;
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
	max-height: 100%;
	overflow-y: auto;
	padding:4em 2em;
}

.close_button{
	margin-left: 80%;
	background-color: var(--background-color);
}
.theme-danger{
	--background-color : #d227
}

</style>