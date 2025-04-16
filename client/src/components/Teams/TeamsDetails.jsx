import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { ClassmentThead } from "../Classement/ClassementThead";
import { ClassementTbody } from "../Classement/ClassementTbody";
// import { DatePicker } from "../DatePicker/DatePicker";
import { DatePickerCarousel } from "../DatePicker/DatePickerCaroussel";

export const TeamsDetails = () => {
    const { teamId } = useParams();
    const [team, setTeam] = useState([]);
    const [standings, setStandings] = useState([]);
    const location = useLocation();
    const selectedLeague = location.state?.selectedLeague
    const [selectedDate, setSelectedDate] = useState(new Date());
    console.log('setSelectedDate :', selectedDate)

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/teams/${teamId}`);
                if(!response.ok){
                    throw new Error('Impossible d\'accéder à la reponse')
                };
                const result = await response.json();
                console.log('result team :', result);
                setTeam(result)

            } catch(e){
                console.error('Error fetching data :', e.message)
            }
        }
        fetchTeam();
    }, [teamId])

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/standings/${selectedLeague}`);
                if(!response.ok){
                    throw new Error('Impossible d\'accéder à la reponse')
                };
                const result = await response.json();
                console.log('result standings :', result);
                setStandings(result)
            } catch(e){
                console.error('Error fetching data :', e.message)
            }
        }
        fetchStandings()
    }, [selectedLeague])
    return <div className="w-full flex flex-col justify-center items-center text-white text-2xl font-medium overflow-hidden">
         <div className="w-100 flex justify-center items-center h-15 bg-stone-800 border border-stone-800 rounded-lg text-white flex items-center justify-center gap-3">{team.name} <img src={team.emblem} alt={`${team.name} emblem`} className="h-10"/></div>
         <div className="w-full flex justify-start mt-5 ml-5">
            <table className="table-auto border-collapse rounded-lg border border-gray-700 text-sm text-gray-200 shadow-lg">
                <ClassmentThead />
                {standings.map(item => <ClassementTbody key={item.position} item={item} teamId={teamId}/>)}
            </table>
         </div>
         <div className=" w-full flex justify-center mt-5">
            {/* <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} /> */}
            <DatePickerCarousel selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
         </div>

    </div>
   
}