# 🤖 LLM Assistant – VSCode Extension (8INF950)

Extension VSCode développée dans le cadre du cours **8INF950 – Sujets spéciaux**.  
Ce plugiciel intègre un **Large Language Model (LLM)** afin d’assister le développeur directement dans son environnement de développement.

👥 **Auteurs**
- Youssef AIT ELOURF  
- Arthur DELHAYE  

---

## 🎯 Objectif du projet

L’objectif de cette extension est d’automatiser et de faciliter certaines tâches du processus de développement logiciel grâce à un LLM, notamment :

- la génération de code,
- l’explication de code existant,
- la génération de commentaires et de documentation,
- l’assistance contextuelle directement depuis VSCode.

L’extension est conçue pour être **simple d’utilisation**, **configurable**, et **robuste**, tout en restant intégrée de manière native à VSCode.

---

## ✨ Fonctionnalités

### 1️⃣ Génération de code
- Génération de code à partir d’une instruction textuelle.
- Insertion automatique du code généré dans l’éditeur.
- Accessible via :
  - la Webview (sidebar),
  - le menu contextuel,
  - la palette de commandes.

### 2️⃣ Explication de code
- Explication claire et concise du code sélectionné.
- Affichage de l’explication dans la Webview ou via une notification VSCode.

### 3️⃣ Commentaires et documentation
- Ajout automatique de commentaires et de docstrings sur le code sélectionné.
- Respect strict de la logique existante (aucune modification fonctionnelle).

---

## 🖥️ Intégration VSCode & UX

- Sidebar dédiée dans la barre d’activité (**Assistant IA**).
- Menus contextuels dans l’éditeur.
- Palette de commandes VSCode.
- Indicateur de progression lors des appels au LLM.
- Messages d’erreur explicites en cas de problème réseau ou API.

---

## ⚙️ Prérequis

- **Node.js** (version recommandée : LTS)
- **VSCode** (≥ 1.106)
- Accès à un LLM compatible via :
  - Ollama (local ou cloud),
  - ou toute API compatible avec l’endpoint configuré.

---

## 🔧 Installation

1. Cloner le dépôt :
```bash
git clone <url-du-repo>
cd projet-llm-8inf950
```

2. Installer les dépendances :
```bash
npm install
```

3. Compiler l’extension :
```bash
npm run compile
```

4. Lancer l’extension en mode développement :
- Ouvrir le projet dans VSCode
- Appuyer sur `F5` (Extension Development Host)

---

## 🔑 Configuration

L’extension expose les paramètres suivants dans les **Settings VSCode** :

- `llmAssistant.model`  
  Modèle LLM utilisé (ex. `qwen3-coder`, `llama3`, etc.)

- `llmAssistant.url`  
  URL de l’API LLM (local ou cloud)

- `llmAssistant.apiKey`  
  Clé API si nécessaire (laisser vide pour un usage local)

---

## 🧪 Tests

Des tests unitaires ont été mis en place afin de valider :
- le parsing des réponses LLM,
- la logique des handlers,
- la robustesse du service d’appel au modèle.

Lancer les tests :
```bash
npm test
```

---

## ⚠️ Limitations connues

- La qualité des réponses dépend du modèle LLM configuré.
- Les temps de réponse peuvent varier selon la latence réseau ou la charge du modèle.
- Les prompts sont génériques et peuvent être améliorés pour des cas d’usage spécifiques.

---

## 🚀 Pistes d’amélioration

- Support avancé multi-langage (adaptation fine des prompts).
- Historique des conversations dans la Webview.
- Personnalisation avancée des paramètres du modèle.
- Évaluation automatique des réponses générées.

---

## 📌 Contexte académique

Projet réalisé dans le cadre du cours **8INF950 – Sujets spéciaux**  
Département de mathématiques, d’informatique et de génie.

---

**Bonne utilisation !**
