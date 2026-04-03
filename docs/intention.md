# Document d’intention – Moulti-Game

## 1. Présentation du projet

Le projet **Moulti-Game** est une application web qui regroupe plusieurs mini-jeux accessibles depuis une seule interface. L’idée est de proposer une sorte de petite plateforme arcade où un utilisateur peut jouer à différents jeux, tout en gardant une trace de ses performances.

Les jeux proposés sont par exemple : Simon, Snake, Pendu, Maze, Puissance 4 et DevineNombre. Chaque jeu fonctionne de manière indépendante, mais ils sont réunis dans une même application pour créer une expérience globale.

L’objectif du projet est surtout de mettre en place une **application full stack simple**, avec :

* un système de compte utilisateur
* un enregistrement des scores
* un historique des parties
* une interface qui regroupe tous les jeux

Le but n’est pas de faire des jeux très complexes, mais plutôt de construire quelque chose de cohérent entre le front-end, le back-end et la base de données.

---

## 2. Architecture du projet

Le projet repose sur une architecture **client / serveur** assez classique, avec trois parties principales : le front-end, le back-end et la base de données.

### Front-end

Le front-end est fait en **HTML, CSS et JavaScript**.
Il gère toute l’interface utilisateur, l’affichage des pages et l’exécution des jeux.

Chaque mini-jeu est intégré directement côté client, avec sa propre logique en JavaScript.
Le front s’occupe aussi d’envoyer des requêtes au back-end (par exemple pour envoyer un score ou récupérer les données utilisateur).

L’organisation du code est structurée en dossiers (inspirée du MVC) pour garder quelque chose de propre et lisible.

### Back-end

Le back-end est développé avec **Node.js et Express**.
Il expose une **API REST** que le front peut appeler.

Il gère :

* l’inscription et la connexion des utilisateurs
* les informations du profil
* l’enregistrement des scores
* la récupération de l’historique

Le code est organisé avec des routes, des contrôleurs et des modèles pour séparer les responsabilités.

### Base de données

Une base de données relationnelle (PostgreSQL) est utilisée pour stocker :

* les utilisateurs
* les jeux
* les scores

Ça permet de garder un historique et de personnaliser l’expérience pour chaque utilisateur.

---

## 3. Fonctionnement global

Le fonctionnement est assez simple :

1. L’utilisateur arrive sur le site
2. Il peut créer un compte ou se connecter
3. Le front communique avec le back pour gérer l’authentification
4. L’utilisateur choisit un jeu
5. Le jeu se lance dans le navigateur
6. À la fin de la partie, le score est envoyé au serveur
7. Le serveur enregistre les données dans la base
8. L’utilisateur peut ensuite voir ses scores et son historique

L’idée est d’avoir un système fluide où le joueur peut enchaîner les parties tout en gardant une trace de ce qu’il a fait.

---

## 4. Choix techniques

Les choix techniques sont volontairement simples pour rester adaptés au projet.

### Front-end

* HTML / CSS
* JavaScript (vanilla)

Ça permet de garder un projet léger et de bien comprendre ce qui se passe sans dépendre d’un framework.

### Back-end

* Node.js
* Express

C’est une solution rapide à mettre en place pour créer une API REST et gérer les routes facilement.

### Base de données

* PostgreSQL

Une base relationnelle est suffisante pour gérer les utilisateurs et les scores.

### Authentification

* JWT ou sessions

Permet de sécuriser les accès et de savoir quel utilisateur envoie les données.

---

## 5. Défis techniques

Même si le projet reste simple, il y a quand même quelques points un peu plus compliqués :

### Organisation du code

Il faut structurer correctement le projet pour éviter que tout soit mélangé, surtout avec plusieurs jeux et une API.

### Communication front / back

Il faut bien gérer les requêtes (fetch), les réponses et les erreurs pour que tout fonctionne correctement.

### Gestion des scores

Chaque jeu doit envoyer un score dans un format cohérent pour pouvoir l’enregistrer facilement en base.

### Base de données

Il faut concevoir des tables simples mais efficaces pour relier les utilisateurs, les jeux et les scores.


## 6. Conclusion

Moulti-Game est un projet qui permet de créer une application web complète en regroupant plusieurs mini-jeux dans une seule plateforme.

L’objectif principal est de mettre en place une **architecture claire et fonctionnelle**, avec un front-end, un back-end et une base de données qui communiquent correctement entre eux.

Le projet reste volontairement simple dans ses choix techniques pour pouvoir se concentrer sur l’essentiel : la structure, la logique et les échanges entre les différentes parties de l’application.
