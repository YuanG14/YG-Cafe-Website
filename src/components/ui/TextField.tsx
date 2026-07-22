import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn(
            'h-11 rounded-xl border border-hairline bg-white px-4 text-sm text-ink placeholder:text-ink-faint',
            'transition-colors focus:border-accent outline-none',
            error && 'border-red-300 focus:border-red-400',
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';
