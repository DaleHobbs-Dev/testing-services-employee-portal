export function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white transition-colors ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
