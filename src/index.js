import { Client } from 'pg';

export const initConnection = () => {
  const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    POSTGRES_PORT,
    POSTGRES_HOST,
  } = process.env;
  const client = new Client({
    user: POSTGRES_USER || 'postgres',
    host: POSTGRES_HOST || 'localhost',
    database: POSTGRES_DB || 'homework',
    password: POSTGRES_PASSWORD || 'postgres',
    port: POSTGRES_PORT || 5432,
  });

  return client;
};

export const createStructure = async () => {
  const client = initConnection();
  client.connect();

  await client.query(
    `create table users (id serial primary key not null, name varchar(30) not null, date date default(current_date));`
  );
  await client.query(
    `create table categories (id serial primary key not null,
    name varchar(30) not null);`
  );
  await client.query(
    `create table authors (id serial primary key not null,
    name varchar(30) not null);`
  );
  await client.query(
    `create table books (id serial primary key not null,
    title varchar(30) not null,
    userid integer not null,
    authorid integer not null,
    categoryid integer not null,
    foreign key(userid) references users(id) on delete cascade,
    foreign key(authorid) references authors(id) on delete cascade,
    foreign key(categoryid) references categories(id) on delete cascade);`
  );
  await client.query(
    `create table descriptions (id serial primary key not null,
    description varchar(10000) not null,
    bookid integer not null unique,
    foreign key(bookid) references books(id) on delete cascade);`
  );
  await client.query(
    `create table reviews (id serial primary key not null,
    message varchar(10000) not null,
    userid integer not null,
    bookid integer not null,
    foreign key(userid) references user(id) on delete cascade,
    foreign key(bookid) references books(id) on delete cascade);`
  );

  client.end();
};

export const createItems = async () => {
  const client = initConnection();
  client.connect();

  await client.query(`insert into users (name) values('yura')`);
  await client.query(`insert into authors (name) values('Satirical novel')`);
  await client.query(`insert into authors (name) values('Chuck Palahniuk')`);
  await client.query(`insert into authors (title) values('Fight Club')`);
  await client.query(
    `insert into authors (description) values('Fight Club is a 1996 novel by Chuck Palahniuk. It follows the experiences of an unnamed protagonist struggling with insomnia. Inspired by his doctor's exasperated remark that insomnia is not suffering, the protagonist finds relief by impersonating a seriously ill person in several support groups. Then he meets a mysterious man named Tyler Durden and establishes an underground fighting club as radical psychotherapy.')`
  );
  await client.query(`insert into authors (massage) values('AWESOME!!!!')`);

  client.end();
};

export const dropTables = async () => {
  const client = initConnection();
  client.connect();

  await client.query('DROP TABLE reviews;');
  await client.query('DROP TABLE descriptions;');
  await client.query('DROP TABLE books;');
  await client.query('DROP TABLE authors;');
  await client.query('DROP TABLE categories;');
  await client.query('DROP TABLE users;');

  client.end();
};
