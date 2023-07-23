DROP DATABASE IF EXISTS db_airbnb;
CREATE DATABASE db_airbnb;
USE db_airbnb;

CREATE TABLE users(
	user_id INT PRIMARY KEY AUTO_INCREMENT,
	email VARCHAR(250),
	pass_word VARCHAR(100),
	name VARCHAR(250),
	birth_day VARCHAR(250),
	gender VARCHAR(150),
	role VARCHAR(150),
	phone VARCHAR(250)
);

CREATE TABLE rooms(
	room_id INT PRIMARY KEY AUTO_INCREMENT,
	room_name VARCHAR(250),
	client_number INT,
	bed_room INT,
	bed INT,
	bath_room INT,
	description VARCHAR(500),
	price INT,
	washing_machine BOOLEAN,
	iron BOOLEAN,
	tivi BOOLEAN,
	air_conditioner BOOLEAN,
	wifi BOOLEAN,
	kitchen BOOLEAN,
	parking BOOLEAN,
	pool BOOLEAN,
	image VARCHAR(250)
);

CREATE TABLE location(
	location_id INT PRIMARY KEY AUTO_INCREMENT,
	location_name VARCHAR(250),
	province VARCHAR(250),
	nation VARCHAR(150),
	location_image VARCHAR(150)
);


CREATE TABLE reservations(
	reservation_id INT PRIMARY KEY AUTO_INCREMENT,
	room_id INT,
	FOREIGN KEY (room_id) REFERENCES rooms(room_id),
	start_date DATETIME,
	end_date DATETIME,
	guest_amount INT,
	user_id INT,
	FOREIGN KEY (user_id) REFERENCES users(user_id)
);	


CREATE TABLE reviews(
	review_id INT PRIMARY KEY AUTO_INCREMENT,
	reservation_id INT,
	FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id),
	user_id INT,
	FOREIGN KEY (user_id) REFERENCES users(user_id),
	review_date DATETIME,
	content VARCHAR(500),
	rating INT
);