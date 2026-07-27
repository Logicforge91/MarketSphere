import React, { useMemo, useState } from "react";
import { AlertTriangle, Camera, CheckCircle2, Pencil, Star, ThumbsDown, ThumbsUp, Trash2, Upload, Video, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useShop } from "../../context/ShopContext";

function Stars({ value, onChange, label }) {
  return <div className="rating-input"><span>{label}</span><div>{[1, 2, 3, 4, 5].map((rating) => <button className={rating <= value ? "selected" : ""} type="button" onClick={() => onChange(rating)} key={rating} aria-label={`${rating} stars`}><Star fill="currentColor" /></button>)}</div></div>;
}

export default function ProductReviews({ product }) {
  const { user } = useAuth();
  const { createReview, deleteReview, orders, reportReview, reviews, updateReview, voteReview } = useShop();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("helpful");
  const [reporting, setReporting] = useState("");
  const [reportReason, setReportReason] = useState("Inappropriate language");
  const [form, setForm] = useState({ productRating: 5, sellerRating: 5, deliveryRating: 5, title: "", body: "" });
  const [media, setMedia] = useState({ images: [], video: null });
  const productReviews = useMemo(() => {
    const exact = reviews.filter((review) => review.productSlug === product.slug);
    const list = exact.length ? exact : reviews.filter((review) => review.id.startsWith("REV-SEED"));
    const filtered = list.filter((review) => filter === "all" || (filter === "verified" ? review.verified : review.productRating === Number(filter)));
    return [...filtered].sort((a, b) => sort === "newest" ? new Date(b.createdAt) - new Date(a.createdAt) : sort === "rating-high" ? b.productRating - a.productRating : sort === "rating-low" ? a.productRating - b.productRating : (b.likes || 0) - (a.likes || 0));
  }, [filter, product.slug, reviews, sort]);
  const verified = orders.some((order) => order.items?.some((item) => item.name === product.name) && order.status !== "Cancelled");
  const average = productReviews.length ? (productReviews.reduce((sum, review) => sum + review.productRating, 0) / productReviews.length).toFixed(1) : product.rating;

  function resetForm() {
    setForm({ productRating: 5, sellerRating: 5, deliveryRating: 5, title: "", body: "" });
    setMedia({ images: [], video: null });
    setEditing("");
    setShowForm(false);
  }

  function submit(event) {
    event.preventDefault();
    const payload = { ...form, productSlug: product.slug, productName: product.name, author: user?.name || "MarketSphere customer", verified, media: { images: media.images.map((file) => file.name), video: media.video?.name || null } };
    if (editing) updateReview(editing, payload);
    else createReview(payload);
    resetForm();
  }

  function edit(review) {
    setForm({ productRating: review.productRating, sellerRating: review.sellerRating, deliveryRating: review.deliveryRating, title: review.title, body: review.body });
    setEditing(review.id);
    setShowForm(true);
  }

  return <section className="advanced-reviews-section">
    <header className="reviews-overview"><div><span>Customer reviews</span><strong>{average}</strong><div>{[1, 2, 3, 4, 5].map((rating) => <Star className={rating <= Math.round(average) ? "filled" : ""} fill="currentColor" key={rating} />)}</div><p>{productReviews.length} reviews for this product</p></div><div className="rating-breakdown">{[5, 4, 3, 2, 1].map((rating) => { const count = productReviews.filter((review) => review.productRating === rating).length; return <span key={rating}><b>{rating}</b><Star fill="currentColor" /><i><em style={{ width: `${productReviews.length ? count / productReviews.length * 100 : 0}%` }} /></i><small>{count}</small></span>; })}</div><button className="primary" onClick={() => setShowForm(true)}>Write a review</button></header>

    {showForm && <form className="review-editor" onSubmit={submit}><header><div><span>{editing ? "Update your feedback" : "Share your experience"}</span><h2>{editing ? "Edit review" : "Write a review"}</h2></div><button type="button" onClick={resetForm}><X /></button></header><div className="review-rating-grid"><Stars label="Product" value={form.productRating} onChange={(value) => setForm({ ...form, productRating: value })} /><Stars label="Seller" value={form.sellerRating} onChange={(value) => setForm({ ...form, sellerRating: value })} /><Stars label="Delivery" value={form.deliveryRating} onChange={(value) => setForm({ ...form, deliveryRating: value })} /></div><label>Review title<input required maxLength="80" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Summarize your experience" /></label><label>Your review<textarea required minLength="20" maxLength="1000" value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} placeholder="What did you like or dislike?" /></label><div className="review-media-upload"><label><Camera /><span>Upload images<small>Up to 5 files</small></span><Upload /><input type="file" accept="image/*" multiple onChange={(event) => setMedia({ ...media, images: [...event.target.files].slice(0, 5) })} /></label><label><Video /><span>Upload video<small>One product video</small></span><Upload /><input type="file" accept="video/*" onChange={(event) => setMedia({ ...media, video: event.target.files?.[0] || null })} /></label></div>{(media.images.length > 0 || media.video) && <p className="review-media-names">{[...media.images.map((file) => file.name), media.video?.name].filter(Boolean).join(" · ")}</p>}<footer><small>Reviews are checked against our community guidelines before publication.</small><button className="primary">{editing ? "Save review" : "Submit review"}</button></footer></form>}

    <div className="review-toolbar"><div>{["all", "verified", "5", "4", "3"].map((value) => <button className={filter === value ? "active" : ""} onClick={() => setFilter(value)} key={value}>{value === "all" ? "All reviews" : value === "verified" ? "Verified" : `${value} stars`}</button>)}</div><label>Sort<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="helpful">Most helpful</option><option value="newest">Newest</option><option value="rating-high">Highest rated</option><option value="rating-low">Lowest rated</option></select></label></div>

    <div className="advanced-review-list">{productReviews.map((review) => <article key={review.id}><header><div className="review-author">{review.author.split(" ").map((part) => part[0]).join("").slice(0, 2)}<span><strong>{review.author}</strong><small>{new Date(review.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}{review.editedAt && " · Edited"}</small></span></div><div className="review-statuses">{review.verified && <span><CheckCircle2 /> Verified purchase</span>}<b>{review.moderationStatus}</b></div></header><div className="review-stars">{[1, 2, 3, 4, 5].map((rating) => <Star className={rating <= review.productRating ? "filled" : ""} fill="currentColor" key={rating} />)}<strong>{review.title}</strong></div><p>{review.body}</p>{(review.media?.images?.length > 0 || review.media?.video) && <div className="published-review-media">{review.media.images.map((name) => <span key={name}><Camera /> {name}</span>)}{review.media.video && <span><Video /> {review.media.video}</span>}</div>}<div className="review-subratings"><span>Seller <b>{review.sellerRating}/5</b></span><span>Delivery <b>{review.deliveryRating}/5</b></span></div><footer><div><span>Helpful?</span><button onClick={() => voteReview(review.id, "likes")}><ThumbsUp /> {review.likes || 0}</button><button onClick={() => voteReview(review.id, "dislikes")}><ThumbsDown /> {review.dislikes || 0}</button></div><div>{!review.id.startsWith("REV-SEED") && <><button onClick={() => edit(review)}><Pencil /> Edit</button><button onClick={() => window.confirm("Delete this review?") && deleteReview(review.id)}><Trash2 /> Delete</button></>}<button onClick={() => setReporting(review.id)}><AlertTriangle /> Report</button></div></footer></article>)}</div>

    {reporting && <div className="review-report-backdrop" onMouseDown={() => setReporting("")}><form onSubmit={(event) => { event.preventDefault(); reportReview(reporting, reportReason); setReporting(""); }} onMouseDown={(event) => event.stopPropagation()}><header><div><span>Community safety</span><h2>Report this review</h2></div><button type="button" onClick={() => setReporting("")}><X /></button></header><label>Reason<select value={reportReason} onChange={(event) => setReportReason(event.target.value)}><option>Inappropriate language</option><option>Spam or advertising</option><option>Contains personal information</option><option>Not about this product</option><option>Suspected fake review</option></select></label><button className="primary">Submit report</button></form></div>}
  </section>;
}
