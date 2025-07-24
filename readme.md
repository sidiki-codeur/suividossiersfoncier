# 📁 Suivi des Dossiers Fonciers

Un outil web simple et robuste pour permettre à une assistante d’**enregistrer** et de **suivre** les dossiers fonciers des clients, tout en respectant un **délai de traitement de 2 jours**.

---

## 🎯 Objectif

- Offrir un **suivi visuel instantané** de l’état des dossiers (à traiter, presque en retard, en retard).
- Simplifier l’enregistrement et la gestion des informations pour chaque dossier.
- Proposer une interface **100% offline** (HTML/CSS/JS pur, sans framework ni base de données).

---

## 🧩 Fonctionnalités principales

- **Ajout de dossier** via un formulaire comprenant :
  - Date de réception
  - Nom & prénom du client
  - Référence cadastrale (parcelle, ilot, section, commune) : des champs pour chaque eleement
  - Situation du dossier
  - Date de sortie
  - Date de récupération

- **Enregistrement et modification** :
  - Les informations saisies pour chaque dossier sont **modifiables** à tout moment.
  - L’ajout et la modification des dossiers se font via des **modals** (fenêtres contextuelles) pour une expérience utilisateur fluide.

- **Tableau dynamique** listant tous les dossiers, avec un système de **couleurs selon le statut** :
  - 🟢 **À traiter** : moins de 2 jours depuis la réception
  - 🟡 **Dernier jour** : 2 jours pile
  - 🔴 **En retard** : plus de 2 jours sans date de sortie
  - ✅ **Traité** : une date de sortie a été saisie

- **Statut calculé automatiquement** selon la date de réception.

- **Statistiques en temps réel** :
  - Un encart en haut de la page affiche un **bilan rapide** du nombre total de dossiers, du nombre de dossiers à traiter, en retard, et traités.

- **Exportation vers Excel** : possibilité d’exporter la liste des dossiers au format Excel pour faciliter le partage ou l’archivage.

---

## 🛠️ Technologies utilisées

- HTML5
- CSS3
- JavaScript (vanilla)"# suividossiersfoncier" 
