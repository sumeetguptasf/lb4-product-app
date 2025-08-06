postgres://postgres:postgres@localhost:5432/product
postgres://postgres:postgres@localhost:5432/userdb
postgres://postgres:postgres@localhost:5432/orderdb
postgres://postgres:postgres@localhost:5432/authdb

docker exec -it postgres-container psql -U postgres -d productdb
docker exec -it postgres-container psql -U postgres -d userdb
docker exec -it postgres-container psql -U postgres -d orderdb

DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS "product" CASCADE;
DROP TABLE IF EXISTS "order" CASCADE;
 
Product Service : PORT : 3001
User Service : PORT : 3002
Order Service : PORT : 3003
Store facade : PORT : 3000.  --> API Gateway + Facade // Orchestration Service

Running on local : separate services :
[running npm start , will take the default config and port 3000]
[the variables will need to be removed from the service codes - DB specific variables HOST, PORT, URL etc]

dotenv -e .env.local -- npm start

RELATIONS :

Raw Logic 
Order <hasMany> Product // Can't be direct relation Product <--> OrderItem <--> Order
Product <hasMany> Order // Can't be direct relation Product <--> OrderItem <--> Order
Customer <hasMany> Order
Order <belongsTo> Customer
Order <hasMany> OrderItem
OrderItem <belongsTo> or <HasOne> Product // confusion !!!


| Source Model | Relation Type  | Target Model  | Foreign Key Field        | Description                                      |
|--------------|----------------|---------------|--------------------------|--------------------------------------------------|
| Customer     | hasMany        | Order         | Order.customerId         | A customer can place multiple orders             |
| Order        | belongsTo      | Customer      | Order.customerId         | An order belongs to a single customer            |
| Order        | hasMany        | OrderItem     | OrderItem.orderId        | An order has multiple line items                 |
| OrderItem    | belongsTo      | Order         | OrderItem.orderId        | Each order item belongs to an order              |
| OrderItem    | belongsTo      | Product       | OrderItem.productId      | Each order item refers to a product              |
| Product      | hasMany        | OrderItem     | OrderItem.productId      | A product can appear in many order items         |




Product : 
{
  "productId": "9c678006-8083-48c5-ae6d-c8559e1dfde8",
  "name": "I Phone 16 Pro Max",
  "description": "Best I phone",
  "price": 199000,
  "inStock": true,
  "created_at": "2025-07-24T19:23:29.251Z"
}
                  id                  |  name  |  description   |  price   | instock |       created_at        
--------------------------------------+--------+----------------+----------+---------+-------------------------
 2b8dd40d-658b-48eb-b7ca-d12d6b64b9f2 | Moto X | Motorola Phone | 34000.00 | t       | 2025-07-24 19:54:57.722
User:
{
  "id": "cda82b10-567b-4b2f-9891-a9765509e37d",
  "firstName": "Sumeet",
  "middleName": "",
  "lastName": "Gupta",
  "email": "sumeet.gupta1@sourcefuse.com",
  "phone": "7985220470",
  "address": "HP, GG Kanpur 208001",
  "role": "SuperAdmin",
  "created_at": "2025-07-24T20:24:11.269Z"
}
Order:
{
  "id": "598d18b0-f5c9-4c8d-893e-e2ea87c11f85",
  "userId": "cda82b10-567b-4b2f-9891-a9765509e37d",
  "status": "Pending",
  "totalAmount": 0,
  "created_at": "2025-07-24T20:26:41.520Z"
}
OrderItem:
{
  "id": "bb168551-0957-4975-a801-6503f7dfef0b",
  "orderId": "598d18b0-f5c9-4c8d-893e-e2ea87c11f85",
  "productId": "9c678006-8083-48c5-ae6d-c8559e1dfde8",
  "productName": "I Phone 16 Pro Max",
  "quantity": 1,
  "unitPrice": 199000
}
GET Order : 
{
  "id": "598d18b0-f5c9-4c8d-893e-e2ea87c11f85",
  "userId": "cda82b10-567b-4b2f-9891-a9765509e37d",
  "status": "Pending",
  "totalAmount": "0.00",
  "created_at": "2025-07-24T14:56:41.520Z",
  "items": [
    {
      "id": "bb168551-0957-4975-a801-6503f7dfef0b",
      "orderId": "598d18b0-f5c9-4c8d-893e-e2ea87c11f85",
      "productId": "9c678006-8083-48c5-ae6d-c8559e1dfde8",
      "productName": "I Phone 16 Pro Max",
      "quantity": 1,
      "unitPrice": "199000.00"
    }
  ]
}
{ Product, Orders[] }:
{
  "product": {
    "id": "2b8dd40d-658b-48eb-b7ca-d12d6b64b9f2",
    "name": "Moto X",
    "description": "Motorola Phone",
    "price": "34000.00",
    "inStock": true,
    "created_at": "2025-07-24T14:24:57.722Z"
  },
  "orders": [
    {
      "id": "598d18b0-f5c9-4c8d-893e-e2ea87c11f85",
      "userId": "cda82b10-567b-4b2f-9891-a9765509e37d",
      "status": "Pending",
      "totalAmount": "0.00",
      "created_at": "2025-07-24T14:56:41.520Z",
      "items": [
        {
          "id": "bb168551-0957-4975-a801-6503f7dfef0b",
          "orderId": "598d18b0-f5c9-4c8d-893e-e2ea87c11f85",
          "productId": "9c678006-8083-48c5-ae6d-c8559e1dfde8",
          "productName": "I Phone 16 Pro Max",
          "quantity": 1,
          "unitPrice": "199000.00"
        }
      ]
    }
  ]
}


Doubt : 
- In product-service, add Product hasMany Order (LB4 Relations).
    Since we have a microservice setup, hasMany relation in product-service with Order will not work : hasMany should work if both the models are in same codebase or, both the data in same database. Exposing endpoints from Product-Service :
    - GET /products
    - GET /products/{id}
- How will we get the order details from the product service - order service doesn't have a datasource for orders.
- In store-facade, define REST datasources to call product- and order-service, plus service proxies for typed methods.✅
- Implement a StoreController that aggregates product & order data. Test the façade endpoints to confirm combined results.✅
- Create a decorator @FormattedDate() for createdOn / modifiedOn fields.



Findings : 
1. The id is not generated automatically if generated = true; and then we use any defaultFn = 'uuidv4' or anything.
    Other way to do it is using the postgres extension : 'uuid-ossp' and generate_uuid_v4() for default value of id. -> more database oriented setup is required , generally I never like doing it that way.


Common Business Logic : 
1. Adding , updating , removing orderItem and updating totalAmount should be a logic to be handled by order-service , and not the facade. It is an order service specific business logic.

Flow ::
--------------------- ---------------------- ---------------------
Products
{
  "id": "f1ca6533-de42-469b-9c6c-7774a04ffc6c",
  "name": "Samsung S24 Ultra",
  "description": "Samsung flagship phone in year 2024",
  "price": 125000,
  "inStock": true,
  "created_at": "2025-07-28T12:42:42.202Z"
}
{
  "id": "aca77236-0982-438d-a8f3-f2190f24ad35",
  "name": "Samsung S24 Lite",
  "description": "Samsung phone in year 2024",
  "price": 31000,
  "inStock": true,
  "created_at": "2025-07-28T12:44:12.335Z"
}

User :
{
  "id": "b066e980-59f7-419f-a549-89ad487c9dd7",
  "firstName": "Manish",
  "middleName": "",
  "lastName": "Gupta",
  "email": "manish.gupta@example.com",
  "phone": "8543021467",
  "address": "abc def Mahesh Villa",
  "role": "SuperAdmin",
  "created_at": "2025-07-28T12:46:02.756Z"
}

Order:
{
  "id": "4ce87ef1-10e3-4115-b9a6-82a76d2336f6",
  "userId": "b066e980-59f7-419f-a549-89ad487c9dd7",
  "status": "Pending",
  "totalAmount": 0,
  "created_at": "2025-07-28T19:31:31.965Z"
}
OrderItem Added : 
{
  "id": "57868b5f-1717-4d47-a458-bed8cffa292c",
  "orderId": "4ce87ef1-10e3-4115-b9a6-82a76d2336f6",
  "productId": "f1ca6533-de42-469b-9c6c-7774a04ffc6c",
  "productName": "Samsung S24 Ultra",
  "quantity": 1,
  "unitPrice": 125000
}
GET Order with Id : { 4ce87ef1-10e3-4115-b9a6-82a76d2336f6 }
{
  "id": "4ce87ef1-10e3-4115-b9a6-82a76d2336f6",
  "userId": "b066e980-59f7-419f-a549-89ad487c9dd7",
  "status": "Pending",
  "totalAmount": "125000.00",
  "created_at": "2025-07-28T19:31:31.965Z",
  "items": [
    {
      "id": "57868b5f-1717-4d47-a458-bed8cffa292c",
      "orderId": "4ce87ef1-10e3-4115-b9a6-82a76d2336f6",
      "productId": "f1ca6533-de42-469b-9c6c-7774a04ffc6c",
      "productName": "Samsung S24 Ultra",
      "quantity": 1,
      "unitPrice": "125000.00"
    }
  ]
}
Add another product : to order : { 4ce87ef1-10e3-4115-b9a6-82a76d2336f6 } : 
{
  "id": "92aafa74-1748-4f6a-893a-01ed6a014eee",
  "orderId": "4ce87ef1-10e3-4115-b9a6-82a76d2336f6",
  "productId": "aca77236-0982-438d-a8f3-f2190f24ad35",
  "productName": "Samsung S24 Lite",
  "quantity": 1,
  "unitPrice": 31000
}
GET Order for id : { 4ce87ef1-10e3-4115-b9a6-82a76d2336f6 }
{
  "id": "4ce87ef1-10e3-4115-b9a6-82a76d2336f6",
  "userId": "b066e980-59f7-419f-a549-89ad487c9dd7",
  "status": "Pending",
  "totalAmount": "156000.00",
  "created_at": "2025-07-28T19:31:31.965Z",
  "items": [
    {
      "id": "57868b5f-1717-4d47-a458-bed8cffa292c",
      "orderId": "4ce87ef1-10e3-4115-b9a6-82a76d2336f6",
      "productId": "f1ca6533-de42-469b-9c6c-7774a04ffc6c",
      "productName": "Samsung S24 Ultra",
      "quantity": 1,
      "unitPrice": "125000.00"
    },
    {
      "id": "92aafa74-1748-4f6a-893a-01ed6a014eee",
      "orderId": "4ce87ef1-10e3-4115-b9a6-82a76d2336f6",
      "productId": "aca77236-0982-438d-a8f3-f2190f24ad35",
      "productName": "Samsung S24 Lite",
      "quantity": 1,
      "unitPrice": "31000.00"
    }
  ]
}
Remove the item Samsung S24 Lite : from order where order id is { 4ce87ef1-10e3-4115-b9a6-82a76d2336f6 } and where productId is { aca77236-0982-438d-a8f3-f2190f24ad35 } :
{
  "id": "4ce87ef1-10e3-4115-b9a6-82a76d2336f6",
  "userId": "b066e980-59f7-419f-a549-89ad487c9dd7",
  "status": "Pending",
  "totalAmount": "156000.00",  // BUG - has to be calculated after item is removed
  "created_at": "2025-07-28T19:31:31.965Z",
  "items": [
    {
      "id": "57868b5f-1717-4d47-a458-bed8cffa292c",
      "orderId": "4ce87ef1-10e3-4115-b9a6-82a76d2336f6",
      "productId": "f1ca6533-de42-469b-9c6c-7774a04ffc6c",
      "productName": "Samsung S24 Ultra",
      "quantity": 1,
      "unitPrice": "125000.00"
    }
  ]
}
