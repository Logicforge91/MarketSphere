import React, { useMemo, useState } from "react";
import { Check, RefreshCw, ShieldCheck } from "lucide-react";

export default function CaptchaCheck({ onChange }) {
  const [seed, setSeed] = useState(1);
  const [answer, setAnswer] = useState("");
  const challenge = useMemo(() => {
    const left = 3 + (seed % 6);
    const right = 2 + ((seed * 3) % 7);
    return { left, right, result: left + right };
  }, [seed]);
  const valid = Number(answer) === challenge.result;

  function update(value) {
    setAnswer(value);
    onChange(Number(value) === challenge.result);
  }

  return <div className={`captcha-check ${valid ? "verified" : ""}`}>
    <ShieldCheck aria-hidden="true" />
    <label><span>Security check: {challenge.left} + {challenge.right}</span><input aria-label="CAPTCHA answer" inputMode="numeric" value={answer} onChange={(event) => update(event.target.value.replace(/\D/g, ""))} /></label>
    {valid ? <Check aria-label="CAPTCHA verified" /> : <button type="button" aria-label="Get a new CAPTCHA" onClick={() => { setSeed((value) => value + 1); setAnswer(""); onChange(false); }}><RefreshCw /></button>}
  </div>;
}
