import { Component } from "react";

export default class MapErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true
    };
  }

  componentDidCatch(error) {
    console.error("Map mode crashed:", error);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/32">
          <div className="max-w-md rounded-3xl border border-rose-300/20 bg-slate-950/82 px-5 py-4 text-sm text-slate-100 backdrop-blur-xl">
            Kure modu acilirken bir hata oldu. 2D moduna donup tekrar deneyebilirsin.
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
