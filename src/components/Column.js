import React, { Component } from "react";
import Card from "./Card";

class Column extends Component {
  render() {
    return (
      <div className="col">
        <div className="col-header">
          <button 
            className="btn btn-success"
            // Au clique, fait RÉFÉRENCE directement à la méthode handleCreateCard() dans App
            onClick={event => this.props.onClickAddCard(event, this.props.columnIndex)}
          >+</button>
          <h2>{this.props.column.name}</h2>
        </div>
        {/* On créé une nouvelle carte pour chaque cartes qui sont dans l'objet de la colonne */}
        {this.props.column.cartes.map(card => {
          return (
            <Card
              key={card.id}
              card={card}
              // onClickEditCard passe en props de Card la RÉFÉRENCE à la méthode handleEditCard() dans App
              onClickEditCard={this.props.onClickEditCard}
              columnIndex={this.props.columnIndex}
              cardIndex={this.props.column.cartes.indexOf(card)}
            />
          );
        })}
      </div>
    );
  }
}

export default Column;
