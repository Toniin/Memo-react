import React, { Component } from 'react'
import Card from "./Card"

export class Column extends Component {
  render() {
    return (
      <div className="col">
        <div className="col-header">
          <button>+</button>
          <h2>{this.props.column.name}</h2>
        </div>
        {this.props.column.cartes.map(card => {
          return <Card key={card.id} card={card} />
        })}
      </div>
    )
  }
}

export default Column
