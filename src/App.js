import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state={
      pc: false,
      xbox: false,
      search: ""
    }
  }
choosePC = () =>{
  this.setState({pc: true});
  this.setState({xbox:false});
  console.log("PC Chosen (Race)");
}
chooseXbox = () =>{
  this.setState({pc: false});
  this.setState({xbox:true});
  console.log("Xbox Selected");
}
updateSearch=(event)=>{
  this.setState({search: event.target.value});
  console.log("State Updated.")
}
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 id="header-logo">PUBG Stats</h1>
        </header>
        <PlatformSelect chooseXbox={this.chooseXbox} choosePC={this.choosePC}/>
        {this.state.pc && <PCRegion />}
        {this.state.xbox && <XboxRegion />}

        <Search updatesearch={this.updateSearch} search={this.state.search} />


      </div>
    );
  }
}

class PlatformSelect extends Component{
  render(){
    return(
        <ul id="platform-list">
          <li id="pc" onClick={this.props.choosePC}>PC</li>
          <li id="xbox" onClick={this.props.chooseXbox} >XBOX</li>
        </ul>
    )
  }
}
class PCRegion extends Component{
  render(){
    return(
      <div id="PC-region-select">
        <h4>PC Regions</h4>
        <ul id="pc-region-list">
          <li>Korea</li>
          <li>Japan</li>
          <li>North America</li>
          <li>Europe</li>
          <li>Russia</li>
          <li>Oceania</li>
          <li>Kakao</li>
          <li>South and Central Americas</li>
          <li>Asia</li>
        </ul>
      </div>
    )
  }
}
class XboxRegion extends Component{
  render(){
    return(
      <div id="Xbox-region-select">
        <h4>Xbox Regions</h4>
        <ul id="xbox-region-list">
          <li>Asia</li>
          <li>Europe</li>
          <li>North America</li>
          <li>Oceania</li>
        </ul>
      </div>
    )
  }
}

class Search extends Component{
  constructor(){
    super();
  }
  render(){
    return(
      <div id="search-container">
        <form action="">
          <input type="text" placeholder="Player Name" value={this.props.search} onChange={this.props.updatesearch}></input>
          <button id="search-button">SEARCH</button>
        </form>
      </div>
    )
  }
}


export default App;
