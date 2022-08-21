# Stonecrop
_This package is under active development / design._

## Design
A context will define schema, events and hooks. 
  - Schema describes the data model and layout of the document.
  - Events are the events that are registered on it and will specific to the context. An application might have 'login', 'onAppLoad', 'beforeRouteChange' and 'logout' events.  A form/document context might define CRUD events. A table component, nested inside the form component might define its own events. I think we want Events to be FSM
  - Hooks are an ordered set of functions, called by Event
  - [Router integration](https://pinia.vuejs.org/core-concepts/plugins.html#adding-new-external-properties). Stonecrop setup should expect a router or provide a default implementation

The context will be tree-shaped with a single root. Adding more nodes at the root level isn't a problem, but multiple roots would be disallowed. 

Example APIs and paths

```
app.schema <Record> // immutable
app.events <FSM> // immutable
app.hooks <OrderedSet> // immutable
app.value <Store> // mutable
app.user // "tyler@agritheory.com"
app.name // "My First Application"
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

It may make sense to use [automatic injection aliasing](https://vuejs.org/guide/components/provide-inject.html#inject) at the doctype level

The user navigates to a doctype (http://local.app/doctype).
The doctype schema, events and hooks are fetched from the server if they don't already exist in localstorage

Automatically detect component schema/events/hooks via composable



