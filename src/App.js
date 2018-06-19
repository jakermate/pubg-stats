import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import loading from './loading.svg'


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
                <Route path="/compare/:name?" render={(props)=><Compare {...props}  />} />
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
       <div id="recent-players-container">
       {recentPlayers.map((player)=>
         <div key={player} className="recent-player">{player}</div>
       )}
       </div>

     </div>
    </section>


    <Footer />
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
        <div id="or-compare"><Link to="/compare/">OR COMPARE TWO PLAYERS</Link></div>
        <p className="text-shadow">Find by PC Username or Xbox Gamertag</p>
        <span className="text-shadow">Currently Following {this.props.recentPlayers.length} Players</span>
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
    this.changeMode=this.changeMode.bind(this);
    this.compareTo = this.compareTo.bind(this);
    this.state={
      rank: 0,
      seasonActive:'Season 6',
      search:"",
      notFound: false,
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
  this.setState({notFound:false});
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
  }).then(response=>response.json()).then(function(json){
    if('error' in json){that.setState({notFound: true})}else{that.setState({player:json,loading:false})}}).catch(function(error){console.log(error);that.setState({notfound:true,loading:false})});

}
changeSeason(e){
  this.setState({season: e.target.value,seasonActive: "Season "+(e.target.value).slice(-1)});
  console.log("Season changed to"+this.state.season);
  fetch('/user/?name='+this.userParam+'&region='+this.region+"&season="+e.target.value,{
    method:'get',
    headers: new Headers({
      "Content-Type": 'application/json'
    })
  }).then(res=>res.json()).then(json=>this.setState({player: json})).catch(error=>console.log(error))
}
toMatches(){
  this.setState({statsActive:false});
}
toStats(){
  this.setState({statsActive:true});
}
changeMode(){
  this.setState({fpp: !this.state.fpp});
}
updateSearch(event){
  this.setState({search: event.target.value});
}
search(e){
  this.props.history.push('/user/'+this.state.search);
}
compareTo(){
  this.props.history.push('/compare/'+this.userParam);

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
          <div id="network">

            <div id="stat-boi-network">
              <span className="br-tracker">BATTLE ROYALE</span><br />
              <span className="stat-tracker">STATISTICS</span>
            </div>
          </div>
          <div id="logo-container">
          <Link to="/" id="home-link">
            <div id="user-logo">PUBG BOI</div>
          </Link>
          </div>

            <div id="user-navbar">
              <Link className="navbar-link" style={{padding:'0 .5rem',fontSize:'1rem',textDecoration:'none',color:'white',fontWeight:'bold'}} to="/" id="nav-home-link">HOME</Link>
              <Link className="navbar-link" style={{padding:'0 .5rem',fontSize:'1rem',textDecoration:'none',color:'white',fontWeight:'bold'}} to="/compare" id="compare-nav-link">COMPARE</Link>
            </div>

          </div>
          <div id="user-search-container">
            <div id="search-form-container">
              <form action="" id="user-search-form">
                <input id="user-search-input" type="text" placeholder="PUBG Player Name" value={this.state.search} onChange={this.updateSearch} />
                <button id="user-search-button" onClick={this.search}>
                  <i className="fas fa-search fa-2x"></i>
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
            <div id="compare-to" onClick={this.compareTo}>COMPARE WITH {this.userParam.toUpperCase()}... </div>
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
                   <span className="bolden">{this.state.player.data.attributes.gameModeStats['solo-fpp'].roundsPlayed+this.state.player.data.attributes.gameModeStats['solo'].roundsPlayed+this.state.player.data.attributes.gameModeStats['duo-fpp'].roundsPlayed+this.state.player.data.attributes.gameModeStats['duo'].roundsPlayed+this.state.player.data.attributes.gameModeStats['squad-fpp'].roundsPlayed+this.state.player.data.attributes.gameModeStats['squad'].roundsPlayed}</span> <span className="stat-grey">Rounds</span>
                 </div>

              </div>

              <div id="total-wins" className="overview-stat-container overview-stat">

                 <div id="total-wins-display" className="stat-margin">
                 <span className="bolden">{this.state.player.data.attributes.gameModeStats['solo-fpp'].wins+this.state.player.data.attributes.gameModeStats['solo'].wins+this.state.player.data.attributes.gameModeStats['duo-fpp'].wins+this.state.player.data.attributes.gameModeStats['duo'].wins+this.state.player.data.attributes.gameModeStats['squad-fpp'].wins+this.state.player.data.attributes.gameModeStats['squad'].wins}</span> <span className="stat-grey">Wins</span></div>
              </div>
              <div className="overview-stat-container" id="overview-kills">

                <div id="total-kills" className="stat-margin overview-stat">
                  <span className="bolden">{this.state.player.data.attributes.gameModeStats['solo-fpp'].kills+this.state.player.data.attributes.gameModeStats['solo'].kills+this.state.player.data.attributes.gameModeStats['duo-fpp'].kills+this.state.player.data.attributes.gameModeStats['duo'].kills+this.state.player.data.attributes.gameModeStats['squad-fpp'].kills+this.state.player.data.attributes.gameModeStats['squad'].kills}</span>
                  <span className="stat-grey"> Kills</span>
                </div>
              </div>

              <div id="win-percent" className="stat-grey overview-stat-container">Wins <span className="overview-stat">{((winratio/tenratio)*100).toFixed(1)}%</span> of Top 10 Scenarios</div>

            </div>


          </div>


          {this.state.fpp && <div id="fpp-changer">
            <div id="fpp-changer-inner">
              <span className="mode-active">FPP </span>
              <span onClick={this.changeMode}>| TPP</span>
            </div>
          </div>}
          {!this.state.fpp && <div id="fpp-changer">
            <div id="fpp-changer-inner">
              <span onClick={this.changeMode}>FPP |</span>
              <span className="mode-active"> TPP</span>
            </div>
          </div>}

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
    <Footer />
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
            <span className="mode-bold">SOLO TPP</span>
            <div  className="rounds-horiz">
              <span className="rounds-played">{this.state.data.roundsPlayed}</span> <span>ROUNDS</span>
            </div>
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
            <span className="mode-bold">DUOS TPP</span>
            <div  className="rounds-horiz">
              <span className="rounds-played">{this.state.data.roundsPlayed}</span> <span>ROUNDS</span>
            </div>
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
            <span className="mode-bold">SQUADS TPP</span>
            <div  className="rounds-horiz">
              <span className="rounds-played">{this.state.data.roundsPlayed}</span> <span>ROUNDS</span>
            </div>
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
        <div id="sorted">Matches Played (By Most Recent)</div>
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
          {this.state.recieved && <i className="fas fa-caret-down fa-lg" style={{marginRight:'1rem'}}></i>}
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
              <Team className="alt-bg" team={team} />
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
                <span>|  {player.name} </span>
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
                <span className="bolden">{player.name}</span>
                <div style={{marginLeft:'.5rem',marginTop:'.3rem'}}>
                  <div>
                    <span className="stat-grey">Points  </span>
                    <span className="stat-bold">{player.stats.winPoints}</span>
                  </div>
                  <div>
                    <span className="stat-grey">Kills  </span> <span className="stat-bold">{player.stats.kills}</span>
                  </div>
                  <div>
                  <span className="stat-grey">Headshot Kills  </span>
                  <span className="stat-bold">{player.stats.headshotKills}</span>
                  </div>
                  <div>
                  <span className="stat-grey">Damage Dealt  </span>
                  <span className="stat-bold">{player.stats.damageDealt.toFixed(1)}</span>
                  </div>
                  <div>
                  <span className="stat-grey">Boosts Used  </span>
                  <span className="stat-bold">{player.stats.boosts}</span>
                  </div>
                  <div>
                  <span className="stat-grey">Kill Rank  </span>
                  <span className="stat-bold">{player.stats.killPlace}</span>
                  </div>
                  <div>
                  <span className="stat-grey">Down But Not Outs  </span>
                  <span className="stat-bold">{player.stats.DBNOs}</span>
                  </div>
                  <div>
                  <span className="stat-grey">Revives  </span>
                  <span className="stat-bold">{player.stats.revives}</span>
                  </div>
                  <div>
                  <span className="stat-grey">Distance On Foot  </span>
                  <span className="stat-bold">{player.stats.walkDistance.toFixed(2)} m</span>
                  </div>
                  <div>
                  <span className="stat-grey">Distance By Vehicle  </span>
                  <span className="stat-bold">{player.stats.rideDistance.toFixed(2)} m</span>
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
      <div>
        {this.state.data.roundsPlayed==0 && <NoRounds />}
        {this.state.data.roundsPlayed!=0 && <div className="stats-container">

          <div className="stat-grid">
            <div id="wins" className="grid-unit">
              <div className="stat-total"><i className="icon-margin fas fa-trophy"></i> {this.state.data.wins}</div>
              <div className="stat-subtitle">Wins</div>
            </div>
            <div id="top-10" className="grid-unit">
              <div className="stat-total"><i className="icon-margin fas fa-chess-rook"></i> {this.state.data.top10s}</div>
              <div className="stat-subtitle">Top 10s</div>
            </div>
            <div className="grid-win-percent grid-unit">
              <div className="stat-total">{(((this.state.data.wins)/(this.state.data.roundsPlayed))*100).toFixed(1)}%</div>
              <div className="stat-subtitle">Win Rate</div>
            </div>
            <div className="grid-top-ten grid-unit">
              <div id="top-ten-total" className="stat-total">{((this.state.data.damageDealt)/(this.state.data.roundsPlayed)).toFixed(0)}</div>
              <div id="top-ten-subtitle" className="stat-subtitle">Avg. Damage Dealt Per Round</div>
            </div>
            <div className="grid-kill-per-game grid-unit">
              <div id="kill-er-game-total" className="stat-total"><i className="icon-margin fas fa-church"></i> {(this.state.data.kills/this.state.data.roundsPlayed).toFixed(1)}</div>
              <div id="kills-per-game-subtitle" className="stat-subtitle">Kills/Game</div>
              <div id="kills-per-game-graphic"></div>
            </div>
            <div className="grid-headshots grid-unit">
              <div id="headshots-total" className="stat-total">
                <i className="icon-margin far fa-dot-circle"></i> {this.state.data.headshotKills}
              </div>
              <div id="headshots-subtitle" className="stat-subtitle">Headshots</div>
              <div id="headshot-percent">
                <span>That's {(((this.state.data.headshotKills)/(this.state.data.kills))*100).toFixed(2)}% of kills from headshots</span>
              </div>
            </div>
            <div className="grid-max-streak grid-unit">
              <div id="kill-streak-total" className="stat-total"><i className="icon-margin fab fa-pied-piper-alt"></i> {this.state.data.roundMostKills}</div>
              <div id="kill-streak-subtitle" className="stat-subtitle">Longest Kill Streak</div>
              <div id="kill-streak-graphic"></div>
            </div>
            <div className="grid-longest-kill grid-unit">
              <div id="longest-kill-total" className="stat-total"><i className="icon-margin fas fa-crosshairs"></i> {this.state.data.longestKill.toFixed(1)} m.</div>
              <div id="longest-kill-subtitle" className="stat-subtitle">Farthest Distance Kill</div>
              <div id="longest-kill-graphic">
              <span>That's {(this.state.data.longestKill/109.1).toFixed(1)} <i className="fas fa-football-ball"></i> fields. </span>
              </div>
            </div>
            <div className="grid-time-survived grid-unit">
              <div id="survived-time-total" className="stat-total"><i className="icon-margin fas fa-stopwatch"></i> {(((this.state.data.timeSurvived)/(this.state.data.roundsPlayed))/60).toFixed(0)} min</div>
              <div id="survived-time-subtitle" className="stat-subtitle">Average Survival Time</div>
            </div>
            <div className="grid-unit">
              <div id="distance-traveled" className="stat-total">
                <i className="icon-margin fab fa-accessible-icon not-bold"></i>
                {((this.state.data.walkDistance+this.state.data.walkDistance)/(this.state.data.roundsPlayed)).toFixed(0)} m.</div>
                <div className="stat-subtitle">Distance Traveled Per Round</div>

            </div>

          </div>
        </div>}
      </div>
    )
  }
}

class Compare extends Component{
  constructor(){
    super();
    this.updatePlayerOne = this.updatePlayerOne.bind(this);
    this.updatePlayerTwo = this.updatePlayerTwo.bind(this);
    this.getPlayerOne = this.getPlayerOne.bind(this);
    this.getPlayerTwo = this.getPlayerTwo.bind(this);
    this.goToPlayerOne = this.goToPlayerOne.bind(this);
    this.goToPlayerTwo = this.goToPlayerTwo.bind(this);
    this.selectRegionOne=this.selectRegionOne.bind(this);
    this.selectRegionTwo=this.selectRegionTwo.bind(this);
    this.selectSeasonOne=this.selectSeasonOne.bind(this);
    this.selectSeasonTwo=this.selectSeasonTwo.bind(this);
    this.state={
      fpp: true,
      regionOne:"pc-na",
      regionTwo:"pc-na",
      playerOneNotFound:false,
      playerTwoNotFound:false,
      seasonOne:"division.bro.official.2018-06",
      seasonTwo:"division.bro.official.2018-06",
      player1name:"",
      player1:{
        name:'',
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
      player2name:"",
      player2:{
        name:'',
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
      }
    }
  }
componentWillReceiveProps(newProps){ //To update state data when api call passes down data.

}
componentDidMount(){
  // If url is pushed with the optional parameter filled
  if(this.props.match.params.name){
    let compareParam = this.props.match.params.name;
    console.log(compareParam);
    let that=this;
    fetch('/user/?&name='+compareParam+'&region='+this.state.regionOne+'&season='+this.state.seasonOne,{
      method:'get',
      headers: new Headers({
        'Content-Type':'application/json'
      })
    }).then(res=>res.json()).then(json=>this.setState({player1: json,player1name:compareParam,playerOneNotFound:false})).catch(function(error){console.log(error);that.setState({playerOneNotFound:true})})

  }

}
selectSeasonOne(event){
  this.setState({seasonOne: event.target.value});
}
selectSeasonTwo(event){
  this.setState({seasonTwo: event.target.value});
}
selectRegionOne(event){
  this.setState({regionOne: event.target.value})
}
selectRegionTwo(event){
  this.setState({regionTwo: event.target.value})
}
goToPlayerOne(e){
  e.preventDefault();
  this.props.history.push('/user/'+this.state.player1.name);
}
goToPlayerTwo(e){
  e.preventDefault();
  this.props.history.push('/user/'+this.state.player2.name);
}
updatePlayerOne(event){
  this.setState({player1name: event.target.value})
}
updatePlayerTwo(event){
  this.setState({player2name: event.target.value})
}
getPlayerOne(event){
  event.preventDefault();
  this.setState({playerOneNotFound:false});
  let that=this;
  console.log('searching with name '+this.state.player1name+' region '+this.state.regionOne+' season '+this.state.seasonOne);
  fetch('/user/?&name='+this.state.player1name+'&region='+this.state.regionOne+'&season='+this.state.seasonOne,{
    method:'get',
    headers: new Headers({
      'Content-Type':'application/json'
    })
  }).then(res=>res.json()).then(function(json){
    if('error' in json){
      that.setState({playerOneNotFound:true})
    }
    else{that.setState({player1: json,playerOneNotFound:false})}
  }).catch(function(error){console.log(error);that.setState({playerOneNotFound:true})})
}
getPlayerTwo(event){
  event.preventDefault();
  this.setState({playerTwoNotFound:false});
  let that=this;
  console.log('searching with name '+this.state.player2name+' region '+this.state.regionTwo+' season '+this.state.seasonTwo);
  fetch('/user/?&name='+this.state.player2name+'&region='+this.state.regionTwo+'&season='+this.state.seasonTwo,{
    method:'get',
    headers: new Headers({
      'Content-Type':'application/json'
    })
  }).then(res=>res.json()).then(function(json){
    if('error' in json){
      that.setState({playerTwoNotFound:true})
    }
    else{that.setState({player2: json,playerTwoNotFound:false})}
  }).catch(function(error){console.log(error);that.setState({playerTwoNotFound:true})})
}
  render(){

    // stat calculations
    let playerOneStats = {};
    let playerTwoStats = {};
    let playerOneStatsCompiled = {
      roundsPlayed: 0,
      wins: 0,
      kills: 0,
      headshotKills: 0,
      winPoints: 0,
      walkDistance:0,
      rideDistance:0,
      roadKills:0,
      vehicleDestroys:0,
      revives:0,
      longestKill:0,
      top10s:0,
      timeSurvived:0,
      mostTimeSurvived:0,
      damageDealt:0,
      assists:0,
      weaponsAcquired:0,
      suicides:0,
      maxKillStreaks:0
    };
    for(var each in this.state.player1.data.attributes.gameModeStats){
      playerOneStatsCompiled.roundsPlayed += this.state.player1.data.attributes.gameModeStats[each].roundsPlayed;
      playerOneStatsCompiled.wins += this.state.player1.data.attributes.gameModeStats[each].wins;
      playerOneStatsCompiled.kills += this.state.player1.data.attributes.gameModeStats[each].kills;
      playerOneStatsCompiled.headshotKills += this.state.player1.data.attributes.gameModeStats[each].headshotKills;
      playerOneStatsCompiled.winPoints += this.state.player1.data.attributes.gameModeStats[each].winPoints;
      playerOneStatsCompiled.walkDistance += this.state.player1.data.attributes.gameModeStats[each].walkDistance;
      playerOneStatsCompiled.rideDistance += this.state.player1.data.attributes.gameModeStats[each].rideDistance;
      playerOneStatsCompiled.roadKills += this.state.player1.data.attributes.gameModeStats[each].roadKills;
      playerOneStatsCompiled.vehicleDestroys += this.state.player1.data.attributes.gameModeStats[each].vehicleDestroys;
      playerOneStatsCompiled.revives += this.state.player1.data.attributes.gameModeStats[each].revives;
      playerOneStatsCompiled.top10s += this.state.player1.data.attributes.gameModeStats[each].top10s;
      playerOneStatsCompiled.timeSurvived += this.state.player1.data.attributes.gameModeStats[each].timeSurvived;
      playerOneStatsCompiled.longestKill += this.state.player1.data.attributes.gameModeStats[each].longestKill;
    }
    let playerTwoStatsCompiled = {
      roundsPlayed: 0,
      wins: 0,
      kills: 0,
      headshotKills: 0,
      winPoints: 0,
      walkDistance:0,
      rideDistance:0,
      roadKills:0,
      vehicleDestroys:0,
      revives:0,
      longestKill:0,
      top10s:0,
      timeSurvived:0,
      mostTimeSurvived:0,
      damageDealt:0,
      assists:0,
      weaponsAcquired:0,
      suicides:0,
      maxKillStreaks:0
    };
    for(var each in this.state.player2.data.attributes.gameModeStats){
      playerTwoStatsCompiled.roundsPlayed += this.state.player2.data.attributes.gameModeStats[each].roundsPlayed;
      playerTwoStatsCompiled.wins += this.state.player2.data.attributes.gameModeStats[each].wins;
      playerTwoStatsCompiled.kills += this.state.player2.data.attributes.gameModeStats[each].kills;
      playerTwoStatsCompiled.headshotKills += this.state.player2.data.attributes.gameModeStats[each].headshotKills;
      playerTwoStatsCompiled.winPoints += this.state.player2.data.attributes.gameModeStats[each].winPoints;
      playerTwoStatsCompiled.walkDistance += this.state.player2.data.attributes.gameModeStats[each].walkDistance;
      playerTwoStatsCompiled.rideDistance += this.state.player2.data.attributes.gameModeStats[each].rideDistance;
      playerTwoStatsCompiled.roadKills += this.state.player2.data.attributes.gameModeStats[each].roadKills;
      playerTwoStatsCompiled.vehicleDestroys += this.state.player2.data.attributes.gameModeStats[each].vehicleDestroys;
      playerTwoStatsCompiled.revives += this.state.player2.data.attributes.gameModeStats[each].revives;
      playerTwoStatsCompiled.top10s += this.state.player2.data.attributes.gameModeStats[each].top10s;
      playerTwoStatsCompiled.timeSurvived += this.state.player2.data.attributes.gameModeStats[each].timeSurvived;
      playerTwoStatsCompiled.longestKill += this.state.player2.data.attributes.gameModeStats[each].longestKill;
    }
    console.log(playerTwoStatsCompiled);

    // Chart Data
    // Create relative-width stat bars by adding both player's totals, then dividing the individual player stat by the total. Multiply by 100 to get the percentage of the total, and apply it as the width style with %

    let longestKillStyleOne={
      width: ((((playerOneStatsCompiled.longestKill)/(playerOneStatsCompiled.longestKill+playerTwoStatsCompiled.longestKill))*100).toFixed(0))+'%'
    }
    let longestKillStyleTwo={
      width: ((((playerTwoStatsCompiled.longestKill)/(playerOneStatsCompiled.longestKill+playerTwoStatsCompiled.longestKill))*100).toFixed(0))+'%'
    }
    let winPointsStyleOne={
      width: ((((playerOneStatsCompiled.winPoints)/(playerOneStatsCompiled.winPoints+playerTwoStatsCompiled.winPoints))*100).toFixed(0))+'%'
    }
    let winPointsStyleTwo={
      width: ((((playerTwoStatsCompiled.winPoints)/(playerOneStatsCompiled.winPoints+playerTwoStatsCompiled.winPoints))*100).toFixed(0))+'%'
    }
    let roundsPlayedStyleOne={
      width: ((((playerOneStatsCompiled.roundsPlayed)/(playerOneStatsCompiled.roundsPlayed+playerTwoStatsCompiled.roundsPlayed))*100).toFixed(0))+'%'
    }
    let roundsPlayedStyleTwo={
      width: ((((playerTwoStatsCompiled.roundsPlayed)/(playerOneStatsCompiled.roundsPlayed+playerTwoStatsCompiled.roundsPlayed))*100).toFixed(0))+'%'
    }
    let winRateStyleOne={
      width: ((((((playerOneStatsCompiled.wins)/(playerOneStatsCompiled.roundsPlayed))*100)/((((playerOneStatsCompiled.wins)/(playerOneStatsCompiled.roundsPlayed))*100)+(((playerTwoStatsCompiled.wins)/(playerTwoStatsCompiled.roundsPlayed))*100)))*100).toFixed(1))+'%'
    }
    let winRateStyleTwo={
      width: ((((((playerTwoStatsCompiled.wins)/(playerTwoStatsCompiled.roundsPlayed))*100)/((((playerOneStatsCompiled.wins)/(playerOneStatsCompiled.roundsPlayed))*100)+(((playerTwoStatsCompiled.wins)/(playerTwoStatsCompiled.roundsPlayed))*100)))*100).toFixed(1))+'%'
    }
    let walkDistanceStyleOne={
      width: ((playerOneStatsCompiled.walkDistance/(playerOneStatsCompiled.walkDistance+playerTwoStatsCompiled.walkDistance))*100).toFixed(1)+'%'
    }
    let walkDistanceStyleTwo={
      width: ((playerTwoStatsCompiled.walkDistance/(playerOneStatsCompiled.walkDistance+playerTwoStatsCompiled.walkDistance))*100).toFixed(1)+'%'
    }
    let rideDistanceStyleOne={
      width: ((playerOneStatsCompiled.rideDistance/(playerOneStatsCompiled.rideDistance+playerTwoStatsCompiled.rideDistance))*100).toFixed(1)+'%'
    }
    let rideDistanceStyleTwo={
      width: ((playerTwoStatsCompiled.rideDistance/(playerOneStatsCompiled.rideDistance+playerTwoStatsCompiled.rideDistance))*100).toFixed(1)+'%'
    }
    let top10StyleOne={
      width: ((((playerOneStatsCompiled.wins/playerOneStatsCompiled.top10s)*100)/(((playerOneStatsCompiled.wins/playerOneStatsCompiled.top10s)*100)+((playerTwoStatsCompiled.wins/playerTwoStatsCompiled.top10s)*100)))*100)+'%'
    }
    let top10StyleTwo={
      width: ((((playerTwoStatsCompiled.wins/playerTwoStatsCompiled.top10s)*100)/(((playerOneStatsCompiled.wins/playerOneStatsCompiled.top10s)*100)+((playerTwoStatsCompiled.wins/playerTwoStatsCompiled.top10s)*100)))*100)+'%'
    }
    let killsPerRoundStyleOne = {
      width: (((playerOneStatsCompiled.kills/playerOneStatsCompiled.roundsPlayed)/((playerOneStatsCompiled.kills/playerOneStatsCompiled.roundsPlayed)+(playerTwoStatsCompiled.kills/playerTwoStatsCompiled.roundsPlayed)))*100)+'%'
    }
    let killsPerRoundStyleTwo = {
      width: (((playerTwoStatsCompiled.kills/playerTwoStatsCompiled.roundsPlayed)/((playerOneStatsCompiled.kills/playerOneStatsCompiled.roundsPlayed)+(playerTwoStatsCompiled.kills/playerTwoStatsCompiled.roundsPlayed)))*100)+'%'
    }
    let headshotStyleOne={
      width: (((playerOneStatsCompiled.headshotKills/playerOneStatsCompiled.kills)/((playerOneStatsCompiled.headshotKills/playerOneStatsCompiled.kills)+(playerTwoStatsCompiled.headshotKills/playerTwoStatsCompiled.kills)))*100)+'%'
    }
    let headshotStyleTwo={
      width: (((playerTwoStatsCompiled.headshotKills/playerTwoStatsCompiled.kills)/((playerOneStatsCompiled.headshotKills/playerOneStatsCompiled.kills)+(playerTwoStatsCompiled.headshotKills/playerTwoStatsCompiled.kills)))*100)+'%'
    }
    return(
      <div id="compare-page">

      <div id="compare-header">
        <div id="compare-header-bg">
          <div id="compare-nav"></div>
          <a href="/"><div id="compare-logo">PUBG BOI</div></a>
        </div>
        <div id="compare-title">COMPARE</div>
        <div id="compare-season"></div>

        <div id="compare-search-section">
          <div id="player1-search" className="player-search">
            <span className="player-icons"> <i className="fas fa-user"></i></span>
            <form action="" className="compare-form">
              <input type="text" action="submit" value={this.state.player1name} className="compare-input" onChange={this.updatePlayerOne} placeholder="Player One" />
              <select name="" onChange={this.selectSeasonOne} id="compare-season-select1" className="compare-select">
                <option value="division.bro.official.2018-06" >Season 6</option>
                <option value="division.bro.official.2018-05" >Season 5</option>
                <option value="division.bro.official.2018-04" >Season 4</option>
                <option value="division.bro.official.2018-03" >Season 3</option>
                <option value="division.bro.official.2018-02" >Season 2</option>
                <option value="division.bro.official.2018-01" >Season 1</option>
              </select>
              <select name="" onChange={this.selectRegionOne} id="compare-region-select1" className="compare-select">
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
              {this.state.player1.name == ""&&<button onClick={this.getPlayerOne} className="compare-button load">LOAD</button>}
              {this.state.player1.name!=""&&<button onClick={this.getPlayerOne} className="compare-button">REPLACE</button>}
            </form>
          </div>
          <div id="player2-search" className="player-search">
          <span className="player-icons"> <i className="fas fa-user"></i> <i className="fas fa-user"></i></span>
            <form action="" className="compare-form">
              <input value={this.state.player2name} type="text" action="submit" className="compare-input" onChange={this.updatePlayerTwo} placeholder="Player Two" />
              <select name="" onChange={this.selectSeasonTwo} id="compare-season-select1" className="compare-select">
                <option value="division.bro.official.2018-06" >Season 6</option>
                <option value="division.bro.official.2018-05" >Season 5</option>
                <option value="division.bro.official.2018-04" >Season 4</option>
                <option value="division.bro.official.2018-03" >Season 3</option>
                <option value="division.bro.official.2018-02" >Season 2</option>
                <option value="division.bro.official.2018-01" >Season 1</option>
              </select>
              <select name="" onChange={this.selectRegionTwo} id="compare-region-select1" className="compare-select">
                <option id="pc-na" value="pc-na" className="list-item region-li" >North America</option>
                <option id="pc-krjp" value="pc-krjp" className="list-item region-li" >Korea</option>
                <option id="pc-jp" value="pc-jp" className="list-item region-li" >Japan</option>
                <option id="pc-eu" value="pc-eu" className="list-item region-li" >Europe</option>
                <option id="pc-ru" value="pc-ru" className="list-item region-li" >Russia</option>
                <option id="pc-oc" value="pc-oc" className="list-item region-li" >Oceania</option>
                <option id="pc-kakao" value="pc-kakao" className="list-item region-li" >Kakao</option>
                <option id="pc-sea" value="pc-sea" className="list-item region-li">South East Asia</option>
                <option id="pc-sa" value="pc-sa" className="list-item region-li" >South and Central Americas</option>
                <option id="pc-as" value="pc-as" className="list-item region-li" >Asia</option>              </select>
              {this.state.player2.name == ""&&<button onClick={this.getPlayerTwo} className="compare-button load">LOAD</button>}
              {this.state.player2.name!=""&&<button onClick={this.getPlayerTwo} className="compare-button">REPLACE</button>}
            </form>
          </div>
        </div>
      </div>



      <div id="compare-content">
        {!<div id="compare-mode-changer">
          {this.state.fpp && <div>
            <span className="mode-active">FPP </span><span>| TPP</span>
          </div>}
          {!this.state.fpp && <div>
            <span>FPP |</span><span className="mode-active"> TPP</span>
          </div>}
        </div>}
        <div id="compare-container">
          <div id="compare-content-header">
            {/* Only displays player 1 name if playerOneNotFound is false */}
            {!this.state.playerOneNotFound ? <div id="player1" className="player-section align-center">
              <span className="compare-name" onClick={this.goToPlayerOne}>{this.state.player1.name}</span>

            </div> : <div id="player1">NOT FOUND</div>}

            {/* Only displays player 1 name if playerOneNotFound is false */}
            {!this.state.playerTwoNotFound ? <div id="player2" className="player-section">
              <span className="compare-name" onClick={this.goToPlayerTwo}>{this.state.player2.name}</span>

            </div>:<div id="player2">NOT FOUND</div>}
          </div>


          {(this.state.player1.name!=""&&this.state.player2.name!="")&&<div id="versus-title">VS</div>}


          {(this.state.player1.name!=""&&this.state.player2.name!="") ?
          <div id="compare-sections">

            <div id="compare-rounds-played" className="compare-subsection">
            <span className="compare-stat-titles">ROUNDS PLAYED</span><i className="icon-bg fas fa-table-tennis"></i>
              <div className="chart-container">
                <div className="player-one-bar" style={roundsPlayedStyleOne}></div>
                <span className="chart-bar-subtitle">{(playerOneStatsCompiled.roundsPlayed)}</span>

                <div className="player-two-bar" style={roundsPlayedStyleTwo}></div>
                <span className="chart-bar-subtitle">{(playerTwoStatsCompiled.roundsPlayed)}</span>
              </div>
            </div>
            <div id="wins-compare" className="compare-subsection">
                <span className="compare-stat-titles">WIN RATE</span><i className="fas fa-trophy icon-bg"></i>
                <div className="chart-container">
                  <div className="player-one-bar" style={winRateStyleOne}></div>
                  <span className="chart-bar-subtitle">{(((playerOneStatsCompiled.wins)/(playerOneStatsCompiled.roundsPlayed))*100).toFixed(1)}%</span>
                  <div className="player-two-bar" style={winRateStyleTwo}></div>
                  <span className="chart-bar-subtitle">{(((playerTwoStatsCompiled.wins)/(playerTwoStatsCompiled.roundsPlayed))*100).toFixed(1)}%</span>
                </div>
            </div>

            <div id="top10s-compare" className="compare-subsection">
              <span className="compare-stat-titles">FINISHER</span><i className="fas fa-chess-king icon-bg"></i>
              <div className="chart-container">
                <div className="player-one-bar" style={top10StyleOne}></div>
                <span className="chart-bar-subtitle">{(((playerOneStatsCompiled.wins)/(playerOneStatsCompiled.top10s))*100).toFixed(1)}% of Top 10 Situations Won</span>
                <div className="player-two-bar" style={top10StyleTwo}></div>
                <span className="chart-bar-subtitle">{(((playerTwoStatsCompiled.wins)/(playerTwoStatsCompiled.top10s))*100).toFixed(1)}% of Top 10 Situations Won</span>
              </div>

            </div>

            <div id="kills-compare" className="compare-subsection">
              <span className="compare-stat-titles">KILLS PER ROUND</span><i className="fas fa-skull icon-bg"></i>
              <div className="chart-container">
                <div className="player-one-bar" style={killsPerRoundStyleOne}></div>
                <span className="chart-bar-subtitle">{((playerOneStatsCompiled.kills)/(playerOneStatsCompiled.roundsPlayed)).toFixed(1)}</span>
                <div className="player-two-bar" style={killsPerRoundStyleTwo}></div>
                <span className="chart-bar-subtitle">{((playerTwoStatsCompiled.kills)/(playerTwoStatsCompiled.roundsPlayed)).toFixed(1)}</span>
              </div>
            </div>

            <div id="headshots-compare" className="compare-subsection">
              <span className="compare-stat-titles">KILLS BY HEADSHOT</span> <i className="fab fa-pied-piper-hat icon-bg"></i>
              <div className="chart-container">
                <div className="player-one-bar" style={headshotStyleOne}></div>
                <span className="chart-bar-subtitle">{((playerOneStatsCompiled.headshotKills/playerOneStatsCompiled.kills)*100).toFixed(1)} %</span>

                <div className="player-two-bar" style={headshotStyleTwo}></div>
                <span className="chart-bar-subtitle">{((playerTwoStatsCompiled.headshotKills/playerTwoStatsCompiled.kills)*100).toFixed(1)} %</span>
              </div>
            </div>

            <div id="longest-kill-compare" className="compare-subsection">
              <span className="compare-stat-titles">LONGEST KILL</span> <i className="fas fa-crosshairs icon-bg"></i>
              <div className="chart-container">
                <div className="player-one-bar" style={longestKillStyleOne}></div>
                <span className="chart-bar-subtitle">{(playerOneStatsCompiled.longestKill).toFixed(1)} m</span>

                <div className="player-two-bar" style={longestKillStyleTwo}></div>
                <span className="chart-bar-subtitle">{(playerTwoStatsCompiled.longestKill).toFixed(1)} m</span>
              </div>

            </div>
            <div id="winpoints-compare" className="compare-subsection">
              <span className="compare-stat-titles">WIN POINTS</span> <i className="far fa-hand-point-right icon-bg"></i>
              <div className="chart-container">
                <div className="player-one-bar" style={winPointsStyleOne}></div>
                  <span className="chart-bar-subtitle">{(playerOneStatsCompiled.winPoints).toFixed(0)}</span>
                  <div className="player-two-bar" style={winPointsStyleTwo}></div>
                  <span className="chart-bar-subtitle">{(playerTwoStatsCompiled.winPoints).toFixed(0)}</span>
                </div>
            </div>

            <div id="walkdistance-compare" className="compare-subsection">
              <span className="compare-stat-titles">DISTANCE ON FOOT</span> <i className="fas fa-walking icon-bg"></i>
              <div className="chart-container">
                <div className="player-one-bar" style={walkDistanceStyleOne}></div>
                  <span className="chart-bar-subtitle">{((playerOneStatsCompiled.walkDistance)/1000).toFixed(1)} km</span>
                  <div className="player-two-bar" style={walkDistanceStyleTwo}></div>
                  <span className="chart-bar-subtitle">{((playerTwoStatsCompiled.walkDistance)/1000).toFixed(1)} km</span>
                </div>
            </div>


            <div id="ridedistance-compare" className="compare-subsection">
              <span className="compare-stat-titles">DISTANCE DRIVEN</span> <i className="fas fa-motorcycle icon-bg"></i>
              <div className="chart-container">
                <div className="player-one-bar" style={rideDistanceStyleOne}></div>
                  <span className="chart-bar-subtitle">{((playerOneStatsCompiled.rideDistance)/1000).toFixed(1)} km</span>
                  <div className="player-two-bar" style={rideDistanceStyleTwo}></div>
                  <span className="chart-bar-subtitle">{((playerTwoStatsCompiled.rideDistance)/1000).toFixed(1)} km</span>
                </div>
            </div>

          </div>:
          <div id="loadem">
             LOCK N LOAD
          </div>}
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
      <i className="fas fa-broadcast-tower footer-bg"></i>
        <div id="footer-content">
          <div id="footer-map">
            <div id="footer-links">
              <span>SITE</span>
              <ul id="footer-list">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/compare/">Compare</Link></li>
              </ul>
            </div>
            <div id="social-links">
              <span><i className="fab fa-github"></i></span>
            </div>
          </div>
          <div id="copyright">
            <span><i className="far fa-copyright"></i> 2018- Jake Miller. All rights reserved.</span>
          </div>
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
        <img id="loading" src={loading} alt=""/>
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
class NoRounds extends Component{
  render(){
    return(
      <div className="no-rounds">
        <div>No Rounds Played For This Game Mode</div>
      </div>

    )
  }
}
class NoData extends Component{
  render(){
    return(
      <div></div>


    )
  }
}
export default App;
