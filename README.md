# Points de Félix

Petit site statique pour suivre les points de Félix pendant les 17 jours d'école restants.

## Fonctionnement

- Le site public est en lecture seule.
- Les données officielles sont dans `data.json`.
- Félix peut voir le total depuis GitHub Pages, mais il ne peut pas modifier les points sans accès au dépôt GitHub.

## Ajouter une perte localement

```powershell
.\tools\add-loss.ps1 -Reason "Retard" -Note "Arrivé 10 minutes en retard"
```

Raisons acceptées:

- `Retard`
- `Message`
- `Courriel`
- `Comportement`

Après une modification, publier sur GitHub:

```powershell
git add data.json
git commit -m "Update Felix points"
git push
```

## GitHub Pages

Dans GitHub, aller dans le dépôt, puis `Settings` -> `Pages`.
Choisir la branche principale et le dossier racine `/`.
