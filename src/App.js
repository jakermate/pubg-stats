import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import Highcharts from 'highcharts';

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
      currentSeason:"",
      playerCount:0
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
  // FIND SEASONS
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

  //FIND PUBG STEAM STATS
  // fetch('http://api.steampowered.com/ISteamUserStats/GetGlobalStatsForGame/v1/?format=json&appid=578080&count=1&name=[0]',{
  //   method: 'get',
  //   headers: new Headers({
  //     "Content-Type": 'application/json'
  //   })
  //   }).then(response=>response.json()).then(data=>console.log(data));
}

  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <div id="header-cover">
              <div id="top-accent"></div>
              <div id="nav">
                <ul id="nav-links">
                  <li className="nav-link nav-active" id="home-link">Home</li>
                  <li className="nav-link" id="compare-link">Compare</li>
                  <li className="nav-link" id="top-link">Top Players</li>
                </ul>
              </div>
              <h1 id="header-logo">PUBG BOI</h1>
              <p id="subtitle">IT'S A NUMBERS GAME</p>
              <div id="bottom-accent"></div>
            </div>
          </header>
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
          <li className="platform-item" id="pc" onClick={this.props.choosePC}>PC</li>
          <li className="platform-item" id="xbox" onClick={this.props.chooseXbox} >XBOX</li>
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
        <ul id="pc-region-list">
          <li id="pc-krjp" onClick={this.props.chooseRegion} className="list-item region-li" >Korea</li>
          <li id="pc-jp" onClick={this.props.chooseRegion} className="list-item region-li" >Japan</li>
          <li id="pc-na" onClick={this.props.chooseRegion} className="list-item region-li" >North America</li>
          <li id="pc-eu" onClick={this.props.chooseRegion} className="list-item region-li" >Europe</li>
          <li id="pc-ru" onClick={this.props.chooseRegion} className="list-item region-li" >Russia</li>
          <li id="pc-oc" onClick={this.props.chooseRegion} className="list-item region-li" >Oceania</li>
          <li id="pc-kakao" onClick={this.props.chooseRegion} className="list-item region-li" >Kakao</li>
          <li id="pc-sea" onClick={this.props.chooseRegion} className="list-item region-li">South East Asia</li>
          <li id="pc-sa" onClick={this.props.chooseRegion} className="list-item region-li" >South and Central Americas</li>
          <li id="pc-as" onClick={this.props.chooseRegion} className="list-item region-li" >Asia</li>
        </ul>
      </div>
    )
  }
}
class XboxRegion extends Component{
  render(){
    return(
      <div id="Xbox-region-select">
        <ul id="xbox-region-list">
          <li className="region-li" onClick={this.props.chooseRegion} value="Asia" >Asia</li>
          <li className="region-li" onClick={this.props.chooseRegion} value="Europe" >Europe</li>
          <li className="region-li" onClick={this.props.chooseRegion} value="North America" >North America</li>
          <li className="region-li" onClick={this.props.chooseRegion} value="Oceania" >Oceania</li>
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
          <button id="search-button" action="" onClick={this.props.getPlayer}>GO</button>
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
      fpp:true,
      season:'division.bro.official.2018-05',
      player: {
        data:{
          attributes:{
            gameModeStats:{
              'duo':{
                wins:0,
                top10s:0,
                assists:0,
                dBNOs:0,
                dailyKills:0,
                damageDealt:0,
                days:0,
                headshotKills:0,
                heals:0,
                killPoints:0,
                kills:0,
                longestKill:0,
                longestTimeSurvived:0,
                losses:0,
                maxKillStreaks:0,
                mostSurvivedTime:0,
                revives:0,
                rideDistance:0,
                roadKills:0,
                roundMostKills:0,
                roundsPlayed:0,
                suicides:0,
                teamKills:0,
                timeSurvived:0,
                vehicleDestroys:0,
                walkDistance:0,
                weaponsAcquired:0,
                weeklyKills:0,
                winPoints:0
              },
              'duo-fpp':{
                wins:0,
                top10s:0,
                assists:0,
                dBNOs:0,
                dailyKills:0,
                damageDealt:0,
                days:0,
                headshotKills:0,
                heals:0,
                killPoints:0,
                kills:0,
                longestKill:0,
                longestTimeSurvived:0,
                losses:0,
                maxKillStreaks:0,
                mostSurvivedTime:0,
                revives:0,
                rideDistance:0,
                roadKills:0,
                roundMostKills:0,
                roundsPlayed:0,
                suicides:0,
                teamKills:0,
                timeSurvived:0,
                vehicleDestroys:0,
                walkDistance:0,
                weaponsAcquired:0,
                weeklyKills:0,
                winPoints:0
              },
              'solo':{
                wins:0,
                top10s:0,
                assists:0,
                dBNOs:0,
                dailyKills:0,
                damageDealt:0,
                days:0,
                headshotKills:0,
                heals:0,
                killPoints:0,
                kills:0,
                longestKill:0,
                longestTimeSurvived:0,
                losses:0,
                maxKillStreaks:0,
                mostSurvivedTime:0,
                revives:0,
                rideDistance:0,
                roadKills:0,
                roundMostKills:0,
                roundsPlayed:0,
                suicides:0,
                teamKills:0,
                timeSurvived:0,
                vehicleDestroys:0,
                walkDistance:0,
                weaponsAcquired:0,
                weeklyKills:0,
                winPoints:0
              },
              'solo-fpp':{
                wins:0,
                top10s:0,
                assists:0,
                dBNOs:0,
                dailyKills:0,
                damageDealt:0,
                days:0,
                headshotKills:0,
                heals:0,
                killPoints:0,
                kills:0,
                longestKill:0,
                longestTimeSurvived:0,
                losses:0,
                maxKillStreaks:0,
                mostSurvivedTime:0,
                revives:0,
                rideDistance:0,
                roadKills:0,
                roundMostKills:0,
                roundsPlayed:0,
                suicides:0,
                teamKills:0,
                timeSurvived:0,
                vehicleDestroys:0,
                walkDistance:0,
                weaponsAcquired:0,
                weeklyKills:0,
                winPoints:0
              },
              'squad':{
                wins:0,
                top10s:0,
                assists:0,
                dBNOs:0,
                dailyKills:0,
                damageDealt:0,
                days:0,
                headshotKills:0,
                heals:0,
                killPoints:0,
                kills:0,
                longestKill:0,
                longestTimeSurvived:0,
                losses:0,
                maxKillStreaks:0,
                mostSurvivedTime:0,
                revives:0,
                rideDistance:0,
                roadKills:0,
                roundMostKills:0,
                roundsPlayed:0,
                suicides:0,
                teamKills:0,
                timeSurvived:0,
                vehicleDestroys:0,
                walkDistance:0,
                weaponsAcquired:0,
                weeklyKills:0,
                winPoints:0
              },
              'squad-fpp':{
                wins:0,
                top10s:0,
                assists:0,
                dBNOs:0,
                dailyKills:0,
                damageDealt:0,
                days:0,
                headshotKills:0,
                heals:0,
                killPoints:0,
                kills:0,
                longestKill:0,
                longestTimeSurvived:0,
                losses:0,
                maxKillStreaks:0,
                mostSurvivedTime:0,
                revives:0,
                rideDistance:0,
                roadKills:0,
                roundMostKills:0,
                roundsPlayed:0,
                suicides:0,
                teamKills:0,
                timeSurvived:0,
                vehicleDestroys:0,
                walkDistance:0,
                weaponsAcquired:0,
                weeklyKills:0,
                winPoints:0
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
    .then(result=>that.setState({player: result})).catch(error=>console.log(error));


}
changeSeason(e){
  this.setState({season: e.target.value})
  console.log("Season changed to"+this.state.season);
}
changeFpp(){
  this.setState({fpp: !this.state.fpp});
}
  render(){

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
          <div id="fpp-select" onClick={this.changeFpp.bind(this)}>FPP</div>
        </div>


        <h2>{this.state.playerInfo.data[0].attributes.name}</h2>
        <p> {this.state.player.data.attributes.gameModeStats['solo-fpp'].roundsPlayed+this.state.player.data.attributes.gameModeStats['solo'].roundsPlayed+this.state.player.data.attributes.gameModeStats['duo-fpp'].roundsPlayed+this.state.player.data.attributes.gameModeStats['duo'].roundsPlayed+this.state.player.data.attributes.gameModeStats['squad-fpp'].roundsPlayed+this.state.player.data.attributes.gameModeStats['squad'].roundsPlayed} Games Played</p>
        <p>{this.state.player.data.attributes.gameModeStats['solo-fpp'].wins+this.state.player.data.attributes.gameModeStats['solo'].wins+this.state.player.data.attributes.gameModeStats['duo-fpp'].wins+this.state.player.data.attributes.gameModeStats['duo'].wins+this.state.player.data.attributes.gameModeStats['squad-fpp'].wins+this.state.player.data.attributes.gameModeStats['squad'].wins} Wins</p>

        <div id="total-wins-chart"></div>

        <div id="modes-container">
          {this.state.fpp && <Solosfpp data={this.state.player.data.attributes.gameModeStats['solo-fpp']} />}
          {!this.state.fpp && <Solos data={this.state.player.data.attributes.gameModeStats['solo']} />}
          {this.state.fpp && <Duosfpp data={this.state.player.data.attributes.gameModeStats['duo-fpp']} />}
          {!this.state.fpp && <Duos data={this.state.player.data.attributes.gameModeStats['duo']} />}
          {this.state.fpp && <Squadsfpp data={this.state.player.data.attributes.gameModeStats['squad-fpp']} />}
          {!this.state.fpp && <Squads data={this.state.player.data.attributes.gameModeStats['squad']} />}
        </div>

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
class Solos extends Component{
  constructor(){
    super();
    this.state={
      data: {
        wins:0,
        top10s:0,
        assists:0,
        dBNOs:0,
        dailyKills:0,
        damageDealt:0,
        days:0,
        headshotKills:0,
        heals:0,
        killPoints:0,
        kills:0,
        longestKill:0,
        longestTimeSurvived:0,
        losses:0,
        maxKillStreaks:0,
        mostSurvivedTime:0,
        revives:0,
        rideDistance:0,
        roadKills:0,
        roundMostKills:0,
        roundsPlayed:0,
        suicides:0,
        teamKills:0,
        timeSurvived:0,
        vehicleDestroys:0,
        walkDistance:0,
        weaponsAcquired:0,
        weeklyKills:0,
        winPoints:0
      }
    }
  }
  componentWillReceiveProps(newprops){
    this.setState({data: newprops.data});
  }
  render(){
    return(
        <div id="solos" className="mode">
          <div className="section-header">
            <h4>Solo</h4>
          </div>
          <Stats data={this.state.data} />
        </div>
    )
  }

}
class Duos extends Component{
  constructor(){
    super();
    this.state={
      data: {
        wins:0,
        top10s:0,
        assists:0,
        dBNOs:0,
        dailyKills:0,
        damageDealt:0,
        days:0,
        headshotKills:0,
        heals:0,
        killPoints:0,
        kills:0,
        longestKill:0,
        longestTimeSurvived:0,
        losses:0,
        maxKillStreaks:0,
        mostSurvivedTime:0,
        revives:0,
        rideDistance:0,
        roadKills:0,
        roundMostKills:0,
        roundsPlayed:0,
        suicides:0,
        teamKills:0,
        timeSurvived:0,
        vehicleDestroys:0,
        walkDistance:0,
        weaponsAcquired:0,
        weeklyKills:0,
        winPoints:0
      }
    }
  }
  componentWillReceiveProps(newprops){
    this.setState({data: newprops.data});
  }
  render(){
    return(
        <div id="duos" className="mode">
          <div className="section-header">
            <h4>Duos</h4>
          </div>
          <Stats data={this.state.data} />
        </div>
    )
  }
}
class Squads extends Component{
  constructor(){
    super();
    this.state={
      data: {
        wins:0,
        top10s:0,
        assists:0,
        dBNOs:0,
        dailyKills:0,
        damageDealt:0,
        days:0,
        headshotKills:0,
        heals:0,
        killPoints:0,
        kills:0,
        longestKill:0,
        longestTimeSurvived:0,
        losses:0,
        maxKillStreaks:0,
        mostSurvivedTime:0,
        revives:0,
        rideDistance:0,
        roadKills:0,
        roundMostKills:0,
        roundsPlayed:0,
        suicides:0,
        teamKills:0,
        timeSurvived:0,
        vehicleDestroys:0,
        walkDistance:0,
        weaponsAcquired:0,
        weeklyKills:0,
        winPoints:0
      }
    }
  }
  componentWillReceiveProps(newprops){
    this.setState({data: newprops.data});
  }
  render(){
    return(
        <div id="squads" className="mode">
          <div className="section-header">
            <h4>Squads</h4>
          </div>
          <Stats data={this.state.data} />
        </div>
    )
  }
}
class Solosfpp extends Component{
  constructor(){
    super();
    this.state={
      data: {
        wins:0,
        top10s:0,
        assists:0,
        dBNOs:0,
        dailyKills:0,
        damageDealt:0,
        days:0,
        headshotKills:0,
        heals:0,
        killPoints:0,
        kills:0,
        longestKill:0,
        longestTimeSurvived:0,
        losses:0,
        maxKillStreaks:0,
        mostSurvivedTime:0,
        revives:0,
        rideDistance:0,
        roadKills:0,
        roundMostKills:0,
        roundsPlayed:0,
        suicides:0,
        teamKills:0,
        timeSurvived:0,
        vehicleDestroys:0,
        walkDistance:0,
        weaponsAcquired:0,
        weeklyKills:0,
        winPoints:0
      }
    }
  }
  componentWillReceiveProps(newprops){
    this.setState({data: newprops.data});
  }
  render(){
    return(
        <div id="solosfpp" className="mode">
          <div className="section-header">
            <h4>Solo FPP</h4>
          </div>
        <Stats data={this.state.data} />
        </div>
    )
  }
}
class Duosfpp extends Component{
  constructor(){
    super();
    this.state={
      data: {
        wins:0,
        top10s:0,
        assists:0,
        dBNOs:0,
        dailyKills:0,
        damageDealt:0,
        days:0,
        headshotKills:0,
        heals:0,
        killPoints:0,
        kills:0,
        longestKill:0,
        longestTimeSurvived:0,
        losses:0,
        maxKillStreaks:0,
        mostSurvivedTime:0,
        revives:0,
        rideDistance:0,
        roadKills:0,
        roundMostKills:0,
        roundsPlayed:0,
        suicides:0,
        teamKills:0,
        timeSurvived:0,
        vehicleDestroys:0,
        walkDistance:0,
        weaponsAcquired:0,
        weeklyKills:0,
        winPoints:0
      }
    }
  }
  componentWillReceiveProps(newprops){
    this.setState({data: newprops.data});
  }
  render(){
    return(
        <div id="duosfpp" className="mode">
          <div className="section-header">
            <h4>Duos FPP</h4>
          </div>
          <Stats data={this.state.data} />
        </div>
    )
  }
}
class Squadsfpp extends Component{
  constructor(){
    super();
    this.state={
      data: {
        wins:0,
        top10s:0,
        assists:0,
        dBNOs:0,
        dailyKills:0,
        damageDealt:0,
        days:0,
        headshotKills:0,
        heals:0,
        killPoints:0,
        kills:0,
        longestKill:0,
        longestTimeSurvived:0,
        losses:0,
        maxKillStreaks:0,
        mostSurvivedTime:0,
        revives:0,
        rideDistance:0,
        roadKills:0,
        roundMostKills:0,
        roundsPlayed:0,
        suicides:0,
        teamKills:0,
        timeSurvived:0,
        vehicleDestroys:0,
        walkDistance:0,
        weaponsAcquired:0,
        weeklyKills:0,
        winPoints:0

      }
    }
  }
  componentWillReceiveProps(newprops){
    this.setState({data: newprops.data});
  }
  render(){
    return(
        <div id="squadsfpp" className="mode">
          <div className="section-header">
            <h4>Squads FPP</h4>
          </div>
        <Stats data={this.state.data} />
        </div>
    )
  }
}

const Matchdisplay = (props) =>{
  return(
    <div id="matches-container">

    </div>
  )
}
class Stats extends Component{
  constructor(){
    super();
    this.state={
      data:{
        wins: 0,
        top10s: 0,
        assists:0,
        dBNOs:0,
        dailyKills:0,
        damageDealt:0,
        days:0,
        headshotKills:0,
        heals:0,
        killPoints:0,
        kills:0,
        longestKill:0,
        longestTimeSurvived:0,
        losses:0,
        maxKillStreaks:0,
        mostSurvivedTime:0,
        revives:0,
        rideDistance:0,
        roadKills:0,
        roundMostKills:0,
        roundsPlayed:0,
        suicides:0,
        teamKills:0,
        timeSurvived:0,
        vehicleDestroys:0,
        walkDistance:0,
        weaponsAcquired:0,
        weeklyKills:0,
        winPoints:0
      }
    }
  }
  componentWillReceiveProps(nextProps){
         this.setState({data:nextProps.data});
}

  render(){
    console.log(this.state.data);
    return(
      <div >
      <div className="stats-container">
        <ul className="stat-list">
          <li>Wins: {this.state.data.wins}</li>
          <li>Top Ten: {this.state.data.top10s}</li>
          <li>KRD: {(this.state.data.kills/(this.state.data.roundsPlayed-this.state.data.wins-this.state.data.suicides)).toFixed(2)}</li>
        </ul>
      </div>
      </div>
    )
  }
}

class Compare extends Component{
  constructor(){
    super();
    this.state={
      player1:{},
      player2:{}
    }
  }

  render(){
    return(
      <div id="compare-page">

        <div id="compare-container">
          <div id="player1">

          </div>
          <div id="player2">

          </div>
        </div>
      </div>
    )
  }
}

export default App;
