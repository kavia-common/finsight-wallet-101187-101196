import { v4 as uuidv4 } from 'uuid';

// Simple internal storage
let db = {
  users: [],
  accounts: [],
  transactions: [],
};

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

function nowISO() {
  return new Date().toISOString();
}

function ensureUser(email) {
  const user = db.users.find((u) => u.email === email);
  if (!user) throw new Error('User not found');
  return user;
}

// Seed demo user
if (db.users.length === 0) {
  const userId = uuidv4();
  const acct1 = uuidv4();
  const acct2 = uuidv4();
  db.users.push({ id: userId, email: 'demo@finsight.test', name: 'Demo User' });
  db.accounts.push(
    { id: acct1, userId, name: 'Checking', type: 'checking', currency: 'USD', balance: 1200 },
    { id: acct2, userId, name: 'Savings', type: 'savings', currency: 'USD', balance: 4200 },
  );
  db.transactions.push(
    { id: uuidv4(), accountId: acct1, type: 'expense', amount: 45.2, description: 'Groceries', date: nowISO() },
    { id: uuidv4(), accountId: acct1, type: 'income', amount: 2000, description: 'Salary', date: nowISO() },
    { id: uuidv4(), accountId: acct2, type: 'expense', amount: 120.77, description: 'Utilities', date: nowISO() },
  );
}

/**
 * PUBLIC_INTERFACE
 * mockApi simulates backend endpoints for development.
 */
export const mockApi = {
  auth: {
    // PUBLIC_INTERFACE
    async register({ name, email }) {
      await delay();
      if (db.users.find((u) => u.email === email)) {
        throw new Error('Email already registered');
      }
      const user = { id: uuidv4(), name, email };
      db.users.push(user);
      return { user };
    },
    // PUBLIC_INTERFACE
    async login({ email }) {
      await delay();
      let user = db.users.find((u) => u.email === email);
      if (!user) {
        // auto-register for demo login
        user = { id: uuidv4(), email, name: email.split('@')[0] };
        db.users.push(user);
      }
      return { user };
    },
  },
  accounts: {
    // PUBLIC_INTERFACE
    async list() {
      await delay();
      return db.accounts;
    },
    // PUBLIC_INTERFACE
    async create(payload) {
      await delay();
      const id = uuidv4();
      const account = { id, balance: Number(payload.startingBalance || 0), ...payload };
      delete account.startingBalance;
      db.accounts.push(account);
      return account;
    },
    // PUBLIC_INTERFACE
    async update(id, payload) {
      await delay();
      const idx = db.accounts.findIndex((a) => a.id === id);
      if (idx < 0) throw new Error('Account not found');
      db.accounts[idx] = { ...db.accounts[idx], ...payload };
      return db.accounts[idx];
    },
    // PUBLIC_INTERFACE
    async remove(id) {
      await delay();
      db.accounts = db.accounts.filter((a) => a.id !== id);
      db.transactions = db.transactions.filter((t) => t.accountId !== id);
      return { success: true };
    },
  },
  transactions: {
    // PUBLIC_INTERFACE
    async listByAccount(accountId) {
      await delay();
      return db.transactions.filter((t) => t.accountId === accountId);
    },
    // PUBLIC_INTERFACE
    async create(accountId, payload) {
      await delay();
      const id = uuidv4();
      const tx = { id, accountId, date: nowISO(), ...payload, amount: Number(payload.amount) };
      db.transactions.push(tx);
      // adjust balance
      const acc = db.accounts.find((a) => a.id === accountId);
      if (acc) {
        acc.balance += tx.type === 'income' ? tx.amount : -tx.amount;
      }
      return tx;
    },
    // PUBLIC_INTERFACE
    async remove(id) {
      await delay();
      const tx = db.transactions.find((t) => t.id === id);
      if (tx) {
        const acc = db.accounts.find((a) => a.id === tx.accountId);
        if (acc) {
          acc.balance += tx.type === 'income' ? -tx.amount : tx.amount;
        }
      }
      db.transactions = db.transactions.filter((t) => t.id !== id);
      return { success: true };
    },
  },
  insights: {
    // PUBLIC_INTERFACE
    async summary() {
      await delay();
      const totalBalance = db.accounts.reduce((s, a) => s + Number(a.balance || 0), 0);
      const last30 = db.transactions.filter(
        (t) => new Date(t.date) >= new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      );
      const income = last30.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = last30.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      const byDay = Array.from({ length: 7 }).map((_, i) => {
        const day = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
        const d = day.toISOString().slice(0, 10);
        const sum = db.transactions
          .filter((t) => t.date.slice(0, 10) === d && t.type === 'expense')
          .reduce((s, t) => s + t.amount, 0);
        return { label: d.slice(5), value: Math.round(sum) };
      });
      return { totalBalance, income, expense, weeklyExpense: byDay };
    },
  },
};
