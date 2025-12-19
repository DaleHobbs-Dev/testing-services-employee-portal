export function IconWrapper({ children, className = "" }) {
  return (
    <div className={`dark:bg-primary-dark/05 p-2 rounded-lg m-1 ${className}`}>
      <div className="text-primary-dark dark:text-primary-light">
        {children}
      </div>
    </div>
  );
}