/**
 * Error Monitoring Service
 *
 * This module provides a centralized error logging system.
 *
 * To integrate with a service like Sentry:
 * 1. Install: npm install @sentry/nextjs
 * 2. Initialize in this file
 * 3. Replace console.error calls with Sentry.captureException
 *
 * Example Sentry initialization:
 * import * as Sentry from "@sentry/nextjs";
 *
 * Sentry.init({
 *   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
 *   environment: process.env.NODE_ENV,
 *   tracesSampleRate: 1.0,
 * });
 */

interface ErrorContext {
  userId?: string;
  component?: string;
  action?: string;
  [key: string]: unknown;
}

export class ErrorMonitoringService {
  private static instance: ErrorMonitoringService;

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): ErrorMonitoringService {
    if (!ErrorMonitoringService.instance) {
      ErrorMonitoringService.instance = new ErrorMonitoringService();
    }
    return ErrorMonitoringService.instance;
  }

  /**
   * Log an error to the monitoring service
   */
  public logError(error: Error, context?: ErrorContext): void {
    // In development, log to console
    if (process.env.NODE_ENV === "development") {
      console.error("[Error Monitoring]", error, context);
      return;
    }

    // In production, send to monitoring service
    // Example: Sentry.captureException(error, { extra: context });

    // For now, we'll use console.error as a fallback
    console.error("[Production Error]", {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log a warning to the monitoring service
   */
  public logWarning(message: string, context?: ErrorContext): void {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Warning]", message, context);
      return;
    }

    // Example: Sentry.captureMessage(message, "warning");
    console.warn("[Production Warning]", {
      message,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Set user context for error tracking
   */
  public setUserContext(userId: string, email?: string): void {
    // Example: Sentry.setUser({ id: userId, email });
    if (process.env.NODE_ENV === "development") {
      console.log("[User Context Set]", { userId, email });
    }
  }

  /**
   * Clear user context (e.g., on logout)
   */
  public clearUserContext(): void {
    // Example: Sentry.setUser(null);
    if (process.env.NODE_ENV === "development") {
      console.log("[User Context Cleared]");
    }
  }
}

// Export singleton instance
export const errorMonitoring = ErrorMonitoringService.getInstance();
