import React, { useMemo, useState } from "react";
import { CalendarClock, Camera, Check, Image, PackageCheck, RefreshCw, RotateCcw, Truck, Upload, Video, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { money } from "../utils/format";
import { getStored } from "../utils/storage";

const requestTypes = [
  { id: "Return", copy: "Send the item back for a refund", icon: RotateCcw },
  { id: "Replacement", copy: "Receive the same item again", icon: RefreshCw },
  { id: "Exchange", copy: "Change size or colour", icon: PackageCheck },
];

const reasons = ["Size or fit issue", "Damaged product", "Wrong item received", "Colour differs from listing", "Quality not as expected", "Missing parts or accessories", "Changed my mind"];

function readAddresses() {
  return getStored("marketsphere:addresses", []);
}

export default function ReturnsPage() {
  const { cancelReturnRequest, createReturnRequest, orders, returnRequests } = useShop();
  const addresses = readAddresses();
  const eligibleItems = useMemo(() => orders.flatMap((order) => (order.items || []).filter((item) => item.itemStatus !== "Cancelled").map((item) => ({
    ...item,
    orderId: order.id,
    orderDate: order.date,
    orderStatus: order.status,
    address: order.address,
  }))), [orders]);
  const [view, setView] = useState("new");
  const [selectedKey, setSelectedKey] = useState(eligibleItems[0] ? `${eligibleItems[0].orderId}:${eligibleItems[0].name}` : "");
  const [form, setForm] = useState({ type: "Return", reason: "", details: "", exchangeKind: "Size", size: "M", color: "Black", pickupAddress: addresses[0]?.id || "order-address", pickupDate: "", pickupSlot: "10 AM - 1 PM", refundMethod: "Original payment method" });
  const [media, setMedia] = useState({ images: [], video: null });
  const [message, setMessage] = useState("");
  const selectedItem = eligibleItems.find((item) => `${item.orderId}:${item.name}` === selectedKey);
  const ageDays = selectedItem ? Math.floor((Date.now() - new Date(selectedItem.orderDate).getTime()) / 86400000) : 0;
  const eligible = selectedItem && selectedItem.orderStatus !== "Cancelled" && ageDays <= 30;
  const selectedAddress = addresses.find((address) => address.id === form.pickupAddress) || selectedItem?.address;

  function addMedia(event, kind) {
    const files = [...event.target.files];
    if (kind === "images") setMedia((value) => ({ ...value, images: [...value.images, ...files].slice(0, 5) }));
    else setMedia((value) => ({ ...value, video: files[0] || null }));
  }

  function submitRequest(event) {
    event.preventDefault();
    if (!eligible) return setMessage("This item is outside the eligible return window.");
    if (!form.reason || !form.pickupDate || !selectedAddress) return setMessage("Complete the reason, pickup address and pickup schedule.");
    const request = createReturnRequest({
      ...form,
      orderId: selectedItem.orderId,
      item: { id: selectedItem.id, name: selectedItem.name, image: selectedItem.image, price: selectedItem.price, variant: selectedItem.variant },
      media: { images: media.images.map((file) => file.name), video: media.video?.name || null },
      pickupAddress: selectedAddress,
      refund: form.type === "Return" ? { amount: selectedItem.price * (selectedItem.qty || 1), method: form.refundMethod, status: "Pending item pickup", reference: `RFR${Date.now().toString().slice(-8)}` } : null,
    });
    setMessage(`${request.type} request ${request.id} was created.`);
    setMedia({ images: [], video: null });
    setView("tracking");
  }

  return <main className="real-page returns-workspace">
    <header className="returns-heading"><div><span>Post-purchase care</span><h1>Returns, replacements and exchanges</h1><p>Create a request, schedule pickup and follow every stage from one place.</p></div><RotateCcw /></header>
    <nav className="returns-tabs"><button className={view === "new" ? "active" : ""} onClick={() => setView("new")}>New request</button><button className={view === "tracking" ? "active" : ""} onClick={() => setView("tracking")}>Track requests <b>{returnRequests.length}</b></button></nav>
    {message && <p className="returns-message"><Check /> {message}</p>}

    {view === "new" && <form className="return-request-form" onSubmit={submitRequest}>
      <section className="return-form-section"><header><i>1</i><div><h2>Select an item</h2><p>Items remain eligible for 30 days unless their policy says otherwise.</p></div></header>{eligibleItems.length ? <div className="return-item-picker">{eligibleItems.map((item) => { const key = `${item.orderId}:${item.name}`; return <label className={selectedKey === key ? "selected" : ""} key={key}><input type="radio" checked={selectedKey === key} onChange={() => setSelectedKey(key)} /><img src={item.image} alt="" /><span><strong>{item.name}</strong><small>Order #{item.orderId} · {money(item.price)}</small></span><b>{item.orderStatus === "Cancelled" ? "Not eligible" : "Eligible"}</b></label>; })}</div> : <div className="return-empty">No order items available. <Link to="/products">Continue shopping</Link></div>}{selectedItem && <aside className={`return-eligibility ${eligible ? "eligible" : "ineligible"}`}><Check /><span><strong>{eligible ? "Eligible for return" : "Return window closed"}</strong>{eligible ? `${30 - ageDays} days remaining in this item's return window.` : "Contact support if the item has a warranty issue."}</span></aside>}</section>

      <section className="return-form-section"><header><i>2</i><div><h2>Choose a resolution</h2><p>Tell us how you would like this resolved.</p></div></header><div className="return-type-grid">{requestTypes.map(({ id, copy, icon: Icon }) => <label className={form.type === id ? "selected" : ""} key={id}><input type="radio" checked={form.type === id} onChange={() => setForm({ ...form, type: id })} /><Icon /><span><strong>{id}</strong><small>{copy}</small></span></label>)}</div>{form.type === "Exchange" && <div className="exchange-options"><label>Exchange type<select value={form.exchangeKind} onChange={(event) => setForm({ ...form, exchangeKind: event.target.value })}><option>Size</option><option>Color</option></select></label>{form.exchangeKind === "Size" ? <label>New size<select value={form.size} onChange={(event) => setForm({ ...form, size: event.target.value })}><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option></select></label> : <label>New colour<select value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value })}><option>Black</option><option>White</option><option>Navy</option><option>Rose</option><option>Green</option></select></label>}</div>}<div className="return-reason-grid"><label>Reason<select required value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })}><option value="">Select a reason</option>{reasons.map((reason) => <option key={reason}>{reason}</option>)}</select></label><label>Additional details<textarea maxLength="400" value={form.details} onChange={(event) => setForm({ ...form, details: event.target.value })} placeholder="Describe the condition and issue" /></label></div></section>

      <section className="return-form-section"><header><i>3</i><div><h2>Add product evidence</h2><p>Clear images help us approve requests faster.</p></div></header><div className="return-upload-grid"><label><Image /><strong>Product images</strong><span>JPG or PNG · Up to 5 files</span><input type="file" accept="image/*" multiple onChange={(event) => addMedia(event, "images")} /><b><Upload /> Choose images</b></label><label><Video /><strong>Product video</strong><span>MP4 or MOV · One file</span><input type="file" accept="video/*" onChange={(event) => addMedia(event, "video")} /><b><Upload /> Choose video</b></label></div>{(media.images.length > 0 || media.video) && <div className="return-media-list">{media.images.map((file) => <span key={file.name}><Camera /> {file.name}<button type="button" onClick={() => setMedia((value) => ({ ...value, images: value.images.filter((item) => item !== file) }))}><X /></button></span>)}{media.video && <span><Video /> {media.video.name}<button type="button" onClick={() => setMedia((value) => ({ ...value, video: null }))}><X /></button></span>}</div>}</section>

      <section className="return-form-section"><header><i>4</i><div><h2>Schedule pickup</h2><p>Choose where and when the package will be ready.</p></div></header><div className="return-pickup-grid"><label>Pickup address<select value={form.pickupAddress} onChange={(event) => setForm({ ...form, pickupAddress: event.target.value })}><option value="order-address">Original delivery address</option>{addresses.map((address) => <option value={address.id} key={address.id}>{address.type} · {address.line1}, {address.city}</option>)}</select></label><label>Pickup date<input required type="date" min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)} value={form.pickupDate} onChange={(event) => setForm({ ...form, pickupDate: event.target.value })} /></label><label>Pickup slot<select value={form.pickupSlot} onChange={(event) => setForm({ ...form, pickupSlot: event.target.value })}><option>10 AM - 1 PM</option><option>1 PM - 4 PM</option><option>4 PM - 7 PM</option></select></label>{form.type === "Return" && <label>Refund method<select value={form.refundMethod} onChange={(event) => setForm({ ...form, refundMethod: event.target.value })}><option>Original payment method</option><option>MarketSphere Wallet</option><option>Bank account</option></select></label>}</div></section>
      <footer className="return-submit"><div><PackageCheck /><span><strong>Free pickup</strong><small>Keep original packaging and included accessories ready.</small></span></div><button className="primary" disabled={!eligible}>Submit {form.type.toLowerCase()} request</button></footer>
    </form>}

    {view === "tracking" && <section className="return-tracking-list">{returnRequests.length ? returnRequests.map((request) => {
      const labels = request.type === "Return" ? ["Request submitted", "Pickup scheduled", "Item received", "Quality check", "Refund completed"] : request.type === "Replacement" ? ["Request submitted", "Pickup scheduled", "Item received", "Replacement shipped", "Delivered"] : ["Request submitted", "Pickup scheduled", "Item received", "Exchange shipped", "Delivered"];
      const active = request.status === "Cancelled" ? -1 : request.status === "Request submitted" ? 0 : 1;
      return <article className={`return-case ${request.status === "Cancelled" ? "cancelled" : ""}`} key={request.id}><header><img src={request.item.image} alt="" /><div><small>{request.type} · #{request.id}</small><h2>{request.item.name}</h2><span>Order #{request.orderId}</span></div><b>{request.status}</b></header><div className="return-case-meta"><span>Reason<strong>{request.reason}</strong></span><span>Pickup<strong>{request.pickupDate} · {request.pickupSlot}</strong></span><span>Address<strong>{request.pickupAddress?.city || "Saved address"}</strong></span></div><div className="return-case-timeline">{labels.map((label, index) => <div className={index <= active ? "done" : ""} key={label}><i>{index <= active ? <Check /> : <Truck />}</i><span>{label}</span></div>)}</div>{request.refund && <aside className="return-refund-status"><RefreshCw /><div><small>Refund status · {request.refund.reference}</small><strong>{request.refund.status}</strong><span>{money(request.refund.amount)} to {request.refund.method}</span></div></aside>}<footer><span><CalendarClock /> Pickup {request.pickupDate}</span>{request.status === "Request submitted" && <button onClick={() => cancelReturnRequest(request.id)}>Cancel request</button>}</footer></article>;
    }) : <div className="return-empty"><RotateCcw /><h2>No active requests</h2><p>Your return, replacement and exchange requests will appear here.</p><button className="primary" onClick={() => setView("new")}>Create request</button></div>}</section>}
  </main>;
}
