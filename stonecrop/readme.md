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

## Features
 - Schema driven form layout / loader
 - CRUD operations
    - trigger actions on CRUD / FSM change
 - `watch` form values for change and trigger actions
 - Localstorage plugin

## Resources

 - [Router integration](https://pinia.vuejs.org/core-concepts/plugins.html#adding-new-external-properties)
  - Stonecrop setup should expect a router or provide a default implementation
  - 

 - After:
  - [Load scripts](https://vue-view.com/how-to-load-an-external-script-in-vue-component/)
  - Load schema, render form/ table

## Design
A context will define schema, events and hooks. 
  - Schema describes the data model and layout of the document.
  - Events are the events that are registered on it and will specific to the context. An application might have 'login', 'onAppLoad', 'beforeRouteChange' and 'logout' events.  A form/document context might define CRUD events. A table component, nested inside the form component might define its own events. I think we want Events to be FSM
  - Hooks are an ordered set of functions, called by Event

  The context will be tree-shaped with a single root. Adding more nodes at the root level isn't a problem, but multiple roots would be disallowed

```
app.schema <Record> // immutable
app.events <FSM> // immutable
app.hooks <OrderedSet> // immutable
app.value <Store> // mutable
app.user // "tyler@agritheory.com"
app.name // "MyFirstERP"
app.doctype.schema <Record> // `app.doctype` lazy loaded by Event in router?
app.doctype.events <FSM> 
app.doctype.hooks <OrderedSet>
app.doctype.hooks.value <Store> 
app.doctype.schema.field.events <FSM>
app.doctype.schema.field.hooks <OrderedSet>
app.doctype.schema.field.value <Store>
app.doctype.schema.field.value.field.value <Store> // a "sub-form" 
app.doctype.schema.field.value.field[0].value <Store> // also a "sub-form", likely representing a table or list
```

https://stackoverflow.com/questions/69833591/how-to-set-the-type-for-the-state-object-in-pinia


| Hook        | Lifecycle    |
| ----------- | ------------ |
| setup | Triggered once when the form is created for the first time |
| getData | an overridable function that fetches the form data |
| onload | Triggered when the form is loaded and is about to render |
| beforeSave | Triggered before save is called |
| afterSave | Triggered after form is saved |
| {fieldname} | [field level change](https://pinia.vuejs.org/core-concepts/plugins.html#calling-subscribe-inside-plugins) |
| beforeDelete | Triggered before a form is deleted |
| afterDelete | Triggered after a form is deleted | 
| beforeRouteChange | Triggered by the router before the route is changed |
| onStateChange | When a form is supplied with a FSM, actions can be called from it |

