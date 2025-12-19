export function Alert({
  children,
  variant = "info",
  className = "",
  ...props
}) {
  const variants = {
    info: "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-200",
    success: "bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-600 text-green-700 dark:text-green-200",
    warning: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-600 text-yellow-700 dark:text-yellow-200",
    error: "bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-600 text-red-700 dark:text-red-200",
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
