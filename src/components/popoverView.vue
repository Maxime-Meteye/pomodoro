<!--© 2025 Maxime Météyé — Released under the MIT License-->
<template setup>
<div popover id="popoverWindow" class="popover glass">
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


</style>