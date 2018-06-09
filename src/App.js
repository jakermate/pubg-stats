import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';



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
      season:"division.bro.official.2018-06",
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
  this.setState({region: event.target.value});
  console.log(this.state.region + " region selected.");
}
updateSearch=(event)=>{
  this.setState({search: event.target.value});
  console.log("State Updated.");
}


  render() {

    return (
      <Router>
        <div className="App">

            <div id="router">
              <Switch>
                <Route path="/" exact render={(props)=><Home {...props} xbox={this.state.xbox}  region={this.state.region} pc={this.state.pc} chooseXbox={this.chooseXbox} updateSearch={this.updateSearch} runSearch={this.runSearch} search={this.state.search} choosePC={this.choosePC} chooseRegion={this.chooseRegion} />} />
                <Route path="/leaderboards/" component={Leaderboards} />
                <Route path="/compare/" render={(props)=><Compare />} />
                <Route path="/user/:name" render={(props)=><User {...props} search={this.state.search} region={this.state.region} />} />
                <Route component={ErrorPage} />
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
      pc:true,
      top10: [],
      recent: {}
    }
  }
  componentWillReceiveProps(newprops){
    this.setState({xbox:newprops.xbox});
    this.setState({pc:newprops.pc});
  }
  componentDidMount(){
    fetch('/recent/',{
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then(res=>res.json()).then(json=>this.setState({recent: json})).catch(error=>console.log(error))
  }

  render(){
    //map recent users object to player
    let recentPlayers = Object.keys(this.state.recent);
    console.log(recentPlayers);

    return(
      <div id="home">
      <header className="App-header">
        <div id="header-cover">
          <div id="top-accent">
            <div id="network">

              <div id="stat-boi-network">
                <span className="br-tracker">BATTLE ROYALE</span><br />
                <span className="stat-tracker">STATISTICS</span>
              </div>
            </div>



          </div>
            <ul id="nav-links">
              <li className="nav-link nav-active" id="home-link" href="#">HOME</li>
              <li className="nav-link" id="compare-link">SIDE BY SIDE</li>
              <li className="nav-link" id="top-link">TOP PLAYERS</li>
              <li className="nav-link" id="item-link">ITEM STATS</li>
            </ul>
        </div>
        <div id="main-title">
          <p id="subtitle">IT'S A NUMBERS GAME</p>
          <h1 id="header-logo"><a href="#">PUBG BOI</a></h1>
        </div>


          <div id="platform-search-section">
              <Search recentPlayers={recentPlayers} history={this.props.history} updatesearch={this.props.updateSearch} runSearch={this.props.runSearch} getPlayer={this.getPlayer} search={this.props.search} />

              {this.state.pc && <PCRegion chooseRegion={this.props.chooseRegion} region={this.props.region} />}
              {this.state.xbox && <XboxRegion region={this.props.region} chooseRegion={this.props.chooseRegion}/>}
              <PlatformSelect pc={this.state.pc} chooseXbox={this.props.chooseXbox} choosePC={this.props.choosePC}/>

          </div>

    </header>

    <section id="top-players-section">
     <div id="leaderboards">
       <div id="leaderboards-header">
         <h2 id="top-players-title">RECENT PLAYERS</h2>
       </div>
       <div>
       {recentPlayers.map((player)=>
         <div key={player} className="recent-player">{player}</div>
       )}
       </div>

     </div>
    </section>



  </div>
    )
  }
}

class PlatformSelect extends Component{
  constructor(props){
    super(props);
    this.state={
      pc: true
    }
  }
  componentWillReceiveProps(newP){
    this.setState({pc: newP.pc})
  }
  render(){
    return(
        <div>
        {this.state.pc &&
          <ul id="platform-list">
            <li className="platform-item active-region" id="pc" onClick={this.props.choosePC}>PC</li>
            <li className="platform-item" id="xbox" onClick={this.props.chooseXbox} >XBOX</li>
          </ul>
         }

          {!this.state.pc &&
            <ul id="platform-list">
              <li className="platform-item" id="pc" onClick={this.props.choosePC}>PC</li>
              <li className="platform-item active-region" id="xbox" onClick={this.props.chooseXbox} >XBOX</li>
            </ul>
        }
        </div>

    )
  }
}
class PCRegion extends Component{
  constructor(props){
    super(props);
    this.state={
      region: props.region
    }
  }
  render(){
    console.log(this.props.region);
    this.activeBg = {
      backgroundColor: 'yellow'
    }
    return(
      <div id="PC-region-select">
        <select  id="pc-region-list" value={this.props.region} onChange={this.props.chooseRegion}>
          <option id="pc-na" value="pc-na" className="list-item region-li" >North America</option>
          <option id="pc-krjp" value="pc-krjp" className="list-item region-li" >Korea</option>
          <option id="pc-jp" value="pc-jp" className="list-item region-li" >Japan</option>
          <option id="pc-eu" value="pc-eu" className="list-item region-li" >Europe</option>
          <option id="pc-ru" value="pc-ru" className="list-item region-li" >Russia</option>
          <option id="pc-oc" value="pc-oc" className="list-item region-li" >Oceania</option>
          <option id="pc-kakao" value="pc-kakao" className="list-item region-li" >Kakao</option>
          <option id="pc-sea" value="pc-sea" className="list-item region-li">South East Asia</option>
          <option id="pc-sa" value="pc-sa" className="list-item region-li" >South and Central Americas</option>
          <option id="pc-as" value="pc-as" className="list-item region-li" >Asia</option>
        </select>
      </div>
    )
  }
}
class XboxRegion extends Component{
  render(){
    return(
      <div id="Xbox-region-select">
        <select id="xbox-region-list" value={this.props.region} onChange={this.props.chooseRegion}>
          <option selected="selected" className="region-li"  value="xbox-na" >North America</option>
          <option className="region-li"  value="xbox-as" >Asia</option>
          <option className="region-li"  value="xbox-eu" >Europe</option>
          <option className="region-li"  value="xbox-oc" >Oceania</option>
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
    console.log('Running Search');
    this.props.history.push('/user/'+this.props.search);
  }
  render(){
    return(
      <div id="search-container">
        <div id="search-title">FIND YOUR STATS</div>
        <form id="search-form" action="">
          <input id="search-input" type="text" placeholder="PUBG Player Name" value={this.props.search} onChange={this.props.updatesearch}></input>
          <button id="search-button" action="" onClick={this.runSearch}>
            <i className="fas fa-search fa-2x"></i>
          </button>
        </form>
        <p>Find by PC Username or Xbox Gamertag</p>
        <span>Currently Following {this.props.recentPlayers.length} Players</span>
      </div>
    )
  }
}

class User extends Component{
  constructor(props){
    super(props);
    this.baseURL="https://api.playbattlegrounds.com/shards";
    this.updateSearch = this.updateSearch.bind(this);
    this.search = this.search.bind(this);
    this.toMatches = this.toMatches.bind(this);
    this.toStats = this.toStats.bind(this);
    this.state={
      rank: 0,
      seasonActive:'Season 6',
      search:"",
      notfound: false,
      loading: true,
      error: false,
      statsActive:true,
      fpp:true,
      season:'division.bro.official.2018-06',
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
  this.setState({season: e.target.value,seasonActive: "Season "+(e.target.value).slice(-1)});
  console.log("Season changed to"+this.state.season);
}
toMatches(){
  this.setState({statsActive:false});
}
toStats(){
  this.setState({statsActive:true});
}
changeFpp(){
  this.setState({fpp: !this.state.fpp});
}
updateSearch(event){
  this.setState({search: event.target.value});
}
search(e){
  this.props.history.push('/user/'+this.state.search);
}

  render(){

    var winratio = (this.state.player.data.attributes.gameModeStats['solo-fpp'].wins+this.state.player.data.attributes.gameModeStats['solo'].wins+this.state.player.data.attributes.gameModeStats['duo-fpp'].wins+this.state.player.data.attributes.gameModeStats['duo'].wins+this.state.player.data.attributes.gameModeStats['squad-fpp'].wins+this.state.player.data.attributes.gameModeStats['squad'].wins);
    var tenratio = (this.state.player.data.attributes.gameModeStats['solo-fpp'].top10s+this.state.player.data.attributes.gameModeStats['solo'].top10s+this.state.player.data.attributes.gameModeStats['duo-fpp'].top10s+this.state.player.data.attributes.gameModeStats['duo'].top10s+this.state.player.data.attributes.gameModeStats['squad-fpp'].top10s+this.state.player.data.attributes.gameModeStats['squad'].top10s);
    const data={
      series:[((winratio/tenratio)*100) , (100-(((winratio/tenratio)*100)))]
    }


    return(
      <div id="user-page">
        <div id="user-header-bg">
        </div>
        <header id="user-header">
          <div id="top-bar">
          <div id="logo-container">
          <Link to="/" id="home-link">
            <div id="pubg-boi-logo">
              <img id="logo" src={require('./img/pubgboi-logo.png')} alt=""/>
            </div>
          </Link>
          </div>

            <div id="user-navbar">
              <Link className="navbar-link" style={{padding:'0 .5rem',fontSize:'1rem',textDecoration:'none',color:'white',fontWeight:'bold'}} to="/" id="nav-home-link">HOME</Link>
              <Link className="navbar-link" style={{padding:'0 .5rem',fontSize:'1rem',textDecoration:'none',color:'white',fontWeight:'bold'}} to="/compare" id="compare-nav-link">COMPARE</Link>
              <Link className="navbar-link" style={{padding:'0 .5rem',fontSize:'1rem',textDecoration:'none',color:'white',fontWeight:'bold'}} to="/leaderboards" id="leaderboards-nav-link">LEADERBOARDS</Link>
              <Link className="navbar-link" style={{padding:'0 .5rem',fontSize:'1rem',textDecoration:'none',color:'white',fontWeight:'bold'}} to="/leaderboards" id="leaderboards-nav-link">ITEM STATS</Link>
            </div>

          </div>
          <div id="user-search-container">
            <div id="search-form-container">
              <form action="" id="user-search-form">
                <input id="user-search-input" type="text" placeholder="PUBG Player Name" value={this.state.search} onChange={this.updateSearch} />
                <button id="user-search-button" onClick={this.search}>
                  <i class="fas fa-search fa-2x"></i>
                </button>
              </form>

            </div>
        </div>
      </header>



      <div id="user-content">
      {this.state.notfound && <NotFound />}
      {this.state.loading && <Placeholder />}
        {!this.state.loading && !this.state.notfound && <div id="user-info">
          <div id="name-container">
            <div id="player-info">
              <span id="player-name">{this.userParam}</span><span id="player-region">{this.props.region}</span>
            </div>
          </div>

          <div id='options'>
            <select id="season-select" value={this.state.season} onChange={this.changeSeason.bind(this)}>
              <option value="division.bro.official.2018-06" >Season 6</option>
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
          <div id="buffer">
            {this.state.statsActive &&
              <div id="stats-matches-changer">
                <span id ="stats-active">STATS</span><span id="matches-inactive" onClick={this.toMatches}>MATCHES</span>
              </div>
            }
            {!this.state.statsActive &&
              <div id="stats-matches-changer">
                <span id ="stats-inactive" onClick={this.toStats}>STATS</span><span id="matches-active">MATCHES</span>
              </div>
            }
            </div>
          {this.state.statsActive &&<div id="stat-page">
          <div id="overview">
            <h2 id="overview-title">{this.state.seasonActive.toUpperCase()} OVERVIEW</h2>
            <div id="overview-stats-holder">
              <div id="total-rounds" className="overview-stat-container">

                <div className="overview-stat stat-margin">
                   {this.state.player.data.attributes.gameModeStats['solo-fpp'].roundsPlayed+this.state.player.data.attributes.gameModeStats['solo'].roundsPlayed+this.state.player.data.attributes.gameModeStats['duo-fpp'].roundsPlayed+this.state.player.data.attributes.gameModeStats['duo'].roundsPlayed+this.state.player.data.attributes.gameModeStats['squad-fpp'].roundsPlayed+this.state.player.data.attributes.gameModeStats['squad'].roundsPlayed} <span className="stat-grey">Rounds</span>
                 </div>

              </div>

              <div id="total-wins" className="overview-stat-container overview-stat">

                 <div id="total-wins-display" className="stat-margin">{this.state.player.data.attributes.gameModeStats['solo-fpp'].wins+this.state.player.data.attributes.gameModeStats['solo'].wins+this.state.player.data.attributes.gameModeStats['duo-fpp'].wins+this.state.player.data.attributes.gameModeStats['duo'].wins+this.state.player.data.attributes.gameModeStats['squad-fpp'].wins+this.state.player.data.attributes.gameModeStats['squad'].wins} <span className="stat-grey">Wins</span></div>
              </div>
              <div className="overview-stat-container" id="overview-kills">

                <div id="total-kills" className="stat-margin overview-stat">
                  {this.state.player.data.attributes.gameModeStats['solo-fpp'].kills+this.state.player.data.attributes.gameModeStats['solo'].kills+this.state.player.data.attributes.gameModeStats['duo-fpp'].kills+this.state.player.data.attributes.gameModeStats['duo'].kills+this.state.player.data.attributes.gameModeStats['squad-fpp'].kills+this.state.player.data.attributes.gameModeStats['squad'].kills}
                  <span className="stat-grey"> Kills</span>
                </div>
              </div>
              <span id="win-percent" className="stat-grey">Wins <span className="overview-stat">{((winratio/tenratio)*100).toFixed(1)}%</span> of Top 10 Scenarios</span><br />
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
          </div>
          }

          {
            !this.state.statsActive &&
            <div id="match-page">

              <Matches id={this.state.player.data.relationships.player.data.id}/>

            </div>
          }



        </div>
        }
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
  componentDidMount(){
    this.setState({data: this.props.data});
    console.log("Component Mounted and state updated.")
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
  componentDidMount(){
    this.setState({data: this.props.data});
    console.log("Component Mounted and state updated.")
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
  componentDidMount(){
    this.setState({data: this.props.data});
    console.log("Component Mounted and state updated.")
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
  componentDidMount(){
    this.setState({data: this.props.data});
    console.log("Component Mounted and state updated.")
  }
  componentWillReceiveProps(newprops){
    this.setState({data: newprops.data});
    console.log("New Props recieved and state updated.");
  }
  render(){
    return(
        <div id="solosfpp" className="mode">
          <div className="section-header bg-orange">
            <span className="mode-bold">SOLO FPP</span>
            <div className="rounds-horiz">
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
  componentDidMount(){
    this.setState({data: this.props.data});
    console.log("Component Mounted and state updated.")
  }
  componentWillReceiveProps(newprops){
    this.setState({data: newprops.data});
  }
  render(){
    return(
        <div id="duosfpp" className="mode">
          <div className="section-header bg-green">
            <span className="mode-bold">DUOS FPP</span>
            <div  className="rounds-horiz">
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
  componentDidMount(){
    this.setState({data: this.props.data});
    console.log("Component Mounted and state updated.")
  }
  componentWillReceiveProps(newprops){
    this.setState({data: newprops.data});
  }
  render(){
    return(
        <div id="squadsfpp" className="mode">
          <div className="section-header bg-purple">
            <span className="mode-bold">SQUADS FPP</span>
            <div  className="rounds-horiz">
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
      matches:[
        {

        }
      ]
    }
  }

  componentDidMount(){
    // Grab matches from server, stored in matchCache from prior ID call.
    console.log('Get request with id: '+this.props.id);
    fetch('/matches/'+this.props.id,{
      method:'get',
      headers: new Headers({
      'Content-Type': 'application/json'
        })
    }).then(response=>response.json()).then(json=>this.setState({matches:json})).catch(error=>console.log(error));

  }
  // Use map function to map matches array into individual Match components
  render(){
    return(
      <div id="matches-container">
        <ul id="match-list">
          {this.state.matches.map((match,i)=> <Match key={i} match={match} />)}
        </ul>
      </div>
    )
  }

}
class Match extends Component{
  constructor(props){
    super(props);
    this.state={
      match:{
        id: props.match.id,
        recieved: false,
        match: {}
      }
    }
    this.fetchMatch = this.fetchMatch.bind(this);
  }
  componentDidMount(props){
    this.setState({id: this.props.match.id});
    console.log(this.props.match.id);
  }
  fetchMatch(e){
    e.preventDefault();
    if(this.state.recieved==true){
      return
    }
    console.log("Sending match request to server with ID: " + this.props.match.id);
    const that = this;
    console.log(this.state.match.id);
    // Add fetch to server @ /match/:id
    fetch('/match/'+this.props.match.id,{
      method:'get',
      headers: new Headers({
      'Content-Type': 'application/json'
      })
    }).then(res=>res.json()).then(function(json){
      that.setState({match: json,recieved:true});
      console.log(that.state.match);
    }).catch(error=>console.log(error))
  }
  render(){
    return(
      <div className="match">
        <div className="match-access">
          <span className="match-subtitle">Match ID: {this.props.match.id}</span>
          {!this.state.recieved && <button className="match-id" onClick={this.fetchMatch}>
          View Match
          </button>}
        </div>
        {this.state.recieved && <MatchStats match={this.state.match} />}
      </div>
    )
  }
}
class MatchStats extends Component{
  constructor(props){
    super(props);
    this.state={
      viewTeam: false,
      match: {
        teams: props.match.teams,
        stats:{
          mode:props.match.stats.mode,
          map:props.match.stats.map,
          duration:props.match.stats.duration,
          region:props.match.stats.region
        }
      }
    }
  }
  componentDidMount(){

  }
  render(){
    // Sort teams by rank
    // Load team number keys into array
    const keys = Object.keys(this.state.match.teams);
    const that = this;
    let ranked = [];
    // Load teams into array to be sorted
    keys.forEach(function(index){
      ranked.push(that.state.match.teams[index]);
    });
    // Sort by rank value, ascending
    let teamsOrdered = ranked.sort(function(a,b){
      return a.rank - b.rank;
    });
    console.log(teamsOrdered);
    if (this.state.match.stats.map == "Erangel_Main"){
      var matchStyle = {
        backgroundImage: 'url("../img/erangel-bg.jpg")'
      };
    }
    if (this.state.match.stats.map == "Desert_Main"){
      var matchStyle = {
        backgroundImage: 'url("../img/miramar-bg.jpg")'
      };
    }
    return(

      <div className="match-expanded">
        <div className="match-stats">
          <div className="match-header" style={matchStyle}>
            <div className="game-info">
              <span className="game-mode">{this.state.match.stats.mode}</span>
              {(this.state.match.stats.map=="Erangel_Main")&&<p className="map-name">Erangel</p>}
              {(this.state.match.stats.map=="Desert_Main")&&<p className="map-name">Miramar</p>}
              <div><span className="minutes">{((this.state.match.stats.duration)/60).toFixed(0)} min</span><span id='seconds'> {((this.state.match.stats.duration)%60)} sec</span></div>
            </div>
          </div>
          <div className="rankings">
            <div className="match-rankings-title">Final Rankings</div>
            {teamsOrdered.map((team)=>
              <Team team={team} />
            )}
          </div>
        </div>
      </div>
    )
  }
}
class Team extends Component{
  constructor(props){
    super(props);
    this.state={
      dropdown: false,
      team: props.team
    }
    this.handleClick=this.handleClick.bind(this);
  }
  handleClick(){
    this.setState({dropdown: !this.state.dropdown})
  }
  render(){
    return(
      <div className="team-ranking">
        <div className="flex" onClick={this.handleClick}>
          <div className="rank">
            {this.state.team.rank}
          </div>
          <div className="players-bar">
            <span className="player-list">{this.state.team.team.map((player)=>
                <span>| {player.name} </span>
            )}</span>
          </div>
          <span className="team-expand-tab"><i className="fas fa-caret-down fa-lg"></i></span>
        </div>

        {this.state.dropdown &&
          <div className="team-dropdown" >
            <span className="breakdown-title">Team {this.state.team.rank}  Breakdown</span>
            <div className="team-container">
            {this.state.team.team.map((player)=>
              <div className="player-stats">
                {player.name}
                <div>
                  <div>
                    Points<br />
                    {player.stats.winPoints}
                  </div>
                  <div>
                    Kills<br />
                    {player.stats.kills}
                  </div>
                  <div>
                  Headshot Kills<br />
                  {player.stats.headshotKills}
                  </div>
                </div>
              </div>
            )}
            </div>

          </div>
        }

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
  componentDidMount(){
    this.setState({data: this.props.data});
    console.log("Component Mounted and state updated.")
  }
  componentWillReceiveProps(nextProps){
    this.setState({data:nextProps.data});


}


  render(){
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
          <div className="grid-win-percent">%</div>
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

        </div>
      </div>
    )
  }
}
class ErrorPage extends Component{
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
        <img id="loading" src={require('./img/loading.svg')} alt=""/>
      </div>
    )
  }
}
class NotFound extends Component{
  render(){
    return(
      <div id="not-found-component">
        <span>PLAYER NOT FOUND</span>
        <p>Hint: Player names are case sensitive.</p>
        <p>Hint: Ensure you are searching within the correct region.</p>
      </div>
    )
  }
}

export default App;
