import React, { Component } from "react";
import Fetch from "./services/Fetch";
import Nav from "./components/Nav";
import Column from "./components/Column";
import "./css/app.css";

export class App extends Component {
  // state correspond à this.state
  state = {
    // On stocke les termes de la navbar
    terms: [],
    // On stocke les colums du terme sélectionné
    columns: []
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
    this.setState(prevState => (prevState.terms = data));
  };

  // Si failure() sur la méthode getTerms de Fetch
  failureTerms = error => {
    console.log("Erreur sur la réception des termes", error);
  };

  // On manipule la récupération des cartes de l'utilisateur
  handleClickTerm = (event, termId, termSelected) => {
    // On va modifier la propriété "selected" du term cliqué
    this.setState(prevState => prevState.termSelected = true); // !!! A REFAIRE !!! (copy + setState)
    console.log(termSelected);
    
    // !!! ATTENTION À L'ORDRE DES PARAMÈTRES !!!
    this.fetch.getCards(this.successCards, this.failureCards, termId);
  };

  // Si on réussit à récup nos cartes le terme précis
  successCards = data => {
    // setState faire une comparaison entre mon state précédent et mon state en cours
    // Si les deux state sont différents, il va "update" le component
    // J'injectes à mon state "columns" la data récupérée (objet de mes colonnes)
    // Le fait d'injecter au state "columns", modifie mon state précédent
    // et va actualiser uniquement mon state "columns" et mon render()
    this.setState(prevState => prevState.columns = data);
    console.log("J'ai réussi à récup tes cartes, je te les montres :", this.state.columns);
  };

  // En cas d'échec de la récupération des cartes du terme
  failureCards = () => {
    console.log("Dans failureCards");
  };

  render() {
    // Destructure le this.state pour créer des const d'élément qui sont dedans
    const { terms } = this.state;
    return (
      <div className="app">
        <header>
          <h1 className="text-white bg-primary">Memo</h1>
          {/* Appelle du component Nav */}
          {/* La prop (onClickTerm) a un nom différent de la méthode (handleClickTerm) 
          pour bien différencier ce qui est la méthode et ce qui est la prop*/}
          <Nav onClickTerm={this.handleClickTerm} terms={terms} />
        </header>
        <main className="container-fluid">
          <div className="row">
            {this.state.columns.map((column) => {
              return (
                <Column key={column.id} column={column}/>
              )
            })}
          </div>
        </main>
      </div>
    );
  }
}

export default App;
