# ImmoSphere

Ce dépôt contient le frontend et le backend du projet **ImmoSphere**.

## Organisation Git

L'objectif de cette convention est de garder la branche `main` stable, de faciliter les revues de code et de permettre à chacun de comprendre le contenu d'une branche sans devoir l'ouvrir.

### Branche principale

- `main` contient uniquement du code fonctionnel, relu et prêt à être partagé.
- Aucun développement important ne doit être réalisé directement sur `main`.
- Toute branche de travail est créée depuis une version à jour de `main`.
- Le retour vers `main` se fait au moyen d'une **Merge Request** relue par au moins un autre membre de l'équipe.

### Quand créer une branche ?

Une nouvelle branche est nécessaire dès que le travail :

- ajoute ou modifie une fonctionnalité ;
- corrige un bug ;
- touche plusieurs fichiers ou plusieurs parties de l'application ;
- modifie la base de données, une API, une dépendance ou la configuration ;
- demande plusieurs commits ou risque de durer plus d'une courte session ;
- doit être relu, testé ou discuté avant d'être intégré ;
- pourrait empêcher les autres membres de l'équipe d'utiliser `main` normalement.

En pratique, **presque toute modification de code doit donc avoir sa propre branche**. Un commit direct sur `main` ne peut être envisagé que pour une correction réellement mineure et sans risque, par exemple une faute de frappe dans la documentation, et uniquement si toute l'équipe l'accepte. En cas de doute, créer une branche reste la règle.

Une branche correspond à **un seul objectif**. Deux fonctionnalités différentes doivent être développées dans deux branches différentes, même si elles concernent le même écran.

## Catégories de branches

Le nom d'une branche respecte le format suivant :

```text
<categorie>/<description-courte-en-kebab-case>
```

Exemple :

```text
feature/recherche-biens
```

| Catégorie | Utilisation | Justification | Exemple |
|---|---|---|---|
| `feature/` | Ajout d'une nouvelle fonctionnalité visible par l'utilisateur ou d'une nouvelle capacité métier. | Isole une évolution du produit afin qu'elle puisse être développée, testée et relue indépendamment. | `feature/ajout-favoris` |
| `fix/` | Correction d'un bug sur du code qui n'est pas encore en production ou qui ne demande pas une intervention urgente. | Distingue clairement une réparation d'une évolution fonctionnelle et facilite le suivi des régressions. | `fix/validation-email` |
| `hotfix/` | Correction urgente d'un problème bloquant présent sur la version livrée ou sur `main`. | Signale une priorité élevée et un cycle de validation plus rapide. Cette catégorie ne doit pas servir pour un bug ordinaire. | `hotfix/connexion-impossible` |
| `refactor/` | Réorganisation ou simplification du code sans modifier son comportement attendu. | Permet de revoir la qualité technique séparément d'un changement fonctionnel et rend la revue plus fiable. | `refactor/service-authentification` |
| `docs/` | Création ou modification de documentation uniquement. | Évite de mélanger la documentation avec du code et permet une revue adaptée. | `docs/convention-git` |
| `test/` | Ajout ou amélioration de tests sans changement fonctionnel volontaire. | Rend explicite que la branche améliore la couverture ou la fiabilité des tests. | `test/api-proprietes` |
| `chore/` | Maintenance technique : dépendances, configuration, scripts, nettoyage ou outillage. | Regroupe les tâches nécessaires au projet qui ne sont ni des fonctionnalités ni des corrections métier. | `chore/mise-a-jour-angular` |

Utiliser les catégories **au singulier** : `feature/` et non `features/`, `fix/` et non `fixes/`.

### Règles de nommage

- Écrire les noms en minuscules.
- Utiliser des tirets `-` entre les mots, sans espace ni underscore.
- Choisir une description courte mais précise.
- Ne pas mettre de nom de personne dans la branche.
- Ajouter le numéro d'une issue lorsqu'elle existe.

Exemples recommandés :

```text
feature/42-gestion-visites
fix/57-prix-negatif
docs/installation-backend
chore/configuration-ci
```

Exemples à éviter :

```text
ma-branche
feature/test
features/Nouvelle_Page
branche-tibo
```

## Workflow recommandé

### 1. Mettre `main` à jour

```bash
git switch main
git pull origin main
```

### 2. Créer la branche de travail

```bash
git switch -c feature/nom-de-la-fonctionnalite
```

Remplacer `feature/` par la catégorie appropriée.

### 3. Réaliser des commits ciblés

Chaque commit doit représenter une étape cohérente. Son message doit être court, précis et rédigé à l'impératif.

Format conseillé :

```text
<type>: <description>
```

Exemples :

```text
feat: ajoute le formulaire de création d'un bien
fix: empêche l'envoi d'un prix négatif
refactor: extrait la validation des adresses
docs: documente le workflow Git
test: couvre la création d'une visite
chore: met à jour les dépendances du frontend
```

Avant chaque commit, vérifier les fichiers concernés afin de ne pas ajouter de secrets, de fichiers générés ou de modifications sans rapport avec la branche :

```bash
git status
git diff
git add <fichiers>
git commit -m "feat: ajoute la recherche par ville"
```

### 4. Synchroniser la branche

Avant d'ouvrir la Merge Request, récupérer les derniers changements de `main` et résoudre les éventuels conflits sur sa propre branche :

```bash
git fetch origin
git rebase origin/main
```

Si un rebase n'est pas maîtrisé par l'auteur de la branche, demander l'aide d'un membre de l'équipe plutôt que de forcer un push sur une branche partagée.

### 5. Pousser la branche

```bash
git push -u origin feature/nom-de-la-fonctionnalite
```

### 6. Ouvrir une Merge Request

La Merge Request doit :

- avoir un titre clair ;
- expliquer ce qui a été modifié et pourquoi ;
- indiquer comment tester la modification ;
- mentionner l'issue concernée, si elle existe ;
- rester suffisamment petite pour être relue facilement ;
- avoir une pipeline et des tests réussis, lorsqu'ils sont disponibles ;
- être relue par au moins une autre personne avant le merge.

Après la fusion, supprimer la branche distante devenue inutile.

## Bonnes pratiques d'équipe

- Ne jamais pousser directement sur la branche d'un autre membre sans son accord.
- Ne jamais utiliser `git push --force` sur `main`.
- Préférer `git push --force-with-lease` à `git push --force` lorsqu'un rebase impose de mettre à jour sa propre branche distante.
- Prévenir rapidement l'équipe lorsqu'une modification touche une zone partagée ou risque de créer des conflits.
- Découper une tâche trop grande en plusieurs branches ou Merge Requests cohérentes.
- Ne pas mélanger correction, refactorisation et nouvelle fonctionnalité dans une même branche sauf si ces changements sont indissociables.

## Résumé de décision

```text
Est-ce une modification de code, de configuration, de dépendance ou de base de données ?
├── Oui  -> créer une branche.
└── Non  -> est-ce une documentation très mineure et sans risque ?
           ├── Oui  -> commit direct possible seulement avec l'accord de l'équipe.
           └── Non  -> créer une branche.
```
