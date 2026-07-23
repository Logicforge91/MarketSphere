import React, { useState } from "react";
import { MapPin, Truck } from "lucide-react";

export default function PincodeDelivery() {
  const [pincode, setPincode] = useState("560102");
  const [checked, setChecked] = useState(true);

  return (
    <section className="india-card">
      <h3><MapPin size={18} /> Delivery Options</h3>
      <div className="pincode-row">
        <input value={pincode} onChange={(event) => setPincode(event.target.value)} maxLength="6" />
        <button onClick={() => setChecked(true)}>Check</button>
      </div>
      {checked && <p><Truck size={16} /> Delivery by tomorrow, free for this pincode. COD available.</p>}
    </section>
  );
}
