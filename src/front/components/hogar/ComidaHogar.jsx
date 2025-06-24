import useGlobalReducer from "../../hooks/useGlobalReducer"
import { RecetaCard } from "../comida/RecetaCard"

export const ComidaHogar = () => {

    const { store, dispatch } = useGlobalReducer()
    const ratingSums = {};

    store.hogar?.users?.forEach(user => {
        const ratings = user.deseado_recetas || {};
        Object.entries(ratings).forEach(([recetaId, rating]) => {
            ratingSums[recetaId] = (ratingSums[recetaId] || 0) + rating;
        });
    });

    const sortedRecetaIds = Object.entries(ratingSums)
        .filter(([, sum]) => sum > 0)
        .sort(([, aRating], [, bRating]) => bRating - aRating)
        .map(([id]) => id);

    return (
        <>
            <h3 className="text-center ivory text-outline">Recetas</h3><p className="text-center charcoal">ordenadas por preferencia del hogar</p>
            {sortedRecetaIds.length > 0 ? (
                <div className="search-results mt-4">
                    <div className="row g-3 justify-content-center">
                        {sortedRecetaIds.map((id) => (
                            <div
                                key={id}
                                className="col-12 col-md-6 col-lg-6 h-100 d-flex justify-content-center"
                            >
                                <RecetaCard id={id} />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-center mt-4">Nadie ha marcado recetas todavía.</p>
            )}
        </>
    )
}