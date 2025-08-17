// src/components/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // شما می‌توانید خطا را به یک سرویس گزارش‌دهی نیز ارسال کنید
    console.error("Uncaught error in component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // در صورت بروز خطا در کامپوننت فرزند، هیچ چیزی نمایش داده نمی‌شود
      return null;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;