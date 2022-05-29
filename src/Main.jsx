import { useContext, useEffect, useState } from 'react'
import Analyze from './PageAnalyze'
import Manage from './PageManage'
import { Context } from './Store'

const Main = () => {

    const [state, setState] = useContext(Context)
    const [page, setPage] = useState('analyze')

    useEffect(() => {
        const ingredients = JSON.parse(localStorage.getItem('SS_ingredients')) ?? []
        const cocktails = JSON.parse(localStorage.getItem('SS_cocktails')) ?? []
        setState({ ingredients, cocktails })
    }, [])

    return (
        <div className='App'>
            <header>
                <h1>Spirit Sense</h1>
                <span className='navbtn' onClick={() => setPage('analyze')}>Analyze</span>
                <span className='navbtn' onClick={() => setPage('manage')}>Manage</span>
            </header>

            {page === 'analyze' && <Analyze />}
            {page === 'manage' && <Manage />}
        </div>
    )
}

export default Main