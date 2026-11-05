---
status: accepted
date: "2026-11-05"
deciders: ['Rohan Bansal']
---
# A Save writes what changed, encoded as its read serves it

## Context and Problem Statement

The Postgres adapter's read decodes JSON, lists, ranges, composites and geometric types into objects and arrays, the shapes PostGraphile serves. Its write had no encoder for them. To keep an expanding link's nested record out of the key column it holds, the write dropped every object or array value and listed it in `droppedFields`, so an edited JSON, list or range value was lost while the Save reported success.

Writing every value back is not the fix on its own, because several reads lose information:

* An infinite date, time or interval, or a float `NaN` or `Infinity`, reads as empty, alone, in a list, inside a composite or as a range bound, and an empty range reads as unbounded.
* jsonb numbers past JavaScript's precision are rounded, and a `json` column's text (key order, repeated keys) is rewritten.

A client sends the whole record on every Save, so writing everything it sends would make each of these losses permanent on a record whose user never touched the field. One case shows why it matters: orpin prefers a dated certainty row over its full-range row by matching `[-infinity,infinity)`, and that range rewritten as `(,)` changes which row wins.

## Decision Drivers

* An edited structured value must be saved, as any scalar is.
* A value the read cannot serve faithfully must survive a Save that did not change it.
* A value of the wrong shape must fail loudly, never be written as another value.
* An expanding link's nested record stays out of its key column, as before.

## Considered Options

* Option 1: encode and write every value the client sends.
* Option 2: write only the fields whose value differs from the stored record, encoded with the codec the read decodes the column with (chosen).
* Option 3: clients send structured values as JSON text.
* Option 4: a save handler in each app for doctypes with structured columns.

## Decision Outcome

Chosen option: "Option 2", decided by Rohan Bansal.

* The update reads the row it is about to write (already locked by the guard's read) through the same select and decoding as any read, put through JSON as the client's copy was. A sent field equal to it as a JSON value is not written: object keys in any order, list items in order, and no coercion (`"5"` is not `5`). An expanding link's field is compared with its key, since the read serves it as the linked record, so a link left empty is unchanged.
* A Save that changes nothing issues no `UPDATE`, so it fires no update trigger, and replies with the record as stored. A create has no stored row and writes everything it is sent.
* A changed value is encoded with its column's codec: JSON (a string is JSON text, as the code editor sends it), lists, ranges, composites and geometric types. A list of zone-free timestamps goes through `timestamptz[]` as a single one goes through `timestamptz`. A negative ISO 8601 duration is written with the sign on each part, which Postgres reads, rather than in front, which it refuses.
* Refused, naming the field, a value not in the shape the read serves: a list that is not an array, or holds an item of the wrong shape; a range that is not `{ start, end }` with each bound null or `{ value, inclusive }` holding a value; a composite without exactly its own fields; an object for a single-value column; any value but null for a `line` column, whose read is wrong.
* An object for a field that is a link (one declaring a `doctype`, or one a one-side `links` entry names) is still left out and listed in `droppedFields`.
* The read keeps an infinite bound of a date or time range, alone or in a list, as the text Postgres writes (`-infinity`), so editing one bound keeps the other, and reads a NULL range as null, which PostGraphile's cast reads as unbounded. Bounds stay zone-free, as a `tsrange` holds them. The read of a negative fraction of a second is exact.

### Consequences

* Good, because JSON, list and range values save, on a new record and a saved one.
* Good, because a value the read serves imperfectly is not rewritten by a Save that left it alone.
* Good, because a Save that changes nothing writes nothing.
* Bad, because every update reads the row once more before writing it.
* Bad, because a page holding values older than the stored row still overwrites what changed since, now for structured values as for scalars.
* Bad, because the lossy reads stay wrong on screen: an empty range shows as unbounded, an infinite date as empty, `json` text normalised, large jsonb numbers rounded. A JSON string or JSON null at the top of a `json` column cannot be written as such.
* Bad, because a changed field is written whole, so editing one item of a list, one attribute of a composite or one key of a JSON value writes the parts the read lost as they were read: an infinite date in a list becomes NULL, a large jsonb number is rounded.
* Bad, because a stored value that fails to decode (an interval whose parts differ in sign) now fails the Save before the write, where the write used to repair it.
* Neutral, because a Save with a server-side handler is unaffected: the handler is that Save's whole write ([ADR 0010](0010-save-handler-is-the-whole-write.md)).

## Pros and Cons of the Options

### Option 1: write every value sent

* Good, because it is the smallest change to the write.
* Bad, because every lossy read becomes a permanent loss on the next Save of the record.

### Option 3: structured values sent as JSON text

* Good, because nothing changes on the server.
* Bad, because every client has to know which fields to stringify, and lists and ranges stay dropped.

### Option 4: a save handler per app

* Good, because an app can write any shape it likes.
* Bad, because every app repeats the encoding, and handlers move writes away from the adapter rather than fixing its path.
