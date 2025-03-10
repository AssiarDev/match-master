//import { SelectorLeague } from "./leagueSelector";
import { Navbar } from "./forms/Navbar";
import { SearchBar } from "./forms/Searchbar";
//import { useNavigate } from "react-router";

export const Home = () => {

    //const navigate = useNavigate()

    return (
        <>
            <div className="h-20 w-full fixed border-none shadow-lg shadow-amber-900/50 flex items-center items-center justify-between">
                <h1 className="font-sans text-4xl font-bold text-white mx-2">Match Master</h1>
                <Navbar />
                <SearchBar />
            </div>
            {/* <div className="w-full min-h-screen flex flex-col justify-center items-center">
            <div className="w-150 h-80 bg-stone-950 border border-stone-800 shadow-xl rounded-lg flex flex-col justify-center items-center gap-2">
            <div className="w-full flex justify-center text-white text-3xl font-medium">
                    <h2>Choissisez votre équipe favorite</h2>
            </div>
            <div className="flex flex-col w-full justify-center items-center gap-2">
                <label htmlFor="league-selector" className="text-white text-xl">Choisissez le championnat :</label>
                <SelectorLeague />
            </div>
            {/* <div className="w-full h-10 flex justify-center items-center mt-6">
                <button className="border border-stone-800 bg-orange-700 hover:bg-orange-600 w-60 h-15 rounded-md text-white text-xl cursor-pointer" onClick={() => navigate('competitions')}>Entrer</button>
            </div> }
            </div>
            </div> */}
        </>
    )
}