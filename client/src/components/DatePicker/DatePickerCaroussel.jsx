import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export const DatePickerCarousel = ({ selectedDate, setSelectedDate }) => {
    // Génère 15 jours avant et 15 jours après aujourd'hui
    const days = Array.from({ length: 30 }, (_, i) => {
        const day = new Date();
        day.setDate(day.getDate() + (i - 15)); // -15 pour les dates précédentes, +15 pour les prochaines
        return day;
    });
    const today = new Date();

    // Bouton précédent
    const PrevButton = ({ onClick }) => (
        <button
            className="absolute left-[-50px] top-[10%] text-white hover:bg-gray-800 rounded-sm px-2 py-2"
            onClick={onClick}
        >
            ←
        </button>
    );

    // Bouton suivant
    const NextButton = ({ onClick }) => (
        <button
            className="absolute right-[-50px] top-[10%] text-white hover:bg-gray-800 rounded-sm px-2 py-2"
            onClick={onClick}
        >
            →
        </button>
    );

    const settings = {
        infinite: true,
        slidesToShow: 3, // Affiche 3 dates visibles à la fois
        slidesToScroll: 1,
        centerMode: true, // Centre l'élément actif
        focusOnSelect: true, // Permet la sélection en cliquant
        prevArrow: <PrevButton />, // Bouton précédent personnalisé
        nextArrow: <NextButton />, // Bouton suivant personnalisé
    };

    return (
        <div className="w-100 relative">
            <Slider {...settings}>
                {days.map((day) => {
                    const isToday = day.toDateString() === today.toDateString();
                    return (
                        <div
                        key={day.toISOString()}
                        className={`py-1 text-center rounded-md shadow-lg mx-2 ${
                            selectedDate?.toDateString() === day.toDateString()
                                ? 'bg-orange-800 text-white font-bold'
                                : 'bg-stone-800 text-white'
                        }`}
                        onClick={() => setSelectedDate(day)}
                    >
                        <p className="text-xs text-white">{isToday ? "Aujourd'hui" : day.getDate()}</p>
                        <p className="text-xs text-white">{day.toLocaleDateString('fr-FR', { weekday: 'long' })}</p>
                    </div>
                    )
               
                })}
            </Slider>
        </div>
    );
};

