DROP TABLE IF EXISTS movietable;


CREATE TABLE IF NOT EXISTS movietable(
    id SERIAL PRIMARY KEY ,
    release_date VARCHAR(10000),
    title VARCHAR(255),
    poster_path VARCHAR(10000),
    overview VARCHAR(10000)
);