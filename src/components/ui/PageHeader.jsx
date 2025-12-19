import { H1 } from "./Heading.jsx";

export function PageHeader({
  title,
  description,
  actions,
  center = false,
  className = "",
}) {
  return (
    <header
      role="region"
      aria-labelledby="page-header-title"
      className={`mb-1 ${className}`}
    >
      <div
        className={center ? "text-center" : "flex items-center justify-between"}
      >
        <div className={center ? "mx-auto" : ""}>
          <H1 id="page-header-title">{title}</H1>
          {description && <p className="mt-2 text-adaptive-muted">{description}</p>}
        </div>

        {!center && actions && <div className="flex gap-3">{actions}</div>}
      </div>
    </header>
  );
}
