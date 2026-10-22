---
status: accepted
date: "2026-10-21"
deciders: ['Rohan Bansal']
---
# A Save's server-side handler is that save's whole write

## Context and Problem Statement

A Save is a self-transition: it keeps the record's state and writes its fields, creating the record when it does not exist yet. The backend's own write (`GuardedTransitionIO.writeData`) does that. [ADR 0009](0009-action-effects-registered-on-the-adapter.md) lets an app register a server-side handler for any action, and for a Save the two used to combine like this:

* On a saved record, the handler ran, and then the backend's own write ran after it, writing the form's values over whatever the handler had written.
* On a record not created yet, the handler did not run at all, and the backend inserted the row itself. A handler is written against an existing row, so running it on a create was left undecided.

So a Save that needs server code (child rows, side effects, or a create the app owns) could not be declared as a Save. FAB declares those Saves as stateless commands. Most declare no `allowedStates`, so the page offers them in every state and the handler refuses them where they do not apply; the ones limited to a state cannot create a record at all. Converting a quotation into a sales order will need more again: the new order is to be created by the app's conversion code inside the order's Save, which the backend's own insert cannot express.

## Decision Drivers

* An app's server code must be able to own a create, such as a conversion that builds the new record from another one.
* A Save with server code should be declarable as a self-transition limited to the states where it runs, so the page offers it only there.
* One Save should write once; a second write after the handler overwrites what the handler set.
* The smallest change that meets these; the larger design of how Stonecrop saves belongs to the framework's owner.

## Considered Options

* Option 1: keep skipping the handler on a create, and running the backend's write after it on a saved record.
* Option 2: run the handler on a create too, still followed by the backend's write.
* Option 3: make a Save's handler its whole write, on a new record and a saved one (chosen).
* Option 4: have Stonecrop write the record and its child rows itself, with app code as hooks before and after the write.

## Decision Outcome

Chosen option: "Option 3", decided by Rohan Bansal, answering for Tyler Matteson, as the smallest change that lets app code own a Save. Option 4 stays open as the later design.

* A Save with a registered handler runs the handler, and the backend's own write does not run. On a record not created yet the handler gets no `recordId` and creates the record.
* The handler must return the record it saved. Returning nothing fails the action, and so does a reply whose record cannot be read back by the doctype's key, since otherwise the page keeps its draft and the next Save creates a second record. In the Postgres adapter the action's writes then roll back.
* A Save sent with an id that matches no record is refused before the handler runs, as the Postgres adapter's own write already refused it: the record was deleted since it was read, and creating it would report a lost update as a success. Each backend refuses it in `readState`, because the guard never sees the id.
* A Save without a handler is still written by the backend's own write, and transitions and stateless commands are untouched by this decision.

### Consequences

* Good, because a Save with server code can be a self-transition limited to its states, so the page offers it only where it can run.
* Good, because each Save writes once.
* Good, because app code can own a create, which a conversion needs.
* Bad, because the handler does the whole write: the adapter's own handling of a patch (keeping to the doctype's columns, never writing `status`, reporting `droppedFields`) does not apply to it.
* Bad, because an app with a handler on a self-transition Save changes behaviour. None was known when this was decided: FAB's self-transition Saves have no handlers, and neither do this repository's hosts.

## Pros and Cons of the Options

### Option 1: keep the old behaviour

* Good, because nothing changes.
* Bad, because a Save with server code cannot create, so an app must declare it as a command offered in every state.
* Bad, because the backend's write after the handler overwrites what the handler set.

### Option 2: run the handler on a create, still followed by the backend's write

* Good, because the handler sees every Save.
* Bad, because the backend still writes twice, and on a create its insert competes with any record the handler created, so a conversion would make two records.

### Option 4: Stonecrop writes, app code hooks around the write

* Good, because the framework keeps one write path for every Save, with hooks for app code, as many application frameworks do.
* Bad, because it needs Stonecrop to write child rows, which it does not today, and still needs a way for app code to own a create such as a conversion.
* Neutral, because it can follow Option 3: a hook design can take over from handlers later.
