CREATE TABLE meets(
    id int PRIMARY KEY,
    federation TEXT,
    path TEXT,
    date date,
    country varchar(20),
    state varchar(10),
    town TEXT,
    name TEXT
);

CREATE TABLE athletes(
    id SERIAL PRIMARY KEY,
    name varchar(30),
    gender varchar(9)
);

CREATE TABLE athlete_lifts(
    lift_id int PRIMARY KEY,
    meet_id int NOT NULL,
    athlete_id int NOT NULL,
    equipment varchar(15),
    age int,
    division varchar(30),
    bodyweight_kg real,
    weightclass_kg real,
    bench_kg real,
    squat_kg real,
    deadlift_kg real,
    total_kg real,
    description TEXT,
    FOREIGN KEY (meet_id) REFERENCES meets(id), 
    FOREIGN KEY (athlete_id) REFERENCES athletes(id)
);

CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username varchar(20) NOT NULL,
      password varchar(256),
      age int,
      current_rival int,
      beaten_rivals int,
      FOREIGN KEY (current_rival) REFERENCES athlete_lifts(lift_id)
);

CREATE TABLE user_lifts(
    user_id int,
    age int,
    date date,
    bodyweight_kg real,
    bench_kg real,
    squat_kg real,
    deadlift_kg real,
    total_kg real,
    equipment varchar(30),
      FOREIGN KEY (user_id) REFERENCES users(id)
);

