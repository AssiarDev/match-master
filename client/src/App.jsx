import { Input } from "./components/forms/input"
import { useState, useEffect } from "react";
import logo from './assets/menu.svg';

const apiUrl = import.meta.env.VITE_API_URL

function App() {

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAllCompetitions = async () => {
      try {
        const response = await fetch(`${apiUrl}/competitions`);
        if(!response.ok){
          throw new Error('Impossible d\'acceder à la reponse');
        }
        const result = await response.json()
        console.log(result)
        setData(result)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchAllCompetitions()
  }, [])

  return (
    <>
    <div className="h-20 w-full border-none shadow-md flex justify-between items-center">
      <SearchBar />
      <div className=" w-full flex justify-center">
        <h1 className="font-sans text-4xl font-bold text-white">Match Master</h1>
      </div>
      <div>
        <img src={logo} alt="Menu hamberger" className="svg-color-white"/>
      </div>
    </div>
        {/* {data ? <p>{data.competition}</p> : <p>Loading...</p>} */}
    </>
  )
}

const SearchBar = () => {
  return <div>
      <Input value="" Onchange={() => null} placeholder="Rechercher..."/>
  </div>
}

export default App
