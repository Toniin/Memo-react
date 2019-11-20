import React, { Component } from "react";
import "../css/navbar.css";

class Nav extends Component {
  state = {};
  render() {
    // Destructure les propriétés passées à Nav pour créer des const d'élément qui sont dedans
    const { terms } = this.props;
    return (
      <nav className="header-navbar">
        <ul>
          {terms.map(term => (
            <li key={term.id}>{term.name}</li>
          ))}
        </ul>
      </nav>
    );
  }
}

export default Nav;
