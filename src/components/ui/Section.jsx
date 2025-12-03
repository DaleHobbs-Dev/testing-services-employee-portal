export function Section({ title, children, className = "" }) {
  return (
    <section className={`mb-8 ${className}`}>
      {title && (
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">{title}</h2>
      )}
      {children}
    </section>
  );
}
