import React from "react";
import { ChevronRight } from "lucide-react";

export default function ListRow({ icon: Icon, title, meta, right }) {
  return (
    <div className="list-row">
      {Icon && <span className="row-icon"><Icon size={16} /></span>}
      <div><strong>{title}</strong>{meta && <small>{meta}</small>}</div>
      {right || <ChevronRight size={14} />}
    </div>
  );
}
