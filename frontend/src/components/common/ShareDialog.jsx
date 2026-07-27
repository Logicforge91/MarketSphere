import React, { useState } from "react";
import { Check, Copy, Facebook, Link2, Mail, MessageCircle, Send, Share2, X } from "lucide-react";

function deepLink(path, type) {
  const url = new URL(path || window.location.href, window.location.origin);
  url.searchParams.set("shared", type || "content");
  return url.toString();
}

export default function ShareDialog({ title, text, path, type = "content", className = "", children }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = deepLink(path, type);
  const message = `${text || title} ${url}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("textarea");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function nativeShare() {
    if (!navigator.share) return copyLink();
    try {
      await navigator.share({ title, text, url });
      setOpen(false);
    } catch (error) {
      if (error?.name !== "AbortError") await copyLink();
    }
  }

  function openChannel(channel) {
    const targets = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text || title)}&url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(message)}`,
    };
    if (channel === "email") window.location.href = targets[channel];
    else window.open(targets[channel], "_blank", "noopener,noreferrer");
  }

  return <>
    <button className={className} onClick={() => setOpen(true)}><Share2 size={16} />{children || "Share"}</button>
    {open && <div className="share-dialog-backdrop" onMouseDown={() => setOpen(false)}><section className="share-dialog" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Share ${title}`}><header><div><span>Share {type}</span><h2>{title}</h2></div><button onClick={() => setOpen(false)} title="Close"><X /></button></header><div className="share-preview"><Link2 /><p>{url}</p></div><div className="share-channels"><button onClick={nativeShare}><Send /><span>Share</span></button><button onClick={() => openChannel("whatsapp")}><MessageCircle /><span>WhatsApp</span></button><button onClick={() => openChannel("facebook")}><Facebook /><span>Facebook</span></button><button onClick={() => openChannel("x")}><strong>X</strong><span>X</span></button><button onClick={() => openChannel("email")}><Mail /><span>Email</span></button><button onClick={copyLink}>{copied ? <Check /> : <Copy />}<span>{copied ? "Copied" : "Copy link"}</span></button></div><footer><Link2 /><span>Deep link opens this {type} directly in MarketSphere.</span></footer></section></div>}
  </>;
}
