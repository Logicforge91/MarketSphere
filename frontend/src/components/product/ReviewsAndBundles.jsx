import { productDetail } from "../../data/shopData";

function ProductMini({ title }) {
  return <article className="mini"><img src={productDetail.image} alt={title} /><span>{title}</span><strong>$29.99</strong></article>;
}

export default function ReviewsAndBundles() {
  return (
    <section className="details-grid">
      <div className="specs"><h3>Product Details</h3>{productDetail.details.map((item) => <p key={item}>- {item}</p>)}<a>View More</a></div>
      <div className="review-box"><h3>Reviews</h3><strong>4.8</strong><span className="stars">★★★★★</span>{[82, 54, 27, 13, 6].map((w, i) => <div className="bar" key={i}><span>{5 - i}</span><i style={{ width: `${w}%` }} /></div>)}</div>
      <div className="bundle"><h3>Frequently Bought Together</h3><div>{["Headphones", "Case", "Stand", "Cable"].map((item) => <ProductMini title={item} key={item} />)}<aside><span>Total Price</span><strong>$338.97</strong><button className="primary">Add All to Cart</button></aside></div></div>
    </section>
  );
}
