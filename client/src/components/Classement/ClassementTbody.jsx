export const ClassementTbody = ({ item, teamId }) => {
    if (!item) {
        return <p>Aucune donnée disponible pour le classement.</p>;
    }

    const isSelected = item.team.id === Number(teamId);

    return <tbody>
            <tr className={`justify-center ${isSelected ? 'bg-orange-800 text-white font-bold' : ''}`}>
                <td className="px-4 py-2 text-center">{item.position}</td>
                <td className=" px-2 py-2 text-center flex gap-2"><img src={item.team.crest} alt={item.team.name} className="h-5"/> {item.team.shortName}</td>
                <td className="px-4 py-2 text-center">{item.points}</td>
                <td className="px-4 py-2 text-center">{item.playedGames}</td>
                <td className="px-4 py-2 text-center">{item.won}</td>
                <td className="px-4 py-2 text-center">{item.draw}</td>
                <td className="px-4 py-2 text-center">{item.lost}</td>
                <td className="px-4 py-2 text-center">{item.goalsFor}</td>
                <td className="px-4 py-2 text-center" >{item.goalsAgainst}</td>
                <td className="px-4 py-2 text-center">{item.goalDifference}</td>
            </tr>
        </tbody>
}