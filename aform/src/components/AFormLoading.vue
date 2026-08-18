<template>
	<div class="aform-loading">
		<div class="aform-loading__label">
			<slot></slot>
		</div>
		<div class="aform-loading__bar"></div>
	</div>
</template>

<style scoped>
.aform-loading {
	width: 100%;
	border: 1px solid var(--sc-form-border);
	border-left: 4px solid var(--sc-form-border);
	padding: 1rem;
	margin-bottom: 1rem;
	box-sizing: border-box;
	position: relative;
	overflow: hidden;
	background: var(--sc-input-field-background);
}

.aform-loading__label {
	font-size: 0.9rem;
	color: var(--sc-cell-text-color);
	z-index: 1;
	position: relative;
}

.aform-loading__label:not(:empty)::after {
	content: '...';
	animation: ellipsis 2s infinite;
}

.aform-loading__bar {
	width: 100%;
	height: 100%;
	position: absolute;
	left: -100%;
	top: 0;
	background: linear-gradient(
		90deg,
		rgba(var(--sc-table-loading-color), 0) 0%,
		rgba(var(--sc-table-loading-color), 1) 50%,
		rgba(var(--sc-table-loading-color), 0) 100%
	);
	animation: bar-sweep 2s infinite;
	z-index: 0;
}

@keyframes bar-sweep {
	0% {
		left: -100%;
	}
	100% {
		left: 100%;
	}
}

@keyframes ellipsis {
	0%,
	20% {
		content: '';
	}
	40% {
		content: '.';
	}
	60% {
		content: '..';
	}
	80%,
	100% {
		content: '...';
	}
}
</style>
