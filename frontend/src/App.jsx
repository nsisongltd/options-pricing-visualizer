// import { useState } from 'react'
import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import * as d3 from "d3";

function App() {
  const [data, setData] = useState([]);
  // const [count, setCount] = useState(0)

  useEffect(() => {
    // will put the placeholder to fetch pricing data here soon
    setData([
      { strike: 100, price 10},
      { strike: 110, price 8},
      { strike: 120, price 6},
      { strike: 130, price 4},
    ]);
  }, []);


  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-900 text-white'>
      <div className='w-full max-w-2xl'>
        <h1 className='text-2xl font-bold mb-4'>Options Pricing Visualizer</h1>
        <div id='chart'></div>
      </div>
    </div>
  );
  // return (
  //   <>
  //     <div>
  //       <a href="https://vite.dev" target="_blank">
  //         <img src={viteLogo} className="logo" alt="Vite logo" />
  //       </a>
  //       <a href="https://react.dev" target="_blank">
  //         <img src={reactLogo} className="logo react" alt="React logo" />
  //       </a>
  //     </div>
  //     <h1>Vite + React</h1>
  //     <div className="card">
  //       <button onClick={() => setCount((count) => count + 1)}>
  //         count is {count}
  //       </button>
  //       <p>
  //         Edit <code>src/App.jsx</code> and save to test HMR
  //       </p>
  //     </div>
  //     <p className="read-the-docs">
  //       Click on the Vite and React logos to learn more
  //     </p>
  //   </>
  // )
}

export default App;
