# Monorepo starter-kit

Monorepo starter-Kit is a monorepo created with all the essential configurations to help you build and scale applications easily and efficiently

With Monorepo Starter-Kit, you will work with:

- Package Manager (pnpm)
- Frontend App (React + vite)
- Server (Express)
- UI (Tailwind + Shadcn)
- Authentication (Better Auth)
- Payments (Stripe)
- Validation (Zod)
- ORM (Drizzle)
- Database (PostgreSQL)

## Development

### Start to develop your app

Execute the command below to install the dependencies

```

pnpm i

```

Execute the command below to start the servers

```

pnpm run dev

```

### Launch Postgresql Database

Launching your postgres database in local

Execute the command below:

```

# https://hub.docker.com/_/postgres

docker run -dp 5432:5432  --name postgresdb  -e POSTGRES_USER=raburuz  -e POSTGRES_PASSWORD=mysecretpassword  -e POSTGRES_DB=dev  -v postgresql:/var/lib/postgresql/data  postgres:15-alpine

```

OR 

```bash
docker compose up --build -d
docker exec -it postgresdb bash
```

Inside psql:

```
psql -U raburuz -d dev
CREATE EXTENSION pg_uuidv7;
\q
```

Verify PostgreSQL is working:

```bash
docker exec -it postgresdb psql -U raburuz -d dev
```

Inside psql:

```sql
\dx                          -- list installed extensions
SELECT uuid_generate_v7();   -- generate UUIDv7
```

Postgresql string connection

```

postgresql://raburuz:mysecretpassword@localhost/dev

```

### Stripe Webhook

Download the Stripe CLI

https://docs.stripe.com/stripe-cli

Unzip the file in your desktop and open the window terminal (Command Prompt)

```

stripe login

# Forward events to your local development server
stripe listen --forward-to http://localhost:8080/stripe/webhook

```
