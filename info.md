postgres://postgres:postgres@localhost:5432/userdb


docker exec -it postgres-container psql -U postgres -d userdb

DROP TABLE IF EXISTS "user" CASCADE;