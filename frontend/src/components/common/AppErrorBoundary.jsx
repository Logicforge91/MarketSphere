import React from "react";

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error("MarketSphere render failure", error, info);
    }
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main className="app-error">
        <span>Something went wrong</span>
        <h1>MarketSphere needs a quick refresh</h1>
        <p>Your saved bag and wishlist are safe on this device.</p>
        <button type="button" onClick={() => window.location.reload()}>Reload application</button>
      </main>
    );
  }
}
