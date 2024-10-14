# Feature Flags :: Starter Repo

This is a simple Twitter clone (only text-based posts) made with [Next.js](https://nextjs.org). We will be adding feature flags to this app.

## Get started

1. Clone this repo to your machine.

2. Delete the `.git` folder, and initialise a new git repository. This removes my commits, and sets up an initial commit for you.

```sh
rm -rf .git
git init
git add .
git commit -m "init: first commit"
```

3. Install npm dependencies using your favorite package manager.

```sh
pnpm install  # i use pnpm
```

4. You'll need a Postgres instance to run the app. I'll use Docker to create one.

```sh
docker run -dp 5432:5432 --name postgres -e POSTGRES_PASSWORD=postgres postgres
# This creates a postgres instance with user=postgres, password=postgres, db=postgres
```

5. Add the Postgres URL to a `.env` file.

```sh
echo "POSTGRES_URL=postgres://postgres:postgres@localhost:5432/postgres" >> .env
```

6. Start the dev server on port [3000](http://localhost:3000)

```sh
pnpm dev
```
