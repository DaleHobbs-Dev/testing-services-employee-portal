export function Container({ children, className = "", wide = false }) {
  const maxWidth = wide ? "max-w-7xl 2xl:max-w-[96rem]" : "max-w-7xl";

  return (
    <div className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 py-2 ${className}`}>
      {children}
    </div>
  );
}
