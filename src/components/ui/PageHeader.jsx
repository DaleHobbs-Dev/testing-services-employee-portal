import { H1 } from "./Heading";

export function PageHeader({ title, description, actions, className = "" }) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <H1>{title}</H1>
          {description && <p className="mt-2 text-gray-600">{description}</p>}
        </div>
        {actions && <div className="flex gap-3">{actions}</div>}
      </div>
    </div>
  );
}
