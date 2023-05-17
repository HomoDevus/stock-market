import React, { useCallback } from 'react'
import './App.css'
import { subscribeMarketData } from './store/slices/stock'
import { useAppDispatch } from './hooks/redux'

function App() {
  const dispatch = useAppDispatch()

  const handleClick = useCallback(async () => {
    await dispatch(subscribeMarketData(1))
  }, [dispatch, subscribeMarketData])

  return (
    <div className='App'>
      <header className='App-header'>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={handleClick}>Trigger action</button>
      </header>
    </div>
  )
}

export default App
