import { Minus, Plus, ShieldCheck, Star } from "lucide-react";
import { productDetail } from "../../data/shopData";
import { money } from "../../utils/format";

export default function ProductDetail() {
  return (
    <section className="detail-panel">
      <div className="gallery">
        <div className="thumbs">{[1, 2, 3, 4].map((i) => <img src={productDetail.image} alt="" key={i} />)}</div>
        <img className="main-product" src={productDetail.image} alt={productDetail.name} />
      </div>
      <div className="product-info">
        <span className="seller">Best Seller</span>
        <h2>{productDetail.name}</h2>
        <div className="rating"><Star size={17} fill="currentColor" /> {productDetail.rating} ({productDetail.reviews.toLocaleString()} reviews) <span>{productDetail.sold} sold</span></div>
        <div className="price"><strong>{money(productDetail.price)}</strong><del>{money(productDetail.oldPrice)}</del><span>30% Off</span></div>
        <p>Industry-leading noise cancellation with exceptional sound quality and all-day comfort.</p>
        <div className="swatches">{productDetail.swatches.map((color) => <button style={{ backgroundColor: color }} key={color} />)}</div>
        <div className="qty"><button><Minus size={14} /></button><span>1</span><button><Plus size={14} /></button></div>
        <div className="buy-actions"><button className="primary">Add to Cart</button><button className="dark">Buy Now</button></div>
      </div>
      <aside className="store-box">
        <strong>Sold by ShopSphere Official</strong>
        {["4.9 Seller Rating", "100% Original Products", "7 Days Easy Returns", "Free Delivery over $49"].map((item) => <span key={item}><ShieldCheck size={16} /> {item}</span>)}
        <button>View Store</button>
      </aside>
    </section>
  );
}
