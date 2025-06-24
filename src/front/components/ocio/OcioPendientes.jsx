import useGlobalReducer from "../../hooks/useGlobalReducer"
import { MovieCard } from "./MovieCard";

export const OcioPendientes = () => {
  const { store } = useGlobalReducer()
  const deseado = store.user?.deseado_peliculas || {};
  const ids = Object.keys(deseado).filter((id) => deseado[id] > 0);

  return (
    <>
            <h3 className="text-center ivory text-outline">Películas y series que quiero ver</h3>
            {ids.length > 0 && (
                <div className="search-results mt-4">
                    <div className="row g-3 justify-content-center">
                        {ids.map((id) => (
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
