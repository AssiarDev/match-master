import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const apiURL = import.meta.env.VITE_API_URL;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const MatchsDetails = () => {

    const { teamId } = useParams();
    const [ matchDetails, setMatchDetails ] = useState(null);
    const [competitionName, setCompetitionName] = useState([]);

    const fetchWithThrottle = useCallback(async (urls, limit) => {
        const results = [];
        const interval = 50000 / limit;

        for(let i = 0; i < urls.length; i++){
            const url = urls[i];
            try {
                const response = await fetch(url);
                if(!response.ok){
                    throw new Error('Error fetching data')
                }
                const text = await response.text();
                const result = JSON.parse(text);
                results.push(result);
            } catch (e){
                console.error('Erreur pour l\'url: ', url, e)
            }
            await delay(interval)
        }
        return results
    }, []);

    useEffect (() => {
        const fetchChampionshipIds = async () => {
            try {
                const response = await fetch(`${apiURL}/competitions`);
                if (!response.ok) {
                    throw new Error('Impossible d\'accéder aux compétitions');
                }
                const text = await response.text();
                if (text.startsWith('<')) {
                    console.error('Received HTML response instead of JSON:', text);
                    return [];
                }
                const result = JSON.parse(text);
                const ids = result.competitions.map(comp => comp.id);
                console.log('Championship IDs:', ids);
                return ids;
            } catch (error) {
                console.error('Error fetching championship IDs: ', error);
                return [];
            }
        };

        const fetchMatchDetails = async (ids) => {
            try {
                
                const urls = ids.map(id => `${apiURL}/competitions/${id}/matches?status=SCHEDULED`);
                const results = await fetchWithThrottle(urls, 10);
                const combinedResults = results.flatMap(result => result.matches);
                const combinedNames = results.map(result => result.competition.name);

                // const scheduledMatches = combinedResults.filter(match => match.status === 'SCHEDULED');
                // console.log('scheduled matches:', scheduledMatches);

                console.log('combined results: ', combinedResults);
                setMatchDetails(combinedResults);
                console.log('combinateName: ', combinedNames)
                setCompetitionName(combinedNames)

            } catch(error) {
                console.error('Error fetching details: ', error)
            }
        }
        const fetchData = async () => {
            const championshipIds = await fetchChampionshipIds();
            if (championshipIds.length > 0) {
                fetchMatchDetails(championshipIds);
            }
        };
        fetchData()
    }, [teamId, fetchWithThrottle])


    return <div className='flex flex-col gap-5 mx-2'>
            {competitionName.map((name, i) => (
                <h1 key={i} className="text-white text-3xl">{name}</h1>
            ))}
            
        </div>
}