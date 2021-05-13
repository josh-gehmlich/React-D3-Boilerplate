import React from 'react';
import './App.css';
import { ChartComponent } from "./visualization/chart.component";


function App() {
  return (
    <div className="App">
     <ChartComponent data={{name:'test'}} ></ChartComponent>
    </div>
  );
}

export default App;
