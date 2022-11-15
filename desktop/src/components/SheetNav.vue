<template>
	<footer>
		<ul class="tabs">
			<li class="hidebreadcrumbs" @click="toggleBreadcrumbs" @keydown.enter="toggleBreadcrumbs">
				<a tabindex="0"><div :class="rotateHideTabIcon">×</div></a>
			</li>
			<li
				class="hometab"
				@click="navigateHome"
				@keydown.enter="navigateHome"
				:style="{ display: breadcrumbsVisibile ? 'block' : 'none' }">
				<router-link to="/home" tabindex="0">
					<svg
						version="1.1"
						id="Capa_1"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						x="0px"
						y="0px"
						viewBox="0 0 424.098 424.098"
						style="enable-background: new 0 0 424.098 424.098"
						xml:space="preserve">
						<g>
							<path
								style="fill: #010002"
								d="M351.191,401.923H72.901c-4.487,0-8.129-3.633-8.129-8.129V242.262l-56.664-0.114
								c-3.284-0.008-6.243-1.992-7.495-5.023c-1.252-3.04-0.553-6.527,1.764-8.852L206.104,24.546c1.853-1.845,4.503-2.666,7.047-2.276
								c2.414,0.39,4.511,1.845,5.731,3.942l47.43,47.43V58.499c0-4.487,3.633-8.129,8.129-8.129h47.755c4.495,0,8.129,3.642,8.129,8.129
								v79.156l91.39,91.398c2.325,2.325,3.024,5.828,1.764,8.868c-1.26,3.032-4.227,5.007-7.511,5.007c-0.008,0-0.008,0-0.016,0
								l-56.64-0.114v150.98C359.32,398.29,355.686,401.923,351.191,401.923z M81.03,385.666h262.033V234.67
								c0-2.162,0.854-4.235,2.39-5.755c1.528-1.52,3.585-2.374,5.739-2.374c0.008,0,0.008,0,0.016,0l45.105,0.089l-79.855-79.863
								c-1.528-1.528-2.382-3.593-2.382-5.747V66.628h-31.498v26.645c0,3.284-1.975,6.251-5.015,7.511
								c-3.032,1.268-6.527,0.569-8.86-1.764l-57.038-57.038l-183.95,183.95l45.203,0.089c4.487,0.008,8.112,3.642,8.112,8.129
								C81.03,234.149,81.03,385.666,81.03,385.666z" />
						</g>
					</svg>
				</router-link>
			</li>
			<li
				class="searchtab"
				@click="toggleSearch"
				@keydown.enter="toggleSearch"
				:style="{ display: breadcrumbsVisibile ? 'block' : 'none' }">
				<a tabindex="0">
					<span :style="{ display: searchVisibile ? 'none' : 'block' }">
						<svg style="width: 11pt">
							<g transform="matrix(-0.08088215,0,0,0.08088215,9.8016177,3.1263021e-6)">
								<path
									d="M 93.148438,80.832031 C 109.5,57.742188 104.03125,25.769531 80.941406,9.421875 57.851562,-6.925781 25.878906,-1.460938 9.53125,21.632812 -6.816406,44.722656 -1.351562,76.691406 21.742188,93.039062 38.222656,104.70703 60.011719,105.60547 77.394531,95.339844 l 37.769529,37.542966 c 4.07813,4.29297 10.86328,4.46485 15.15625,0.38672 4.29297,-4.07422 4.46485,-10.85937 0.39063,-15.15234 -0.12891,-0.13672 -0.25391,-0.26172 -0.39063,-0.39063 z m -41.839844,3.5 C 33.0625,84.335938 18.269531,69.554688 18.257812,51.308594 18.253906,33.0625 33.035156,18.269531 51.285156,18.261719 c 18.222656,-0.0078 33.007813,14.75 33.042969,32.972656 0.03125,18.25 -14.742187,33.066406 -32.996094,33.097656 -0.0078,0 -0.01172,0 -0.02344,0 z m 0,0"
									style="fill: #000000; fill-opacity: 1; fill-rule: nonzero; stroke: none"
									id="path2" />
							</g>
						</svg>
					</span>
					<input
						v-model="searchText"
						ref="searchinput"
						:style="{ display: searchVisibile ? 'block' : 'none' }"
						@click="handleSearchInput($event)"
						@input="handleSearchInput($event)"
						@blur="handleSearch($event)"
						@keydown.enter="handleSearch($event)"
						type="text" />
				</a>
			</li>
			<li
				v-for="(breadcrumb, index) in breadcrumbs"
				:key="index"
				:style="{ display: breadcrumbsVisibile ? 'block' : 'none' }">
				<router-link tabindex="0" :to="breadcrumb.to"> {{ breadcrumb.title }} </router-link>
			</li>
		</ul>
	</footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'SheetNav',
	data() {
		return {
			breadcrumbs: [],
			breadcrumbsVisibile: true,
			searchVisibile: false,
			searchText: '',
		}
	},
	methods: {
		toggleBreadcrumbs() {
			this.breadcrumbsVisibile = !this.breadcrumbsVisibile
		},
		toggleSearch() {
			this.searchVisibile = !this.searchVisibile
			this.$nextTick(() => {
				this.$refs.searchinput.focus()
			})
		},
		handleSearchInput(e) {
			e.preventDefault()
			e.stopPropagation()
		},
		handleSearch(e) {
			e.preventDefault()
			e.stopPropagation()
			this.toggleSearch()
		},
		navigateHome(e) {
			console.log(e)
		},
	},
	computed: {
		rotateHideTabIcon() {
			return this.breadcrumbsVisibile ? 'unrotated' : 'rotated'
		},
	},
	mounted() {
		this.breadcrumbs = this.$props.breadcrumbs || []
	},
})
</script>
<style scoped>
footer {
	position: fixed;
	bottom: 0px;
	width: 100%;
	background-color: transparent;
	height: 2rem;
	z-index: 100;
	text-align: left;
	font-size: 100%;
	display: flex;
	justify-content: right;
	padding-bottom: 0.2rem;
}
ul {
	display: flex;
	flex-direction: row-reverse;
}

.tabs li {
	/* Makes a horizontal row */
	float: left;
	list-style-type: none;
	/* So the psueudo elements can be
     abs. positioned inside */
	position: relative;
}
.tabs a {
	float: left;
	padding: 1ch 4ch 4ch 4ch;
	text-decoration: none;
	color: black;
	background: #aaa;
	outline: 2px solid inherit;
	outline-offset: -2px;

	/* Only round the top corners */
	-webkit-border-top-left-radius: 15px;
	-webkit-border-top-right-radius: 15px;
	-moz-border-radius-topleft: 15px;
	-moz-border-radius-topright: 15px;
	border-top-left-radius: 15px;
	border-top-right-radius: 15px;
}
.tabs .router-link-active {
	/* Highest, active tab is on top */
	z-index: 3;
}
.router-link-active {
	/* Colors when tab is active */
	background: #827553;
	color: black;
	box-shadow: #999;
}
.tabs li:before,
.tabs li:after,
.tabs li a:before,
.tabs li a:after {
	/* All pseudo elements are
     abs. positioned and on bottom */
	position: absolute;
	bottom: 0;
}
/* Only the first, last, and active
   tabs need pseudo elements at all */
.tabs li:last-child:after,
.tabs li:last-child a:after,
.tabs li:first-child:before,
.tabs li:first-child a:before,
.tabs .router-link-active:after,
.tabs .router-link-active:before,
.tabs .router-link-active a:after,
.tabs .router-link-active a:before {
	content: '';
}
.tabs .router-link-active:before,
.tabs .router-link-active:after {
	background: transparent;

	/* Squares below circles */
	z-index: 1;
}
/* Squares */
.tabs li:before,
.tabs li:after {
	background: transparent;
	width: 10px;
	height: 10px;
}
.tabs li:before {
	left: -10px;
}
.tabs li:after {
	right: -10px;
}
/* Circles */
.tabs li a:after,
.tabs li a:before {
	width: 20px;
	height: 20px;
	/* Circles are circular */
	-webkit-border-radius: 10px;
	-moz-border-radius: 10px;
	border-radius: 10px;
	background: transparent;

	/* Circles over squares */
	z-index: 2;
}
.tabs .router-link-active a:after,
.tabs .router-link-active a:before {
	background: transparent;
}
/* First and last tabs have different
   outside color needs */
.tabs li:first-child.router-link-active a:before,
.tabs li:last-child.router-link-active a:after {
	background: transparent;
}
.tabs li a:before {
	left: -20px;
}
.tabs li a:after {
	right: -20px;
}
.hidebreadcrumbs a {
	width: 1ch;
	min-width: calc(66px - 4ch);
	background-color: #827553;
	padding-left: 2ch;
	padding-right: 2ch;
	padding-top: 3px;
	font-size: 150%;
	text-align: center;
}
.rotated {
	/* border: 1px solid red; */
	transform: rotate(45deg);
	-webkit-transform: rotate(45deg);
	-moz-transform: rotate(45deg);
	-ms-transform: rotate(45deg);
	-o-transform: rotate(45deg);
	transition: transform 250ms;
}
.unrotated {
	/* border: 1px solid red; */
	transform: rotate(0deg);
	-webkit-transform: rotate(0deg);
	-moz-transform: rotate(0deg);
	-ms-transform: rotate(0deg);
	-o-transform: rotate(0deg);
	transition: transform 250ms;
}
a:active,
a:hover,
a:focus {
	outline: 2px solid black;
	z-index: 3;
}
.hometab a {
	width: 1ch;
	min-width: calc(66px - 4ch);
	background-color: #827553;
	padding-left: 2ch;
	padding-right: 2ch;
	padding-top: 6px;
	text-align: center;
}
.hometab svg {
	height: 14pt;
	width: 14pt;
}
.searchtab a {
	/* width: 100%; */
	min-width: calc(66px - 4ch);
	background-color: #827553;
	padding-left: 2ch;
	padding-right: 2ch;
	padding-top: 11px;
	font-size: 150%;
	align-items: center;
}
.searchtab svg {
	padding-left: 0.25ch;
}
.searchtab input {
	margin-top: -4px;
	outline: none;
	border: none;
	border-bottom: 1.5px solid black;
	background-color: transparent;
	text-align: right;
	font-size: 11pt;
}
</style>
