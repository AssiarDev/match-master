import logo from '../../assets/search.png';

// eslint-disable-next-line react/prop-types
export const Input = ({placeholder, value, onChange}) => {
    return <div className='relative text-white'>
        <input 
            className="border-1 border-gray-600 placeholder-white rounded-sm px-2 py-1 mx-2"
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
        />
        <img src={logo} alt='logo search' className='h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2'/>
    </div>
}