create and run a postgres instance in docker.

docker exec -it postgres-container bash

psql -U postgres -d productdb

rename the dataabse 
ALTER DATABASE product-old-db RENAME TO productdb;

docker exec -it postgres-container psql -U postgres -d productdb -f /path/to/script.sql

postgres://postgres:postgres@localhost:5432/productdb


loopback-connector-postgresql

psql -h localhost -U postgres -d productdb

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE Product (
    productId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    inStock BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

productdb=# select * from product;

 productid | name | description | price | instock | created_at 
-----------+------+-------------+-------+---------+------------
(0 rows)