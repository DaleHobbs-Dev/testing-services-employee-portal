export function Input({ className = "", ...props }) {
  return (
    <input
      className={`border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors ${className}`}
      {...props}
    />
  );
}
