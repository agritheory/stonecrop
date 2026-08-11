CREATE TABLE sc_item (
	id serial PRIMARY KEY,
	name text NOT NULL,
	status text NOT NULL DEFAULT 'Draft'
);

CREATE TABLE sc_tag (
	id serial PRIMARY KEY,
	label text NOT NULL,
	item_id integer REFERENCES sc_item(id) ON DELETE CASCADE
);

CREATE TABLE sc_note (
	id serial PRIMARY KEY,
	body text NOT NULL,
	item_id integer REFERENCES sc_item(id) ON DELETE CASCADE
);

INSERT INTO sc_item (name, status) VALUES
	('Alpha', 'Draft'),
	('Beta', 'Active'),
	('Gamma', 'Draft');

INSERT INTO sc_tag (label, item_id) VALUES
	('urgent', 1),
	('review', 1),
	('approved', 2);

INSERT INTO sc_note (body, item_id) VALUES
	('First note', 1),
	('Second note', 1),
	('Third note', 2);

-- camelCase fieldname fixtures (for column aliasing + backlink camelToSnake tests)
CREATE TABLE sc_camel_item (
	item_id serial PRIMARY KEY,
	display_name text NOT NULL,
	item_status text NOT NULL DEFAULT 'Draft'
);

CREATE TABLE sc_camel_tag (
	tag_id serial PRIMARY KEY,
	tag_label text NOT NULL,
	camel_item_id integer REFERENCES sc_camel_item(item_id) ON DELETE CASCADE
);

INSERT INTO sc_camel_item (display_name, item_status) VALUES
	('Alpha', 'Draft'),
	('Beta', 'Active');

INSERT INTO sc_camel_tag (tag_label, camel_item_id) VALUES
	('urgent', 1),
	('review', 1),
	('approved', 2);

-- Fieldset integration test fixtures
CREATE TABLE sc_widget (
	id serial PRIMARY KEY,
	item_name text,
	item_color text
);
INSERT INTO sc_widget (id, item_name, item_color) VALUES (1, 'Widget A', 'blue'), (2, 'Widget B', 'red');

CREATE TABLE sc_part (
	id serial PRIMARY KEY,
	gadget_id integer,
	part_name text
);

CREATE TABLE sc_gadget (
	id serial PRIMARY KEY,
	gadget_name text
);
INSERT INTO sc_gadget (id, gadget_name) VALUES (1, 'Gadget One');
INSERT INTO sc_part (gadget_id, part_name) VALUES (1, 'Part A');

-- Display field exclusion test fixture (no price_display column — proves Display is not SELECTed)
CREATE TABLE sc_product (id serial PRIMARY KEY, product_name text, price integer);
INSERT INTO sc_product (id, product_name, price) VALUES (1, 'Product A', 100);

-- Cross-adapter conformance fixture: a NATURAL-key table (no `id` column at all).
-- The rest of this seed is surrogate-keyed, which cannot expose a disagreement about
-- which field a record is looked up by. See conformance.test.ts.
CREATE TABLE sc_code (
	code text PRIMARY KEY,
	name text NOT NULL,
	status text NOT NULL DEFAULT 'Draft'
);
INSERT INTO sc_code (code, name, status) VALUES
	('ALPHA', 'Alpha Region', 'Draft'),
	('BETA', 'Beta Region', 'Active'),
	('GAMMA', 'Gamma Region', 'Draft');

-- A row that exists but carries no workflow state: `status` is deliberately nullable here,
-- unlike every other table above. It is the control for "record does not exist" — the two read
-- identically until the backend can answer `null` for a missed lookup rather than `undefined`.
CREATE TABLE sc_draft (
	id serial PRIMARY KEY,
	name text NOT NULL,
	status text
);
INSERT INTO sc_draft (name, status) VALUES
	('Stateless Row', NULL);
