import React, { useMemo, useRef, useState } from "react";
import { AlertTriangle, Ban, Bell, Bot, CheckCheck, Headphones, Image, MessageCircle, MoreVertical, Paperclip, Search, Send, ShoppingBag, Store, Upload, X } from "lucide-react";
import { useShop } from "../context/ShopContext";

const seededConversations = [
  { id: "support", type: "support", name: "MarketSphere Support", subtitle: "Customer Care", unread: 1, blocked: false, messages: [{ id: 1, from: "them", body: "Hello. How can our support team help today?", date: "2026-07-23T09:15:00.000Z" }] },
  { id: "seller-modern", type: "seller", name: "The Modern Wardrobe", subtitle: "Seller · Usually replies in 10 min", unread: 2, blocked: false, messages: [{ id: 2, from: "them", body: "Your selected size is currently available.", date: "2026-07-22T13:25:00.000Z" }] },
  { id: "seller-sole", type: "seller", name: "Sole Society", subtitle: "Seller · Online", unread: 0, blocked: false, messages: [{ id: 3, from: "me", body: "Does this shoe run true to size?", date: "2026-07-20T08:20:00.000Z" }, { id: 4, from: "them", body: "Yes, we recommend choosing your usual size.", date: "2026-07-20T08:28:00.000Z" }] },
];

function readStored() {
  try {
    return JSON.parse(window.localStorage.getItem("marketsphere:chats")) || seededConversations;
  } catch {
    return seededConversations;
  }
}

export default function ChatPage() {
  const { orders } = useShop();
  const [conversations, setConversations] = useState(readStored);
  const [activeId, setActiveId] = useState("support");
  const [query, setQuery] = useState("");
  const [input, setInput] = useState("");
  const [contextType, setContextType] = useState("none");
  const [contextValue, setContextValue] = useState("");
  const [showActions, setShowActions] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reportReason, setReportReason] = useState("Misleading information");
  const fileRef = useRef(null);
  const active = conversations.find((item) => item.id === activeId) || conversations[0];
  const filtered = useMemo(() => conversations.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())), [conversations, query]);
  const products = useMemo(() => Array.from(new Map(orders.flatMap((order) => order.items || []).map((item) => [item.name, item])).values()), [orders]);
  const unread = conversations.reduce((sum, item) => sum + item.unread, 0);

  function persist(next) {
    setConversations(next);
    window.localStorage.setItem("marketsphere:chats", JSON.stringify(next));
  }

  function selectConversation(id) {
    setActiveId(id);
    persist(conversations.map((item) => item.id === id ? { ...item, unread: 0 } : item));
    setShowActions(false);
  }

  function appendMessage(message) {
    const next = conversations.map((conversation) => conversation.id === active.id ? { ...conversation, messages: [...conversation.messages, message] } : conversation);
    persist(next);
  }

  function send(event) {
    event.preventDefault();
    if (!input.trim() || active.blocked) return;
    const body = input.trim();
    const context = contextType !== "none" && contextValue ? { type: contextType, value: contextValue } : null;
    appendMessage({ id: Date.now(), from: "me", body, context, date: new Date().toISOString(), status: "Delivered" });
    setInput("");
    window.setTimeout(() => {
      const reply = active.type === "support"
        ? /refund|payment/i.test(body) ? "I found your payment request. Please share the order number, and I can check its refund timeline." : /order|delivery/i.test(body) ? "Select the related order above and I will check the latest shipment details." : "Thanks for the details. I can help here or connect you to a customer-care specialist."
        : /size|fit/i.test(body) ? "This style follows the standard size chart shown on the product page." : /stock|available/i.test(body) ? "I will verify the selected variant and update you shortly." : "Thanks for contacting our store. A seller representative will respond shortly.";
      setConversations((current) => {
        const updated = current.map((conversation) => conversation.id === active.id ? { ...conversation, messages: [...conversation.messages, { id: Date.now() + 1, from: "them", body: reply, automated: true, date: new Date().toISOString() }] } : conversation);
        window.localStorage.setItem("marketsphere:chats", JSON.stringify(updated));
        return updated;
      });
    }, 500);
  }

  function shareFiles(event) {
    const files = [...event.target.files].slice(0, 5);
    if (!files.length) return;
    appendMessage({ id: Date.now(), from: "me", body: files.length === 1 ? files[0].name : `${files.length} attachments`, attachments: files.map((file) => ({ name: file.name, type: file.type, image: file.type.startsWith("image/") })), date: new Date().toISOString(), status: "Delivered" });
    event.target.value = "";
  }

  function blockSeller() {
    persist(conversations.map((item) => item.id === active.id ? { ...item, blocked: !item.blocked } : item));
    setShowActions(false);
  }

  function reportSeller(event) {
    event.preventDefault();
    persist(conversations.map((item) => item.id === active.id ? { ...item, reported: { reason: reportReason, date: new Date().toISOString() } } : item));
    setReporting(false);
    setShowActions(false);
  }

  return <main className="real-page chat-workspace">
    <header className="chat-page-heading"><div><span>Messages</span><h1>Chat</h1><p>Talk with support and sellers without leaving MarketSphere.</p></div><div><Bell /><strong>{unread}</strong><span>Unread</span></div></header>
    <section className="chat-shell">
      <aside className="conversation-sidebar"><header><div><h2>Conversations</h2><span>{conversations.length} chats</span></div><label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search chats" /></label></header><div>{filtered.map((conversation) => <button className={conversation.id === active.id ? "active" : ""} onClick={() => selectConversation(conversation.id)} key={conversation.id}><i>{conversation.type === "support" ? <Headphones /> : <Store />}</i><span><strong>{conversation.name}</strong><small>{conversation.messages.at(-1)?.body}</small></span>{conversation.unread > 0 && <b>{conversation.unread}</b>}</button>)}</div></aside>

      <section className="conversation-panel"><header><div><i>{active.type === "support" ? <Headphones /> : <Store />}</i><span><strong>{active.name}</strong><small><em /> {active.subtitle}</small></span></div>{active.type === "seller" && <div className="chat-actions"><button onClick={() => setShowActions((value) => !value)}><MoreVertical /></button>{showActions && <menu><button onClick={blockSeller}><Ban /> {active.blocked ? "Unblock seller" : "Block seller"}</button><button onClick={() => setReporting(true)}><AlertTriangle /> Report seller</button></menu>}</div>}</header>
        <div className="chat-context-bar"><select value={contextType} onChange={(event) => { setContextType(event.target.value); setContextValue(""); }}><option value="none">General conversation</option><option value="order">Order-specific support</option><option value="product">Product enquiry</option></select>{contextType === "order" && <select value={contextValue} onChange={(event) => setContextValue(event.target.value)}><option value="">Select order</option>{orders.map((order) => <option value={`#${order.id}`} key={order.id}>#{order.id} · {order.status}</option>)}</select>}{contextType === "product" && <select value={contextValue} onChange={(event) => setContextValue(event.target.value)}><option value="">Select product</option>{products.map((product) => <option value={product.name} key={product.name}>{product.name}</option>)}</select>}</div>
        <div className="conversation-messages">{active.messages.map((message) => <article className={message.from} key={message.id}>{message.context && <small className="message-context">{message.context.type === "order" ? <ShoppingBag /> : <Store />}{message.context.value}</small>}<p>{message.body}</p>{message.attachments && <div className="message-attachments">{message.attachments.map((file) => <span key={file.name}>{file.image ? <Image /> : <Paperclip />}<b>{file.name}</b></span>)}</div>}<footer><span>{new Date(message.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>{message.automated && <span><Bot /> Automated response</span>}{message.from === "me" && <span><CheckCheck /> {message.status}</span>}</footer></article>)}</div>
        {active.blocked ? <div className="chat-blocked"><Ban /><span><strong>You blocked this seller</strong>Unblock the seller to send new messages.</span><button onClick={blockSeller}>Unblock</button></div> : <><div className="chat-quick-replies">{(active.type === "support" ? ["Track my order", "Payment problem", "Refund status", "Start a return"] : ["Is this in stock?", "Help with size", "Product authenticity", "Delivery estimate"]).map((text) => <button onClick={() => setInput(text)} key={text}>{text}</button>)}</div><form className="chat-composer" onSubmit={send}><button type="button" title="Share files" onClick={() => fileRef.current?.click()}><Paperclip /></button><input ref={fileRef} hidden type="file" accept="image/*,video/*,.pdf,.doc,.docx" multiple onChange={shareFiles} /><input value={input} onChange={(event) => setInput(event.target.value)} placeholder={`Message ${active.name}`} /><button><Send /></button></form></>}
      </section>
    </section>

    {reporting && <div className="seller-report-backdrop" onMouseDown={() => setReporting(false)}><form onSubmit={reportSeller} onMouseDown={(event) => event.stopPropagation()}><header><div><span>Marketplace safety</span><h2>Report {active.name}</h2></div><button type="button" onClick={() => setReporting(false)}><X /></button></header><label>Reason<select value={reportReason} onChange={(event) => setReportReason(event.target.value)}><option>Misleading information</option><option>Inappropriate messages</option><option>Spam or advertising</option><option>Suspected counterfeit product</option><option>Asked to pay outside MarketSphere</option></select></label><button className="primary">Submit report</button></form></div>}
  </main>;
}
