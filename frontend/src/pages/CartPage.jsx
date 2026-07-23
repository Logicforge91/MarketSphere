import React, { useMemo, useState } from "react";
import { AlertTriangle, Check, Clock3, Gift, Heart, Minus, PackageCheck, Plus, RotateCcw, Tag, Trash2, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { money } from "../utils/format";

const sellerNames = ["MarketSphere Select", "The Modern Wardrobe", "Sole Society"];
const MAX_QTY = 5;
const MIN_ORDER = 499;

export default function CartPage() {
  const { cart, moveSavedToCart, moveToWishlist, removeFromCart, saveForLater, savedForLater, updateCartVariant, updateQty } = useShop();
  const [selected, setSelected] = useState(() => new Set(cart.map((item) => item.name)));
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState("");
  const [giftInput, setGiftInput] = useState("");
  const [giftCard, setGiftCard] = useState("");
  const [rewardPoints, setRewardPoints] = useState(0);
  const [message, setMessage] = useState("");
  const [showRecovery, setShowRecovery] = useState(Boolean(cart.length && window.localStorage.getItem("marketsphere:cart-activity")));

  const groupedCart = useMemo(() => cart.reduce((groups, item, index) => {
    const seller = item.seller || sellerNames[index % sellerNames.length];
    groups[seller] = [...(groups[seller] || []), item];
    return groups;
  }, {}), [cart]);

  const selectedItems = cart.filter((item) => selected.has(item.name));
  const subtotal = selectedItems.reduce((total, item) => total + item.price * (item.qty || 1), 0);
  const productSavings = selectedItems.reduce((total, item) => total + Math.max(0, (item.oldPrice || item.price) - item.price) * (item.qty || 1), 0);
  const couponDiscount = coupon === "SAVE10" ? Math.min(subtotal * .1, 1200) : 0;
  const giftDiscount = giftCard === "GIFT500" ? Math.min(500, Math.max(0, subtotal - couponDiscount)) : 0;
  const rewardDiscount = Math.min(rewardPoints, Math.max(0, subtotal - couponDiscount - giftDiscount));
  const taxable = Math.max(0, subtotal - couponDiscount - giftDiscount - rewardDiscount);
  const tax = Math.round(taxable * .05);
  const shipping = !selectedItems.length || taxable >= 1999 ? 0 : 99;
  const total = taxable + tax + shipping;
  const validOrder = selectedItems.length > 0 && subtotal >= MIN_ORDER && selectedItems.every((item) => (item.qty || 1) <= MAX_QTY);

  function toggleItem(name) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function toggleSeller(items) {
    const allSelected = items.every((item) => selected.has(item.name));
    setSelected((current) => {
      const next = new Set(current);
      items.forEach((item) => allSelected ? next.delete(item.name) : next.add(item.name));
      return next;
    });
  }

  function applyCode(type) {
    const value = (type === "coupon" ? couponInput : giftInput).trim().toUpperCase();
    const valid = type === "coupon" ? value === "SAVE10" : value === "GIFT500";
    if (valid) {
      if (type === "coupon") setCoupon(value);
      else setGiftCard(value);
      setMessage(`${type === "coupon" ? "Coupon" : "Gift card"} applied successfully`);
    } else setMessage(`Use ${type === "coupon" ? "SAVE10" : "GIFT500"} for this demo`);
  }

  return (
    <main className="real-page advanced-cart-page">
      {showRecovery && <section className="cart-recovery"><RotateCcw /><div><strong>Your cart was restored</strong><span>We saved these items from your previous visit.</span></div><button onClick={() => setShowRecovery(false)}>Dismiss</button></section>}
      <div className="advanced-cart-layout">
        <section className="cart-main">
          <header className="cart-heading"><div><span>Shopping cart</span><h1>{cart.length} items in your bag</h1></div>{cart.length > 0 && <label><input type="checkbox" checked={selected.size === cart.length} onChange={() => setSelected(selected.size === cart.length ? new Set() : new Set(cart.map((item) => item.name)))} /> Select all</label>}</header>

          {!cart.length && <div className="cart-empty"><PackageCheck /><h2>Your cart is ready for something new</h2><p>Products you add will stay here between visits.</p><Link className="primary" to="/products">Explore products</Link></div>}

          {Object.entries(groupedCart).map(([seller, items]) => <section className="cart-seller-group" key={seller}>
            <header><label><input type="checkbox" checked={items.every((item) => selected.has(item.name))} onChange={() => toggleSeller(items)} /><strong>{seller}</strong></label><span><Truck size={13} /> Delivery in 2-4 days</span></header>
            {items.map((item, itemIndex) => {
              const stock = Math.max(2, 8 - itemIndex);
              const variants = item.variant || { size: "M", color: "Black" };
              return <article className="advanced-cart-item" key={item.name}>
                <input className="cart-item-check" type="checkbox" checked={selected.has(item.name)} onChange={() => toggleItem(item.name)} aria-label={`Select ${item.name}`} />
                <img src={item.image} alt={item.name} />
                <div className="cart-item-copy"><h2>{item.name}</h2><p>SKU: {item.sku || `MS-${item.id || "ITEM"}`}</p><div className="cart-variant-controls"><label>Size<select value={variants.size || "M"} onChange={(event) => updateCartVariant(item.name, { ...variants, size: event.target.value })}>{["XS", "S", "M", "L", "XL"].map((value) => <option key={value}>{value}</option>)}</select></label><label>Color<select value={variants.color || "Black"} onChange={(event) => updateCartVariant(item.name, { ...variants, color: event.target.value })}>{["Black", "Violet", "Rose", "Ivory"].map((value) => <option key={value}>{value}</option>)}</select></label></div><div className="cart-stock"><Check size={13} /> {stock} in stock · Delivery by {new Date(Date.now() + 3 * 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div><div className="cart-item-actions"><button onClick={() => saveForLater(item.name)}><Clock3 size={13} /> Save for later</button><button onClick={() => moveToWishlist(item.name)}><Heart size={13} /> Move to wishlist</button><button onClick={() => removeFromCart(item.name)}><Trash2 size={13} /> Remove</button></div></div>
                <div className="cart-item-price"><strong>{money(item.price * (item.qty || 1))}</strong>{item.oldPrice && <del>{money(item.oldPrice * (item.qty || 1))}</del>}{item.oldPrice > item.price && <small>Price dropped since added</small>}<div className="cart-qty"><button disabled={(item.qty || 1) <= 1} onClick={() => updateQty(item.name, (item.qty || 1) - 1)}><Minus size={13} /></button><span>{item.qty || 1}</span><button disabled={(item.qty || 1) >= MAX_QTY} onClick={() => updateQty(item.name, (item.qty || 1) + 1)}><Plus size={13} /></button></div>{(item.qty || 1) >= MAX_QTY && <small className="quantity-warning">Maximum {MAX_QTY} per order</small>}</div>
              </article>;
            })}
          </section>)}

          {savedForLater.length > 0 && <section className="saved-cart-section"><header><div><span>Not ready yet?</span><h2>Saved for later ({savedForLater.length})</h2></div></header>{savedForLater.map((item) => <article key={item.name}><img src={item.image} alt={item.name} /><div><strong>{item.name}</strong><span>{money(item.price)}</span></div><button className="secondary" onClick={() => moveSavedToCart(item.name)}>Move to cart</button></article>)}</section>}
        </section>

        <aside className="advanced-cart-summary">
          <h2>Order summary</h2>
          <div className="promotion-box"><label><Tag size={14} /> Coupon code</label><div><input value={couponInput} onChange={(event) => setCouponInput(event.target.value)} placeholder="Try SAVE10" /><button onClick={() => applyCode("coupon")}>Apply</button></div></div>
          <div className="promotion-box"><label><Gift size={14} /> Gift card</label><div><input value={giftInput} onChange={(event) => setGiftInput(event.target.value)} placeholder="Try GIFT500" /><button onClick={() => applyCode("gift card")}>Apply</button></div></div>
          <div className="reward-control"><label><span>Use reward points</span><strong>{rewardPoints} pts</strong></label><input type="range" min="0" max={Math.min(640, subtotal)} step="10" value={rewardPoints} onChange={(event) => setRewardPoints(Number(event.target.value))} /><small>640 points available · 1 point = Rs. 1</small></div>
          {message && <p className="cart-message" role="status">{message}</p>}
          <div className="cart-calculation"><p><span>Selected subtotal</span><strong>{money(subtotal)}</strong></p><p><span>Product savings</span><strong className="saving">-{money(productSavings)}</strong></p>{couponDiscount > 0 && <p><span>Coupon</span><strong className="saving">-{money(couponDiscount)}</strong></p>}{giftDiscount > 0 && <p><span>Gift card</span><strong className="saving">-{money(giftDiscount)}</strong></p>}{rewardDiscount > 0 && <p><span>Reward points</span><strong className="saving">-{money(rewardDiscount)}</strong></p>}<p><span>Tax (5%)</span><strong>{money(tax)}</strong></p><p><span>Shipping</span><strong>{shipping ? money(shipping) : "Free"}</strong></p><div><span>Total</span><strong>{money(total)}</strong></div></div>
          {subtotal > 0 && subtotal < MIN_ORDER && <div className="cart-validation"><AlertTriangle size={15} /> Add {money(MIN_ORDER - subtotal)} more to meet the minimum order.</div>}
          {shipping > 0 && <div className="shipping-progress"><span>Add {money(1999 - taxable)} more for free shipping</span><i><b style={{ width: `${Math.min(100, taxable / 1999 * 100)}%` }} /></i></div>}
          {validOrder ? <Link className="primary cart-checkout" to="/checkout">Proceed to checkout</Link> : <button className="primary cart-checkout" disabled>Proceed to checkout</button>}
          <p className="cart-security"><PackageCheck size={14} /> Stock validated at checkout · Secure payment</p>
        </aside>
      </div>
    </main>
  );
}
