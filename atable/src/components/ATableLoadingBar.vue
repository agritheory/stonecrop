<template>
	<div class="aloading">
		<h2 class="aloading-header">
			<slot></slot>
		</h2>
		<div class="aloading-bar"></div>
	</div>
</template>

<style scoped>
.aloading {
	width: 100%;
	border-top: 1px solid var(--sc-row-border-color);
	border-bottom: 1px solid var(--sc-row-border-color);
	display: flex;
	background-color: white;
	border-left: 4px solid var(--sc-row-border-color);
	padding-left: 0.5ch !important;
	padding-right: 0.5ch;
	padding-top: var(--sc-atable-row-padding);
	padding-bottom: var(--sc-atable-row-padding);
	align-items: center;
	box-sizing: border-box;
	background: var(--sc-focus-cell-background);
	overflow: hidden;
	position: relative;
}
.aloading-bar {
	width: 50%;
	height: 3px;
	position: absolute;
	left: -100%;
	bottom: 0;
	background: var(--sc-row-border-color);
	animation: bar-left infinite 2s;
	z-index: 0;
}
.aloading-header {
	color: var(--sc-cell-text-color);
	font-family: var(--sc-atable-font-family);
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	font-size: var(--sc-table-font-size);
	padding: 0;
	margin: 0;
	font-weight: normal;
	z-index: 1;
}
.aloading-header::after {
	content: '...';
	animation: ellipse 2s;
	animation-iteration-count: infinite;
}

@keyframes bar-left {
	0% {
		left: -50%;
	}
	100% {
		left: 100%;
	}
}

@keyframes ellipse {
	0% {
		content: '';
	}
	20% {
		content: '';
	}
	40% {
		content: '.';
	}
	60% {
		content: '..';
	}
	80% {
		content: '...';
	}
}
</style>
