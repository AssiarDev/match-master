export const Input = ({placeholder, value, onChange}) => {
    return <div>
        <input 
            className="border-1 border-white placeholder-white rounded-sm px-5"
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
}