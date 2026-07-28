import React, { useEffect, useRef, useState } from "react";
import { Accessibility, Contrast, Mic, RotateCcw, Type, X, ZapOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAccessibility } from "../../context/AccessibilityContext";

const voiceRoutes = [
  ["home", "/"],
  ["products", "/products"],
  ["shop", "/products"],
  ["search", "/search"],
  ["cart", "/cart"],
  ["bag", "/cart"],
  ["wishlist", "/wishlist"],
  ["account", "/account"],
  ["orders", "/orders"],
  ["support", "/support"],
];

export default function AccessibilityMenu() {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");
  const { textScale, setTextScale, highContrast, toggleHighContrast, reduceMotion, toggleReduceMotion, reset } = useAccessibility();

  useEffect(() => {
    if (!open) return undefined;
    panelRef.current?.querySelector("button")?.focus();
    const close = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);

  function startVoiceNavigation() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceStatus("Voice navigation is not supported by this browser.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = document.documentElement.lang || "en";
    recognition.interimResults = false;
    setVoiceStatus("Listening. Say home, products, search, cart, wishlist, account, orders, or support.");
    recognition.onresult = (event) => {
      const phrase = event.results[0][0].transcript.toLowerCase();
      const match = voiceRoutes.find(([command]) => phrase.includes(command));
      if (match) {
        setVoiceStatus(`Opening ${match[0]}.`);
        navigate(match[1]);
        setOpen(false);
      } else {
        setVoiceStatus(`Command not recognized: ${phrase}.`);
      }
    };
    recognition.onerror = () => setVoiceStatus("Voice navigation could not hear a command. Please try again.");
    recognition.start();
  }

  return (
    <>
      <button className="a11y-trigger" type="button" aria-label="Open accessibility settings" aria-expanded={open} aria-controls="a11y-panel" onClick={() => setOpen(true)}>
        <Accessibility aria-hidden="true" />
      </button>
      {open && <div className="a11y-backdrop" onMouseDown={() => setOpen(false)}>
        <section id="a11y-panel" className="a11y-panel" role="dialog" aria-modal="true" aria-labelledby="a11y-title" ref={panelRef} onMouseDown={(event) => event.stopPropagation()}>
          <header><div><span>Display and navigation</span><h2 id="a11y-title">Accessibility</h2></div><button type="button" aria-label="Close accessibility settings" onClick={() => setOpen(false)}><X /></button></header>
          <div className="a11y-setting">
            <label id="text-size-label"><Type /> Text size</label>
            <div className="a11y-segments" role="group" aria-labelledby="text-size-label">
              {[1, 1.12, 1.25].map((scale) => <button type="button" className={textScale === scale ? "active" : ""} aria-pressed={textScale === scale} onClick={() => setTextScale(scale)} key={scale}>{Math.round(scale * 100)}%</button>)}
            </div>
          </div>
          <button className="a11y-toggle" type="button" role="switch" aria-checked={highContrast} onClick={toggleHighContrast}><Contrast /><span><strong>High contrast</strong><small>Increase color and border contrast</small></span><i /></button>
          <button className="a11y-toggle" type="button" role="switch" aria-checked={reduceMotion} onClick={toggleReduceMotion}><ZapOff /><span><strong>Reduce motion</strong><small>Limit transitions and animation</small></span><i /></button>
          <button className="a11y-voice" type="button" onClick={startVoiceNavigation}><Mic /> Start voice navigation</button>
          <p className="a11y-voice-status" role="status" aria-live="polite">{voiceStatus}</p>
          <button className="a11y-reset" type="button" onClick={reset}><RotateCcw /> Reset accessibility settings</button>
        </section>
      </div>}
    </>
  );
}
