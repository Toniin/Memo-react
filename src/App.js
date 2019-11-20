import React, { Component } from "react";
import Nav from "./components/Nav";
import Fetch from "./services/Fetch";
import "./css/app.css";

export class App extends Component {
  // state correspond à this.state
  state = {
    terms: []
  };

  // fetch correspond à this.fetch
  fetch = {};

  // Après que le composant soit chargé
  // Cette méthode est un hook du composant donc le this fais référence ici à la classe
  // même si c'est de type function() {}
  componentDidMount() {
    this.fetch = new Fetch("http://www.coopernet.fr");
    // On va récupérer notre token
    this.fetch.getToken(this.successToken, this.failureToken);
  }

  // Si success() sur la méthode getToken de Fetch
  successToken = data => {
    console.log("J'ai bien récup. ton token, tiens :", data);
    this.fetch.token = data;
    // On va récupérer les termes
    this.fetch.getTerms(this.successTerms, this.failureTerms);
  };
  // Si failure() sur la méthode getToken de Fetch
  failureToken = error => {
    console.log("Erreur sur la réception du token", error);
  };

  // Si success() sur la méthode getTerms de Fetch
  successTerms = data => {
    console.log("J'ai bien récup. tes termes, tiens :", data);

    // On récupère le state précédent et on lui donne data (l'objet des terms)
    // React va voir une différence entre le prevState et le state en cours
    // Ce qui va modifier l'état en prenant en compte les modifications réalisées
    this.setState(prevState => prevState.terms = data)
  };

  // Si failure() sur la méthode getTerms de Fetch
  failureTerms = error => {
    console.log("Erreur sur la réception des termes", error);
  };

  render() {
    // Destructure le this.state pour créer des const d'élément qui sont dedans
    const { terms } = this.state;
    return (
      <div className="app">
        <header>
          <h1>Memo</h1>
          {/* Appelle du component Nav */}
          <Nav terms={terms} />
        </header>
      </div>
    );
  }
}

export default App;
