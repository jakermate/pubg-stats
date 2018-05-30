import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import ChartistGraph from "react-chartist";


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
    this.player1={};
    this.err404="Search Found Nothing (hint: Player Names Are Case Sensitive)";
    // this.processReq=this.processReq.bind(this);
    //Grab season list on first mounting of main app component.
  }

choosePC = () =>{
  this.setState({region:"pc-na"});
  this.setState({pc: true});
  this.setState({xbox:false});
  console.log("PC Chosen (Race)");
}
chooseXbox = () =>{
  this.setState({region:"xbox-na"});
  this.setState({pc: false});
  this.setState({xbox: true});
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

// getPlayer=(e)=>{
//   this.setState({playerID:''});
//   var that = this;
//   e.preventDefault();
//   console.log("searching");
//   this.setState({hasSearched: true});
//   var name = this.state.search;
//   var playerFilter = "/players?filter[playerNames]=";
//   var requestString = this.baseURL+'/'+this.state.region+playerFilter+name;
//   var req = new XMLHttpRequest();
//   req.onreadystatechange = function(){
//     if(req.status==200 && req.readyState==4){
//       this.player1 = JSON.parse(req.responseText);
//       console.log(this.player1);
//       this.setState({player1: this.player1});
//       console.log(this.player1.data[0].attributes.name);
//       this.processReq();
//     }
//     if(this.status==404&&this.readyState==4){
//       console.log('Player not found.');
//     }
//   }.bind(this);
//   req.open('GET',requestString, true);
//   req.setRequestHeader('Authorization', this.authorization);
//   req.setRequestHeader('Accept',"application/json");
//   req.send();
// }
// processReq(){
//   this.playerArray = this.player1.data;
//   this.playerAtt = this.playerArray[0].attributes;
//   this.playerName = this.playerAtt.name;
//   this.setState({playerID: this.playerArray[0].id});
//   console.log(this.state.playerID);
//   console.log(this.playerName);
//   this.playerRel = this.playerArray[0].relationships;
//   this.playerMatches = this.playerRel.matches;
//   console.log(this.playerMatches);
// }

  render() {
    return (
      <Router>
        <div className="App">

            <div id="router">
              <Switch>
                <Route path="/" exact render={(props)=><Home {...props} xbox={this.state.xbox} pc={this.state.pc} chooseXbox={this.chooseXbox} updateSearch={this.updateSearch} runSearch={this.runSearch} search={this.state.search} choosePC={this.choosePC} />} />
                <Route path="/leaderboards" component={Leaderboards} />
                <Route path="/compare" component={Compare} />
                <Route path="/user/:name" render={(props)=><User {...props} search={this.state.search} region={this.state.region} />} />
                <Route component={Notfound} />
                </Switch>
            </div>

        </div>
      </Router>
    );
  }
}
class Home extends Component{
  constructor(){
    super();
    this.state={
      region:'pc-na',
      xbox:false,
      pc:true
    }
  }
  componentWillReceiveProps(newprops){
    this.setState({xbox:newprops.xbox});
    this.setState({pc:newprops.pc});
  }
  render(){
    return(
      <div id="home">
      <header className="App-header">
        <div id="header-cover">
          <div id="top-accent">
            <div id="statboi-img-container">
              <img id="statboi-img" src={require('./img/statboi.png')} alt=""/>
            </div>

            <div id="stat-boi-network"></div>
          </div>
            <ul id="nav-links">
              <li className="nav-link nav-active" id="home-link" href="#">HOME</li>
              <li className="nav-link" id="compare-link">SIDE BY SIDE</li>
              <li className="nav-link" id="top-link">TOP PLAYERS</li>
              <li className="nav-link" id="item-link">ITEM STATS</li>
            </ul>
        </div>
          <h1 id="header-logo">PUBG BOI</h1>
          <p id="subtitle">IT'S A NUMBERS GAME</p>


          <PlatformSelect chooseXbox={this.props.chooseXbox} choosePC={this.props.choosePC}/>
          {this.state.pc && <PCRegion chooseRegion={this.chooseRegion} active={this.state.region} />}
          {this.state.xbox && <XboxRegion chooseRegion={this.chooseRegion}/>}


         <Search history={this.props.history} updatesearch={this.props.updateSearch} runSearch={this.props.runSearch} getPlayer={this.getPlayer} search={this.props.search} />
         <div id="bottom-accent"></div>

    </header>
  </div>
    )
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
        <select id="pc-region-list">
          <option selected="selected" id="pc-na" onClick={this.props.chooseRegion} className="list-item region-li" >North America</option>
          <option id="pc-krjp" onClick={this.props.chooseRegion} className="list-item region-li" >Korea</option>
          <option id="pc-jp" onClick={this.props.chooseRegion} className="list-item region-li" >Japan</option>
          <option id="pc-eu" onClick={this.props.chooseRegion} className="list-item region-li" >Europe</option>
          <option id="pc-ru" onClick={this.props.chooseRegion} className="list-item region-li" >Russia</option>
          <option id="pc-oc" onClick={this.props.chooseRegion} className="list-item region-li" >Oceania</option>
          <option id="pc-kakao" onClick={this.props.chooseRegion} className="list-item region-li" >Kakao</option>
          <option id="pc-sea" onClick={this.props.chooseRegion} className="list-item region-li">South East Asia</option>
          <option id="pc-sa" onClick={this.props.chooseRegion} className="list-item region-li" >South and Central Americas</option>
          <option id="pc-as" onClick={this.props.chooseRegion} className="list-item region-li" >Asia</option>
        </select>
      </div>
    )
  }
}
class XboxRegion extends Component{
  render(){
    return(
      <div id="Xbox-region-select">
        <select id="xbox-region-list">
          <option selected="selected" className="region-li" onClick={this.props.chooseRegion} value="North America" >North America</option>
          <option className="region-li" onClick={this.props.chooseRegion} value="Asia" >Asia</option>
          <option className="region-li" onClick={this.props.chooseRegion} value="Europe" >Europe</option>
          <option className="region-li" onClick={this.props.chooseRegion} value="Oceania" >Oceania</option>
        </select>
      </div>
    )
  }
}

class Search extends Component{
  constructor(props){
    super(props);
    this.runSearch=this.runSearch.bind(this);
  }
  runSearch(event){
    event.preventDefault();
    console.log('Running Search.');
    this.props.history.push('/user/'+this.props.search);
  }
  render(){
    return(
      <div id="search-container">
        <form id="search-form" action="">
          <input id="search-input" type="text" placeholder="PUBG Player Name" value={this.props.search} onChange={this.props.updatesearch}></input>
          <button id="search-button" action="" onClick={this.runSearch}>GO</button>
        </form>
      </div>
    )
  }
}

class User extends Component{
  constructor(props){
    super(props);
    this.baseURL="https://api.playbattlegrounds.com/shards";
    this.updateSearch = this.updateSearch.bind(this);
    this.state={
      search:"",
      notfound: false,
      loading: true,
      error: false,
      statsActive:true,
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
                name:'',
                id:''
            }
          }
        ]
      }
    }

  }
componentDidMount(){
// This will be the call to app server, which redirects to PUBG API
  console.log('User page mounted.  Fetch next using string: '+this.props.search);
  this.region = this.props.region;
  this.userParam = this.props.match.params.name;
  console.log(this.userParam);
  this.url = '/user/?name='+this.userParam+"&region="+this.region+"&season="+this.state.season;
  console.log('Passing Fetch url: ' +this.url);
  const that = this;
  fetch(this.url,{
    method:'get',
    headers: new Headers({
    'Content-Type': 'application/json'
      }),
  }).then(response=>response.json()).then(json=>this.setState({player:json,loading:false})).catch(function(error){console.log(error);that.setState({notfound:true,loading:false})});

}
changeSeason(e){
  this.setState({season: e.target.value})
  console.log("Season changed to"+this.state.season);
}
changeFpp(){
  this.setState({fpp: !this.state.fpp});
}
updateSearch(event){
  this.setState({search: event.target.value});
}
search(){

}
  render(){
    var winratio = (this.state.player.data.attributes.gameModeStats['solo-fpp'].wins+this.state.player.data.attributes.gameModeStats['solo'].wins+this.state.player.data.attributes.gameModeStats['duo-fpp'].wins+this.state.player.data.attributes.gameModeStats['duo'].wins+this.state.player.data.attributes.gameModeStats['squad-fpp'].wins+this.state.player.data.attributes.gameModeStats['squad'].wins);
    var tenratio = (this.state.player.data.attributes.gameModeStats['solo-fpp'].top10s+this.state.player.data.attributes.gameModeStats['solo'].top10s+this.state.player.data.attributes.gameModeStats['duo-fpp'].top10s+this.state.player.data.attributes.gameModeStats['duo'].top10s+this.state.player.data.attributes.gameModeStats['squad-fpp'].top10s+this.state.player.data.attributes.gameModeStats['squad'].top10s);
    const data={
      series:[((winratio/tenratio)*100) , (100-(((winratio/tenratio)*100)))]
    }
    const options={
      donut: true,
      donutWidth:60,
      startAngle: 270,
      total:200,
      donutSolid:true,
      labels: false
    }
    const type="Pie"

    return(
      <div id="user-page">
        <div id="user-header-bg">
        </div>
        <header id="user-header">
          <div id="top-bar">

          </div>
          <div id="user-search-container">
            <div id="search-form-container">
              <form action="" id="user-search-form">
                <span id="search-subtitle">SEARCH FOR PLAYER</span><br />
                <input id="search-input" type="text" placeholder="PUBG Player Name" value={this.state.search} onChange={this.updateSearch} />
                <button onClick={this.search}>GO</button>
              </form>
            </div>
        </div>
      </header>



      <div id="user-content">
      {this.state.notfound && <NotFound />}
      {this.state.loading && <Placeholder />}
        {!this.state.loading && !this.state.notfound && <div id="user-info">
          <div id="name-container">
            <span id="player-name">{this.userParam}</span><span id="player-region">{this.props.region}</span>
          </div>

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
          <div id="avatar-holder">
            <img className="avatar" src="img/user.svg" alt=""/>
          </div>
          <div id="stats-matches-changer">
            <span>STATS</span><span>MATCHES</span>
          </div>
          <div id="overview">
            <h2 id="overview-title">OVERVIEW</h2>
            <div id="overview-stat-container">
              <div id="total-rounds" className="overview-stat-container">
                <img id="boxing-gloves" src={require('./img/boxing.svg')} alt="boxing-gloves"/>
                <p className="overview-stat stat-margin">
                   {this.state.player.data.attributes.gameModeStats['solo-fpp'].roundsPlayed+this.state.player.data.attributes.gameModeStats['solo'].roundsPlayed+this.state.player.data.attributes.gameModeStats['duo-fpp'].roundsPlayed+this.state.player.data.attributes.gameModeStats['duo'].roundsPlayed+this.state.player.data.attributes.gameModeStats['squad-fpp'].roundsPlayed+this.state.player.data.attributes.gameModeStats['squad'].roundsPlayed} <span className="stat-grey">Rounds</span>
                 </p>
              </div>

              <div id="gold-medal-container" className="overview-stat-container overview-stat">
                 <img id="gold-medal" src={require("./img/gold-medal.png")} alt=""/>
                 <div id="total-wins" className="stat-margin">{this.state.player.data.attributes.gameModeStats['solo-fpp'].wins+this.state.player.data.attributes.gameModeStats['solo'].wins+this.state.player.data.attributes.gameModeStats['duo-fpp'].wins+this.state.player.data.attributes.gameModeStats['duo'].wins+this.state.player.data.attributes.gameModeStats['squad-fpp'].wins+this.state.player.data.attributes.gameModeStats['squad'].wins} <span className="stat-grey">Wins</span></div>
              </div>
              <div id="chart-container" className="overview-stat-container">
                <ChartistGraph data={data} options={options} type={type} />
                <span id="win-percent" className="stat-grey">Wins <span className="overview-stat">{((winratio/tenratio)*100).toFixed(1)}%</span> of Top 10 Scenarios</span><br />

              </div>
              <div className="overview-stat-container">
                <span ></span>
              </div>



            </div>


          </div>



          <div id="total-wins-chart">


          </div>

          <div id="modes-container">
            {this.state.fpp && <Solosfpp data={this.state.player.data.attributes.gameModeStats['solo-fpp']} />}
            {!this.state.fpp && <Solos data={this.state.player.data.attributes.gameModeStats['solo']} />}
            {this.state.fpp && <Duosfpp data={this.state.player.data.attributes.gameModeStats['duo-fpp']} />}
            {!this.state.fpp && <Duos data={this.state.player.data.attributes.gameModeStats['duo']} />}
            {this.state.fpp && <Squadsfpp data={this.state.player.data.attributes.gameModeStats['squad-fpp']} />}
            {!this.state.fpp && <Squads data={this.state.player.data.attributes.gameModeStats['squad']} />}
          </div>

          </div>}
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
          <div className="section-header bg-orange">
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
          <div className="section-header bg-green">
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
          <div className="section-header bg-purple">
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
          <div className="section-header bg-orange">
            <span className="mode-bold">SOLO FPP</span>
            <div>
              <span className="rounds-played">{this.state.data.roundsPlayed}</span> <span>ROUNDS</span>
            </div>
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
          <div className="section-header bg-green">
            <span className="mode-bold">DUOS FPP</span>
            <div>
              <span className="rounds-played">{this.state.data.roundsPlayed}</span> <span>ROUNDS</span>
            </div>
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
          <div className="section-header bg-purple">
            <span className="mode-bold">SQUADS FPP</span>
            <div>
              <span className="rounds-played">{this.state.data.roundsPlayed}</span> <span>ROUNDS</span>
            </div>

          </div>
        <Stats data={this.state.data} />
        </div>
    )
  }
}

class Matches extends Component{
  constructor(){
    super();
    this.state={
      matches:[]
    }
  }
  // Use map function to map matches array into individual Match components
  render(){
    return(
      <div id="matches-container">
        <ul id="match-list">

        </ul>
      </div>
    )
  }

}
class Match extends Component{
  render(){
    return(
      <div className="match">
      </div>
    )
  }
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
    this.data = {

    }
    this.options={

    }

}


  render(){

    console.log(this.state.data);
    return(
      <div >
      <div className="stats-container">
        <div id="wins">
          <img className="gold-medal" src="img/gold-medal.svg" alt=""/>
          <span>{this.state.data.wins} Wins</span>
        </div>
        <div id="top-10">
          <span>{this.state.data.top10s} Top Tens</span>
        </div>

        <div className="stat-grid">
          <div className="gird-win-percent">%</div>
          <div className="grid-kdr">KRD: {(this.state.data.kills/(this.state.data.roundsPlayed-this.state.data.wins-this.state.data.suicides)).toFixed(2)}
            <div id="kdr-chart"></div>
          </div>
          <div className="grid-top-ten grid-unit">
            <div id="top-ten-total" className="stat-total">{this.state.data.top10s}</div>
            <div id="top-ten-subtitle" className="stat-subtitle">Top 10s</div>
          </div>
          <div className="grid-kill-per-game grid-unit">
            <div id="kill-er-game-total" className="stat-total">{(this.state.data.kills/this.state.data.roundsPlayed).toFixed(1)}</div>
            <div id="kills-per-game-subtitle" className="stat-subtitle">Kills/Game</div>
            <div id="kills-per-game-graphic"></div>
          </div>
          <div className="grid-headshots grid-unit">
          <div id="headshots-total" className="stat-total"></div>
            <div id="headshots-subtitle" className="stat-subtitle">% of Kills as Headshots</div>
            <div id="headshots-graphic"></div>
          </div>
          <div className="grid-max-streak grid-unit">
            <div id="kill-streak-total" className="stat-total">{this.state.data.roundMostKills}</div>
            <div id="kill-streak-subtitle" className="stat-subtitle">Longest Kill Streak</div>
            <div id="kill-streak-graphic"></div>
          </div>
          <div className="grid-longest-kill grid-unit">
            <div id="longest-kill-total" className="stat-total">{this.state.data.longestKill.toFixed(1)} m.</div>
            <div id="longest-kill-subtitle" className="stat-subtitle">Farthest Distance Kill</div>
            <div id="longest-kill-graphic">
            <span>That's {(this.state.data.longestKill/109.1).toFixed(1)} football fields.</span>
            </div>
          </div>
          <div className="grid-damage-per-round grid-unit">
            <div id="avg-damage-total" className="stat-total"></div>
            <div id="avg-damage-subtitle" className="stat-subtitle">Average Damage / Round</div>
            <div id="avg-damage-graphic"></div>
          </div>
          <div className="grid-time-survived grid-unit">
            <div id="survived-time-total" className="stat-total"></div>
            <div id="survived-time-subtitle" className="stat-subtitle">Average Survival Time</div>
            <div id="survived-time-graphic"></div>
          </div>
        </div>
      </div>
      </div>
    )
  }
}

class Compare extends Component{
  constructor(){
    super();
    this.state={
      player1:{
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
      player2:{
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
componentWillReceiveProps(newProps){ //To update state data when api call passes down data.

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

class Footer extends Component{
  render(){
    return(
      <div id="footer">
        <div id="credits">
          <div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
          <div>Icons made by <a href="https://www.flaticon.com/authors/gregor-cresnar" title="Gregor Cresnar">Gregor Cresnar</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
          <div>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
          <div>Icons made by <a href="https://www.flaticon.com/authors/vectors-market" title="Vectors Market">Vectors Market</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
          <div>Icons made by <a href="https://www.flaticon.com/authors/pongsakornred" title="pongsakornRed">pongsakornRed</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
        </div>
      </div>
    )
  }
}
class Notfound extends Component{
  render(){
    return(
      <div id="error-page">
        <h1>PAGE NOT FOUND</h1>
        <Link to="/">PUBG BOI Home</Link>
      </div>
    )
  }
}

class Placeholder extends Component{
  render(){
    return(
      <div id="placeholder">
        <img src={require('./img/loading.svg')} alt=""/>
      </div>
    )
  }
}
class NotFound extends Component{
  render(){
    return(
      <div id="not-found-component">
        <h1>PLAYER NOT FOUND</h1>
      </div>
    )
  }
}

export default App;
