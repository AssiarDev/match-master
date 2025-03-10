import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const apiURL = import.meta.env.VITE_API_URL;

 // TODO : TROUVER COMMENT AFFICHER LES LOGOS DES CLUBS DANS LES SELECTS

 export const SelectorLeague = () => {

    const navigate = useNavigate()

    const [leagues, setleagues] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState('');
    const [selectedTeamId, setSelectedTeamId] = useState('');

    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedLeague(selectedValue);
    }

    const handleSelectedTeamChange = (e) => {
        const selectedTeamId = e.target.value;
        setSelectedTeamId(selectedTeamId)
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
                    code: league.code, 
                    logo: league.emblem
                }));
            setleagues(filteredLeague);
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
                    const response = await fetch(`${apiURL}/competitions/${selectedLeague}/teams`);
                    const result = await response.json();
                    const teams = result.teams
                        // .filter(team => team.name)
                        .map(ligue => ({
                            name: ligue.name, 
                            id: ligue.id
                        }))
                    console.log('teams: ', teams)
                    setTeams(teams)
                } catch (error){
                    console.error('Error fetching data:', error);
                }
            }
        fetchTeams()
        }
    }, [selectedLeague])

    const handleNavigate = () => {
        if(selectedLeague && teams){
            navigate(`/v4/teams/${selectedTeamId}`);
        } else {
            alert('Veuillez selectionner un championnat et une équipe')
        }
    }

    return <div className="flex flex-col gap-3 w-full items-center">
        <select value={selectedLeague} onChange={handleSelectChange} name="selected league" className="border border-stone-800 rounded-sm text-white w-80 h-10">
            {leagues.map((data, i) => (
                <option key={i} value={data.code} className="text-black">
                    {data.name}
                </option>
            ))}
        </select>

        <select value={selectedTeamId} onChange={handleSelectedTeamChange} name="selected teams"  className="border border-stone-800 rounded-sm text-white w-80 h-10">
            {teams.map((team, i) => (
                <option key={i} value={team.id} className="text-black">{team.name}</option>
            ))}
        </select>
        <button className="border border-stone-800 bg-orange-700 hover:bg-orange-600 w-60 h-15 rounded-md text-white text-xl cursor-pointer" onClick={handleNavigate}>Entrer</button>
    </div>     
}