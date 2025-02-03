import { useState, useEffect } from 'react'
import './App.css'

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
        const response = await fetch("/competitions/FL1/teams");
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
    <h1>Data from Express API</h1>
      {data ? <p>{data}</p> : <p>Loading...</p>}
    </>
  )
}

export default App
