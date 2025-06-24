import { useEffect, useState } from "react";
import userServices from "../../services/userServices";
import omdbApi from "../../services/omdbApi";
import "../../styles/Ocio.css";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Rating } from "../modals/rating";
import { Detalle } from "../Detalle";

export const MovieCard = ({ id }) => {
    const { store, dispatch } = useGlobalReducer();
    const [showRating, setShowRating] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const userId = store.user?.id;
    const movie = store.moviesById?.[id];

    useEffect(() => {
        const isMissingDetails = !movie?.title || !movie?.image || !movie?.year;

        if (isMissingDetails) {
            omdbApi.getMovieById(id)
                .then((data) => {
                    if (data) {
                        const payload = {
                            id: data.imdbID,
                            title: data.Title,
                            image: data.Poster !== "N/A" ? data.Poster : null,
                            year: data.Year,
                            genre: data.Genre,
                            imdbRating: data.imdbRating,
                        };

                        dispatch({ type: "ADD_MOVIE", payload });
                    }
                })
                .catch((err) => {
                    console.error("Error fetching movie:", err);
                });
        }
    }, [id, movie, dispatch]);

    if (!movie) return null;

    const favoritos = Array.isArray(store.user?.favorito_peliculas)
        ? store.user.favorito_peliculas
        : [];
    const moviesDeseadas = store.user?.deseado_peliculas || {};

    const isFavorite = favoritos.includes(movie.id);
    const isLiked = moviesDeseadas.hasOwnProperty(movie.id);
    const currentRating = moviesDeseadas[movie.id] || null;

    const toggleFavorite = async () => {
        const isAlreadyFavorite = favoritos.includes(movie.id);
        const updatedFavoritos = isAlreadyFavorite
            ? favoritos.filter((id) => id !== movie.id)
            : [...favoritos, movie.id];

        dispatch({ type: "UPDATE_MOVIE_FAVORITA", payload: updatedFavoritos });
        try {
            await userServices.updateuser(userId, { favorito_peliculas: updatedFavoritos });
        } catch (err) {
            console.error("Error updating favoritos:", err);
        }
    };

    const handleRatingChange = async (ratingValue) => {
        const current = moviesDeseadas[movie.id];
        if (current !== ratingValue) {
            const updated = {
                ...moviesDeseadas,
                [movie.id]: ratingValue,
            };

            dispatch({
                type: "ADD_MOVIE_DESEADA",
                payload: { id: movie.id, rating: ratingValue },
            });

            try {
                await userServices.updateuser(userId, { deseado_peliculas: updated });
            } catch (err) {
                console.error("Error saving deseado_peliculas:", err);
            }
        }
        setShowRating(false);
        setTimeout(() => document.activeElement.blur(), 0);
    };

    return (
        <>
            <div className="movie-card m-2">

                <div
                    className="card-body small d-flex flex-column justify-content-between h-100"
                    onClick={() => setShowModal(true)}
                >
                    <div className="d-flex flex-column justify-content-between h-100">
                        <div className="d-flex align-items-center justify-content-center h-100">
                            <h6 className="card-title text-center fw-bold m-0">{movie.title} ({movie.year})</h6>
                        </div>
                        <div className="row justify-content-center gap-3">
                            <div className="col-6 text-center mt-2">
                                {movie.image && (
                                    <img src={movie.image} alt={movie.title} />
                                )}
                            </div>
                            <div className="col-4 d-flex flex-column align-items-center justify-content-center mt-2">
                                {movie.imdbRating != null && movie.imdbRating != "N/A" && (
                                    <>
                                        <p className="text-center"><span className="fa-solid charcoal fa-star me-2"></span> {movie.imdbRating}/10</p>
                                    </>
                                )}
                                {movie.genre != null && (
                                    <>
                                        <p className="text-center"> {movie.genre}</p>
                                    </>
                                )}
                            </div>


                        </div>
                    </div>
                </div>
                <div className="card-footer d-flex justify-content-around align-items-center mt-2">
                    <button className="btn btn-sm" onClick={() => setShowRating(true)} title="Me gusta">
                        <span className={`fa-${isLiked ? "solid" : "regular"} fa-thumbs-up fa-2x
              ${currentRating <= 0
                                ? "ochre"
                                : "aqua"
                            }`}></span>
                    </button>
                    <button className="btn btn-sm" onClick={toggleFavorite} title="Favorito">
                        <span className={`fa fa-${isFavorite ? "solid" : "regular"} fa-heart fa-2x coral`}></span>
                    </button>
                </div>
            </div>

            {showModal && movie?.id && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    role="dialog"
                    onClick={() => setShowModal(false)}
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content bg-aqua border-charcoal p-3">
                            <div className="modal-header border-0">
                                <h2 className="modal-title flex-grow-1 text-center">{movie.title}</h2>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                />
                            </div>
                            <div className="modal-body">
                                {movie?.id ? (
                                    <Detalle id={movie.id} />
                                ) : (
                                    <div className="text-center p-4">Cargando detalles…</div>
                                )}
                            </div>
                            <div className="modal-footer border-0 d-flex justify-content-center align-items-center mt-2">
                                <button
                                    className="btn btn-sm"
                                    onClick={() => setShowRating(true)}
                                    title="Me gusta"
                                >
                                    <span className={`fa-${isLiked ? "solid" : "regular"} fa-thumbs-up fa-2x
                                    ${currentRating <= 0 ? "ochre" : "sage"}`}
                                    ></span>
                                </button>
                                <button className="btn btn-sm" onClick={toggleFavorite} title="Favorito">
                                    <span className={`fa fa-${isFavorite ? "solid" : "regular"} fa-heart fa-2x coral`}></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Rating
                id={id}
                onRate={handleRatingChange}
                show={showRating}
                onClose={() => setShowRating(false)}
            />
        </>
    );
};
