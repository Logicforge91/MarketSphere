import React from "react";
import { User } from "lucide-react";
import ListRow from "../components/board/ListRow";
import { accountMenu } from "../data/shopData";

export default function AccountPage() {
  return (
    <main className="real-page account-page">
      <div className="account-hero"><User size={42} /><div><h1>Rahul Kumar</h1><p>rahul@email.com · +91 98765 43210</p></div></div>
      <section className="account-grid">{accountMenu.map((item) => <ListRow icon={User} title={item} key={item} />)}</section>
    </main>
  );
}
