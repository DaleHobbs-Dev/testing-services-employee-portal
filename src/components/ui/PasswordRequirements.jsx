export function RequirementIndicator({ met, children, className = "" }) {
  return (
    <div
      className={`flex items-center justify-between rounded border px-3 py-2 text-sm ${
        met
          ? "border-green-300 bg-green-50 text-green-700"
          : "border-gray-200 bg-gray-50 text-gray-600"
      } ${className}`}
    >
      <span>{children}</span>
      <span className="font-semibold">{met ? "Met" : "Pending"}</span>
    </div>
  );
}

export function PasswordRequirements({ requirements }) {
  return (
    <div className="mb-4 space-y-2">
      {requirements.map((rule) => (
        <RequirementIndicator key={rule.id} met={rule.met}>
          {rule.label}
        </RequirementIndicator>
      ))}
    </div>
  );
}
