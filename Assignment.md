Day 1:
- Reading & Discussion: Review LB4 Docs for an overview. ✅
- Discuss how npm workspaces manage multiple LB4 services in one repository. ✅
- Explore the concept of a façade (aggregator) microservice for a consistent external API. ✅
- Action: The trainee requests or receives an invite to arc-general Slack for future ARC questions. ✅
Day 2:
- Initialize the monorepo by setting up npm workspaces in the root package.json. ✅
- Scaffold services/product-service and facades/store-facade with lb4 app. ✅
- In product-service, create a Product model, ProductRepository, and ProductController for CRUD. ✅
- Confirm each LB4 service starts independently (via npm scripts). ✅
- Review LB4’s folder structure (controllers, models, datasources). ✅
Day 3:
- Use lb4 app to create services/order-service. Define Order model, OrderRepository. ✅
- In product-service, add Product hasMany Order (LB4 Relations). ✅
- In store-facade, define REST datasources to call product- and order-service, plus service proxies for typed methods. ✅
- Implement a StoreController that aggregates product & order data. Test the façade endpoints to confirm combined results. ✅
Day 4:
- lb4 app for services/user-service; define User model with role enum, plus UserRepository. ✅
- Create a decorator @FormattedDate() for createdOn / modifiedOn fields. ✅
- Optionally build a GenericRepository<T> for advanced TypeScript usage.
- Integrate store-facade with user-service via another REST datasource if you want to fetch user data or roles.
Day 5:
- Reading: Go through ARC Docs to see which core modules and microservices are available (auth-service, rate-limiter, secure sequences, notifications,etc.).  ✅
- Install Arc CLI globally and run a short demo generating or installing an ARC-based microservice. ✅ | User Tenant Service 
- Discuss how ARC’s modules compare to your local LB4 code and decide which ones to adopt (e.g., replace custom user-service with ARC’s user-service, or keep your own). ✅ :: the arc user service is composite user - tenant based service, can be managed with multiple user in same tenant for single tenant systems , also it can handle multitenancy. The endpoints are already secured with JWT based tokens so simply using arc authentication and authorzation services with user-tenant service will make it work.
Day 6:
- Install the ARC authentication and authorization packages in store-facade (and/or user-service if relevant).
- Configure them in the LB4 application: e.g., load ARC auth strategies for JWT, specify role checks in the façade endpoints.
- Restrict certain routes (e.g., product creation) to Admin or SuperAdmin using ARC’s decorators or metadata-based checks.
- Test that calls without valid tokens or roles are blocked, confirming ARC’s built-in logic is engaged.
Day 7:
- Install ARC’s rate-limiter module in store-facade, configure it to use Redis or in-memory if needed.
- Replace or enhance the LB4 sequence in store-facade with ARC secure sequences, ensuring rate-limit checks are automatically applied.
- Verify repeated or high-traffic calls from the same user or IP get a 429 error, demonstrating ARC’s rate-limiting is active. No custom interceptor code—just ARC config.

Day 8:
- Generate an ARC-based chat-service or notification-service with Arc CLI. 
- Configure environment variables (DB credentials, host/port). 
- In store-facade, define REST datasources for the new ARC microservices. 
- Create a façade endpoint that triggers a chat or notification upon events like new user sign-up or new order. 
- Test a full flow: user logs in via ARC auth, triggers a protected action, if they spam calls ARC rate-limiting blocks them, if order completes ARC sends a notification.
