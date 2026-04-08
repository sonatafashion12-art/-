import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    const { children } = this.props;
    if (this.state.hasError) {
      let errorMessage = "Something went wrong. Please try again later.";
      
      try {
        const parsedError = JSON.parse(this.state.error?.message || "");
        if (parsedError.error && parsedError.error.includes("Missing or insufficient permissions")) {
          errorMessage = "You don't have permission to perform this action. Please check your login status.";
        }
      } catch (e) {
        // Not a JSON error message, use default
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-ehad-bg p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center">
            <h2 className="text-2xl font-serif font-bold text-ehad-accent mb-4">Oops!</h2>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-ehad-primary text-white rounded-full hover:opacity-90 transition-opacity"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
