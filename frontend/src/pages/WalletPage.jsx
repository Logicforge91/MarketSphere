import React, { useMemo, useState } from "react";
import { AlertTriangle, ArrowDownLeft, ArrowUpRight, Check, Clock3, CreditCard, Download, Gift, History, IndianRupee, Plus, ShieldCheck, WalletCards, X } from "lucide-react";
import { money } from "../utils/format";

const initialWallet = {
  cashBalance: 1250,
  promotionalBalance: 300,
  promotionalExpiry: "2026-08-31",
  transactions: [
    { id: "WTX-5012", type: "credit", category: "Refund", label: "Refund for order #MS205186", amount: 750, date: "2026-07-20T10:20:00.000Z", status: "Completed" },
    { id: "WTX-4998", type: "credit", category: "Add money", label: "Added using UPI", amount: 500, date: "2026-07-18T08:15:00.000Z", status: "Completed" },
    { id: "WTX-4931", type: "debit", category: "Payment", label: "Wallet payment for order #MS204912", amount: 1299, date: "2026-07-15T12:40:00.000Z", status: "Completed" },
    { id: "WTX-4880", type: "credit", category: "Promotion", label: "MarketSphere Rewards bonus", amount: 300, date: "2026-07-10T09:00:00.000Z", status: "Promotional" },
  ],
};

function readWallet() {
  try {
    return JSON.parse(window.localStorage.getItem("marketsphere:wallet")) || initialWallet;
  } catch {
    return initialWallet;
  }
}

export default function WalletPage() {
  const [wallet, setWallet] = useState(readWallet);
  const [showAdd, setShowAdd] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("UPI");
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");
  const total = wallet.cashBalance + wallet.promotionalBalance;
  const transactions = useMemo(() => wallet.transactions.filter((item) => filter === "All" || item.category === filter), [filter, wallet.transactions]);

  function persist(next) {
    setWallet(next);
    window.localStorage.setItem("marketsphere:wallet", JSON.stringify(next));
  }

  function addMoney(event) {
    event.preventDefault();
    const value = Number(amount);
    if (value < 100 || value > 50000) return setMessage("Add between Rs. 100 and Rs. 50,000 per transaction.");
    const transaction = { id: `WTX-${Date.now().toString().slice(-5)}`, type: "credit", category: "Add money", label: `Added using ${method}`, amount: value, date: new Date().toISOString(), status: "Completed" };
    persist({ ...wallet, cashBalance: wallet.cashBalance + value, transactions: [transaction, ...wallet.transactions] });
    setAmount("");
    setShowAdd(false);
    setMessage(`${money(value)} added to your wallet.`);
  }

  function downloadStatement() {
    const rows = ["MARKETSPHERE WALLET STATEMENT", `Generated: ${new Date().toLocaleString("en-IN")}`, `Cash balance: ${money(wallet.cashBalance)}`, `Promotional balance: ${money(wallet.promotionalBalance)}`, "", ...wallet.transactions.map((item) => `${new Date(item.date).toLocaleDateString("en-IN")} | ${item.id} | ${item.category} | ${item.type === "credit" ? "+" : "-"}${money(item.amount)} | ${item.status}`)];
    const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/plain" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "MarketSphere-wallet-statement.txt";
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Wallet statement downloaded.");
  }

  return <main className="real-page wallet-page">
    <header className="wallet-heading"><div><span>MarketSphere Wallet</span><h1>Fast, protected payments</h1><p>Add money, receive refunds and follow every wallet transaction.</p></div><button className="primary" onClick={() => setShowAdd(true)}><Plus /> Add money</button></header>
    {message && <p className="wallet-message"><Check /> {message}</p>}
    <section className="wallet-balance-panel"><div><WalletCards /><span><small>Total wallet balance</small><strong>{money(total)}</strong><p>Available for eligible MarketSphere orders</p></span></div><div><span>Cash balance<strong>{money(wallet.cashBalance)}</strong></span><span>Promotional balance<strong>{money(wallet.promotionalBalance)}</strong><small>Expires {new Date(wallet.promotionalExpiry).toLocaleDateString("en-IN", { dateStyle: "medium" })}</small></span></div></section>
    <aside className="wallet-expiry-alert"><Clock3 /><div><strong>{money(wallet.promotionalBalance)} promotional balance expires soon</strong><span>Promotional funds are used first on eligible wallet payments and cannot be withdrawn.</span></div></aside>
    <section className="wallet-actions"><article><CreditCard /><div><strong>Wallet payment</strong><span>Select MarketSphere Wallet during checkout. Promotional funds are applied before cash balance.</span></div></article><article><ArrowDownLeft /><div><strong>Refund to wallet</strong><span>Choose Wallet as the refund destination for near-instant credit after approval.</span></div></article><button onClick={downloadStatement}><Download /><span><strong>Download statement</strong><small>Export complete wallet history</small></span></button></section>
    <section className="wallet-transactions"><header><div><span>Wallet transactions</span><h2>Balance activity</h2></div><div>{["All", "Add money", "Payment", "Refund", "Promotion"].map((item) => <button className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div></header>{transactions.map((transaction) => <article key={transaction.id}><i className={transaction.type}>{transaction.type === "credit" ? <ArrowDownLeft /> : <ArrowUpRight />}</i><div><strong>{transaction.label}</strong><span>{transaction.id} · {new Date(transaction.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span></div><div><strong className={transaction.type}>{transaction.type === "credit" ? "+" : "-"}{money(transaction.amount)}</strong><span>{transaction.status}</span></div></article>)}</section>
    <section className="wallet-rules"><header><ShieldCheck /><div><span>Wallet terms</span><h2>Withdrawal and usage rules</h2></div></header><div><p><Check /> Cash balance added by you may be eligible for withdrawal after identity verification.</p><p><X /> Promotional balance, coupons and rewards cannot be withdrawn or transferred.</p><p><Check /> Approved refunds can be credited to the wallet and used immediately.</p><p><AlertTriangle /> Wallet payments and withdrawals may be reviewed for fraud prevention and regulatory compliance.</p></div></section>

    {showAdd && <div className="wallet-modal-backdrop" onMouseDown={() => setShowAdd(false)}><form className="add-money-modal" onSubmit={addMoney} onMouseDown={(event) => event.stopPropagation()}><header><div><span>Wallet top-up</span><h2>Add money</h2></div><button type="button" onClick={() => setShowAdd(false)}><X /></button></header><label>Amount<div><IndianRupee /><input required type="number" min="100" max="50000" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Enter amount" /></div></label><div className="wallet-quick-amounts">{[500, 1000, 2000, 5000].map((value) => <button type="button" onClick={() => setAmount(String(value))} key={value}>{money(value)}</button>)}</div><label>Payment method<select value={method} onChange={(event) => setMethod(event.target.value)}><option>UPI</option><option>Debit card</option><option>Net banking</option></select></label><aside><ShieldCheck /> Money is added through MarketSphere SecurePay.</aside><button className="primary">Add {amount ? money(Number(amount)) : "money"}</button></form></div>}
  </main>;
}
