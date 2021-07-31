# RATHAD
Scottish Gaelic for 'road'

## To do:
- get _actual_ schema for forms and {{ view }}
	- unpack layout and data => figure out skeltons and async
	- include custom scripts
- trigger hooks
	- figure out field-level change hooks
	- route change hooks
	- state machine hooks
- "sheet" navigation
- command palette (modal)

## Resources

- Router integration
	-	Before:
		- Authorization
	- After:
		- [Load scripts](https://vue-view.com/how-to-load-an-external-script-in-vue-component/)
		- Load schema, render form/ table

- Adapter
 - Universal cache? [Quell](https://www.npmjs.com/package/@quell/client)

## Usage
```js
let rathad = new Rathad() // you can also pass in a complete hook structure to start

rathad.addHook('onAppLoad', function getMeta(){
	...
})

rathad.addHook('onAddLoad', getMeta) // where the function is declared elsewhere and/or imported

```



