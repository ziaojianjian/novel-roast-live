import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateFangyuanIndex } from '../src/scoring.js';
const zero={antiTrope:0,rationality:0,selfInterest:0,ruthlessness:0,persistence:0,absurdity:0};
const ten=Object.fromEntries(Object.keys(zero).map(key=>[key,10]));
test('all-zero scores equal zero',()=>assert.equal(calculateFangyuanIndex(zero),0));
test('all-ten scores equal ten',()=>assert.equal(calculateFangyuanIndex(ten),10));
test('average is rounded to one decimal',()=>assert.equal(calculateFangyuanIndex({...zero,antiTrope:9,rationality:8}),2.8));
test('live six-score example calculates the displayed Fangyuan index',()=>assert.equal(calculateFangyuanIndex({antiTrope:3.7,rationality:3.9,selfInterest:5,ruthlessness:1.6,persistence:5.7,absurdity:2.4}),3.7));
