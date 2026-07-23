import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { buttonStyles } from '../ui/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render-time errors anywhere below it so a single broken component
 * doesn't take down the whole app to a blank white screen. Mounted once,
 * high up (see main.tsx), around everything — including the router — so it
 * can also catch errors thrown by context providers.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Kept as a console log rather than a reporting call — this is a
    // private two-person app with no error-tracking service wired up.
    console.error('Unhandled error caught by ErrorBoundary:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-canvas grid place-items-center px-4 py-12">
          <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
            <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
            <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-secondary/25 blur-3xl" />
          </div>

          <div className="w-full max-w-sm text-center bg-card rounded-card border border-hairline shadow-soft p-8">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-3">
              Something went wrong
            </p>
            <h1 className="font-display text-3xl font-medium text-ink mb-3">
              This page hit a snag.
            </h1>
            <p className="text-sm text-ink-soft leading-relaxed mb-6">
              Nothing's lost — your cafes and photos are safe. Try again, or head back home.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button type="button" onClick={this.handleReset} className={buttonStyles('primary', 'md')}>
                Try again
              </button>
              <a href="/" className={buttonStyles('secondary', 'md')}>
                Go home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
