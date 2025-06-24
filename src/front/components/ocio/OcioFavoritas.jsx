import useGlobalReducer from "../../hooks/useGlobalReducer"
import { MovieCard } from "./MovieCard";

export const OcioFavoritas = () => {
  const { store } = useGlobalReducer()
  const favoritos = store.user?.favorito_peliculas || [];

  return (
    <>
      <h3 className="text-center ivory text-outline">Mis favoritas</h3>
            {favoritos.length > 0 && (
                <div className="search-results mt-4">
                    <div className="row g-3 justify-content-center">
                        {favoritos.map((id) => (
                            <div
                                key={id}
                                className="col-12 col-sm-6 col-md-4 col-lg-3"
                            >
                                <MovieCard id={id} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
    </>
  );
};
