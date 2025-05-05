import { Link, useParams } from "react-router-dom"

export const Navbar = () => {
    //const {teamId} = useParams()
    return (
    <nav >
        <ul className="flex justify-center items-center gap-10 text-white text-2xl">
            <li>
                <Link to={`/competitions/2015/matches`}>Matchs</Link>
            </li>
            <li>
                <Link to="/competitions">Compétitions</Link>
            </li>
            <li>
                <Link to="/login">Se connecter</Link>
            </li>
            <li>
                <Link to="favoris">Favoris</Link>
            </li>
        </ul>
    </nav>
    )
}