// components/ui/error-display.tsx
import { IconAlertCircle, IconX } from "@tabler/icons-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  message: string;
  title?: string;
  onClose?: () => void;
  onRetry?: () => void;
  variant?: "default" | "destructive";
  showIcon?: boolean;
}

export function ErrorDisplay({
  message,
  title = "Error",
  onClose,
  onRetry,
  variant = "destructive",
  showIcon = true,
}: ErrorDisplayProps) {
  return (
    <Alert variant={variant} className="relative">
      {showIcon && <IconAlertCircle className="h-4 w-4" />}

      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-6 w-6"
          onClick={onClose}
        >
          <IconX className="h-4 w-4" />
        </Button>
      )}

      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        {message}
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={onRetry}
          >
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

// Inline variant
interface InlineErrorProps {
  message: string;
  className?: string;
}

export function InlineError({ message, className = "" }: InlineErrorProps) {
  return (
    <div
      className={`flex items-center gap-2 text-sm text-destructive ${className}`}
    >
      <IconAlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}

// Full page error
interface ErrorPageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onGoBack?: () => void;
}

export function ErrorPage({
  title = "Something went wrong",
  message,
  onRetry,
  onGoBack,
}: ErrorPageProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 p-8 text-center">
      <div className="rounded-full bg-destructive/10 p-4">
        <IconAlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-muted-foreground max-w-md">{message}</p>
      </div>
      <div className="flex gap-3">
        {onGoBack && (
          <Button variant="outline" onClick={onGoBack}>
            Go Back
          </Button>
        )}
        {onRetry && <Button onClick={onRetry}>Try Again</Button>}
      </div>
    </div>
  );
}
