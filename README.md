# NC News

### Live API
Hosted version available here:  
- https://nc-news-backend-02ex.onrender.com/api

---

## 📌 Project Summary

NC News is a fully tested RESTful backend service that provides programmatic access to a relational news database, inspired by Reddit. It allows clients to query and interact with topics, users, articles, and comments while maintaining strong data integrity and consistent error handling throughout.

✅ Current supported functionality includes:

- Fetching all topics  
- Retrieving articles individually or as a list, including `comment_count`
- Advanced article queries including sorting, ordering and topic filtering  
- Creating and deleting comments  
- Updating article vote totals  
- Fetching user data  

## Tech Stack

| Feature | Details |
|--------|---------|
| Server Framework | Express.js |
| Database | PostgreSQL |
| Testing | Jest & Supertest |
| Validation | PostgreSQL error codes + custom middleware |

---

## Getting Started Locally

Follow these steps to setup the project on your machine.

### ✅ 1. Clone the repository

```bash
git clone https://github.com/hasnaindar8/nc-news-backend.git
cd nc-news-backend
```

### ✅ 2. Install dependencies

```bash
npm install
```

### ✅ 3. Setup environment variables

You must create **two** `.env` files in the project root:

```
.env.development
.env.test
```

Each file must contain a **PGDATABASE** variable with value of the correct local database as mentioned below:

```env
# .env.development
PGDATABASE=nc_news
```

```env
# .env.test
PGDATABASE=nc_news_test
```
These steps tell the app which database to connect to in different environments.

### ✅ 4. Setup local databases + seed

```bash
npm run setup-dbs
npm run seed
npm run test-seed
```

This creates both dev and test DBs with data.

### ✅ 5. Run Tests

 Jest + Supertest included.

```bash
npm test
```

Run a single test file:

```bash
npm test api
```

### ✅ 6. Start the server

```bash
npm run start
```

Server should be running at:

```
http://localhost:8080/getHealth
```
---

## Minimum Requirements

| Dependency | Version |
|-----------|---------|
| Node.js | **v18.x or higher recommended** |
| PostgreSQL | **v14.x or higher recommended** |

Check your versions:

```bash
node -v
psql --version
```
