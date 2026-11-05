import test from 'node:test';
import assert from 'node:assert/strict';
import { totals, amountToCents, validEntry, entriesToCsv } from './public/ledger.js';
test('income and expenses produce exact balance in cents', () => {
 assert.deepEqual(totals([{type:'income',cents:amountToCents('100.10')},{type:'expense',cents:amountToCents('25.20')}]), {income:10010,expense:2520,balance:7490});
 assert.equal(amountToCents('0.29'),29);
});
test('invalid monetary entries are rejected', () => {
 for (const value of ['0','-1','1.001','NaN','Infinity','1e3','']) assert.throws(() => amountToCents(value));
});
test('stored entries require a supported transaction shape', () => {
 const entry = {id:'test',description:'Salary',type:'income',cents:100,date:'2026-11-05'};
 assert.ok(validEntry(entry));
 for (const change of [{type:'other'},{cents:-1},{description:' '},{cents:1.1},{date:'invalid'}]) assert.ok(!validEntry({...entry,...change}));
});

test('CSV preserves quoted descriptions and decimal amounts and neutralizes formulas', () => {
 const csv = entriesToCsv([
  {date:'2026-11-05',type:'expense',description:'Food, "lunch"\nand tea',cents:2520},
  {date:'2026-11-05',type:'income',description:'=1+1',cents:100000}
 ]);
 assert.ok(csv.startsWith('\uFEFF"Date","Type","Description","Amount (MYR)","Category"\r\n'));
 assert.ok(csv.includes('"Food, ""lunch""\nand tea","25.20"'));
 assert.ok(csv.includes('"\'=1+1","1000.00"'));
 assert.equal(entriesToCsv([]), '\uFEFF"Date","Type","Description","Amount (MYR)","Category"\r\n');
});

test('categories support legacy entries and reject invalid new category values', () => {
 const entry = {id:'test',description:'Food',type:'expense',cents:100,date:'2026-11-05'};
 assert.ok(validEntry(entry));
 assert.ok(validEntry({...entry,category:'Pet care'}));
 for (const category of ['', ' ', 123, 'x'.repeat(61)]) assert.ok(!validEntry({...entry,category}));
 assert.ok(entriesToCsv([{...entry,category:'=SUM(1)'}]).includes('"\'=SUM(1)"'));
 assert.ok(entriesToCsv([entry]).includes('"Uncategorized"'));
});
