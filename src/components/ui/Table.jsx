export function Table({ children, className = "" }) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }) {
  return (
    <thead className="bg-gray-50 dark:bg-gray-800">
      {children}
    </thead>
  );
}

export function TableBody({ children }) {
  return (
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = "", onClick, striped = false, ...props }) {
  return (
    <tr 
      className={`
        hover:bg-gray-50 dark:hover:bg-gray-800 
        transition-colors
        ${striped ? 'odd:bg-white dark:odd:bg-gray-900 even:bg-gray-50 dark:even:bg-gray-800' : ''}
        ${className}
      `} 
      onClick={onClick} 
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = "" }) {
  return (
    <th
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = "" }) {
  return (
    <td
      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${className}`}
    >
      {children}
    </td>
  );
}