import { useContext } from 'react'
import { Context } from "./Store"


const Analyze = () => {

    const [state, setState] = useContext(Context)

    const toggle = (index) => () => {
        const ingredients = state.ingredients.map((ingredient, i) => i === index ? { ...ingredient, checked: !ingredient.checked } : ingredient)
        localStorage.setItem('SS_ingredients', JSON.stringify(ingredients))
        setState({ ...state, ingredients })
    }

    const Results = () => {
        // associate a missingIngredients list to each cocktail
        let cocktails = state.cocktails.map(cocktail => {
            const missingIngredients = cocktail.ingredients.reduce((missingList, ingredientName) => {
                return state.ingredients.some(ingredient => ingredient.checked && ingredient.name === ingredientName) ? missingList : missingList.concat(ingredientName)
            }, [])
            console.log('type', missingIngredients, typeof missingIngredients)
            return { ...cocktail, missingIngredients }
        })

        console.log('cocktails', cocktails)

        // group by missingIngredients length
        const groupedCocktails = []
        cocktails.forEach(cocktail => {
            let m = cocktail.missingIngredients.length
            if (groupedCocktails[m] === undefined) {
                groupedCocktails[m] = []
            }
            groupedCocktails[m] = groupedCocktails[m].concat(cocktail)
        })
        console.log('grouped', groupedCocktails)

        return <div className='results'>
            {groupedCocktails.map((cocktailList, missingIngredientCount) => {
                return <div key={`result${missingIngredientCount}`}>
                    <h2>{missingIngredientCount === 0 ? 'No' : missingIngredientCount} missing ingredients</h2>
                    <ul>
                        {cocktailList.map(cocktail => {
                            return <li key={cocktail.name}>{cocktail.name}</li>
                        })}
                    </ul>

                </div>
            })}
        </div>
    }

    return <div className='Analyze'>
        <div className='left'>
            <ul>
                {state.ingredients.map((ingredient, i) => (
                    <li key={ingredient.name}>
                        <label>
                            <input type='checkbox' checked={ingredient.checked} onChange={toggle(i)} />
                            {ingredient.name}
                        </label>

                    </li>
                ))}
            </ul>
        </div>

        <div className='right'>
            {state.cocktails.map(cocktail => <div key={cocktail.name}>{cocktail.name}</div>)}

            <Results />
        </div>

    </div>

}

export default Analyze