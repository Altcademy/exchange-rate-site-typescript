import './App.css';
import getRates from './utils/getRates';
import getCurrencies from './utils/getCurrencies';
import type { Rates } from './utils/getRates';
import type { Currencies } from './utils/currencies';
import { returnNegativeWeightPath } from './utils/bellmanFord';
import type { AdjacencyList } from './utils/bellmanFord';
import RatesTable from './components/ratesTable';
import SelectBaseCurrency from './components/selectBaseCurrency';
import { sampleSize } from 'lodash';
import Navbar from './components/navbar';
import React from 'react';
import AlertBanner from './components/alertBanner';

type AppProps = {};

type AppStates = {
  adjacencyList: AdjacencyList,
  arbitrage: string,
  baseCurrency: string,
  baseValue: number,
  currencies: Currencies,
  loadingArbitrage: boolean,
  rates: Rates,
};

class App extends React.Component<AppProps, AppStates> {
  constructor(props: any) {
    super(props);

    this.state = {
      adjacencyList: {},
      arbitrage: 'Loading currencies...',
      baseCurrency: 'USD',
      baseValue: 1,
      currencies: {},
      loadingArbitrage: true,
      rates: [],
    }
  }

  changeBaseCurrency = async(baseCurrency: string) => {
    this.setState({ 
      baseCurrency,
      rates: []
    }, () => {
      this.refreshRates();
      this.findArbitrageOpportunity();
    })
  }

  changeBaseValue = (baseValue: number) => {
    this.setState({
      baseValue: Number(baseValue),
      rates: []
    }, this.refreshRates)
  }

  refreshRates = async() => {
    let rates = await getRates(this.state.baseCurrency);
    
    if (rates) {
      rates = rates.map((rate) => {
        return {
          ...rate,
          total: rate.rate * this.state.baseValue
        }
      });

      this.setState({ rates });
    }
  }

  buildAdjacencyList = async(): Promise<void> => {
    const newAdjacencyList: {
      [key: string]: [string, number][]
    } = {}
    const { currencies } = this.state;
    // for (const currency of sampleSize(Object.keys(currencies), 20)) {
    for (const currency of Object.keys(currencies)) {
      newAdjacencyList[currency] = [];
      let rates = await getRates(currency);
      if (rates) {
        for (const rate of rates) {
          newAdjacencyList[currency].push([rate.currency, rate.rate]);
        }
      }
      this.setState({ arbitrage: `Loading currencies... (${Object.keys(newAdjacencyList).length} currencies loaded)` });
    }
    
    const { adjacencyList } = this.state;
    if (Object.keys(adjacencyList).length === 0) {
      return new Promise(resolve => this.setState({ adjacencyList: newAdjacencyList }, resolve));
    }
  }

  findArbitrageOpportunity = async() => {
    await this.buildAdjacencyList();
    const { adjacencyList, baseCurrency } = this.state;

    const negativeWeightPath = returnNegativeWeightPath(adjacencyList, baseCurrency);

    if (negativeWeightPath && negativeWeightPath.gain > 1) {
      this.setState({ arbitrage: [baseCurrency, ...negativeWeightPath.path].join(' -> ') + ' (Gain: ' + ((negativeWeightPath.gain-1)*100).toFixed(6) + '%)' });
    } else {
      this.setState({ arbitrage: 'No arbitrage opportunity found' });
    }
  }

  setCurrencies = async(success: () => void) => {
    const currencies = await getCurrencies();
    if (currencies) {
      return this.setState({ currencies }, success);
    }
  }

  componentDidMount() {
    this.setCurrencies(() => {
      this.changeBaseCurrency(this.state.baseCurrency);
    })
  }

  render() {
    return (
      <div className="App">
        <Navbar />

        <main className="mx-auto max-w-lg px-2 py-4">
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
                baseValue={this.state.baseValue}
                changeBaseCurrency={this.changeBaseCurrency}
                changeBaseValue={this.changeBaseValue}
                currencies={this.state.currencies}
              />
            </div>
          </form>
        </main>

        <main className="mx-auto max-w-lg px-2 py-4">
          <AlertBanner arbitrage={this.state.arbitrage} />
        </main>

        <main className="mx-auto max-w-xl px-2 py-4" hidden={this.state.rates.length === 0}>
          <RatesTable
            baseCurrency={this.state.baseCurrency}
            baseValue={this.state.baseValue}
            rates={this.state.rates}
          />
        </main>
      </div>
    );
  }
}

export default App;
