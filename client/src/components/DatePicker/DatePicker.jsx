import ReactDatePicker from 'react-date-picker'

export const DatePicker = ({selectedDate, setSelectedDate}) => {
    return (
            <ReactDatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd EEEE"
                className="w-40 text-center bg-stone-800 text-white py-2 rounded-md shadow-md"
                renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                    <div className="flex justify-between items-center mb-2">
                        <button onClick={decreaseMonth} className="text-white">←</button>
                        <span className="text-white font-bold">{date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                        <button onClick={increaseMonth} className="text-white">→</button>
                    </div>
    )}
    />
);
}