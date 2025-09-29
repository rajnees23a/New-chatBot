# 🤖 ChatBot – AI Digital Assistant (ADA)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version **15.2.11**.

ChatBot is an Angular-based AI-powered assistant designed to help users ideate, structure, and refine business ideas through a conversational interface. It features dynamic form generation, metadata mapping, and guided prompts inspired by ADA (AI Digital Assistant) workflows.

---

## 🚀 Features

- Conversational assistant with guided prompts  
- Auto-populated business idea forms  
- Metadata-driven field mapping  
- Responsive UI with Bootstrap 5 and Angular Material  
- PDF export via `jspdf`  
- Email integration via `emailjs-com`  
- Progress tracking and checklist validation  
- Modular architecture for reusable components  

---

## 📦 Tech Stack

| Category        | Packages & Tools |
|-----------------|------------------|
| **Framework**   | Angular 15.2.x   |
| **UI Libraries**| Angular Material, Bootstrap 5.3.3, FontAwesome |
| **Animations**  | Animate.css      |
| **PDF Export**  | jspdf            |
| **Email Service**| emailjs-com     |
| **Testing**     | Karma, Jasmine   |
| **Utilities**   | RxJS, Zone.js    |

---

## 🛠️ Scripts

| Command                                 | Description |
|----------------------------------------|-------------|
| `ng serve`                              | Starts the dev server at `http://localhost:4200/` |
| `ng serve --configuration production`   | Starts the server in production mode |
| `ng build`                              | Builds the project into `dist/` |
| `ng build --watch --configuration development` | Builds in watch mode for development |
| `ng test`                               | Runs unit tests via Karma |
| `ng test --code-coverage`               | Runs unit tests and generates coverage report |

---

## 💻 Development Server

Run:
```bash
ng serve
```

Navigate to [http://localhost:4200/](http://localhost:4200/).  
The application will automatically reload if you change any of the source files.

---

## 📱 Responsive Design

The application supports the following screen resolutions:

| Device Type | Resolution Range   |
|-------------|--------------------|
| Mobile      | 360px – 768px      |
| Tablet      | 768px – 1024px     |
| Desktop     | 1024px and above   |

Built with **Bootstrap 5** grid system and media queries for adaptive layout.

---

## 🧪 Testing & Coverage

### ✅ Unit Tests
Run:
```bash
ng test
```

### 📊 Coverage Report
Run:
```bash
ng test --code-coverage
```

Opens coverage report at:
```
/coverage/chat-bot/index.html
```

### 🖼️ Sample Test & Coverage Screenshots

<img width="1366" height="719" alt="Dufry_test" src="https://github.com/user-attachments/assets/38f957c2-030b-4afc-a0b2-4e28883bdd93" />

---

## ⚙️ Configuration & Mock Data

### 🔧 Configuration File
Static constants and metadata mappings are defined in:
```
src/app/constants.ts
```

### 📦 Mock Data
Mock data for static form population and testing is located at:
```
src/app/create/create.component.mock.ts
```

This mock data is also referenced in `constants.ts` for ADA-style field simulation.

---

## 🖼️ Application Screenshots



---

