import React from "react";

export default function SectionTitle({ title, action = "View All" }) {
  return <div className="section-title"><h2>{title}</h2><button>{action}</button></div>;
}
