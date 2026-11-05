import { totals, amountToCents, validEntry, entriesToCsv } from './ledger.js';
const $ = id => document.getElementById(id);
const key = 'lite-account.entries.v1';
let entries = [];
const money = cents => new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(cents / 100);
function today() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
$('date').value = today();
try { const saved = JSON.parse(localStorage.getItem(key) || '[]'); if (!Array.isArray(saved) || !saved.every(validEntry)) throw new Error(); entries = saved; }
catch { $('message').textContent = 'Saved entries could not be read. Existing storage will not change until you save a transaction.'; }
function save(next) { try { localStorage.setItem(key, JSON.stringify(next)); entries = next; render(); return true; } catch { $('message').textContent = 'Could not save. Browser storage may be full or disabled.'; return false; } }
function render() {
  $('export').disabled = entries.length === 0;
  const sum = totals(entries); for (const name of ['balance','income','expense']) $(name).textContent = money(sum[name]);
  $('count').textContent = `${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`;
  const visible = entries.filter(e => $('filter').value === 'all' || e.type === $('filter').value).sort((a,b) => b.date.localeCompare(a.date));
  $('transactions').replaceChildren();
  if (!visible.length) { const empty = document.createElement('div'); empty.className = 'empty'; const icon = document.createElement('div'); icon.className = 'empty-icon'; icon.textContent = '↗'; const heading = document.createElement('h3'); heading.textContent = entries.length ? 'No matching transactions' : 'A fresh start'; const p = document.createElement('p'); p.textContent = entries.length ? 'Choose another filter to see your entries.' : 'Add your first transaction to start building a clearer picture of your money.'; empty.append(icon,heading,p); $('transactions').append(empty); }
  for (const e of visible) { const row = document.createElement('article'); row.className = 'transaction'; const icon = document.createElement('span'); icon.className = `transaction-icon ${e.type}`; icon.textContent = e.type === 'income' ? '↙' : '↗'; const detail = document.createElement('div'); detail.className = 'detail'; const title = document.createElement('strong'); title.textContent = e.description; const date = document.createElement('small'); date.textContent = `${new Date(e.date+'T12:00:00').toLocaleDateString('en-MY',{day:'numeric',month:'short',year:'numeric'})} · ${e.type}`; detail.append(title,date); const amount = document.createElement('strong'); amount.className = e.type; amount.textContent = `${e.type === 'income' ? '+' : '−'}${money(e.cents)}`; const button = document.createElement('button'); button.className = 'delete'; button.textContent = '×'; button.setAttribute('aria-label',`Delete ${e.description}`); button.onclick = () => { if (confirm(`Delete “${e.description}”?`)) { if (save(entries.filter(item => item.id !== e.id))) $('message').textContent = 'Transaction deleted.'; } }; row.append(icon,detail,amount,button); $('transactions').append(row); }
}
$('export').onclick = () => {
  const url = URL.createObjectURL(new Blob([entriesToCsv(entries)], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `lite-account-${today()}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  $('message').textContent = `Exported all ${entries.length} transactions.`;
};
$('filter').onchange = render;
$('form').onsubmit = event => { event.preventDefault(); try { const data = new FormData(event.target); const entry = { id: crypto.randomUUID(), description: data.get('description').trim(), cents: amountToCents(data.get('amount').trim()), type: data.get('type'), date: data.get('date') }; if (!validEntry(entry)) throw new Error('Enter a description and valid date.'); if (save([...entries,entry])) { $('description').value = ''; $('amount').value = ''; $('message').textContent = 'Transaction saved.'; $('description').focus(); } } catch (error) { $('message').textContent = error.message; } };
render();
