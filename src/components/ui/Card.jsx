import { H3 } from './Heading';

export function Card({ children, className = "", ...props }) {
  return (
    <div className={`rounded-xl shadow-sm p-6 border border-adaptive dark:border-adaptive bg-muted ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return (
    <H3 className={`${className}`}>
      {children}
    </H3>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`text-adaptive flex flex-col gap-3 ${className}`}>{children}</div>;
}
