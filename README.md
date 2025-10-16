# NC News Seeding

- You need to create two `.env` files to connect to your local databases, one for test environment and one for development environment.
- File name should be: 
  - `.env.test`
  - `.env.development`
- In each file add the following environment variable:
  - For development: `PGDATABASE={your-database-name}`  
  - For testing: `PGDATABASE={your-test-database-name}`