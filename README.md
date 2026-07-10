# Application de reservation de parking

## Description du projet

## Conception

### Model de donnees

### Choix de compatibilite
 
* Les vehicules utilitaires devront se garer uniquement sur les places utilitaires.
* les vehicules familiales uniquement sur les places familiales.
* Les citadines sur les places citadines et familiales.
* Les motos sur les places moto et familiales.

### Choix de tarification

Pour la tarification, un modele de degressivite par tranche est adopte, c'est a dire par exemple pour les vehicules citadines:
* 0 a 2h => 200f / h
* 2h01 a 6h => 150f / h 
* 6h01 a infini => 100f / h

Ainsi si le vehicule passe 30min il paiera 200f,
Si il va jusqu'a 5 il paira 200f * 2 + 150f * 3 = 850f, enfin s'il va jusqua 10 h il paiera 200f * 2 + 150f *4 + 100f * 4 =  1250f.


## Installation et lancement du projet

* Cloner le repo via la commande: git clone https://github.com/fenix237/parking-reservation.git

* Installer les dependances via:  npm install

* Lancer le projet via la commande: npm run dev

## Tests

## Details horaires

* Heure de debut: 12h40
* Heure de fin: 