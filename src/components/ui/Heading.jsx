export function H1({ children, className = "" }) {
  return (
    <h1 className={`text-3xl font-bold text-primary dark:text-primary mb-6 ${className}`}>
      {children}
    </h1>
  );
}

export function H2({ children, className = "" }) {
  return (
    <h2 className={`text-2xl font-semibold text-primary dark:text-primary mb-4 ${className}`}>
      {children}
    </h2>
  );
}

export function H3({ children, className = "", underline = false }) {
  return (
    <h3
      className={`text-xl font-semibold text-primary dark:text-primary mb-3 ${
        underline ? "border-b-2 border-primary dark:border-primary pb-2" : ""
      } ${className}`}
    >
      {children}
    </h3>
  );
}
