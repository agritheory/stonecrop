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
