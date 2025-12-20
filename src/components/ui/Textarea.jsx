export function Textarea({ className = "", id, ...props }) {
  return (
    <textarea
      id={id}
      className={`
        w-full
        min-h-[120px]
        border border-gray-300 dark:border-gray-600
        rounded-md
        px-3 py-2
        bg-white dark:bg-gray-800
        text-gray-900 dark:text-gray-100
        placeholder:text-gray-500 dark:placeholder:text-gray-400
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-primary
        transition-colors
        ${className}
      `}
      {...props}
    />
  );
}