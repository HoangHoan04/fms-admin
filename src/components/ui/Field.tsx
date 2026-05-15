export const Field = ({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-bold">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <small className="animate-fade-in ml-1 font-bold text-red-500">{error}</small>}
  </div>
);
