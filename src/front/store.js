export const initialStore = () => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  if (user) {
    user.favorito_recetas = [];
    user.deseado_recetas = {};
    user.favorito_peliculas = [];
    user.deseado_peliculas = {};
    localStorage.setItem("user", JSON.stringify(user));
  }

  const hogarString = localStorage.getItem("hogar");
  const hogar = hogarString ? JSON.parse(hogarString) : null;

  const tasksString = localStorage.getItem("tasks");
  const tasks = tasksString ? JSON.parse(tasksString) : [];

  const gastosString = localStorage.getItem("gastos");
  const gastos = gastosString ? JSON.parse(gastosString) : [];

  return {
    message: null,
    user,
    hogar,
    token: localStorage.getItem("token") || null,
    recetasById: {},
    recetasSearch: [],
    moviesById: {},
    moviesSearch: [],
    tasks,
    gastos,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "login_success":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("hogar", JSON.stringify(action.payload.hogar));
      return {
        ...store,
        user: action.payload.user,
        hogar: action.payload.hogar,
        token: action.payload.token,
      };

    case "logout":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("hogar");
      return initialStore();

    case "update_user":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...store,
        user: action.payload,
      };

    case "update_member":
      localStorage.setItem("hogar", JSON.stringify(action.payload));
      return {
        ...store,
        hogar: {
          ...store.hogar,
          users: store.hogar.users.map((u) =>
            u.id === action.payload.id ? action.payload : u
          ),
        },
      };

    case "remove_member":
      localStorage.setItem("hogar", JSON.stringify(action.payload));
      return {
        ...store,
        hogar: {
          ...store.hogar,
          users: store.hogar.users.filter((u) => u.id !== action.payload),
        },
      };

    case "update_hogar":
      localStorage.setItem("hogar", JSON.stringify(action.payload));
      return {
        ...store,
        hogar: action.payload,
      };

    case "set_hello": {
      const newTasks = [...(store.tasks || []), action.payload];
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      return {
        ...store,
        tasks: newTasks,
      };
    }

    case "logout":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("hogar");
      return initialStore();

    case "add_task": {
      const newTasks = [...(store.tasks || []), action.payload];
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      return {
        ...store,
        tasks: newTasks,
      };
    }

    case "delete_task": {
      const newTasks = store.tasks.filter((_, i) => i !== action.payload);
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      return {
        ...store,
        tasks: newTasks,
      };
    }

    case "edit_task": {
      const newTasks = store.tasks.map((task, i) =>
        i === action.payload.index ? action.payload.updatedTask : task
      );
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      return {
        ...store,
        tasks: newTasks,
      };
    }

    case "toggle_task_done": {
      const newTasks = store.tasks.map((task, i) =>
        i === action.payload ? { ...task, hecha: !task.hecha } : task
      );
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      return {
        ...store,
        tasks: newTasks,
      };
    }

    case "set_gasto":
      localStorage.setItem("gastos", JSON.stringify(action.payload));
      return {
        ...store,
        gastos: action.payload,
      };

    case "delete_gasto":
      const gastoEliminado = store.gastos.filter(
        (g) => g.id !== action.payload
      );
      localStorage.setItem("gastos", JSON.stringify(gastoEliminado));
      return {
        ...store,
        gastos: gastoEliminado,
      };

    case "update_gasto":
      const gastoActualizados = store.gastos.map((g) =>
        g.id === action.payload.id ? action.payload : g
      );
      localStorage.setItem("gastos", JSON.stringify(gastoActualizados));
      return {
        ...store,
        gastos: gastoActualizados,
      };

    case "SET_RECETA_SEARCH_RESULTS":
      return {
        ...store,
        recetasSearch: action.payload.map((r) => r.id),
        recetasById: {
          ...store.recetasById,
          ...action.payload.reduce((acc, r) => {
            acc[r.id] = r;
            return acc;
          }, {}),
        },
      };

    case "ADD_RECETA":
      return {
        ...store,
        recetasById: {
          ...store.recetasById,
          [action.payload.id]: {
            ...(store.recetasById?.[action.payload.id] || {}),
            ...action.payload,
          },
        },
      };

    case "UPDATE_RECETA_FAVORITA":
      const updatedUser = {
        ...store.user,
        favorito_recetas: action.payload,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return {
        ...store,
        user: updatedUser,
      };

    case "ADD_RECETA_DESEADA":
      const currentRating = store.user?.deseado_recetas?.[action.payload.id];
      if (currentRating === action.payload.rating) return store;
      return {
        ...store,
        user: {
          ...store.user,
          deseado_recetas: {
            ...(store.user?.deseado_recetas || {}),
            [action.payload.id]: action.payload.rating,
          },
        },
        hogar: {
          ...store.hogar,
          users: store.hogar.users.map((u) =>
            u.id === store.user.id
              ? {
                  ...u,
                  deseado_recetas: {
                    ...(u.deseado_recetas || {}),
                    [action.payload.id]: action.payload.rating,
                  },
                }
              : u
          ),
        },
      };

    case "SET_MOVIE_SEARCH_RESULTS":
      return {
        ...store,
        moviesSearch: action.payload.map((m) => m.id),
        moviesById: {
          ...store.moviesById,
          ...action.payload.reduce((acc, m) => {
            acc[m.id] = m;
            return acc;
          }, {}),
        },
      };

    case "ADD_MOVIE":
      return {
        ...store,
        moviesById: {
          ...store.moviesById,
          [action.payload.id]: {
            ...(store.moviesById?.[action.payload.id] || {}),
            ...action.payload,
          },
        },
      };

    case "UPDATE_MOVIE_FAVORITA":
      const updatedUserMovie = {
        ...store.user,
        favorito_peliculas: action.payload,
      };
      console.log("Reducer ran: UPDATE_MOVIE_FAVORITA", action.payload);
      localStorage.setItem("user", JSON.stringify(updatedUserMovie));
      return {
        ...store,
        user: updatedUserMovie,
      };

    case "ADD_MOVIE_DESEADA":
      const currentRatingMovie =
        store.user?.deseado_peliculas?.[action.payload.id];
      if (currentRatingMovie === action.payload.rating) return store;
      return {
        ...store,
        user: {
          ...store.user,
          deseado_peliculas: {
            ...(store.user?.deseado_peliculas || {}),
            [action.payload.id]: action.payload.rating,
          },
        },
        hogar: {
          ...store.hogar,
          users: store.hogar.users.map((u) =>
            u.id === store.user.id
              ? {
                  ...u,
                  deseado_peliculas: {
                    ...(u.deseado_peliculas || {}),
                    [action.payload.id]: action.payload.rating,
                  },
                }
              : u
          ),
        },
      };

    default:
      return store;
  }
}
