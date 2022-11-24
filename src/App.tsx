import React from 'react';
import logo from './logo.svg';
import './App.css';

import Navbar from './components/navbar';
import Dropdown from './components/dropdown';

function App() {
  return (
    <div className="App">
      <Navbar />

      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>

      <div>
        <Dropdown active={true} />
      </div>
    </div>
  );
}

export default App;
