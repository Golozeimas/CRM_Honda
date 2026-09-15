interface AuthErrorBannerProps {
  title: string;
  message: string;
}

export function AuthErrorBanner({ title, message }: AuthErrorBannerProps) {
  return (
    <div className="flex items-start gap-3 bg-error-container rounded-xl px-4 py-3 border border-error/20">
      <span
        className="material-symbols-outlined text-[20px] text-error flex-shrink-0 mt-0.5"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        error
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="font-label-lg text-label-lg font-bold text-error">{title}</span>
        <span className="font-body-sm text-body-sm text-on-error-container">{message}</span>
      </div>
    </div>
  );
}
