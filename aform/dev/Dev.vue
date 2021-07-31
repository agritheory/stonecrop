<template>
<nav>
	<button class="aform-primary-action">SWITCH COLOR</button>
	<button 
		@click="changeSchema"
	class="aform-primary-action">SWITCH SCHEMA</button>
</nav>
	<AForm
		class="aform-main"
		:schema="schema"
		:data="data"
		:key="id"
	/>
</template>
<script>
import basic_form_schema from './assets/basic_form_schema.json'
import basic_fieldset_schema from './assets/basic_fieldset_schema.json'
import basic_table_schema from './assets/basic_table_schema.json'
import fieldset_table_schema from './assets/fieldset_table_schema.json'

export default {
	name: "Dev",
	data() {
		return {
			schema : basic_form_schema,
			id: 0,
			data: [],
			color: '',
			schemaIndex: 0,
		}
	},
	methods: {
		changeSchema(){
			let schemas = [basic_fieldset_schema, basic_form_schema, basic_table_schema, fieldset_table_schema]
			this.schemaIndex = this.schemaIndex + 1 
			if(this.schemaIndex == schemas.length){
				this.schemaIndex = 0
			}
			this.id = this.schemaIndex
			this.schema = schemas[this.schemaIndex]
		}
	}
}

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import url('../src/theme/aform.css');
html {
	font-family: Arimo, sans-serif;
	font-size: 11pt;
}
nav {
	min-height: 60px;
	display: flex;
	/* flex-direction: row; */
	flex-direction: row-reverse;
	align-items:center;
	border-bottom: 2px solid var(--primary-color);
	margin: 0px;
	padding-left: 1ch;
	padding-right: 1ch;
}
.aform-main {
	margin-left: 2ch;
	margin-top: 1.15rem;
}
</style>
