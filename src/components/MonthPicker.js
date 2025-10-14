
"use client";

// Komponen ini menampilkan grid 12 bulan dan memungkinkan pemilihan.
export default function MonthPicker({ selectedMonth, onMonthChange }) {
  const months = [
    { value: 1, label: 'Jan' }, { value: 2, label: 'Feb' }, { value: 3, label: 'Mar' },
    { value: 4, label: 'Apr' }, { value: 5, label: 'Mei' }, { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' }, { value: 8, label: 'Agu' }, { value: 9, label: 'Sep' },
    { value: 10, label: 'Okt' }, { value: 11, label: 'Nov' }, { value: 12, label: 'Des' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 p-2">
      {months.map((month) => {
        const isSelected = month.value === selectedMonth;
        return (
          <button
            key={month.value}
            type="button"
            onClick={() => onMonthChange(month.value)}
            className={`
              p-2 rounded-md text-center text-sm font-semibold transition-colors
              ${isSelected 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'}
            `}
          >
            {month.label}
          </button>
        );
      })}
    </div>
  );
}
