class Fetch {
  constructor(url_basis) {
    // url_basis => C'est l'url racine du site (http://www.coopernet.fr)
    this.url_basis = url_basis;
    this.token = "";
    this.userId = 41;
    this.login = "antonin.chaudiere";
    this.pwd = "antonin.chaudiere";
  }

  // Récupère le token envoyé par le site
  getToken(success, failure) {
    fetch(this.url_basis + "/rest/session/token/")
      .then(response => {
        if (response.status !== 200) {
          console.log("Erreur (même si le server a répondu)- statut : " + response.status);
          failure(response.status);
          return;
        }
        response.text().then(data => {
          // Ca roule, le serveur a répondu et il a bien
          // renvoyé une chaine de caractère qui correspond à un token
          // Allons vite le récupérer dans successToken depuis la classe App
          // Pour l'afficher dans la console
          success(data);
        });
      })
      .catch(error => {
        // Aïe aïe aïe, grosse erreur qui s'affiche dans la console
        // grâce à failureToken depuis la classe App
        failure(error);
      });
  }

  // On va récupérer les termes pour les afficher dans la navbar du header
  getTerms = (success, failure) => {
    try {
      fetch(this.url_basis + "/memo/themes/", {
        credentials: "same-origin",
        method: "GET",
        headers: {
          "Content-Type": "application/hal+json",
          "X-CSRF-Token": this.token,
          Authorization: "Basic " + btoa(this.login + ":" + this.pwd) // btoa = encodage en base 64
        }
      }).then(response => {
        if (response.status !== 200) {
          // Il y a un problème, le statut de la réponse n'est pas le bon
          console.error("Erreur - statut : " + response.status);
          failure(response.status);
        } else {
          // Ca roule... mais encore faut-il que la
          // réponse soit dans le bon format
          response.json().then(data => {
            // On ajoute aux termes une propriété "selected"
            for (const datum of data) {
              datum.selected = false;
            }
            // T'as tous les termes maintenant, faut vite que tu les affiches
            // dans la console avec successTerms depuis la classe App
            success(data);
          });
        }
      });
    } catch (error) {
      // Aïe aïe aïe, grosse erreur qui s'affiche dans la console
      // grâce à failureTerms depuis la classe App
      console.error("Erreur : " + error);
      failure(error);
    }
  };

  // On va récupérer les cartes pour chaque terme
  getCards = (success, failure, termId) => {
    // On récupère les cartes en fonction de l'utilisateur
    fetch(
      this.url_basis +
        `/memo/list_cartes_term/${
          this.userId
        }/${termId}&_format=json&time=${Math.floor(Math.random() * 10000)}`,
      {
        credentials: "same-origin",
        method: "GET",
        headers: {
          "Content-Type": "application/hal+json",
          "X-CSRF-Token": this.token,
          Authorization: "Basic " + btoa(this.login + ":" + this.pwd) // btoa = encodage en base 64
        }
      }
    )
    .then(response => {
      if (response.status !== 200) {
        console.log("Erreur (même si le server a répondu)- statut : " + response.status);
        failure(response.status);
        return false;
      }
      // json() permet de vérifier que on récupère bien un objet JSON pour ensuite nous le transmettre sous forme de JSON
      return response.json();
    })
    .then(data => {
      // On mets les colonnes dans l'ordre des ids (du plus petit au plus grand)
      // a => élément d'avant | b => élément d'après
      data.sort((a, b) => a.id - b.id);
      // Ca roule, le serveur a répondu et il a bien renvoyé un objet JSON
      // Allons vite le récupérer dans successCards depuis la classe App
      // Pour afficher nos super cartes d'apprentissage
      success(data);
    })
    .catch(error => {
      // Aïe aïe aïe, grosse erreur qui s'affiche dans la console
      // grâce à failureCards depuis la classe App
      failure(error);
    });
  };

  // Méthode qui permet de POST la modification d'une carte
  createReqEditCard = (
    card,
    themeid,
    callbackSuccess,
    callbackFailed
  ) => {
    console.log("Dans createReqEditCard de Fetch");

    // Je destructure l'objet card pour utiliser plus rapidement ses propriétés
    // J'ajoute un alias pour l'id de la carte et de la colonne pour rendre plus
    // lisible le code
    const { id: cardId, question, reponse, colonne: colonneId } = card;

    // Création de la requête
    // Utilisation de fetch
    fetch(this.url_basis + "/node/" + cardId + "?_format=hal_json", {
      // Permet d'accepter les cookies ?
      credentials: "same-origin",
      method: "PATCH",
      headers: {
        "Content-Type": "application/hal+json",
        "X-CSRF-Token": this.token,
        Authorization: "Basic " + btoa(this.login + ":" + this.pwd) // btoa = encodage en base 64
      },
      body: JSON.stringify({
        _links: {
          type: {
            href: this.url_basis + "/rest/type/node/carte"
          }
        },
        title: [
          {
            value: question
          }
        ],
        field_carte_question: [
          {
            value: question
          }
        ],
        field_carte_reponse: [
          {
            value: reponse
          }
        ],
        field_carte_colonne: [
          {
            target_id: colonneId,
            url: "/taxonomy/term/" + colonneId
          }
        ],
        field_carte_thematique: [
          {
            target_id: themeid,
            url: "/taxonomy/term/" + themeid
          }
        ],
        type: [
          {
            target_id: "carte"
          }
        ]
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log("data reçues :", data);
      if (data) {
        callbackSuccess(themeid);
      } else {
        callbackFailed("Erreur de login ou de mot de passe");
      }
    });
  };

  // Méthode qui permet de créer une carte
  createReqAddCard = (
    card,
    themeid,
    callbackSuccess,
    callbackFailed
  ) => {
    console.log("Dans createReqAddCards de Fetch");

    // Je destructure l'objet card pour utiliser plus rapidement ses propriétés
    // J'ajoute un alias pour l'id de la carte et de la colonne pour rendre plus
    // lisible le code
    const { question, reponse, colonne: colonneId } = card;

    // création de la requête
    // utilisation de fetch
    fetch(this.url_basis + "/node?_format=hal_json", {
      // permet d'accepter les cookies ?
      credentials: "same-origin",
      method: "POST",
      headers: {
        "Content-Type": "application/hal+json",
        "X-CSRF-Token": this.token,
        Authorization: "Basic " + btoa(this.login + ":" + this.pwd) // btoa = encodage en base 64
      },
      body: JSON.stringify({
        _links: {
          type: {
            href: this.url_basis + "/rest/type/node/carte"
          }
        },
        title: [
          {
            value: question
          }
        ],
        field_carte_question: [
          {
            value: question
          }
        ],
        field_carte_reponse: [
          {
            value: reponse
          }
        ],
        field_carte_colonne: [
          {
            target_id: colonneId,
            url: "/taxonomy/term/" + colonneId
          }
        ],
        field_carte_thematique: [
          {
            target_id: themeid,
            url: "/taxonomy/term/" + themeid
          }
        ],
        type: [
          {
            target_id: "carte"
          }
        ]
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log("data reçues le :", data.created[0].value);
      if (data.created[0].value) {
        callbackSuccess(themeid);
      } else {
        callbackFailed("Erreur de login ou de mot de passe");
      }
    });
  };
}

export default Fetch;
