# Lite Account

A simple personal ledger for income, expenses, and balance in Malaysian ringgit (MYR).

## Run

Requires Node.js 22 or newer. No external packages or database are needed.

```sh
npm start
```

The server listens on port 3000. Set `PORT` to use another port.

```sh
npm test
```

Entries are saved in this browser's local storage for the current origin. They are not synced or backed up. Clearing browser data removes them. This starter is for personal use; it has no authentication or server-side account storage. Use a consistent port to access the same saved entries.
