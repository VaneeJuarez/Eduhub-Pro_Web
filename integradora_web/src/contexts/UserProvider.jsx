import React, { useReducer, useContext } from "react";
import { USER_ACTIONS } from "../utils/config/enums";

// Definir el contexto del usuario
const UserContext = React.createContext();

// Proporciona el contexto
const useUserContext = () => {
    return useContext(UserContext);
}

// Estado inicial del usuario
const initialState = {
    // Colocar el objeto que de usuario (ejemplo)
    user: JSON.parse(localStorage.getItem('user')) || null
}

// Funcion que altera el valor del usuario
const reducer = (state, action) => {
    // Acciones

    switch (action.type) {
        case USER_ACTIONS.LOGIN:
            localStorage.setItem('user', JSON.stringify(action.value));
            return { ...state, user: action.value };

        case USER_ACTIONS.LOGOUT:
            localStorage.removeItem('user');
            return { ...state, user: null };
        default:
            return state;
    }
}

// Componente que unifica todo
const UserProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <UserContext.Provider value={{ user: state.user, dispatch }}>
            {children}
        </UserContext.Provider>
    );
}

export {
    UserProvider, useUserContext
}