export function H1({ children, className = "" }) {
  return (
    <h1 className={`text-3xl font-bold text-purple-500 mb-6 ${className}`}>
      {children}
    </h1>
  );
}

export function H2({ children, className = "" }) {
  return (
    <h2 className={`text-2xl font-semibold text-purple-700 mb-4 ${className}`}>
      {children}
    </h2>
  );
}

export function H3({ children, className = "" }) {
  return (
    <h3 className={`text-xl font-semibold text-purple-700 mb-3 ${className}`}>
      {children}
    </h3>
  );
}
