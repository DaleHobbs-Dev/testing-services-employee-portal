export function Input({ className = "", ...props }) {
  return (
    <input
      className={`
        border border-gray-300 dark:border-gray-600 
        rounded-md p-2 w-full 
        placeholder: text-adaptive
        bg-adaptive
        text-gray-900 dark:text-gray-100
        focus:ring-2 focus:ring-primary focus:outline-none 
        transition-colors
        ${className}
      `}
      {...props}
    />
  );
}