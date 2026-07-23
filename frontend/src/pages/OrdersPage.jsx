import React, { useMemo, useState } from "react";
import { AlertCircle, Check, ChevronDown, Download, Headphones, Mail, PackageCheck, RefreshCw, Store, Truck, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { money } from "../utils/format";

function downloadDocument(order, type) {
  const payment = order.payment || {};
  const lines = [
    `MARKETSPHERE ${type.toUpperCase()}`,
    `Order: ${order.id}`,
    `Date: ${new Date(order.date).toLocaleString("en-IN")}`,
    `Status: ${order.status}`,
    "",
    ...(order.items || []).map((item) => `${item.name} x ${item.qty || 1}  ${money(item.price * (item.qty || 1))}`),
    "",
    `Total: ${money(order.total)}`,
    `Payment: ${payment.instrument || order.paymentMethod || "Not available"}`,
    `Transaction: ${payment.transactionId || "Pay on delivery"}`,
    `Document generated: ${new Date().toLocaleString("en-IN")}`,
  ];
  const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `MarketSphere-${type}-${order.id}.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function groupItems(order) {
  const fallbackSeller = ["MarketSphere Select", "The Modern Wardrobe", "Sole Society"];
  return Object.entries((order.items || []).reduce((groups, item, index) => {
    const seller = item.seller || fallbackSeller[index % fallbackSeller.length];
    groups[seller] = [...(groups[seller] || []), item];
    return groups;
  }, {}));
}

export default function OrdersPage() {
  const { cancelOrder, cancelOrderItem, orders, reorder, retryRefund, updateOrder } = useShop();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(orders[0]?.id || "");
  const [instructions, setInstructions] = useState("");
  const [issueOrder, setIssueOrder] = useState("");
  const [issue, setIssue] = useState({ category: "Delivery delayed", details: "" });
  const [cancellation, setCancellation] = useState(null);
  const [cancelDetails, setCancelDetails] = useState({ reason: "", refundMethod: "Original payment method", bankAccount: "", ifsc: "", confirmed: false });
  const [notice, setNotice] = useState("");
  const orderCount = useMemo(() => orders.filter((order) => order.status !== "Cancelled").length, [orders]);

  function saveInstructions(order) {
    updateOrder(order.id, { deliveryInstructions: instructions });
    setNotice("Delivery instructions updated.");
  }

  function submitIssue(event) {
    event.preventDefault();
    updateOrder(issueOrder, (order) => ({
      ...order,
      issues: [...(order.issues || []), { ...issue, id: `ISS-${Date.now().toString().slice(-6)}`, status: "Open", createdAt: new Date().toISOString() }],
    }));
    setIssueOrder("");
    setIssue({ category: "Delivery delayed", details: "" });
    setNotice("Your issue was submitted to customer support.");
  }

  function submitCancellation(event) {
    event.preventDefault();
    const bankValid = cancelDetails.refundMethod !== "Bank account" || (cancelDetails.bankAccount.replace(/\D/g, "").length >= 9 && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(cancelDetails.ifsc));
    if (!cancelDetails.reason || !cancelDetails.confirmed || !cancellation || !bankValid) return;
    if (cancellation.itemName) cancelOrderItem(cancellation.orderId, cancellation.itemName, cancelDetails);
    else cancelOrder(cancellation.orderId, cancelDetails);
    setCancellation(null);
    setCancelDetails({ reason: "", refundMethod: "Original payment method", bankAccount: "", ifsc: "", confirmed: false });
    setNotice(cancellation.itemName ? "Item cancellation confirmed. Refund tracking is now available." : "Order cancellation confirmed. Refund tracking is now available.");
  }

  return (
    <main className="real-page orders-page advanced-orders">
      <header className="orders-heading"><div><span>My account</span><h1>Orders</h1><p>Review purchases, shipments, documents and support requests.</p></div><div><strong>{orderCount}</strong><span>Active orders</span></div></header>
      {notice && <p className="order-notice"><Check size={14} /> {notice}</p>}
      {orders.length ? <div className="advanced-order-list">
        {orders.map((order) => {
          const isOpen = expanded === order.id;
          const sellers = groupItems(order);
          const shipments = order.shipments?.length ? order.shipments : sellers.map(([seller, items], index) => ({ id: `SHP-${index + 1}`, seller, items, estimate: "3-5 days" }));
          const cancellable = !["Cancelled", "Delivered", "Shipped"].includes(order.status);
          return <article className={`advanced-order ${isOpen ? "open" : ""}`} key={order.id}>
            <button className="order-row" onClick={() => setExpanded(isOpen ? "" : order.id)}>
              <img src={order.image || order.items?.[0]?.image} alt="" />
              <div><small>Order #{order.id}</small><strong>{order.items?.length || 1} items · {money(order.total)}</strong><span>{new Date(order.date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span></div>
              <b className={`order-status ${order.status?.toLowerCase()}`}>{order.status}</b>
              <ChevronDown className={isOpen ? "rotated" : ""} size={18} />
            </button>
            {isOpen && <div className="order-detail-workspace">
              <section className="order-overview">
                <div><span>Delivery</span><strong>{order.deliveryMethod?.name || "Standard delivery"}</strong><small>{order.deliveryDate || order.deliveryMethod?.detail || "3-5 business days"}</small></div>
                <div><span>Payment</span><strong>{order.payment?.instrument || order.paymentMethod || "Confirmed"}</strong><small>{order.payment?.status || "Order confirmed"}</small></div>
                <div><span>Ship to</span><strong>{order.address?.name || "Customer"}</strong><small>{order.address ? `${order.address.city}, ${order.address.pincode}` : "Saved address"}</small></div>
              </section>

              <section className="order-group-section"><header><div><Store size={16} /><h2>Seller groups</h2></div><span>{sellers.length} sellers</span></header>{sellers.map(([seller, items]) => <article className="seller-order-group" key={seller}><header><strong>{seller}</strong><a href={`mailto:seller-support@marketsphere.in?subject=Order ${order.id}`}>Contact seller</a></header>{items.map((item) => <div className={item.itemStatus === "Cancelled" ? "cancelled" : ""} key={item.name}><img src={item.image} alt="" /><span><strong>{item.name}</strong><small>Qty {item.qty || 1} · {money(item.price * (item.qty || 1))}</small>{item.itemStatus && <b>{item.itemStatus}</b>}{item.refund && <small className="item-refund">{item.refund.status} · {money(item.refund.amount)}</small>}</span>{cancellable && item.itemStatus !== "Cancelled" && <button onClick={() => setCancellation({ orderId: order.id, itemName: item.name, amount: item.price * (item.qty || 1), paymentMethod: order.paymentMethod })}>Cancel item</button>}</div>)}</article>)}</section>

              <section className="order-group-section"><header><div><Truck size={16} /><h2>Shipments</h2></div><Link to="/track-order">Live tracking</Link></header><div className="order-shipment-grid">{shipments.map((shipment, index) => <article key={shipment.id}><div><PackageCheck /><span><small>Package {index + 1}</small><strong>{shipment.seller}</strong></span></div><p>{shipment.items?.length || 1} items · Estimated {shipment.estimate}</p><b>{index ? "Processing" : order.status}</b></article>)}</div></section>

              <section className="order-instructions"><div><h2>Delivery instructions</h2><p>Changes are shared with the delivery partner when operationally possible.</p></div><textarea value={expanded === order.id ? instructions || order.deliveryInstructions || "" : ""} onChange={(event) => setInstructions(event.target.value)} placeholder="Gate, landmark or drop-off instructions" /><button onClick={() => saveInstructions(order)}>Update</button></section>

              {order.refund && <section className={`refund-tracker ${order.refund.status === "Refund failed" ? "failed" : ""}`}><header><div><RefreshCw /><span><small>{order.refund.type || "Refund"} · {order.refund.reference}</small><strong>{order.refund.status}</strong></span></div><b>{money(order.refund.amount)}</b></header>{order.refund.status === "Refund failed" && <aside><AlertCircle /><span><strong>Refund could not be processed</strong>{order.refund.failureReason}</span><button onClick={() => retryRefund(order.id)}><RefreshCw /> Retry refund</button></aside>}<div className="refund-progress"><i className="done" /><i className={["Bank processing", "Refund completed"].includes(order.refund.status) ? "done" : ""} /><i className={order.refund.status === "Refund completed" ? "done" : ""} /></div><div className="refund-labels"><span>Initiated</span><span>Processing</span><span>Refunded</span></div><footer><span>Refund to <strong>{order.refund.method}{order.refund.bankAccount ? ` · ${order.refund.bankAccount}` : ""}</strong></span>{order.refund.estimate && <span>Expected in <strong>{order.refund.estimate}</strong></span>}</footer></section>}
              {order.items?.some((item) => item.refund) && <section className="partial-refund-list"><header><h2>Partial refunds</h2><span>{order.items.filter((item) => item.refund).length} active</span></header>{order.items.filter((item) => item.refund).map((item) => <article key={item.name}><img src={item.image} alt="" /><div><strong>{item.name}</strong><span>{item.refund.reference} · {item.refund.method}</span></div><div><strong>{money(item.refund.amount)}</strong><span>{item.refund.status}</span></div></article>)}</section>}

              <div className="order-action-bar">
                <button onClick={() => downloadDocument(order, "invoice")}><Download size={14} /> Invoice</button>
                <button onClick={() => downloadDocument(order, "receipt")}><Download size={14} /> Receipt</button>
                <button onClick={() => { reorder(order.id); navigate("/cart"); }}><RefreshCw size={14} /> Reorder</button>
                <a href={`mailto:support@marketsphere.in?subject=Support for order ${order.id}`}><Headphones size={14} /> Contact support</a>
                <button onClick={() => setIssueOrder(order.id)}><AlertCircle size={14} /> Report issue</button>
                {cancellable ? <button className="danger" onClick={() => setCancellation({ orderId: order.id, amount: order.total, paymentMethod: order.paymentMethod })}><X size={14} /> Cancel order</button> : order.status !== "Cancelled" && <span className="cancellation-ineligible">Cancellation unavailable after shipment</span>}
              </div>
            </div>}
          </article>;
        })}
      </div> : <div className="empty-state"><PackageCheck /><h2>No orders yet</h2><Link className="primary" to="/products">Start shopping</Link></div>}

      {issueOrder && <div className="order-modal-backdrop" role="presentation" onMouseDown={() => setIssueOrder("")}><form className="order-issue-modal" onSubmit={submitIssue} onMouseDown={(event) => event.stopPropagation()}><header><div><span>Order #{issueOrder}</span><h2>Report an order issue</h2></div><button type="button" onClick={() => setIssueOrder("")}><X /></button></header><label>Issue type<select value={issue.category} onChange={(event) => setIssue({ ...issue, category: event.target.value })}><option>Delivery delayed</option><option>Missing item</option><option>Damaged product</option><option>Incorrect item</option><option>Payment issue</option><option>Seller concern</option></select></label><label>Tell us what happened<textarea required maxLength="500" value={issue.details} onChange={(event) => setIssue({ ...issue, details: event.target.value })} /></label><button className="primary">Submit issue</button></form></div>}
      {cancellation && <div className="order-modal-backdrop" role="presentation" onMouseDown={() => setCancellation(null)}><form className="order-issue-modal cancellation-modal" onSubmit={submitCancellation} onMouseDown={(event) => event.stopPropagation()}><header><div><span>Order #{cancellation.orderId}</span><h2>{cancellation.itemName ? "Cancel item" : "Cancel entire order"}</h2></div><button type="button" onClick={() => setCancellation(null)}><X /></button></header><aside><AlertCircle /><div><strong>Cancellation eligible</strong><span>{cancellation.itemName ? cancellation.itemName : "Every active item in this order"} will be cancelled. This cannot be undone.</span></div></aside><label>Reason for cancellation<select required value={cancelDetails.reason} onChange={(event) => setCancelDetails({ ...cancelDetails, reason: event.target.value })}><option value="">Select a reason</option><option>Ordered by mistake</option><option>Found a better price</option><option>Delivery date is too late</option><option>Need to change address or payment</option><option>Product no longer needed</option><option>Other</option></select></label><label>Refund method<select value={cancelDetails.refundMethod} onChange={(event) => setCancelDetails({ ...cancelDetails, refundMethod: event.target.value })} disabled={cancellation.paymentMethod === "cod"}><option>Original payment method</option><option>MarketSphere Wallet</option><option>Bank account</option></select><small>{cancellation.paymentMethod === "cod" ? "No refund is required for cash on delivery." : `${cancellation.itemName ? "Partial refund" : "Full refund"} of ${money(cancellation.amount)} will be initiated.`}</small></label>{cancelDetails.refundMethod === "Bank account" && <div className="refund-bank-fields"><label>Account number<input required inputMode="numeric" value={cancelDetails.bankAccount} onChange={(event) => setCancelDetails({ ...cancelDetails, bankAccount: event.target.value.replace(/\D/g, "") })} placeholder="Bank account number" /></label><label>IFSC code<input required maxLength="11" value={cancelDetails.ifsc} onChange={(event) => setCancelDetails({ ...cancelDetails, ifsc: event.target.value.toUpperCase() })} placeholder="HDFC0001234" /></label><small>Use an account ending in 0000 to preview refund-failure recovery.</small></div>}<label className="cancellation-confirm"><input type="checkbox" checked={cancelDetails.confirmed} onChange={(event) => setCancelDetails({ ...cancelDetails, confirmed: event.target.checked })} /><span>I understand this cancellation cannot be reversed.</span></label><button className="danger-button" disabled={!cancelDetails.reason || !cancelDetails.confirmed || (cancelDetails.refundMethod === "Bank account" && (cancelDetails.bankAccount.length < 9 || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cancelDetails.ifsc)))}>Confirm cancellation and refund</button></form></div>}
    </main>
  );
}
