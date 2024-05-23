CREATE DATABASE petApp_database;


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    number VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255)
)

CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    walkerId INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    rating INT DEFAULT NULL,
    review TEXT DEFAULT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (walkerId) REFERENCES users(id)
);
CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    walkerId INT,
    rating INT,
    comment TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (walkerId) REFERENCES users(id)
);
CREATE TABLE pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    breed VARCHAR(255),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)

INSERT INTO users(name, email, number, password, type) VALUES('Juan David','juandavidalzate11c@gmial.com', '3008289325', '12345', 'user');
INSERT INTO users(name, email, number, password, type) VALUES('Jose Luiz','joseluisc@gmial.com', '3008456734', '12345', 'user');

INSERT INTO pets(name, breed, user_id) VALUES('Bruno','Shit-tzu', 1);
INSERT INTO pets(name, breed, user_id) VALUES('Max','Golden', 2);
INSERT INTO pets(name, breed, user_id) VALUES('Sasha','Golden', 2);