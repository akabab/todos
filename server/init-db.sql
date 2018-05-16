DROP DATABASE IF EXISTS heroku_24768c0a1baa19f;
CREATE DATABASE heroku_24768c0a1baa19f;
USE heroku_24768c0a1baa19f;

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(64),
  email VARCHAR(254),
  password VARCHAR(254),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE todos (
  id INT NOT NULL AUTO_INCREMENT,
  userId INT NOT NULL,
  title VARCHAR(128),
  description TEXT,
  image TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (userId)
    REFERENCES users(id)
) ENGINE=INNODB;

CREATE TABLE stars (
  userId INT NOT NULL,
  todoId INT NOT NULL,
  PRIMARY KEY (userId, todoId),
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (todoId) REFERENCES todos(id)
) ENGINE=INNODB;

INSERT INTO users (name, email, password) VALUES ('demo', 'demo@demo.fr', 'pwd');
