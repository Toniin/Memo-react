class Fetch {
  constructor(url_basis) {
    // url_basis => C'est l'url racine du site (http://www.coopernet.fr)
    this.url_basis = url_basis;
    this.token = "";
    this.login = "antonin.chaudiere";
    this.pwd = "antonin.chaudiere";
  }

  // Récupère le token envoyé par le site ou renvoie un message d'erreur
  getToken(success, failure) {
    fetch(this.url_basis + "/rest/session/token/")
      .then(function(response) {
        if (response.status !== 200) {
          console.log("Erreur (même si le server a répondu)- statut : " + response.status);
          failure(response.status);
          return;
        }
        response.text().then(function(data) {
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
      }).then(function(response) {
        if (response.status !== 200) {
          // Il y a un problème, le statut de la réponse n'est pas le bon
          console.error("Erreur - statut : " + response.status);
          failure(response.status);
        } else {
          // Ca roule... mais encore faut-il que la
          // réponse soit dans le bon format
          response.json().then(function(data) {
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
}

export default Fetch;