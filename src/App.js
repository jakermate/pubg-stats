import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
// import Routes from './routes';

class App extends Component {
  constructor(){
    super();
    this.state={
      pc: true,
      xbox: false,
      search: "",  // Search string from input.
      query:"",  // Query to be built and then sent as a .get
      region:"pc-na", // To be set with specific region from li value.
      playerID:"", //Store currently chosed player ID for match search.
      searched:{},
      player1:{},
      seasons:{},
      season:"division.bro.official.2018-05",
      currentSeason:""
    };
    this.regionList={
      'Xbox Asia':'xbox-as',
      'Xbox Europe':'xbox-eu',
      'Xbox North America':'xbox-na',
      'Xbox Oceania':'xbox-oc',
      'Korea':'pc-krjp',
      'Japan':'pc-jp',
      'North America':'pc-na',
      'Europe':'pc-eu',
      'Russia':'pc-ru',
      'Oceania':'pc-oc',
      'Kakao':'pc-kakao',
      'South East Asia': 'pc-sea',
      'South and Central America': 'pc-sa',
      'Asia':'pc-as'
    };
    this.baseURL="https://api.playbattlegrounds.com/shards";
    this.key="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkNzJkMmFhMC0zMDUyLTAxMzYtMDg0Ny0wYTU4NjQ3NTk1MDIiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTI1Mjc4MTA5LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6InB1Ymctc3RhdHMtZTczOGUwOGMtMDRhYi00OTNiLWIwMjItNTZhYzA5ZTZhNTcwIiwic2NvcGUiOiJjb21tdW5pdHkiLCJsaW1pdCI6MTB9.yveXxHRPZcx3mAnC7CMGY-SbEArJV4gAK40Pv1VeLZw";
    this.authorization="Bearer "+this.key;
    this.player1={};
    this.err404="Search Found Nothing (hint: Player Names Are Case Sensitive)";
    this.processReq=this.processReq.bind(this);
    //Grab season list on first mounting of main app component.

  }

choosePC = () =>{
  this.setState({region:""});
  this.setState({pc: !this.state.pc});
  this.setState({xbox:false});
  console.log("PC Chosen (Race)");
}
chooseXbox = () =>{
  this.setState({region:""});
  this.setState({pc: false});
  this.setState({xbox: !this.state.xbox});
  console.log("Xbox Selected");
}
chooseRegion=(event)=>{
  console.log('setting region');
  this.regionKey=event.target.innerHTML;
  this.remove=document.getElementById(this.state.region);
  console.log(this.regionKey);
  this.setState({region: this.regionList[this.regionKey]});
  console.log(this.state.region + " region selected.");
}
updateSearch=(event)=>{
  this.setState({search: event.target.value});
  console.log("State Updated.");
}
getPlayer=(e)=>{
  this.setState({playerID:''});
  var that = this;
  e.preventDefault();
  console.log("searching");
  this.setState({hasSearched: true});
  var name = this.state.search;
  var playerFilter = "/players?filter[playerNames]=";
  var requestString = this.baseURL+'/'+this.state.region+playerFilter+name;
  var req = new XMLHttpRequest();
  req.onreadystatechange = function(){
    if(req.status==200 && req.readyState==4){
      this.player1 = JSON.parse(req.responseText);
      console.log(this.player1);
      this.setState({player1: this.player1});
      console.log(this.player1.data[0].attributes.name);
      this.processReq();
    }
    if(this.status==404&&this.readyState==4){
      console.log('Player not found.');
    }
  }.bind(this);
  req.open('GET',requestString, true);
  req.setRequestHeader('Authorization', this.authorization);
  req.setRequestHeader('Accept',"application/json");
  req.send();
}
processReq(){
  this.playerArray = this.player1.data;
  this.playerAtt = this.playerArray[0].attributes;
  this.playerName = this.playerAtt.name;
  this.setState({playerID: this.playerArray[0].id});
  console.log(this.state.playerID);
  console.log(this.playerName);
  this.playerRel = this.playerArray[0].relationships;
  this.playerMatches = this.playerRel.matches;
  console.log(this.playerMatches);
}
componentDidMount(){
  var that = this;
  console.log('Building query string.');
  this.seasonString = this.baseURL+'/'+this.state.region+'/seasons';
  console.log(this.seasonString);
  fetch(this.seasonString, {
    method: 'get',
    headers: new Headers({
      'Authorization': this.authorization,
      'Accept': 'application/json'
    })
  }).then(response=>response.json()).then(data=>console.log(data));
}
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <h1 id="header-logo">PUBG BOI</h1>
          </header>
          <h4>Choose Platform and Region</h4>
          <PlatformSelect chooseXbox={this.chooseXbox} choosePC={this.choosePC}/>
          {this.state.pc && <PCRegion chooseRegion={this.chooseRegion} active={this.state.region} />}
          {this.state.xbox && <XboxRegion chooseRegion={this.chooseRegion}/>}

          {/*Displays search box only when region is selected.*/}
          {this.state.region!=""&& (this.state.xbox || this.state.pc) && <Search updatesearch={this.updateSearch} search={this.state.search} getPlayer={this.getPlayer}/>}


          {this.state.playerID!="" &&<User playerInfo={this.player1} region={this.state.region} id={this.state.playerID} season={this.state.season} seasons={this.state.seasons} />}

          <Route path="/leaderboards" component={Leaderboards} />
        </div>
      </Router>
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
    this.activeBg = {
      backgroundColor: 'yellow'
    }
    return(
      <div id="PC-region-select">
        <h4>PC Regions</h4>
        <ul id="pc-region-list">
          <li id="pc-krjp" onClick={this.props.chooseRegion} className="list-item" >Korea</li>
          <li id="pc-jp" onClick={this.props.chooseRegion} className="list-item" >Japan</li>
          <li id="pc-na" onClick={this.props.chooseRegion} className="list-item" >North America</li>
          <li id="pc-eu" onClick={this.props.chooseRegion} className="list-item" >Europe</li>
          <li id="pc-ru" onClick={this.props.chooseRegion} className="list-item" >Russia</li>
          <li id="pc-oc" onClick={this.props.chooseRegion} className="list-item" >Oceania</li>
          <li id="pc-kakao" onClick={this.props.chooseRegion} className="list-item" >Kakao</li>
          <li id="pc-sea" onClick={this.props.chooseRegion} className="list-item">South East Asia</li>
          <li id="pc-sa" onClick={this.props.chooseRegion} className="list-item" >South and Central Americas</li>
          <li id="pc-as" onClick={this.props.chooseRegion} className="list-item" >Asia</li>
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
          <li onClick={this.props.chooseRegion} value="Asia" >Asia</li>
          <li onClick={this.props.chooseRegion} value="Europe" >Europe</li>
          <li onClick={this.props.chooseRegion} value="North America" >North America</li>
          <li onClick={this.props.chooseRegion} value="Oceania" >Oceania</li>
        </ul>
      </div>
    )
  }
}

class Search extends Component{
  constructor(props){
    super(props);

  }
  render(){
    return(
      <div id="search-container">
        <form id="search-form" action="">
          <input id="search-input" type="text" placeholder="Player Name" value={this.props.search} onChange={this.props.updatesearch}></input>
          <button id="search-button" action="" onClick={this.props.getPlayer}>SEARCH</button>
        </form>
      </div>
    )
  }
}
class Home extends Component{
  render(){
    return(
      <div id="home">
        <div id="leaderboards">
        </div>
      </div>
    )
  }
}
class User extends Component{
  constructor(props){
    super(props);
    this.baseURL="https://api.playbattlegrounds.com/shards";
    this.key="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkNzJkMmFhMC0zMDUyLTAxMzYtMDg0Ny0wYTU4NjQ3NTk1MDIiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTI1Mjc4MTA5LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6InB1Ymctc3RhdHMtZTczOGUwOGMtMDRhYi00OTNiLWIwMjItNTZhYzA5ZTZhNTcwIiwic2NvcGUiOiJjb21tdW5pdHkiLCJsaW1pdCI6MTB9.yveXxHRPZcx3mAnC7CMGY-SbEArJV4gAK40Pv1VeLZw";
    this.authorization="Bearer "+this.key;
    this.state={
      season:'division.bro.official.2018-05',
      player: {
        data:{
          attributes:{
            gameModeStats:{
              duo:{
                wins:0
              },
              'duo-fpp':{
                wins:0
              },
              solo:{
                wins:0
              },
              'solo-fpp':{
                wins:0
              },
              squad:{
                wins:0
              },
              'squad-fpp':{
                wins:0
              }
            }
          }
        }
      },
      playerInfo: {
        data:[
            {
              attributes:{
                name:''
            }
          }
        ]
      }
    }

  }
componentDidMount(){

    var that=this;
    this.setState({playerInfo: this.props.playerInfo});
    this.statString=this.baseURL+'/'+this.props.region+'/players/'+this.props.id+'/seasons/'+this.state.season;
    console.log('Getting Stats from season');
    fetch(this.statString, {
      method: 'get',
      headers: new Headers({
        'Authorization': this.authorization,
        'Accept': 'application/json'
      })
    })
    .then(response=>response.json())
    .then(result=>that.setState({player: result}));

}
changeSeason(e){
  this.setState({season: e.target.value})
  console.log("Season changed to"+this.state.season);
}
  render(){

    console.log(this.state.player);
    return(
      <div id="user-page">
        <div id='options'>
          <select id="season-select" value={this.state.season} onChange={this.changeSeason.bind(this)}>
            <option value="division.bro.official.2018-05" >Season 5</option>
            <option value="division.bro.official.2018-04" >Season 4</option>
            <option value="division.bro.official.2018-03" >Season 3</option>
            <option value="division.bro.official.2018-02" >Season 2</option>
            <option value="division.bro.official.2018-01" >Season 1</option>
            <option value="division.bro.official.2017-pre9" >Preseason 9</option>
            <option value="division.bro.official.2017-pre8" >Preseason 8</option>
            <option value="division.bro.official.2017-pre7" >Preseason 7</option>
            <option value="division.bro.official.2017-pre6" >Preseason 6</option>
            <option value="division.bro.official.2017-pre5" >Preseason 5</option>
            <option value="division.bro.official.2017-pre4" >Preseason 4</option>
            <option value="division.bro.official.2017-pre3" >Preseason 3</option>
            <option value="division.bro.official.2017-pre2" >Preseason 2</option>
            <option value="division.bro.official.2017-pre1" >Preseason 1</option>
            <option value="division.bro.official.2017-beta" >Beta</option>

          </select>
        </div>


        <h2>{this.state.playerInfo.data[0].attributes.name}</h2>
        <p>Total wins: {this.state.player.data.attributes.gameModeStats['solo-fpp'].wins}</p>
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
        <div id="player-name">{this.props.playerName}</div>

        <Stats />
        <Matchdisplay />

      </div>
    )
  }
}
class Leaderboards extends Component{
  render(){
    return(
      <div id="leaderboards-page">
      </div>
    )
  }
}
const Season = () => {
  return(
    <div id="option">
      <option value={this.props.season}>{this.props.season}</option>
    </div>

  )
}
const Matchdisplay = (props) =>{
  return(
    <div id="matches-container">

    </div>
  )
}
const Stats = (props =>{
  return(
    <div id="stats-container">
    </div>
  )
})
const solos=(props)=>{
  return(
      <div id="solos">

      </div>
  )
}
const duos=(props)=>{
  return(
      <div id="duos">

      </div>
  )
}
const squads=(props)=>{
  return(
      <div id="squads">

      </div>
  )
}

export default App;
