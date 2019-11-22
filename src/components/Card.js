import React, { Component } from "react";

class Card extends Component {
  state = {};
  render() {
    return (
      <article>
        <h3>{this.props.card.question}</h3>
        <p>{this.props.card.reponse}</p>
        <button
          // Au clique, fait RÉFÉRENCE directement à la méthode handleClickEditCard() dans App 
          onClick={event => this.props.onClickEditCard(event, this.props.card)}
        >
          Modifier
        </button>
      </article>
    );
  }
}

export default Card;
