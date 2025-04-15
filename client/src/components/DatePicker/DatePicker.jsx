import ReactDatePicker from 'react-date-picker'

export const DatePicker = ({selectedDate, setSelectedDate}) => {
    return (
            <ReactDatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                className="border rounded p-2"
            />
    )
}