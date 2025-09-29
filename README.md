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

Built with **Bootstrap 5** grid system .

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

<img width="1312" height="991" alt="test_specs" src="https://github.com/user-attachments/assets/a4241303-0c26-4b8f-b5ce-ff9d8a34715d" />

<img width="1918" height="758" alt="component-wise-coverage" src="https://github.com/user-attachments/assets/2718f291-0926-4384-aa57-709200de85a5" />

<img width="793" height="194" alt="overall_coverage" src="https://github.com/user-attachments/assets/be1f0890-a470-4003-92c5-ffdc59bcfa95" />


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


<img width="1359" height="671" alt="create_request_1440px_resolution" src="https://github.com/user-attachments/assets/e59057b4-698c-4ba2-b6ff-6ba14498dd69" />

<img width="1366" height="625" alt="create_request_1024px_resolution" src="https://github.com/user-attachments/assets/3e8a3126-666d-4d2b-9ab7-ab221888b9f3" />

<img width="1353" height="631" alt="create_request_768px_resolution" src="https://github.com/user-attachments/assets/5fec0e1e-9abe-4977-9f40-7e53233552dd" />

<img width="1336" height="607" alt="create_request_375px_mobile_resolution" src="https://github.com/user-attachments/assets/10a78789-fdb1-42fa-969c-890f3bc4e637" />


---




