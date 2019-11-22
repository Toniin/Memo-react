import React, { Component } from "react";
import Card from "./Card";

class Column extends Component {
  render() {
    return (
      <div className="col">
        <div className="col-header">
          <button className="btn btn-success">+</button>
          <h2>{this.props.column.name}</h2>
        </div>
        {/* On créé une nouvelle carte pour chaque cartes qui sont dans l'objet de la colonne */}
        {this.props.column.cartes.map(card => {
          return (
            <Card
              key={card.id}
              card={card}
              // onClickEditCard fait RÉFÉRENCE à la méthode handleClickEditCard() dans App
              onClickEditCard={this.props.onClickEditCard}
            />
          );
        })}
      </div>
    );
  }
}

export default Column;
