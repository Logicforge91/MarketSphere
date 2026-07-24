import React, { useMemo, useState } from "react";
import { Bot, Check, ChevronDown, CircleHelp, Clock3, Headphones, Mail, MessageCircle, Paperclip, Phone, Search, Send, Star, TicketCheck, Upload, X } from "lucide-react";
import { useShop } from "../context/ShopContext";

const helpArticles = [
  { category: "Orders", title: "Where is my order?", body: "Open Orders, select the purchase and choose Live tracking to view shipment scans, courier details and delivery estimates." },
  { category: "Orders", title: "Change or cancel an order", body: "Eligible orders can be cancelled before shipment. Open order details to cancel an item or the full order." },
  { category: "Payments", title: "Payment failed but money was deducted", body: "Banks usually reverse unsuccessful authorizations automatically. Create a payment ticket if it is not reversed within five business days." },
  { category: "Payments", title: "Track a refund", body: "Refund references, destination and status timelines appear inside the related order details." },
  { category: "Returns", title: "Start a return or exchange", body: "Open Returns, select an eligible item, choose your resolution and schedule a pickup." },
  { category: "Returns", title: "Return pickup was missed", body: "Open the return request and contact support to schedule another pickup slot." },
  { category: "Products", title: "Report an incorrect product listing", body: "Use Report this product on the product page or create a product-specific support ticket." },
  { category: "Account", title: "Secure a compromised account", body: "Change your password, enable two-factor authentication and remove unfamiliar devices immediately." },
];

const initialTickets = [
  { id: "TKT-28415", subject: "Refund reference required", category: "Payment", status: "Resolved", createdAt: "2026-07-18T10:30:00.000Z", context: "Order #MS205186", messages: 3, rating: 0 },
  { id: "TKT-27902", subject: "Return pickup reschedule", category: "Return", status: "In progress", createdAt: "2026-07-15T08:20:00.000Z", context: "Return #RET204912", messages: 2, rating: 0 },
];

function readStored(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

export default function SupportPage() {
  const { orders, returnRequests } = useShop();
  const [view, setView] = useState("help");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [openArticle, setOpenArticle] = useState("");
  const [tickets, setTickets] = useState(() => readStored("marketsphere:support-tickets", initialTickets));
  const [ticketForm, setTicketForm] = useState({ category: "Order", subject: "", description: "", context: "", priority: "Normal" });
  const [attachments, setAttachments] = useState([]);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([{ id: 1, from: "bot", body: "Hi, I am Sphere Assist. How can I help with your shopping today?" }]);
  const [chatInput, setChatInput] = useState("");
  const filteredArticles = useMemo(() => helpArticles.filter((article) => (category === "All" || article.category === category) && `${article.title} ${article.body}`.toLowerCase().includes(query.toLowerCase())), [category, query]);

  function persistTickets(next) {
    setTickets(next);
    window.localStorage.setItem("marketsphere:support-tickets", JSON.stringify(next));
  }

  function createTicket(event) {
    event.preventDefault();
    const ticket = { ...ticketForm, id: `TKT-${Date.now().toString().slice(-5)}`, status: "Open", createdAt: new Date().toISOString(), attachments: attachments.map((file) => file.name), messages: 1, rating: 0 };
    persistTickets([ticket, ...tickets]);
    setTicketForm({ category: "Order", subject: "", description: "", context: "", priority: "Normal" });
    setAttachments([]);
    setMessage(`Ticket ${ticket.id} created. Our support team will respond shortly.`);
    setView("tickets");
  }

  function sendChat(event) {
    event.preventDefault();
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    setChat((items) => [...items, { id: Date.now(), from: "user", body: text }, { id: Date.now() + 1, from: "bot", body: /refund|payment/i.test(text) ? "I can help with that payment. Open the order details for its refund reference, or create a payment ticket for an agent." : /return|exchange/i.test(text) ? "You can start and track returns from the Returns workspace. I can also connect you to an agent." : /order|delivery|track/i.test(text) ? "Open Orders and select Live tracking for the latest courier scan and delivery estimate." : "I found a few possible paths. Would you like help from a live support agent?" }]);
    setChatInput("");
  }

  function rateTicket(id, rating) {
    persistTickets(tickets.map((ticket) => ticket.id === id ? { ...ticket, rating } : ticket));
    setMessage("Thank you for rating your support experience.");
  }

  return <main className="real-page support-hub">
    <header className="support-heading"><div><span>MarketSphere care</span><h1>How can we help?</h1><p>Find answers, talk with us or follow an existing support request.</p></div><Headphones /></header>
    <nav className="support-tabs"><button className={view === "help" ? "active" : ""} onClick={() => setView("help")}><CircleHelp /> Help centre</button><button className={view === "new" ? "active" : ""} onClick={() => setView("new")}><TicketCheck /> Create ticket</button><button className={view === "tickets" ? "active" : ""} onClick={() => setView("tickets")}><Clock3 /> Ticket history <b>{tickets.length}</b></button><button className={view === "chat" ? "active" : ""} onClick={() => setView("chat")}><MessageCircle /> Live chat</button></nav>
    {message && <p className="support-message"><Check /> {message}</p>}

    {view === "help" && <><section className="help-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search help articles, payments, returns and orders" /></section><div className="help-layout"><aside><strong>Browse topics</strong>{["All", "Orders", "Payments", "Returns", "Products", "Account"].map((item) => <button className={category === item ? "active" : ""} onClick={() => setCategory(item)} key={item}>{item}<span>{item === "All" ? helpArticles.length : helpArticles.filter((article) => article.category === item).length}</span></button>)}</aside><section className="help-articles"><header><div><span>Frequently asked questions</span><h2>{category === "All" ? "Popular help articles" : category}</h2></div><b>{filteredArticles.length} articles</b></header>{filteredArticles.map((article) => <article className={openArticle === article.title ? "open" : ""} key={article.title}><button onClick={() => setOpenArticle(openArticle === article.title ? "" : article.title)}><span><small>{article.category}</small><strong>{article.title}</strong></span><ChevronDown /></button>{openArticle === article.title && <p>{article.body}</p>}</article>)}{!filteredArticles.length && <div className="support-empty"><Search /><h3>No matching articles</h3><button className="primary" onClick={() => setView("new")}>Ask support</button></div>}</section></div><section className="support-contact-grid"><a href="tel:+918047122880"><Phone /><span><strong>Call support</strong><small>Mon-Sun · 8 AM-10 PM</small></span></a><a href="mailto:support@marketsphere.in"><Mail /><span><strong>Email support</strong><small>Reply within 24 hours</small></span></a><a href="https://wa.me/918047122880" target="_blank" rel="noreferrer"><MessageCircle /><span><strong>WhatsApp support</strong><small>Chat using your order number</small></span></a><button onClick={() => setView("chat")}><Bot /><span><strong>Sphere Assist</strong><small>Instant chatbot help</small></span></button></section></>}

    {view === "new" && <form className="support-ticket-form" onSubmit={createTicket}><header><div><span>New support request</span><h2>Tell us what happened</h2><p>Add context so the right specialist can help faster.</p></div><TicketCheck /></header><div className="ticket-field-grid"><label>Support category<select value={ticketForm.category} onChange={(event) => setTicketForm({ ...ticketForm, category: event.target.value, context: "" })}><option>Order</option><option>Product</option><option>Payment</option><option>Return</option><option>Account</option><option>Other</option></select></label><label>Priority<select value={ticketForm.priority} onChange={(event) => setTicketForm({ ...ticketForm, priority: event.target.value })}><option>Normal</option><option>Urgent</option></select></label>{ticketForm.category === "Order" && <label className="wide">Related order<select value={ticketForm.context} onChange={(event) => setTicketForm({ ...ticketForm, context: event.target.value })}><option value="">Select an order</option>{orders.map((order) => <option value={`Order #${order.id}`} key={order.id}>#{order.id} · {order.status}</option>)}</select></label>}{ticketForm.category === "Product" && <label className="wide">Related product<select value={ticketForm.context} onChange={(event) => setTicketForm({ ...ticketForm, context: event.target.value })}><option value="">Select a product</option>{orders.flatMap((order) => order.items || []).map((item) => <option value={item.name} key={item.name}>{item.name}</option>)}</select></label>}{ticketForm.category === "Return" && <label className="wide">Related return<select value={ticketForm.context} onChange={(event) => setTicketForm({ ...ticketForm, context: event.target.value })}><option value="">Select a return request</option>{returnRequests.map((request) => <option value={`Return #${request.id}`} key={request.id}>#{request.id} · {request.status}</option>)}</select></label>}<label className="wide">Subject<input required maxLength="100" value={ticketForm.subject} onChange={(event) => setTicketForm({ ...ticketForm, subject: event.target.value })} /></label><label className="wide">Description<textarea required minLength="20" maxLength="1000" value={ticketForm.description} onChange={(event) => setTicketForm({ ...ticketForm, description: event.target.value })} placeholder="Include dates, amounts and what you expected to happen" /></label></div><label className="ticket-attachment"><Paperclip /><span><strong>Upload attachments</strong><small>Images, video or documents · Up to 5 files</small></span><Upload /><input type="file" multiple onChange={(event) => setAttachments([...event.target.files].slice(0, 5))} /></label>{attachments.length > 0 && <p className="ticket-files">{attachments.map((file) => file.name).join(" · ")}</p>}<footer><span>By submitting, you agree that support may review related order and account details.</span><button className="primary">Create support ticket</button></footer></form>}

    {view === "tickets" && <section className="ticket-history">{tickets.length ? tickets.map((ticket) => <article key={ticket.id}><header><div><small>{ticket.category} · {ticket.id}</small><h2>{ticket.subject}</h2><span>{new Date(ticket.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}{ticket.context && ` · ${ticket.context}`}</span></div><b className={ticket.status.toLowerCase().replace(" ", "-")}>{ticket.status}</b></header><div className="ticket-timeline"><i className="done" /><i className={ticket.status !== "Open" ? "done" : ""} /><i className={ticket.status === "Resolved" ? "done" : ""} /></div><div className="ticket-timeline-labels"><span>Created</span><span>Agent response</span><span>Resolved</span></div><footer><span>{ticket.messages} messages{ticket.attachments?.length ? ` · ${ticket.attachments.length} attachments` : ""}</span>{ticket.status === "Resolved" ? <div className="support-rating"><span>Rate support</span>{[1, 2, 3, 4, 5].map((rating) => <button className={rating <= ticket.rating ? "selected" : ""} onClick={() => rateTicket(ticket.id, rating)} key={rating}><Star fill="currentColor" /></button>)}</div> : <button onClick={() => setView("chat")}>Message support</button>}</footer></article>) : <div className="support-empty"><TicketCheck /><h3>No support tickets</h3><button className="primary" onClick={() => setView("new")}>Create ticket</button></div>}</section>}

    {view === "chat" && <section className="support-chat"><header><div><i><Bot /></i><span><strong>Sphere Assist</strong><small><em /> Online · Instant replies</small></span></div><button onClick={() => setMessage("A live support agent will join this chat shortly.")}><Headphones /> Request live agent</button></header><div className="chat-messages">{chat.map((item) => <p className={item.from} key={item.id}>{item.body}</p>)}</div><div className="chat-suggestions">{["Track my order", "Refund status", "Start a return", "Payment problem"].map((text) => <button onClick={() => setChatInput(text)} key={text}>{text}</button>)}</div><form onSubmit={sendChat}><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Type your message" /><button><Send /></button></form></section>}
  </main>;
}
