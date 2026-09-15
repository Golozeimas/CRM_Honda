import { useState, type InputHTMLAttributes } from 'react';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  hasError?: boolean;
}

export function PasswordInput({ hasError, className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <span className={`material-symbols-outlined absolute left-3 top-2.5 text-[20px] pointer-events-none ${hasError ? 'text-error' : 'text-secondary'}`}>
        lock
      </span>
      <input
        {...props}
        type={visible ? 'text' : 'password'}
        className={`w-full h-10 pl-10 pr-10 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-secondary/60 focus:outline-none transition-all shadow-sm border ${
          hasError
            ? 'border-error focus:ring-2 focus:ring-error'
            : 'border-outline/20 focus:ring-2 focus:ring-primary focus:border-transparent'
        } ${className ?? ''}`}
      />
      <button
        type="button"
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-2.5 text-secondary hover:text-on-surface transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-[20px]">
          {visible ? 'visibility_off' : 'visibility'}
        </span>
      </button>
    </div>
  );
}
