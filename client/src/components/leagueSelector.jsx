import { useEffect, useState } from "react";

const apiURL = import.meta.env.VITE_API_URL;

export const SelectorLeague = () => {

    const [leagues, setleagues] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState('');

    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedLeague(selectedValue);
    }
    
    useEffect(() => {
        const fetchAllCompetitions = async () => {
            try {
            const response = await fetch(`${apiURL}/competitions`);
            if(!response.ok){
              throw new Error('Impossible d\'acceder à la reponse');
            }
            const result = await response.json();
            // Je filtre result pour récupérer les noms des ligues et 
            // je fais une copie avec map pour obtenir les noms dans un nouveau tableau
            const filteredLeague = result.competitions
                .filter(league => league.name)
                .map(league => ({
                    name: league.name,
                    code: league.code
                }));
            setleagues(filteredLeague);
            console.log(filteredLeague)
            } catch (error) {
            console.error('Error fetching data:', error);
            }
        }
    fetchAllCompetitions()
    }, []);

    useEffect(() => {
        if(selectedLeague){
            const fetchTeams = async () => {
                try {
                    console.log('>>>>>', `${apiURL}/competitions/${selectedLeague}/teams`)
                    const response = await fetch(`${apiURL}/competitions/${selectedLeague}/teams`);
                    console.log('Fetching teams with URL:', response)
                    // if(!response.ok){
                    //     throw new Error('Impossible d\'acceder à la réponse');
                    // }

                    const result = await response.json();
                    //console.log('result: ',result.teams)
                    const teams = result.teams
                        .filter(team => team.name)
                    setTeams(teams)
                    console.log('teams', teams)
                } catch (error){
                    console.error('Error fetching data:', error);
                }
            }
        fetchTeams()
        }
    }, [selectedLeague])

    return <>
        <select value={selectedLeague} onChange={handleSelectChange} name="selected league" className="border border-gray-600 rounded-sm text-white w-50">
            {leagues.map((data, i) => (
                <option key={i} value={data.code} className="text-black">{data.name}</option>
            ))}
        </select>

        <select name="selected teams" id="" className="border border-gray-600 rounded-sm text-white w-50">
            {teams.map((team, i) => (
                <option key={i} value={team} className="text-black">{team.name}</option>
            ))}
        </select>
        
    </>
}