import { ChevronRight, Grid2X2 } from "lucide-react";
import { categories } from "../../data/shopData";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <button className="all-cat"><Grid2X2 size={16} /> All Categories</button>
      {categories.map(({ name, icon: Icon }) => (
        <button className="side-item" key={name}><Icon size={16} /> {name}<ChevronRight size={14} /></button>
      ))}
      <a className="view-link">View All Categories</a>
    </aside>
  );
}
