import React, { useMemo, useState } from "react";
import { Bell, Check, ChevronDown, Eye, EyeOff, FolderPlus, Heart, Lock, PackageCheck, Share2, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { money } from "../utils/format";
import { slugify } from "../data/catalog";
import ShareDialog from "../components/common/ShareDialog";

const COLLECTIONS_KEY = "marketsphere:wishlist-collections";
const ALERTS_KEY = "marketsphere:wishlist-alerts";

function readStorage(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

const initialCollections = [
  { id: "favorites", name: "My favourites", privacy: "private", products: [] },
  { id: "occasion", name: "Occasion ideas", privacy: "private", products: [] },
];

export default function WishlistPage() {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [collections, setCollections] = useState(() => readStorage(COLLECTIONS_KEY, initialCollections));
  const [alerts, setAlerts] = useState(() => readStorage(ALERTS_KEY, {}));
  const [activeCollection, setActiveCollection] = useState("all");
  const [newCollection, setNewCollection] = useState("");
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState("");

  const visibleProducts = useMemo(() => {
    if (activeCollection === "all") return wishlist;
    const membership = collections.find((item) => item.id === activeCollection)?.products || [];
    return wishlist.filter((product) => membership.includes(product.name));
  }, [activeCollection, collections, wishlist]);

  function persistCollections(next) {
    setCollections(next);
    window.localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(next));
  }

  function persistAlerts(next) {
    setAlerts(next);
    window.localStorage.setItem(ALERTS_KEY, JSON.stringify(next));
  }

  function createCollection(event) {
    event.preventDefault();
    const name = newCollection.trim();
    if (!name) return;
    const collection = { id: `collection-${Date.now()}`, name, privacy: "private", products: [] };
    persistCollections([...collections, collection]);
    setActiveCollection(collection.id);
    setNewCollection("");
    setCreating(false);
  }

  function assignCollection(productName, collectionId) {
    const next = collections.map((collection) => ({
      ...collection,
      products: collection.id === collectionId
        ? [...new Set([...collection.products, productName])]
        : collection.products.filter((name) => name !== productName),
    }));
    persistCollections(next);
    setNotice("Product moved to collection");
  }

  function setPrivacy(value) {
    if (activeCollection === "all") return;
    persistCollections(collections.map((collection) => collection.id === activeCollection ? { ...collection, privacy: value } : collection));
    setNotice(`Collection is now ${value}`);
  }

  function removeProduct(product) {
    toggleWishlist(product);
    persistCollections(collections.map((collection) => ({ ...collection, products: collection.products.filter((name) => name !== product.name) })));
  }

  function moveToCart(product) {
    addToCart(product);
    removeProduct(product);
  }

  function toggleAlert(productName, type) {
    const current = alerts[productName] || {};
    const next = { ...alerts, [productName]: { ...current, [type]: !current[type] } };
    persistAlerts(next);
    setNotice(`${type === "price" ? "Price-drop" : "Back-in-stock"} alert ${next[productName][type] ? "enabled" : "disabled"}`);
  }

  const currentCollection = collections.find((item) => item.id === activeCollection);

  return (
    <main className="real-page wishlist-page">
      <header className="wishlist-heading">
        <div><span>Saved products</span><h1>My wishlist</h1><p>Organise favourites, watch prices and move products to your bag when the moment is right.</p></div>
        <div><button className="secondary" onClick={() => setCreating((value) => !value)}><FolderPlus size={15} /> New collection</button><ShareDialog className="secondary" title={collections.find((item) => item.id === activeCollection)?.name || "My MarketSphere wishlist"} text={`See my saved picks: ${visibleProducts.map((item) => item.name).join(", ")}`} path={`/wishlist${activeCollection !== "all" ? `?collection=${activeCollection}` : ""}`} type="wishlist">Share</ShareDialog></div>
      </header>

      {creating && <form className="new-collection-form" onSubmit={createCollection}><input autoFocus value={newCollection} onChange={(event) => setNewCollection(event.target.value)} placeholder="Collection name" maxLength="40" /><button className="primary">Create collection</button></form>}
      {notice && <p className="wishlist-notice" role="status"><Check size={14} /> {notice}</p>}

      <div className="wishlist-layout">
        <aside className="wishlist-sidebar">
          <div className="wishlist-nav-title"><Heart size={16} /><strong>Collections</strong></div>
          <button className={activeCollection === "all" ? "active" : ""} onClick={() => setActiveCollection("all")}><span>All saved items</span><b>{wishlist.length}</b></button>
          {collections.map((collection) => <button className={activeCollection === collection.id ? "active" : ""} onClick={() => setActiveCollection(collection.id)} key={collection.id}><span>{collection.name}<small>{collection.privacy === "private" ? <Lock size={10} /> : <Eye size={10} />}{collection.privacy}</small></span><b>{collection.products.filter((name) => wishlist.some((item) => item.name === name)).length}</b></button>)}
          {currentCollection && <section className="privacy-control"><strong>Collection privacy</strong><div><button className={currentCollection.privacy === "private" ? "active" : ""} onClick={() => setPrivacy("private")}><EyeOff size={13} /> Private</button><button className={currentCollection.privacy === "shared" ? "active" : ""} onClick={() => setPrivacy("shared")}><Share2 size={13} /> Shared</button></div></section>}
        </aside>

        <section className="wishlist-content">
          <div className="wishlist-content-heading"><div><span>{visibleProducts.length} products</span><h2>{currentCollection?.name || "All saved items"}</h2></div>{currentCollection && <small>{currentCollection.privacy === "private" ? <Lock size={12} /> : <Eye size={12} />}{currentCollection.privacy === "private" ? "Only you can view this collection" : "Anyone with the link can view"}</small>}</div>
          {visibleProducts.length ? <div className="wishlist-product-list">{visibleProducts.map((product, index) => {
            const available = index % 4 !== 3;
            const productAlerts = alerts[product.name] || {};
            return <article key={product.name}>
              <img src={product.image} alt={product.name} />
              <div className="wishlist-product-copy"><span className={available ? "available" : "unavailable"}>{available ? <><PackageCheck size={12} /> In stock</> : "Currently unavailable"}</span><Link to={`/product/${product.slug || slugify(product.name)}`}><h3>{product.name}</h3></Link><div className="wishlist-price"><strong>{money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}{product.oldPrice > product.price && <small>{Math.round((1 - product.price / product.oldPrice) * 100)}% lower</small>}</div><label>Collection <span><select value={collections.find((collection) => collection.products.includes(product.name))?.id || ""} onChange={(event) => assignCollection(product.name, event.target.value)}><option value="">Uncategorised</option>{collections.map((collection) => <option value={collection.id} key={collection.id}>{collection.name}</option>)}</select><ChevronDown size={12} /></span></label><div className="wishlist-alerts"><button className={productAlerts.price ? "active" : ""} onClick={() => toggleAlert(product.name, "price")}><Bell size={13} /> Price drop</button><button className={productAlerts.stock ? "active" : ""} onClick={() => toggleAlert(product.name, "stock")}><Bell size={13} /> Back in stock</button></div></div>
              <div className="wishlist-product-actions"><button className="primary" disabled={!available} onClick={() => moveToCart(product)}><ShoppingBag size={14} /> Move to cart</button><button className="icon-button" title="Remove from wishlist" onClick={() => removeProduct(product)}><Trash2 size={15} /></button></div>
            </article>;
          })}</div> : <div className="wishlist-empty"><Heart /><h2>No products in this collection</h2><p>Move saved products here or discover something new.</p><Link className="primary" to="/products">Explore products</Link></div>}
        </section>
      </div>
    </main>
  );
}
