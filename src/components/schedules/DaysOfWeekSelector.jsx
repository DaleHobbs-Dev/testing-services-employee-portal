const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function DaysOfWeekSelector({ selectedDays, onChange }) {
  const toggleDay = (day) => {
    onChange(
      selectedDays.includes(day)
        ? selectedDays.filter((d) => d !== day)
        : [...selectedDays, day]
    );
  };

  return (
    <div>
      <p className="text-sm font-medium mb-2">Work Days</p>
      <div className="flex flex-wrap gap-3">
        {DAYS.map((day) => (
          <label key={day} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedDays.includes(day)}
              onChange={() => toggleDay(day)}
            />
            <span className="text-sm">{day}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
