import React, { Component } from "react";
import Fetch from "./services/Fetch";
import Nav from "./components/Nav";
import Column from "./components/Column";
// import Form from "./components/Form";
import "./css/app.css";

class App extends Component {
  // state correspond à this.state
  state = {
    // On stocke les termes de la navbar
    terms: [],
    // On stocke les colums du terme sélectionné
    columns: [],
    cardIsEditing: null
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
    console.log("J'ai bien récup. tes termes, tiens :");
    console.table(data);

    // On récupère le state précédent et on lui donne data (l'objet des terms)
    // React va voir une différence entre le prevState et le state en cours
    // Ce qui va modifier l'état en prenant en compte les modifications réalisées
    this.setState(prevState => (prevState.terms = data));
  };

  // Si failure() sur la méthode getTerms de Fetch
  failureTerms = error => {
    console.log("Dans failureTerms", error);
  };

  // On manipule la récupération des cartes de l'utilisateur
  handleClickTerm = (event, term) => {
    // !!! ATTENTION À L'ORDRE DES PARAMÈTRES !!! (En haut du block car c'est asynchrone donc pas de soucis ;))
    this.fetch.getCards(this.successCards, this.failureCards, term.id);

    // On recherche quel est l'index de notre élément cliqué depuis le tableau terms
    const indexTerm = this.state.terms.indexOf(term);

    for (const term of this.state.terms) {
      // On donne false pour la propriété selected du terme
      term.selected = false;
    }

    // On change l'état à true de la propriété selected du terme cliqué grâce à son index récupéré
    this.setState(prevState => (prevState.terms[indexTerm].selected = true));
  };

  // Si on réussit à récup nos cartes le terme précis
  successCards = data => {
    // setState faire une comparaison entre mon state précédent et mon state en cours
    // Si les deux state sont différents, il va "update" le component
    // J'injectes à mon state "columns" la data récupérée (objet de mes colonnes)
    // Le fait d'injecter au state "columns", modifie mon state précédent
    // et va actualiser uniquement mon state "columns" et mon render()
    this.setState({ columns: data });
    console.log("J'ai réussi à récup tes cartes, je te les montres :");
    console.table(this.state.columns);
  };

  // En cas d'échec de la récupération des cartes du terme
  failureCards = () => {
    console.log("Dans failureCards");
  };

  // On manipule la modification de la carte cliquée
  handleEditCard = (event, columnIndex, cardIndex) => {
    console.log("Handle click edit card");

    // On modifie cardIsEditing en ajoutant l'objet de la carte séléctionnée
    this.setState({
      cardIsEditing: {
        columnIndex: columnIndex,
        cardIndex: cardIndex
      }
    });
  };

  // Lorsque le formulaire est "submit"
  // preventDefault => Pour retirer le rechargement du formulaire quand il est submit
  handleSubmit = event => {
    event.preventDefault();
    console.log("Envoie du formulaire!");

    // AUTRE MANIÈRE POUR setState (copie du state qui est comparé au state)
    // On fait une copie du state
    const copy_state = { ...this.state };
    // On modifie la valeur de la propriété cardIsEditing de la copie du state quand on submit
    copy_state.cardIsEditing = false;
    // Le state de cardIsEditing de la copie va être comparé au state de cardIsEditing en cours,
    // si c'est différent il change le state par sa copie et appellera la méthode render()
    this.setState(copy_state);
  };

  // On change la question à changement de l'input question
  handleChangeQuestion = (event, questionReponse) => {
    console.log("Handle question, première carte");
    // Je destructure l'objet cardIsEditing pour utiliser plus rapidement ses propriétés
    const { columnIndex, cardIndex } = this.state.cardIsEditing;

    // UTILISATION DU prevState METTRE LE event.target.value EN DEHORS PUIS UTILISER SA VARIABLE DANS setState
    // inputValue change à chaque modification de l'input de la question
    const inputValue = event.target.value;
    // Modifie le state de la question à chaque entrée
    this.setState(
      prevState =>
        (prevState.columns[columnIndex].cartes[cardIndex][
          questionReponse
        ] = inputValue)
    );
  };

  // Méthode qui renvoit un formulaire
  dumpForm = () => {
    // Si cardIsEditing récupère la carte séléctionnée car on veut la modifier, alors on affiche le formulaire
    if (this.state.cardIsEditing) {
      // Je destructure l'objet cardIsEditing pour utiliser plus rapidement ses propriétés
      const { columnIndex, cardIndex } = this.state.cardIsEditing;

      // On retourne le formulaire quand on à une carte dans cardIsEditing
      return (
        <form action="" onSubmit={this.handleSubmit}>
          {/* Input pour inscrire sa question */}
          <label htmlFor="question">
            Question
            <input
              type="text"
              id="question"
              value={this.state.columns[columnIndex].cartes[cardIndex].question}
              onChange={event => this.handleChangeQuestion(event, "question")}
            />
          </label>
          {/* Input pour inscrire la réponse à la question */}
          <label htmlFor="response">
            Réponse
            <input
              type="text"
              id="response"
              value={this.state.columns[columnIndex].cartes[cardIndex].reponse}
              onChange={event => this.handleChangeQuestion(event, "reponse")}
            />
          </label>
          <input type="submit" value="Envoyer" />
        </form>
      );
    }
  };

  render() {
    // Destructure le this.state pour créer des const d'élément qui sont dedans
    const { terms } = this.state;
    return (
      <div className="app">
        <header>
          <h1 className="text-white bg-dark">Memo</h1>
          {/* Appelle du component Nav */}
          {/* La prop (onClickTerm) a un nom différent de la méthode (handleClickTerm) 
          pour bien différencier ce qui est la méthode et ce qui est la prop*/}
          <Nav onClickTerm={this.handleClickTerm} terms={terms} />
        </header>
        <main className="container-fluid">
          <div className="row">
            {/* On créé un formulaire pour inscrire une question et une réponse */}
            {this.dumpForm()}
            {/* Pour chaque colonne qui existe, on créé une nouvelle instance de Column */}
            {this.state.columns.map(column => {
              return (
                <Column
                  key={column.id}
                  column={column}
                  // onClickEditCard passe en props de Column la RÉFÉRENCE à la méthode "handleEditCard"
                  onClickEditCard={this.handleEditCard}
                  columnIndex={this.state.columns.indexOf(column)}
                />
              );
            })}
          </div>
        </main>
      </div>
    );
  }
}

export default App;
