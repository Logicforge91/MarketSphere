import React, { useMemo, useState } from "react";
import { AlertTriangle, Bell, CheckCircle2, MessageCircleQuestion, Search, Store, ThumbsUp, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useShop } from "../../context/ShopContext";

export default function ProductQuestions({ product }) {
  const { user } = useAuth();
  const { askProductQuestion, markAnswerHelpful, productQuestions, reportQuestionContent } = useShop();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("helpful");
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState("");
  const [notify, setNotify] = useState(true);
  const [message, setMessage] = useState("");
  const [report, setReport] = useState(null);
  const [reportReason, setReportReason] = useState("Inappropriate content");
  const questions = useMemo(() => {
    const exact = productQuestions.filter((item) => item.productSlug === product.slug);
    const source = exact.length ? exact : productQuestions.filter((item) => item.id.startsWith("QUE-SEED"));
    const filtered = source.filter((item) => `${item.question} ${item.answer?.body || ""}`.toLowerCase().includes(query.toLowerCase()));
    return [...filtered].sort((a, b) => sort === "newest" ? new Date(b.createdAt) - new Date(a.createdAt) : sort === "oldest" ? new Date(a.createdAt) - new Date(b.createdAt) : (b.answer?.helpful || 0) - (a.answer?.helpful || 0));
  }, [product.slug, productQuestions, query, sort]);

  function submit(event) {
    event.preventDefault();
    const created = askProductQuestion({ productSlug: product.slug, productName: product.name, author: user?.name || "MarketSphere customer", question, notify });
    setMessage(`Question ${created.id} submitted${notify ? ". Answer notifications are enabled." : "."}`);
    setQuestion("");
    setShowForm(false);
  }

  return <section className="product-questions-module">
    <header><div><MessageCircleQuestion /><span>Product questions and answers</span><h2>Ask the MarketSphere community</h2><p>Get answers from verified customers and the seller.</p></div><button className="primary" onClick={() => setShowForm((value) => !value)}>Ask a question</button></header>
    {message && <p className="question-notice"><CheckCircle2 /> {message}</p>}
    {showForm && <form className="ask-question-form" onSubmit={submit}><label>Your question<textarea required minLength="10" maxLength="300" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about size, materials, compatibility, care or packaging" /></label><label className="question-notification"><input type="checkbox" checked={notify} onChange={(event) => setNotify(event.target.checked)} /><Bell /><span><strong>Notify me when answered</strong><small>We will send an account and email notification.</small></span></label><footer><small>Questions must follow the MarketSphere community guidelines.</small><button className="primary">Submit question</button></footer></form>}

    <div className="question-toolbar"><label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search questions and answers" /></label><label>Sort<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="helpful">Most helpful</option><option value="newest">Newest questions</option><option value="oldest">Oldest questions</option></select></label></div>

    <div className="questions-list">{questions.length ? questions.map((item) => <article key={item.id}><div className="question-row"><b>Q</b><div><strong>{item.question}</strong><span>Asked by {item.author} · {new Date(item.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span></div><button onClick={() => setReport({ questionId: item.id, target: "question" })}><AlertTriangle /> Report</button></div>{item.answer ? <div className="answer-row"><b>A</b><div><header><strong>{item.answer.author}</strong>{item.answer.seller && <span><Store /> Seller answer</span>}</header><p>{item.answer.body}</p><small>{new Date(item.answer.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</small><footer><button onClick={() => markAnswerHelpful(item.id)}><ThumbsUp /> Helpful ({item.answer.helpful || 0})</button><button onClick={() => setReport({ questionId: item.id, target: "answer" })}><AlertTriangle /> Report answer</button></footer></div></div> : <div className="answer-pending"><MessageCircleQuestion /><span><strong>Awaiting seller answer</strong>{item.notify && " · Notifications enabled"}</span></div>}</article>) : <div className="questions-empty"><Search /><h3>No matching questions</h3><p>Try another search or ask the seller directly.</p></div>}</div>

    {report && <div className="question-report-backdrop" onMouseDown={() => setReport(null)}><form onSubmit={(event) => { event.preventDefault(); reportQuestionContent(report.questionId, report.target, reportReason); setReport(null); setMessage(`${report.target === "answer" ? "Answer" : "Question"} reported to moderation.`); }} onMouseDown={(event) => event.stopPropagation()}><header><div><span>Community moderation</span><h2>Report {report.target}</h2></div><button type="button" onClick={() => setReport(null)}><X /></button></header><label>Reason<select value={reportReason} onChange={(event) => setReportReason(event.target.value)}><option>Inappropriate content</option><option>Spam or advertising</option><option>Contains personal information</option><option>Incorrect or misleading</option><option>Not related to this product</option></select></label><button className="primary">Submit report</button></form></div>}
  </section>;
}
