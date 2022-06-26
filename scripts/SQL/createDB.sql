DROP TABLE IF EXISTS "client" CASCADE;
CREATE TABLE "client"
(
    id       integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    pseudo   varchar UNIQUE NOT NULL,
    password varchar        NOT NULL,
    email    varchar UNIQUE NOT NULL,
    is_admin boolean        NOT NULL
);

ALTER TABLE "client"
    OWNER TO john;

DROP TABLE IF EXISTS deck CASCADE;
CREATE TABLE deck
(
    id        integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    client_id   integer NOT NULL,
    deck_name varchar NOT NULL,
    foreign key (client_id) references "client" (id)
);

ALTER TABLE deck
    OWNER TO john;


DROP TABLE IF EXISTS session CASCADE;
CREATE TABLE session
(
    id        integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    completed boolean NOT NULL,
    deck_id   integer NOT NULL,
    foreign key (deck_id) references "deck" (id)
);

ALTER TABLE session
    OWNER TO john;



DROP TABLE IF EXISTS revision_category CASCADE;
CREATE TABLE revision_category
(
    id               integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    category_name    varchar NOT NULL,
    difficulty_order integer NOT NULL,
    description      varchar
);

ALTER TABLE revision_category
    OWNER TO john;

DROP TABLE IF EXISTS card CASCADE;
CREATE TABLE card
(
    id          integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    deck_id     integer NOT NULL,
    category_id integer NOT NULL,
    front_card  varchar NOT NULL NOT NULL,
    back_card   varchar,
    foreign key (deck_id) references deck (id),
    foreign key (category_id) references revision_category (id)

);

ALTER TABLE card
    OWNER TO john;


INSERT INTO "client"(pseudo, email, password, is_admin)
VALUES ('un-utilisateur', 'un.utilisateur@gmail.com', '$2a$10$fiKILzSQn2YvA.mbmxhqa.7f8pErrnl4qofZY7nE/a5Vq8KakfPKG',false);
INSERT INTO "client"(pseudo, email, password, is_admin)
VALUES ('un-etudiant', 'un.etudiant@gmail.com', '$2b$10$TfWpuBsQQqwWI93GQIYUMORJkOCnEaWocIybWqEPgja3DvE7cBiwu',false);
INSERT INTO "client"(pseudo, email, password, is_admin)
VALUES ('pauline', 'etu40989@henallux.be', '$2a$10$fiKILzSQn2YvA.mbmxhqa.7f8pErrnl4qofZY7nE/a5Vq8KakfPKG', true);
INSERT INTO "client"(pseudo, email, password, is_admin)
VALUES ('jonathan', 'etu43753@henallux.be', '$2a$10$fiKILzSQn2YvA.mbmxhqa.7f8pErrnl4qofZY7nE/a5Vq8KakfPKG', true);
INSERT INTO "client"(pseudo, email, password, is_admin)
VALUES ('benjamin', 'benjamin@henallux.be', '$2b$10$X1wG5hGUarnS1HQl48d1GuILRPVt3KzWQZEGbRblJmfeHW3Gf.NkS', true);

INSERT INTO deck(client_id, deck_name)
VALUES (1, 'Java');
INSERT INTO deck(client_id, deck_name)
VALUES (1, 'MTD');
INSERT INTO deck(client_id, deck_name)
VALUES (1, 'Eco');
INSERT INTO deck(client_id, deck_name)
VALUES (2, 'Marketing');
INSERT INTO deck(client_id, deck_name)
VALUES (1, 'C');
INSERT INTO deck(client_id, deck_name)
VALUES (3, 'Bio');


INSERT INTO session(completed, deck_id)
VALUES (true, 1);
INSERT INTO session(completed, deck_id)
VALUES (false, 2);
INSERT INTO session(completed, deck_id)
VALUES (false, 4);

INSERT INTO revision_category(category_name, difficulty_order, description)
VALUES ('Not Category', 0, 'La fiche n est dans aucune catégorie');
INSERT INTO revision_category(category_name, difficulty_order, description)
VALUES ('Pas acquis', 1, 'La fiche n a soit pas été révisée, soit la réponse est impossible à donner');
INSERT INTO revision_category(category_name, difficulty_order, description)
VALUES ('Ca passse', 2, 'La fiche est récitée difficilement ou bien à moitié');
INSERT INTO revision_category(category_name, difficulty_order, description)
VALUES ('Acquise', 3, 'La fiche est parfaitement récitée');

INSERT INTO card(deck_id, category_id, front_card, back_card)
VALUES (1, 1, 'Qu’est ce qu’une class Java?',
        'Dans sa forme la plus basique, c’est une template définissant un type de donnée. Elle est utilisée pour créer un objet.');
INSERT INTO card(deck_id, category_id, front_card, back_card)
VALUES (1, 3, 'Et qu’est-ce qu’un objet?', 'C’est un élément d’une classe (instance)');
INSERT INTO card(deck_id, category_id, front_card, back_card)
VALUES (1, 3, 'Et qu’es-ce qu’une méthode?', 'C’est l’action (le comportement) qu’un objet peut faire.');
INSERT INTO card(deck_id, category_id, front_card, back_card)
VALUES (1, 3, 'Est-ce que Java utilise les pointeurs?', 'Non');
INSERT INTO card(deck_id, category_id, front_card, back_card)
VALUES (1, 2, 'Se renseigner sur le JSP', null);
INSERT INTO card(deck_id, category_id, front_card, back_card)
VALUES (1, 3, 'Qu’est-ce qu’un constructeur? ',
        'Un constructeur est un bloc de code utilisé pour initialiser un objet.');
INSERT INTO card(deck_id, category_id, front_card, back_card)
VALUES (1, 2, 'Se renseigner sur les types', null);
INSERT INTO card(deck_id, category_id, front_card, back_card)
VALUES (1, 1, 'Est-ce que les tableaux sont des primitifs en Java?', 'Non');

INSERT INTO card(deck_id, category_id, front_card, back_card)
VALUES (2, 3, 'Quel paramètre caractérise la taille du problème ?',
        'Ce paramètre va constituer la variable d induction.');
INSERT INTO card(deck_id, category_id, front_card, back_card)
VALUES (2, 3,
        'Quelle est la taille init du problème pour laquelle la solution est triviale et quelle est cette solution ?',
        'La taille init va constituer la condition d''arrêt de la fonction récursive.');
INSERT INTO card(deck_id, category_id, front_card, back_card)
VALUES (2, 2, 'Taper récurssivité sur google', null);


INSERT INTO card(deck_id, category_id, front_card, back_card)
VALUES (3, 4, 'Quelle est ma motivation à manager les autres ?', null);
INSERT INTO card(deck_id, category_id, front_card, back_card)
VALUES (3, 4, 'Quelles sont mes valeurs ?', null);
INSERT INTO card(deck_id, category_id, front_card, back_card)
VALUES (3, 4, 'Est-ce que je me connais bien ?', null);

