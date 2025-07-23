postgres://postgres:postgres@localhost:5432/product
postgres://postgres:postgres@localhost:5432/userdb
postgres://postgres:postgres@localhost:5432/orderdb

docker exec -it postgres-container psql -U postgres -d productdb
docker exec -it postgres-container psql -U postgres -d userdb
docker exec -it postgres-container psql -U postgres -d orderdb

DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS "product" CASCADE;
DROP TABLE IF EXISTS "order" CASCADE;
 
Product Service : PORT : 3001
User Service : PORT : 3002
Order Service : PORT : 3003
Store facade : PORT : 3000