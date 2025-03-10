// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router';

// const apiURL = import.meta.env.VITE_API_URL;

// export const TeamDetails = () => {

//     const { leagueCode, teamId } = useParams();
//     const [ teamDetails, setTeamDetails ] = useState(null);

//     useEffect (() => {
//         const fetchTeamDetails = async (id) => {
//             try {
//                 const response = await fetch(`${apiURL}/v4/teams/${id}`);
//                 if(!response.ok){
//                     throw new Error('Impossible d\'acceder aux détails de l\'équipe');
//                 }
//                 const result = await response.json();
//                 console.log('result: ', result);
//                 setTeamDetails(result)
//             } catch(error) {
//                 console.error('Error fetching details: ', error)
//             }
//         }
//         fetchTeamDetails(teamId)
//     }, [teamId])


//     return <h1 className="text-white text-3xl">Compétitions</h1>
// }