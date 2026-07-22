import { benefits } from "../../data/shopData";

export default function BenefitRow() {
  return (
    <section className="benefits">
      {benefits.map(({ label, detail, icon: Icon }) => (
        <div key={label}><Icon size={22} /><strong>{label}</strong><span>{detail}</span></div>
      ))}
    </section>
  );
}
