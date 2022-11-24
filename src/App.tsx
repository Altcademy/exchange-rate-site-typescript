import './App.css';
import { checkStatus, json } from './utils/fetchUtils';
import getRates from './utils/getRates';
import type { Rates } from './utils/getRates';
import classNames from './utils/classNames'
import RatesTable from './components/ratesTable';
import SelectBaseCurrency from './components/selectBaseCurrency';
import Navbar from './components/navbar';
import React from 'react';

type AppProps = {};

type AppStates = {
  baseCurrency: string,
  rates: Rates,
};

class App extends React.Component<AppProps, AppStates> {
  constructor(props: any) {
    super(props);

    this.state = {
      baseCurrency: 'USD',
      rates: []
    }
  }

  changeBaseCurrency = async(baseCurrency: string) => {
    this.setState({ baseCurrency });

    const rates = await getRates(baseCurrency);

    if (rates) {
      this.setState({ rates })
    }
  }

  render() {
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

              <SelectBaseCurrency 
                baseCurrency={this.state.baseCurrency}
                changeBaseCurrency={this.changeBaseCurrency}
              />
            </div>
          </form>
        </main>

        <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <RatesTable
            baseCurrency={this.state.baseCurrency}
            rates={this.state.rates}
          />
        </main>
      </div>
    );
  }
}

export default App;
