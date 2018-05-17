import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state={
      pc: false,
      xbox: false,
      search: "",  // Search string from input.
      query:"",  // Query to be built and then sent as a .get
      region:"" // To be set with specific region from li value.
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
          <li className="list-item" id="pc" onClick={this.props.choosePC}>PC</li>
          <li className="list-item" id="xbox" onClick={this.props.chooseXbox} >XBOX</li>
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
          <li className="list-item" >Korea</li>
          <li className="list-item" >Japan</li>
          <li className="list-item" >North America</li>
          <li className="list-item" >Europe</li>
          <li className="list-item" >Russia</li>
          <li className="list-item" >Oceania</li>
          <li className="list-item" >Kakao</li>
          <li className="list-item" >South and Central Americas</li>
          <li className="list-item" >Asia</li>
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
          <li value="Asia" >Asia</li>
          <li value="Europe" >Europe</li>
          <li value="North America" >North America</li>
          <li value="Oceania" >Oceania</li>
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
class Display extends Component{
  constructor(props){
    super();

  }
  render(){
    return(
      <div id="display">
        <div id="player'name"></div>
      </div>
    )
  }
}

export default App;
