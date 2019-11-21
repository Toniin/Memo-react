import React, { Component } from 'react'

export class Card extends Component {
  render() {
    return (
      <article>
        <h3>{this.props.card.question}</h3>
        <p>{this.props.card.reponse}</p>
      </article>
    )
  }
}

export default Card
