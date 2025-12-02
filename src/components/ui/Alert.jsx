export function Alert({
  children,
  variant = "info",
  className = "",
  ...props
}) {
  const variants = {
    info: "bg-blue-50 border-blue-300 text-blue-700",
    success: "bg-green-50 border-green-300 text-green-700",
    warning: "bg-yellow-50 border-yellow-300 text-yellow-700",
    danger: "bg-red-50 border-red-300 text-red-700",
  };

  return (
    <div
      className={`rounded-lg px-4 py-3 border ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
