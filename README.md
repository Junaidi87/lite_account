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

Use **Export all CSV** to download all saved transactions, regardless of the current filter. The file includes date, type, description, and amount in MYR and opens in spreadsheet apps. Formula-like descriptions are prefixed with an apostrophe for spreadsheet safety. CSV import is not yet supported.

Select **Edit** beside a transaction to change its type, description, amount, or date. **Save changes** updates the existing entry; **Cancel edit** leaves it unchanged.
