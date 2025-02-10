import { useEffect, useState } from "react";

const apiURL = import.meta.env.VITE_API_URL;

export const SelectorLeague = () => {

    const [data, setData] = useState([]);
    
      useEffect(() => {
        const fetchAllCompetitions = async () => {
            
            try {
            const response = await fetch(`${apiURL}/competitions`);
            if(!response.ok){
              throw new Error('Impossible d\'acceder à la reponse');
            }
            const result = await response.json();
            const filteredLeague = result.competitions
                .filter(league => league.name)
                .map(league => league.name);
            setData(filteredLeague);
            } catch (error) {
            console.error('Error fetching data:', error);
            }
        }
        fetchAllCompetitions()
      }, [])

    return <>
        <select onChange={() => null} name="selected league" className="border border-white text-white">
            {data.map((data, i) => (
                <option key={i} value={data} className="text-black">{data}</option>
            ))}
        </select>
    </>
}