import { useContext, useState } from 'react'
import { Context } from './Store'

import importedIngredients from './ingredients.json'


const Manage = () => {

    const [state, setState] = useContext(Context)

    const [newCocktail, setNewCocktail] = useState({ name: '', ingredients: [] })
    const [newIngredient, setNewIngredient] = useState({ name: '', checked: false })
    const [delIngredientName, setDelIngredientName] = useState('')
    const [delCocktailName, setDelCocktailName] = useState('')
    const [portValue, setPortValue] = useState('')

    const saveNewIngredient = () => {
        if (state.ingredients.every(ingredient => ingredient.name !== newIngredient.name)) {
            const ingredients = state.ingredients.concat(newIngredient)
            localStorage.setItem('SS_ingredients', JSON.stringify(ingredients))
            setState({ ...state, ingredients })
            setNewIngredient({ name: '', checked: false })
        }
    }

    const deleteIngredient = () => {
        const ingredients = state.ingredients.filter(x => x.name !== delIngredientName)
        if (ingredients.length === state.ingredients.length) return
        if (ingredients.length === 0) {
            localStorage.removeItem('SS_ingredients')
            setState({ ...state, ingredients: [] })
        } else {
            localStorage.setItem('SS_ingredients', ingredients)
            setState({ ...state, ingredients })

        }
        setDelIngredientName('')
    }

    const setNewCocktailIngredient = (index) => (value) => {
        const ingredients = newCocktail.ingredients.map((ingredient, i) => i === index ? value : ingredient)
        setNewCocktail({ ...newCocktail, ingredients })
    }

    const hasInvalidIngredient = () => {
        return newCocktail.ingredients.some(ingredientName => {
            return state.ingredients.every(ingredient => ingredient.name !== ingredientName)
        })
    }

    const saveNewCocktail = () => {
        if (hasInvalidIngredient()) {
            return console.log('invalid ingredient')
        }

        const cocktails = state.cocktails.concat(newCocktail)
        localStorage.setItem('SS_cocktails', JSON.stringify(cocktails))
        setState({ ...state, cocktails })
        setNewCocktail({ name: '', ingredients: [] })
    }

    const cleanIngredients = () => {
        const ingredients = newCocktail.ingredients.filter(ingredient => !!ingredient)
        if (ingredients.length !== newCocktail.ingredients) setNewCocktail({ ...newCocktail, ingredients })
    }

    const deleteCocktail = () => {
        console.log('state', state.cocktails)
        const cocktails = state.cocktails.filter(cocktail => {
            console.log('C', cocktail.name, delCocktailName, cocktail.name !== delCocktailName)
            return cocktail.name !== delCocktailName
        })
        if (cocktails.length == state.cocktails.length) {
            console.log('nothing to remove')
            return
        }

        if (cocktails.length === 0) {
            localStorage.removeItem('SS_cocktails')
            setState({ ...state, cocktails: [] })
        } else {
            localStorage.setItem('SS_cocktails', cocktails)
            setState({ ...state, cocktails })

        }
        setDelCocktailName('')
    }

    const onExportClick = () => {
        setPortValue(JSON.stringify(state))
    }

    const onImportClick = () => {
        try {
            const { ingredients, cocktails } = JSON.parse(portValue)
            if (Array.isArray(ingredients) && Array.isArray(cocktails)) {
                setState({cocktails, ingredients})
                localStorage.setItem('SS_cocktails', cocktails)
                localStorage.setItem('SS_ingredients', ingredients)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const importIngredients = () => {
        const ingredientsToAdd = importedIngredients.map(x => ({name: x, checked: false}))
        const ingredients = state.ingredients.concat(ingredientsToAdd)
        setState({...state, ingredients})
        localStorage.setItem('SS_ingredients', ingredients)
    }

    return <div className='Manage'>
        <h2>Manage Cocktails</h2>

        <div className='row'>
            <input type='text'
                value={newCocktail.name}
                onChange={(event) => setNewCocktail({ ...newCocktail, name: event.target.value })}
            />
            <button onClick={saveNewCocktail}>Save</button>
        </div>
        <div className='box'>


            <ul>
                {newCocktail.ingredients.map((ingredient, i) => {
                    return <li key={`nc${i}`}>
                        <Input value={ingredient}
                            onChange={setNewCocktailIngredient(i)}
                            onBlur={cleanIngredients}
                        />
                    </li>
                })}
                <li onFocus={() => setNewCocktail({ ...newCocktail, ingredients: newCocktail.ingredients.concat('') })}>
                    <div className='ingredient-input'><input type='text' className='faux-input' /></div>
                </li>
            </ul>

        </div>

        <hr />

        <div className='row'>
            <input type='text'
                value={delCocktailName}
                onChange={(event) => setDelCocktailName(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && deleteCocktail()}
            />
            <button onClick={deleteCocktail}>Remove</button>
        </div>



        <h2>Manage Ingredients</h2>
        <button onClick={importIngredients}>Use common ingredients</button>
        <div className='row'>
            <input type='text'
                value={newIngredient.name}
                onChange={(event) => setNewIngredient({ ...newIngredient, name: event.target.value })}
                onKeyDown={(event) => event.key === 'Enter' && saveNewIngredient()}
            />
            <input type='checkbox'
                checked={newIngredient.checked}
                onChange={() => setNewIngredient({ ...newIngredient, checked: !newIngredient.checked })}
            />
            <button onClick={saveNewIngredient}>Add</button>
        </div>

        <hr />

        <div className='row'>
            <input type='text'
                value={delIngredientName}
                onChange={(event) => setDelIngredientName(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && deleteIngredient()}
            />
            <button onClick={deleteIngredient}>Remove</button>
        </div>

        <h2>Export/Import Data</h2>

        <textarea value={portValue} onChange={(event) => setPortValue(event.target.value)} />
        <div className='row'>
            <button onClick={onImportClick}>Import</button>
            <button onClick={onExportClick}>Export</button>
        </div>
    </div>
}

const Input = ({ value, onChange, onBlur }) => {
    const [state, setState] = useContext(Context)

    const [showOptions, setShowOptions] = useState(false)

    const onKeyDown = (event) => {
        if (event.key === 'Enter') {
            const match = state.ingredients.find(ingredient => ingredient.name.toLowerCase().includes(value.toLowerCase()))
            if (match) onChange(match.name)
        }
    }

    const onInputBlur = () => {
        setShowOptions(false)
        onBlur()
    }

    return <div className='ingredient-input'>
        <input type='text'
            className={state.ingredients.some(ingredient => ingredient.name.includes(value)) ? '' : 'invalid'}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => setShowOptions(true)}
            onBlur={onInputBlur}
            autoFocus
        />
        {showOptions && <ul className='ingredient-input-options'>
            {state.ingredients.filter(ingredient => {
                return ingredient.name.toLowerCase().includes(value.toLowerCase())
            }).map(ingredient => (
                <li key={ingredient.name}>{ingredient.name}</li>
            ))}
        </ul>}
    </div>
}

export default Manage