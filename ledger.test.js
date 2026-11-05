import test from 'node:test';
import assert from 'node:assert/strict';
import { totals, amountToCents, validEntry } from './public/ledger.js';
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
