export function Spinner({ size = "md", className = "" }) {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
    xl: "h-14 w-14",
  };

  return (
    <div
      className={`
        animate-spin 
        rounded-full 
        border-4 
        border-gray-300 
        border-t-primary 
        ${sizeMap[size]} 
        ${className}
      `}
      role="status"
      aria-label="Loading"
    />
  );
}
