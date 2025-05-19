import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { MatchCard } from "../Matchs/MatchCard";
import { ClassmentThead } from "../Classement/ClassementThead";
import { ClassementTbody } from "../Classement/ClassementTbody";

export const Resume = () => {
    const location = useLocation();
    const id = location.state?.competition.id;
    const [matchs, setMatchs] = useState([]);
    const [standings, setStandings] = useState([]);

    useEffect(() => {
        const fetchMatchs = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/competitions/${id}/matches`);

                if(!response.ok){
                    throw new Error('Impossible d\'accéder à la response');
                }

                const result = await response.json();
                const finishedMatchs = result.matches.filter(match => match.status === "FINISHED");
                const sortedMatchs = finishedMatchs.sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));
                const last5Matchs = sortedMatchs.slice(0, 5);

                setMatchs(last5Matchs);

            } catch(e){
                console.error('Impossible de récupérer les infos sur les matches', e.message)
            }
        }
        fetchMatchs();
    }, [id]);

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/standings/${id}`);
                if(!response.ok){
                    throw new Error('Impossible d\'accéder à la reponse');
                };
                const result = await response.json();
                setStandings(result)
            } catch(e){
                console.error('Error fetching data :', e.message)
            }
        }
        fetchStandings()
    }, [id]);

    const podiumTeams = standings.slice(0, 3); // récupérer les 3 premiers du classement

    return (
        <div className="min-h-screen w-250 flex flex-col mx-auto gap-5">
            <div className="flex flex-col justify-center">
                <h1 className="font-bold text-left self-start ">Derniers matchs</h1>
                <div className="flex items-center overflow-x-auto flex-nowrap gap-x-4">
                    {matchs.map(match => (
                        <MatchCard key={match.id} item={match} className="min-w-[200px]"/>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-5">
                <h1 className="font-bold">Podium</h1>
                <table className="rounded-sm">
                    <ClassmentThead />
                    {podiumTeams.map(item => <ClassementTbody key={item.position} item={item} />)}
                </table>
            </div>
        </div>
    );
};
