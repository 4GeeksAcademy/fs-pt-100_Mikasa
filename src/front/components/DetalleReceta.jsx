
import { useEffect, useState } from "react";
import recetaServices from "../services/recetaServices";
import useGlobalReducer from "../hooks/useGlobalReducer";
import DOMPurify from "dompurify";

export const DetalleReceta = ({ id }) => {
  const { store, dispatch } = useGlobalReducer();
  const [receta, setReceta] = useState(null);
  const [loading, setLoading] = useState(!receta);

  useEffect(() => {
    if (!id) return null;
    if (!receta) {

      setLoading(true);
      recetaServices
        .getRecetaById(id)
        .then((data) => {
          dispatch({ type: "ADD_RECETA", payload: data });
          setReceta(data);
        })
        .catch((err) => console.error("Error fetching receta:", err))
        .finally(() => setLoading(false));
    }
  }, [id, receta, dispatch]);

  if (loading || !receta) {
    return <p>Cargando…</p>;
  }

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="d-flex justify-content-center h-100">
            {receta.image && (
              <img src={receta.image} alt={receta.title} className="recipe-img" />
            )}
          </div>
        </div>
        <div className="col">
          <p className="text-center">{receta.cuisines?.[0]}</p>
          {receta.servings != null && (
            <p className="text-center"><span className="fa-solid charcoal fa-users me-2"></span> <strong>Porciones:</strong> {receta.servings}</p>
          )}
          {receta.readyInMinutes != null && (
            <p className="text-center"><span className="fa-regular charcoal fa-clock me-2"></span> <strong>Listo en:</strong> {receta.readyInMinutes} min</p>
          )}
          {receta.healthScore != null && (
            <p className="text-center"><span className="fa-solid charcoal fa-apple-whole me-2"></span> <strong>Valor nutricional:</strong> {receta.healthScore} %</p>
          )}
          <p><strong>Ingredientes:</strong></p>
          <ul>
            {receta.extendedIngredients.map((ingredient, index) => (
              <li key={`${ingredient.id ?? ingredient.name}-${index}`}>
                {ingredient.original}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p><strong>Instrucciones:</strong></p>
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(receta.instructions || "")
        }}
      />
    </>
  );
};
