export function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`
        w-full
        border border-gray-300 dark:border-gray-600 
        rounded-md px-3 py-2
        bg-white dark:bg-gray-800 
        text-gray-900 dark:text-gray-100
        focus:outline-none focus:ring-2 focus:ring-primary 
        focus:border-transparent
        transition-colors
        cursor-pointer
        appearance-none
        bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3e%3cpolyline points="6 9 12 15 18 9"%3e%3c/polyline%3e%3c/svg%3e')]
        bg-[length:1.25rem]
        bg-[right_0.5rem_center]
        bg-no-repeat
        pr-10
        [&>option]:bg-white [&>option]:text-gray-900
        dark:[&>option]:bg-gray-800 dark:[&>option]:text-gray-100
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  );
}
