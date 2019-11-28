import React, { Component } from "react";

class Card extends Component {
  state = {};

  // PETIT SOUCIS POUR LE COMPONENTDIDUPDATE()
  // le prevProps est égale à la nouvelle prop donc ça ne fonctionne pas
  // Il faut que les deux props soient différentes
  // componentDidUpdate(prevProps) {
  //   console.log("DID UPDATE !!!");
  //   // On vérifie si la prop précédente est différente de la prop modifiée
  //   // Si c'est le cas, on log dans la console un message
  //   if ((this.props.card.question !== prevProps.card.question) ||
  //   (this.props.card.reponse !== prevProps.card.reponse) ) {
  //     // this.fetchData(this.props.userID);
  //     console.log("On a modifié la carte.");
  //   }
  // }

  render() {
    return (
      <article>
        <h3>{this.props.card.question}</h3>
        <p>{this.props.card.reponse}</p>
        <button
          // Au clique, fait RÉFÉRENCE directement à la méthode handleEditCard() dans App
          onClick={event =>
            this.props.onClickEditCard(
              event,
              this.props.columnIndex,
              this.props.cardIndex
            )
          }
        >
          Modifier
        </button>
      </article>
    );
  }
}

export default Card;
