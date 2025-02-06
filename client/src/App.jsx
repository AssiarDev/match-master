//import { useState, useEffect } from 'react';
import { Input } from "./components/forms/input"
import { useState, useEffect } from "react";
import logo from './assets/menu.svg'

function App() {
  // const [message, setMessage] = useState(null);

  // useEffect(() => {
  //   const fetchAPITest = async () => {
  //     try {
  //       const response = await fetch("/api");
  //       if(!response.ok){
  //         throw new Error('Impossible d\'acceder à la reponse')
  //       }
  //       const result = await response.text()
  //       setMessage(result)
  //     } catch (error) {
  //     console.error('Error fetching data:', error)
  //   }
  //   };
  //   fetchAPITest()
  // }, []);

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const response = await fetch("http://localhost:3000/competitions/FL1/teams");
        if(!response.ok){
          throw new Error('Impossible d\'acceder à la reponse');
        }
        const result = await response.text()
        setData(result)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchAPI()
  }, [])

  return (
    <>
    <div className="h-20 w-100% border flex justify-between items-center p-5">
    <SearchBar />
    <h1 className="font-sans text-4xl bold text-white">Match Master</h1>
    <div className="svg-color-white">
    <img src={logo} alt="Menu hamberger" className="svg-color-white"/>
    </div>
    </div>
      {/* {data ? <p>{data}</p> : <p>Loading...</p>} */}
    </>
  )
}

const SearchBar = () => {
  return <div>
      <Input value="" Onchange={() => null} placeholder="Rechercher..."/>
  </div>
}

export default App
