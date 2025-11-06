<template setup>
<div popover id="popoverWindow" class="popover">
	<slot></slot>
</div>
</template>
<style scoped>

.popover:popover-open{
	transition: bottom 0.2s;
	bottom: 0;
	@starting-style{
		transition: bottom 0.2s;
		bottom: -200%;
	}
}
.popover::backdrop{
	backdrop-filter: blur(1px);
}

</style>