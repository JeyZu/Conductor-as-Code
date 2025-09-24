# AGENTS.md — Guide pour les agents de code (Codex, etc.)

Ce fichier sert à fournir aux agents de code (comme Codex) le contexte, les règles, les commandes, et les contraintes du projet afin que le code généré soit cohérent avec l’architecture, les normes et les attentes.

---

## Contexte du projet

- Nom du projet : `conductor-as-code`  
- Objectif : un utilitaire TypeScript pour gérer les workflows Conductor OSS comme du code (déclaratif), avec un CLI, déploiement, diff, rollback, gestion multi-client/environnement.  
- Architecture : monorepo avec des packages (core, parser, transpiler, conductor-api, deployer, logger, etc.) et une app CLI dans `apps/cli`.  
- Le DSL est en YAML/JSON strict conforme aux contrats Conductor (WorkflowDef, TaskDef, EventHandler).  
- Code doit suivre les principes SOLID et Clean Code, être bien structuré et testable.

---

## Structure & emplacement de fichiers

- Racine : `AGENTS.md`, `README.md`, `pnpm-workspace.yaml`, configuration globale (tsconfig, eslint, etc.).  
- dossiers principaux :  
  - `apps/cli/` → binaire CLI (`cac`)  
  - `packages/` → `core`, `parser`, `transpiler`, `conductor-api`, `deployer`, `logger`  
  - `manifests/` → contient les définitions YAML (tasks, workflows, handlers, clients, environments, fragments)  
  - `.cac/` (state, backups)  
- Chaque package a son propre `src/`, son tsconfig, ses tests.

---

## Commandes clés (build / test / CI)

Les agents de code doivent respecter les commandes suivantes (et s’assurer que le code généré s’intègre à ce flux) :

```bash
# Installer les dépendances
pnpm install

# Build global (monorepo)
pnpm run build   # ou pnpm -r build selon l’organisation

# Lint / format
pnpm run lint
pnpm run format

# Tests
pnpm run test

# CLI commands (via `cac`)
cac --help
cac --version
cac init
# pour les étapes ultérieures : cac validate, compile, diff, apply, rollback, etc.

Dans les pipelines CI, prévoir les étapes : lint → validate → build → test → plan/apply.
```

---

Conventions de code & normes

TypeScript strict, pas d’any non justifié.

Modularité claire : chaque commande CLI dans son module ; séparation des responsabilités (parser, transpiler, déploiement).

Les interfaces/ports doivent être bien définis (Domain / UseCase / Port / Adapter).

Utiliser Zod pour validation des YAML → IR, et générer JSON Schema.

Ne jamais exposer les secrets dans le code ou dans les manifests.

Logging structuré (via Pino), niveaux, mode CI (JSON).

Tous les modules doivent être testables, avec mocks sur les appels API.

Respecter les schémas Conductor : ne pas inventer de champs, sauf préfixés x- (ex. x-include).



---

Contraintes & garde-fous

Idempotence requise : exécuter le même plan deux fois sans effets secondaires indésirables.

Protection contre la dérive : si l’état distant diffère du code (modifications UI), l’agent / outil ne doit pas écraser sans alerte ou flag explicite.

Chaque apply doit backup l’état précédent pour rollback.

Le diff / plan affiché doit être lisible, style Terraform (création, mise à jour, suppression).

Rollback doit être rapide et fiable.

Les agents ne doivent pas générer de secrets ou de données sensibles dans le code.

Il faut que tous les manifests YAML/JSON soient valides selon les contrats officiels Conductor.



---

Instructions pour l’agent (Codex) quand il génère du code

Toujours vérifier / exécuter les tests après génération de code, corriger les erreurs.

Ne pas générer de modifications sans inclure des tests nouveaux ou mis à jour.

Respecter la structure monorepo : placer les fichiers dans le package correct (parser, core, etc.).

Ajouter des commentaires pour toute logique complexe.

Si le code modifie les manifests YAML, s’assurer que les exemples restent valides.

Pour les commandes CLI (comme cac init), simuler leur exécution en test pour valider l’effet.

Ne jamais violer les contraintes (idempotence, backups, drift protection).

Si l’agent détecte une potentielle dérive ou conflit, générer un avertissement dans le code/cli, pas une suppression silencieuse.



---

Points de vigilance & suggestions

Si l’agent propose d’ajouter de nouveaux champs dans les manifests, vérifier qu’ils sont conformes aux contrats Conductor.

Garder les modifications incrémentielles — éviter les gros “refactors massifs” sans tests.

L’agent doit se limiter à la portée de la feature traitée (ne pas toucher toute l’architecture d’un coup).

En cas d’ambiguïté, se référer au DSL YAML / JSON de Conductor 
comme source de vérité.

Eviter les injections de code dangereux : pas d’exécution de code arbitraire dans Handlebars templates.
