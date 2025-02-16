import { NavLink } from "react-router-dom"

export const Navbar = () => {
    return (
    <nav>
        <ul className="flex justify-center items-center gap-10 text-white text-2xl">
            <li>
                <NavLink to="/favoris">Favoris</NavLink>
            </li>
            <li>
                <NavLink to="/competitions">Compétitions</NavLink>
            </li>
            <li>
                <NavLink to="/connexion">Connexion</NavLink>
            </li>
        </ul>
    </nav>
    )
}