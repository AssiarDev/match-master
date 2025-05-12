import { useState, useEffect } from "react";
import { Link } from "react-router-dom"

export const Navbar = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Vérification après rechargement, isAuthenticated :", data.isAuthenticated);
                    setIsAuthenticated(data.isAuthenticated);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Erreur d'authentification :", error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

        const handleLogout = async () => {
        try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
            method: "POST",
            credentials: "include", 
        });

        if (!response.ok) throw new Error("Erreur lors de la déconnexion");

        setIsAuthenticated(false);
        setTimeout(() => {
            console.log("Déconnexion réussie, isAuthenticated :", isAuthenticated);
            window.location.href = "/login";
        }, 300);

    } catch (error) {
        console.error("Échec de la déconnexion :", error);
    }
    }
    
    return (
    <nav >
        <ul className="flex justify-center items-center gap-10 text-white text-2xl">
            <li>
                <Link to="/live">Live</Link>
            </li>
            <li>
                <Link to="/competitions">Compétitions</Link>
            </li>
            <li>
                {isAuthenticated ? (
                        <button
                            className="border border-red-500 bg-orange-700 hover:bg-orange-600 text-white px-2 py-1 rounded-md cursor-pointer"
                            onClick={handleLogout}
                        >
                            Déconnexion
                        </button>
                    ) : (
                        <Link to="/login">Se connecter</Link>
                    )}
            </li>
            <li>
                <Link to="favoris">Favoris</Link>
            </li>
        </ul>
    </nav>
    )
}