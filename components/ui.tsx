import React from "react";

export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "outline" | "ghost";
  }
>(({ className, variant = "primary", ...props }, ref) => {
  const variants = {
    primary:
      "bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/20 active:scale-[0.98]",
    secondary:
      "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:scale-[0.98]",
    outline:
      "border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 active:scale-[0.98]",
    ghost: "hover:bg-zinc-100 text-zinc-700 active:scale-[0.98]",
  };
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-5 py-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-lg border-b-2 border-zinc-100 bg-zinc-50/50 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:border-zinc-900 focus-visible:bg-white transition-all disabled:cursor-not-allowed disabled:opacity-50 hover:bg-zinc-50",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[100px] w-full rounded-lg border-b-2 border-zinc-100 bg-zinc-50/50 px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-400 focus-visible:outline-none focus-visible:border-zinc-900 focus-visible:bg-white transition-all disabled:cursor-not-allowed disabled:opacity-50 resize-y hover:bg-zinc-50",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "flex h-11 w-full appearance-none rounded-lg border-b-2 border-zinc-100 bg-zinc-50/50 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:border-zinc-900 focus-visible:bg-white transition-all disabled:cursor-not-allowed disabled:opacity-50 pr-10 cursor-pointer hover:bg-zinc-50",
          className
        )}
        {...props}
      />
      <div className="absolute right-3 top-3.5 pointer-events-none text-zinc-500">
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
});
Select.displayName = "Select";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-[11px] font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-400 uppercase tracking-widest mb-2 block",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export const Card = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "rounded-2xl border border-zinc-100 bg-white text-zinc-950 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)]",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const Tabs = ({
  value,
  onValueChange,
  children,
  className,
}: {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={className}>{children}</div>;
};

export const TabsList = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "inline-flex h-12 items-center justify-center rounded-xl bg-zinc-100/50 p-1 text-zinc-500 w-full",
      className
    )}
  >
    {children}
  </div>
);

export const TabsTrigger = ({
  value,
  activeValue,
  onClick,
  children,
  className,
}: {
  value: string;
  activeValue: string;
  onClick: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    onClick={() => onClick(value)}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1",
      activeValue === value
        ? "bg-white text-zinc-900 shadow-sm font-semibold"
        : "hover:bg-zinc-200/50 hover:text-zinc-900",
      className
    )}
  >
    {children}
  </button>
);

export const TabsContent = ({
  value,
  activeValue,
  children,
  className,
}: {
  value: string;
  activeValue: string;
  children: React.ReactNode;
  className?: string;
}) => {
  if (value !== activeValue) return null;
  return (
    <div
      className={cn(
        "mt-4 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 animate-in fade-in duration-300 slide-in-from-bottom-2",
        className
      )}
    >
      {children}
    </div>
  );
};
