export function Table({ children, className = "" }) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }) {
  return <thead className=" ">{children}</thead>;
}

export function TableBody({ children }) {
  return (
    <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
  );
}

export function TableRow({ children, className = "", onClick, ...props }) {
  return (
    <tr className={className} onClick={onClick} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className = "" }) {
  return (
    <th
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = "" }) {
  return (
    <td
      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}
    >
      {children}
    </td>
  );
}
