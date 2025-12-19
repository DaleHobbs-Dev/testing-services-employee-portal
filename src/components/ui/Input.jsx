export function Input({ className = "", ...props }) {
  return (
    <input
      className={`
        border border-gray-300 dark:border-gray-600 
        rounded-md p-2 w-full 
        bg-white dark:bg-gray-800 
        text-gray-900 dark:text-gray-100
        placeholder:text-gray-500 dark:placeholder:text-gray-400
        focus:ring-2 focus:ring-primary focus:outline-none 
        transition-colors
        ${className}
      `}
      {...props}
    />
  );
}
