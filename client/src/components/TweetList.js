import React from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import socketIOClient from "socket.io-client";
import CardComponent from "./CardComponent";

class TweetList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [], searchTerm: "cake" };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleResume = this.handleResume.bind(this);
    this.handlePause = this.handlePause.bind(this);
  }

  handleChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  handleKeyPress(event) {
    if (event.key === "Enter") {
      this.handleResume();}
  }

  handleResume() {
    let term = this.state.searchTerm;
    fetch("/setSearchTerm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ term })
    });
    console.log(term);
  }

  handlePause(event) {
    fetch("/pause", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  componentDidMount() {
    const socket = socketIOClient("http://localhost:3001/");

    socket.on("connect", () => {
      console.log("Socket Connected");
      socket.on("tweets", data => {
        
        let newList = [data].concat(this.state.items.slice(0, 8));
        this.setState({ items: newList });
      });
    });
    socket.on("disconnect", () => {
      socket.off("tweets");
      socket.removeAllListeners("tweets");
      console.log("Socket Disconnected");
    });
  }

  render() {
    let items = this.state.items;

    let itemsCards = (
      <TransitionGroup>
        {items.map((x, i) => (
          <CSSTransition key={i} timeout={500} classNames="item">
            <CardComponent key={i} data={x} />
          </CSSTransition>
        ))}
      </TransitionGroup>
    );

    let searchControls = (
      <div>
        <input
          type="text"
          className="validate search-input"
          value={this.state.searchTerm}
          onKeyPress={this.handleKeyPress}
          onChange={this.handleChange}
        />
        <label className="deep-purple-text text-accent-1 left-align" >Search</label>
      </div>
    );

    let filterControls = (
      <div>
        <a
          className="btn-floating btn-small purple accent-1 control-button"
          style={controlStyle}
          onClick={this.handleResume}
        >
          <i className="material-icons">play_arrow</i>
        </a>
        <a
          className="btn-floating btn-small purple accent-3 control-button"
          onClick={this.handlePause}
        >
          <i className="material-icons">pause</i>
        </a>
        <p>
          <input className="pink" type="checkbox" id="test5" />
          <label className="deep-purple-text text-accent-1" htmlFor="test5">
            Retweets
          </label>
        </p>
      </div>
    );

    let controls = <div>{items.length > 0 ? filterControls : null}</div>;

    let loading = (
      <div className="valign-wrapper container loading">
        <p className="flow-text black-text">Finding Tweets</p>
        <div className="progress blue accent-1">
          <div className="indeterminate purple accent-1"></div>
        </div>
      </div>
    );

    return (
      <div className="row">
        <div className="col s12 m4">
          <div className="input-field col s11 center-align">
            {searchControls}
            {items.length > 0 ? controls : null}
          </div>
        </div>
        <div className="col s12 m4">
          <div>{items.length > 0 ? itemsCards : loading}</div>
        </div>
        <div className="col s12 m4"></div>
      </div>
    );
  }
}

const controlStyle = {
  marginRight: "5px"
};

export default TweetList;
