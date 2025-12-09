export function Textarea({ className = "", id, ...props }) {
  return (
    <textarea
      id={id}
      className={`
        w-full
        min-h-[120px]
        border border-gray-300
        rounded-md
        px-3 py-2
        text-gray-900
        bg-white
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-primary-dark
        transition
        ${className}
      `}
      {...props}
    />
  );
}
