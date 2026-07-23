import React, { useState } from "react";
import { MapPin, Truck } from "lucide-react";

export default function PincodeDelivery() {
  const [pincode, setPincode] = useState("560102");
  const [checked, setChecked] = useState(true);
  const valid = /^\d{6}$/.test(pincode);

  return (
    <section className="india-card">
      <h3><MapPin size={18} /> Delivery Options</h3>
      <div className="pincode-row">
        <input inputMode="numeric" value={pincode} onChange={(event) => { setPincode(event.target.value.replace(/\D/g, "")); setChecked(false); }} maxLength="6" aria-label="Delivery pincode" />
        <button disabled={!valid} onClick={() => setChecked(true)}>Check</button>
      </div>
      {checked && valid && <p><Truck size={16} /> Delivery in 2-3 days. Free shipping and cash on delivery available.</p>}
    </section>
  );
}
