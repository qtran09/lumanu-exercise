import './App.css';
import {RepoListView} from './RepoListView.js';
import React from 'react';


class App extends React.Component
{
  render()
  {
    return (
      <div className="App">
        <header className="App-header">
          <div className="repo-third">
            <RepoListView/>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
