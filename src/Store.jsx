import { createContext, useState } from 'react'

const initialState = {
    cocktails: [],
    ingredients: []
}

const Store = ({children}) => {
    const [state, setState] = useState(initialState)
    return <Context.Provider value={[state, setState]}>{children}</Context.Provider>
}

export const Context = createContext(initialState)
export default Store