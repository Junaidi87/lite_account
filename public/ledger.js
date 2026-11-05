export function totals(entries) {
  return entries.reduce((sum, entry) => { sum[entry.type] += entry.cents; sum.balance += entry.type === 'income' ? entry.cents : -entry.cents; return sum; }, { income: 0, expense: 0, balance: 0 });
}
export function amountToCents(value) {
  if (!/^\d+(\.\d{1,2})?$/.test(value)) throw new Error('Enter a positive amount with up to two decimal places.');
  const cents = Math.round(Number(value) * 100);
  if (!Number.isSafeInteger(cents) || cents <= 0 || cents > 99999999999) throw new Error('Enter an amount between 0.01 and 999,999,999.99.');
  return cents;
}
export function validEntry(e) {
  return e && typeof e.id === 'string' && typeof e.description === 'string' && e.description.trim().length > 0 && e.description.length <= 120 && ['income', 'expense'].includes(e.type) && Number.isSafeInteger(e.cents) && e.cents > 0 && /^\d{4}-\d{2}-\d{2}$/.test(e.date);
}

export function entriesToCsv(entries) {
  const cell = value => '"' + String(value).replaceAll('"', '""') + '"';
  // Prevent spreadsheet applications from interpreting descriptions as formulas.
  const safeDescription = text => /^[\s]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text) ? "'" + text : text;
  const rows = [['Date', 'Type', 'Description', 'Amount (MYR)'], ...entries.map(e => [e.date, e.type, safeDescription(e.description), (e.cents / 100).toFixed(2)])];
  return '\uFEFF' + rows.map(row => row.map(cell).join(',')).join('\r\n') + '\r\n';
}
