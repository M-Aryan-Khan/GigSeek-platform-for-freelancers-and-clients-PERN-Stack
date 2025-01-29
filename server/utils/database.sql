CREATE DATABASE Freelance_MS;

CREATE TABLE client (
    client_id SERIAL PRIMARY KEY,
    fullname VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    CONSTRAINT chk_client_password_length CHECK (LENGTH(password) >= 6)
);

CREATE TABLE clientcardinfo (
    card_number VARCHAR(16) PRIMARY KEY,
    client_id INTEGER NOT NULL,
    CONSTRAINT fk_clientcardinfo_client FOREIGN KEY (client_id) REFERENCES client(client_id) ON DELETE CASCADE
);

CREATE TABLE freelancer (
    freelancer_id SERIAL PRIMARY KEY,
    fullname VARCHAR(50) NOT NULL,
    email VARCHAR(70) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    bio VARCHAR(200),
    education VARCHAR(20),
    CONSTRAINT chk_freelancer_password_length CHECK (LENGTH(password) >= 6)
);

CREATE TABLE freelancercardinfo (
    card_number VARCHAR(16) PRIMARY KEY,
    freelancer_id INTEGER NOT NULL,
    CONSTRAINT fk_freelancercardinfo_freelancer FOREIGN KEY (freelancer_id) REFERENCES freelancer(freelancer_id) ON DELETE CASCADE
);

CREATE TABLE gigs (
    gig_id SERIAL PRIMARY KEY,
    gig_type varchar(10) not null check (gig_type in ('fixed','hourly')) default 'hourly',
    title VARCHAR(50) NOT NULL,
    description VARCHAR(200) NOT NULL,
    price INTEGER NOT NULL CHECK (price > 0),
    freelancer_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_gigs_freelancer FOREIGN KEY (freelancer_id) REFERENCES freelancer(freelancer_id) ON DELETE CASCADE
);

CREATE TABLE gig_client_history (
    gch_id SERIAL PRIMARY KEY,
    gig_id INTEGER,
    client_id INTEGER,
    amount_to_pay INTEGER NOT NULL CHECK (amount_to_pay > 0),
    order_status CHAR(1) NOT NULL CHECK (order_status IN ('C', 'F')),
    CONSTRAINT fk_gig_history_gig FOREIGN KEY (gig_id) REFERENCES gigs(gig_id) ON DELETE
    SET
        NULL,
        CONSTRAINT fk_gig_history_client FOREIGN KEY (client_id) REFERENCES client(client_id) ON DELETE
    SET
        NULL
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    description varchar(255) not null,
    order_status CHAR(1) NOT NULL CHECK (order_status IN ('P', 'C', 'F')) DEFAULT 'P',
    gig_id INTEGER NOT NULL,
    freelancer_id INTEGER NOT NULL,
    client_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_gig FOREIGN KEY (gig_id) REFERENCES gigs(gig_id) ON DELETE
    SET
        NULL,
        CONSTRAINT fk_order_freelancer FOREIGN KEY (freelancer_id) REFERENCES freelancer(freelancer_id) ON DELETE
    SET
        NULL,
        CONSTRAINT fk_order_client FOREIGN KEY (client_id) REFERENCES client(client_id) ON DELETE
    SET
        NULL
);

CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    amount_to_pay INTEGER NOT NULL CHECK (amount_to_pay > 0),
    order_id INTEGER NOT NULL,
    CONSTRAINT fk_payment_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

CREATE TABLE review (
    review_id SERIAL PRIMARY KEY,
    review_text VARCHAR(100) NOT NULL,
    client_id INTEGER,
    freelancer_id INTEGER NOT NULL,
    CONSTRAINT fk_review_client FOREIGN KEY (client_id) REFERENCES client(client_id) ON DELETE
    SET
        NULL,
        CONSTRAINT fk_review_freelancer FOREIGN KEY (freelancer_id) REFERENCES freelancer(freelancer_id) ON DELETE CASCADE
);

CREATE TABLE skills (
    skill_name VARCHAR(100) NOT NULL,
    freelancer_id INTEGER NOT NULL,
    PRIMARY KEY (skill_name, freelancer_id),
    CONSTRAINT fk_skills_freelancer FOREIGN KEY (freelancer_id) REFERENCES freelancer(freelancer_id) ON DELETE CASCADE
);