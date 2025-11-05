# VaxTrack NG

VaxTrack NG is an intelligent vaccination tracking and health education system designed for parents and health practitioners in Nigeria. It helps manage infant immunization schedules, provides timely reminders, and offers valuable, AI-powered health resources to ensure every child is protected.

## ✨ Key Features

The application offers a tailored experience for two main user types: Parents and Health Practitioners.

### For Parents:
- **Dashboard:** An at-a-glance summary of urgent overdue vaccinations and upcoming appointments.
- **My Children:** A centralized place to add and manage vaccination records for multiple children.
- **Detailed View:** Track the complete immunization history and completion percentage for each child.
- **Health Education:** Access a library of articles on vaccine safety, schedules, and infant health.
- **AI Health Assistant:** An integrated, conversational AI (powered by the Gemini API) to answer vaccination-related questions in a clear and supportive manner.
- **AI Catch-Up Planner:** A powerful tool that generates a personalized catch-up schedule for children who have missed vaccinations.
- **Notifications:** Receive timely reminders for due dates and alerts for overdue shots.

### For Health Practitioners:
- **Provider Dashboard:** A high-level overview of key clinic metrics, including total patients, coverage rates, and urgent alerts.
- **Patient Management:** A comprehensive list of all patients with search, filtering, and the ability to add new patients.
- **Reporting & Analytics:** Visualize data on vaccination coverage rates and patient demographics.
- **Centralized Education:** Access the same educational resources provided to caregivers to ensure consistent messaging.

### General Features:
- **Responsive Design:** A clean, modern, and fully responsive UI that works on all screen sizes.
- **Dark Mode:** A beautiful, themeable interface with support for light, dark, and system themes.
- **Interactive UI:** Features like modals, toasts, and animated charts provide a rich user experience.
- **Role Switching:** Seamlessly switch between Parent and Health Practitioner views to demonstrate all features.

## 🚀 Tech Stack

- **Frontend Framework:** [React](https://reactjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **AI Integration:** [Google Gemini API](https://ai.google.dev/)
- **Build Tool:** Vite (inferred from `index.html` setup)
- **Language:** TypeScript

## 📂 Application Structure

The codebase is organized into logical directories to maintain clarity and scalability.

```
.
├── components/      # Reusable UI components (Modals, Layout, Icons, etc.)
├── views/           # Top-level components for each major screen/view
├── App.tsx          # Main application component, handles state and routing
├── index.tsx        # Entry point of the React application
├── constants.ts     # Mock data and constant values
├── types.ts         # TypeScript type definitions
├── index.html       # The main HTML file
└── README.md        # This file
```

- **`components/`**: Contains shared, reusable components like `Modal`, `Sidebar`, `Header`, `ToastComponent`, and icon exports.
- **`views/`**: Each file represents a major view of the application (e.g., `ParentDashboard.tsx`, `EducationView.tsx`). These are the main content panes controlled by the `App` component.
- **`App.tsx`**: The core of the application. It manages global state such as the current user type, the active view, modal visibility, and orchestrates which view component to render.
- **`constants.ts`**: Holds all static data used throughout the app, such as infant records, educational content, and notifications. This makes it easy to manage sample data.
- **`types.ts`**: Defines the data structures and shapes using TypeScript interfaces, ensuring type safety across the application.

## 🤖 AI Integration

The application leverages the Google Gemini API for its intelligent features.

- **AI Chat:** Uses the `gemini-2.5-flash` model for its balance of speed and conversational quality. The AI is given a specific persona as a "helpful and compassionate health assistant" to ensure its responses are appropriate and supportive.
- **AI Catch-Up Planner:** Uses the more powerful `gemini-2.5-pro` model for its advanced reasoning capabilities to generate safe and accurate personalized vaccination schedules based on user inputs.
- **Markdown Rendering:** The AI's responses are formatted with Markdown, which is then parsed and rendered in the UI for better readability (e.g., bold text and lists).

## 🏁 Getting Started

This application is designed to run directly in a browser without a complex setup.

### 1. Configure Your API Key

The application's AI features are powered by the Google Gemini API. To use them, you must provide an API key.

**How to get a key:**
- You can obtain a free API key from [Google AI Studio](https://aistudio.google.com/).

**How to use the key:**
- The application is configured to read the API key from an environment variable named `API_KEY`.
- **For local development:** You will need to set this environment variable in the terminal session where you are serving the application. For example:
    ```bash
    # On macOS or Linux
    export API_KEY="YOUR_GEMINI_API_KEY"
    
    # On Windows (Command Prompt)
    set API_KEY="YOUR_GEMINI_API_KEY"
    
    # On Windows (PowerShell)
    $env:API_KEY="YOUR_GEMINI_API_KEY"
    ```
- Replace `"YOUR_GEMINI_API_KEY"` with the actual key you obtained from Google AI Studio.
- **If you are using a shared API key:** Please follow the same steps above, using the key provided to you.

### 2. Open the Application

Simply open the `index.html` file in a modern web browser (like Chrome, Firefox, or Safari).

### 3. No Installation Required

All dependencies are loaded from a CDN, so no `npm install` or build step is necessary. The app is ready to use immediately after you've configured your API key.

## 🕹️ How to Use

- **Switch Roles:** Use the "Parent" / "Health Practitioner" toggle in the header to explore the two different user experiences.
- **Navigate:** Use the sidebar to move between different sections like the Dashboard, Patients/Children list, and Settings.
- **Interact:**
    - Click on a child or patient to view their detailed vaccination schedule.
    - Click "Read More" on an education article to open a detailed modal view.
    - Add new children or patients using the dedicated buttons in the "My Children" or "Patients" views.
- **Use AI Features:**
    - Click the sparkle icon in the bottom-right to open the AI menu.
    - Select "Ask a Question" to chat with the AI Health Assistant.
    - Select "Create Catch-Up Plan" to generate a personalized schedule for a child who has missed vaccines.
- **Customize:** Go to the "Settings" page to change the application's theme (light/dark/system).

## 🔮 Future Improvements

- **Authentication:** Implement a full user login and authentication system to securely store personal data.
- **Backend Integration:** Connect the application to a real database (like Firebase or Supabase) to persist user and patient data beyond a single session.
- **Data Synchronization:** Allow health practitioners to update a child's record, which would then be visible to the parent in real-time.
- **Advanced Reporting:** Add more complex charts and data export options (e.g., PDF, CSV) for providers to generate compliance reports.
- **Push Notification Service:** Integrate a real push notification service (e.g., Firebase Cloud Messaging) to send reminders even when the app is not open.
- **Offline Support:** Implement service workers to provide basic offline functionality, allowing users to view cached records without an internet connection.

This project was created to demonstrate a modern, feature-rich, and AI-enhanced React application. It serves as a strong foundation for building a real-world public health tool. With its robust feature set and clean architecture, VaxTrack NG is poised to make a significant impact on child healthcare management in Nigeria and beyond.