import './App.css';
import classNames from './utils/classNames'
import SelectBaseCurrency from './components/selectBaseCurrency';
import Navbar from './components/navbar';
import React from 'react';

function App() {
  return (
    <div className="App">
      <Navbar />

      <main className="mx-auto max-w-lg px-4 pt-10 pb-12 lg:pb-16">
        <form>
          <div className="space-y-6">
            <div>
              <h1 className="text-lg font-medium leading-6 text-gray-900">Currency Exchange Rates</h1>
              <p className="mt-1 text-sm text-gray-500">
                Let’s get started by selecting a base currency.
              </p>
            </div>

            <SelectBaseCurrency />
          </div>
        </form>
      </main>
    </div>
  );
}

export default App;
