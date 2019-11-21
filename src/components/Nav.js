import React, { Component } from "react";
import "../css/header-navbar.css";

class Nav extends Component {
  state = {};

  buttonClasses = (selected) => {
    const button_classes = selected ? "btn btn-warning" : "btn btn-primary"
    return button_classes;
  };

  render() {
    // Destructure les propriétés passées à Nav pour créer des const d'élément qui sont dedans
    const { terms } = this.props;
    return (
      <nav className="header-navbar">
        <ul>
          {terms.map(term => (
            <li
              key={term.id}
              className={this.buttonClasses(term.selected)}
              // On appelle la prop onClickTerm qui fait référence à la méthode handleClickTerm
              onClick={(event) => this.props.onClickTerm(event, term.id, term.selected)}
            >
              {term.name}
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

export default Nav;
