import React from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { money } from "../utils/format";
import OfferList from "../components/commerce/OfferList";

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, updateQty } = useShop();

  return (
    <main className="real-page cart-layout">
      <section>
        <div className="page-heading"><div><p>Shopping Bag</p><h1>My Cart ({cart.length})</h1></div></div>
        {!cart.length && <div className="empty-state">Your bag is empty</div>}
        {cart.map((item) => (
          <article className="cart-line" key={item.name}>
            <img src={item.image} alt={item.name} />
            <div><h3>{item.name}</h3><strong>{money(item.price)}</strong></div>
            <div className="qty"><button onClick={() => updateQty(item.name, (item.qty || 1) - 1)}><Minus size={14} /></button><span>{item.qty || 1}</span><button onClick={() => updateQty(item.name, (item.qty || 1) + 1)}><Plus size={14} /></button></div>
            <button className="icon-danger" onClick={() => removeFromCart(item.name)}><Trash2 size={18} /></button>
          </article>
        ))}
      </section>
      <aside className="summary-card">
        <OfferList />
        <h2>Price Details</h2>
        <p><span>Subtotal</span><b>{money(cartTotal)}</b></p>
        <p><span>Delivery</span><b>Free</b></p>
        <p><span>Discount</span><b>-{money(Math.min(cartTotal * 0.1, 1200))}</b></p>
        <h3><span>Total</span><b>{money(cartTotal - Math.min(cartTotal * 0.1, 1200))}</b></h3>
        {cart.length ? <Link className="primary route-button" to="/checkout">Checkout</Link> : <Link className="secondary route-button" to="/products">Continue shopping</Link>}
      </aside>
    </main>
  );
}
