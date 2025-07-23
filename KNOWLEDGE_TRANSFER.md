# Xplore Buzz - Knowledge Transfer Document

This document provides a comprehensive overview of the Xplore Buzz application, designed to help new developers quickly understand its architecture, core functionalities, and development workflow.

## 1. Project Overview

Xplore Buzz is a Learning Management System (LMS) creator that empowers authenticated users to upload videos and enhance them with interactive elements such as survey popups and Call-to-Actions (CTAs). These interactive elements can be triggered at specific timestamps within the videos (start, end, or custom times). Each uploaded video is assigned a unique ID, which, along with a preview platform domain, allows end-users to consume and interact with the content directly. The application also provides analytics based on user interactions with the videos.

**Core Features:**
*   **User Authentication:** Secure login, registration, email verification, password reset, and Google Sign-In.
*   **Video Upload & Management:** Users can upload, view, update, and delete their videos.
*   **Interactive Elements:** Ability to add and manage survey popups and CTAs within videos.
*   **Video Playback:** Integrated video player with HLS support.
*   **Analytics:** View analytics related to video consumption and interactive element engagement.

## 2. Tech Stack

*   **Frontend:**
    *   **React.js:** For building the user interface.
    *   **Vite:** As the build tool for a fast development experience.
    *   **Tailwind CSS:** For utility-first CSS styling.
    *   **Shadcn/ui:** A collection of re-usable components built with Radix UI and Tailwind CSS.
    *   **Axios:** For making HTTP requests to the backend API.
    *   **React Router DOM:** For client-side routing.
    *   **HLS.js:** For handling HTTP Live Streaming video playback.
*   **Backend:** (Assumed based on API calls, not part of this repository)
    *   The application interacts with a backend API hosted at `https://prompthkit.apprikart.com/api/v1/xplore`.

## 3. Project Structure

The project follows a standard React application structure. Here's a breakdown of the key directories and files:

```
D:/User/Public/Projects/Xplore/xplore-buzz/
├───public/
├───src/
│   ├───App.jsx               // Main application component, handles routing and sets up the overall layout.
│   ├───index.css             // Global CSS styles for the application.
│   ├───main.jsx              // Entry point of the React application, responsible for rendering the App component.
│   ├───components/           // Reusable UI components used across different pages.
│   │   ├───IntervalEditor.jsx // Component for defining and editing time intervals within videos for interactive elements.
│   │   ├───Navbar.jsx        // Navigation bar component, typically found at the top of the application.
│   │   ├───ProductPopup.jsx  // Displays a popup related to product information or CTA.
│   │   ├───ProtectedRoute.jsx // A higher-order component (HOC) that protects routes, ensuring only authenticated users can access them.
│   │   ├───QRPopup.jsx       // Displays a QR code in a popup, likely for sharing video links.
│   │   ├───Sidebar.jsx       // Sidebar navigation component.
│   │   ├───SurveyPopup.jsx   // Displays a survey form in a popup within a video.
│   │   ├───VideoPlayer.jsx   // The main video player component, handling video playback and integration with HLS.
│   │   ├───VideoSidebar.jsx  // Sidebar specifically for video-related controls or information.
│   │   ├───popups/           // Specific popup components for editing interactive elements.
│   │   │   ├───EditCTAPopup.jsx // Popup for editing Call-to-Action (CTA) details.
│   │   │   └───EditSurveyPopup.jsx // Popup for editing survey details.
│   │   └───ui/               // Shadcn/ui components, providing pre-built and styled UI elements.
│   │       └───... (various UI components like button, dialog, input, etc.)
│   ├───hooks/                // Custom React hooks for encapsulating and reusing stateful logic.
│   │   ├───use-toast.ts      // Hook for displaying toast notifications.
│   │   ├───useAnalytics.js   // Hook for fetching and managing analytics data.
│   │   ├───useAuth.js        // Hook containing authentication logic (login, register, logout, etc.).
│   │   ├───useCTA.js         // Hook for managing Call-to-Action (CTA) data and operations.
│   │   ├───useFeedBackQuestion.js // Hook for managing feedback questions, likely used in surveys.
│   │   ├───useProvidersKey.js // Hook for managing provider-specific API keys.
│   │   ├───useSecretKey.js   // Hook for managing secret keys.
│   │   └───useVideo.js       // Hook for managing video-related operations (upload, fetch, update, delete).
│   ├───lib/                  // Utility functions and API configurations.
│   │   ├───axios.js          // Configures and exports Axios instances for API communication.
│   │   ├───utils.ts          // General utility functions.
│   │   └───utils/
│   │       └───hls.js        // Utility functions for HLS (HTTP Live Streaming) video playback.
│   └───pages/                // Top-level components representing different application pages.
│       ├───Analytics.jsx     // Page displaying video analytics and user interaction data.
│       ├───ApiKeys.jsx       // Page for managing API keys.
│       ├───ForgotPassword.jsx // Page for initiating the password reset process.
│       ├───Home.jsx          // The main landing page after successful login.
│       ├───Login.jsx         // User login page.
│       ├───Profile.jsx       // User profile management page.
│       ├───Register.jsx      // User registration page.
│       ├───ResetPassword.jsx // Page for resetting user password using a token.
│       ├───Upload.jsx        // Page for uploading new videos.
│       ├───VerifyEmail.jsx   // Page for verifying user email addresses.
│       ├───VideoPage.jsx     // Page for viewing a single video with its interactive elements.
│       └───Videos.jsx        // Page listing all uploaded videos by the user.
├───package.json              // Project dependencies and scripts
├───vite.config.js            // Vite configuration
├───tailwind.config.js        // Tailwind CSS configuration
├───postcss.config.js         // PostCSS configuration
├───.eslintrc.json            // ESLint configuration
├───components.json           // Shadcn/ui components configuration
└───vercel.json               // Vercel deployment configuration
```

## 4. API Communication

All API communication is handled through `axios` instances configured in `src/lib/axios.js`.

*   `apiClient`: Used for public endpoints (e.g., login, register).
*   `apiClientStudio`: Used for specific studio-related endpoints, includes an `adminToken`.
*   `apiClientWithAuth`: Used for authenticated endpoints. It includes an interceptor that automatically attaches the user's authentication token from `localStorage` to every request.

**Base URL:** `https://prompthkit.apprikart.com/api/v1/xplore`

## 5. Authentication Flow

The authentication logic is primarily managed within the `src/hooks/useAuth.js` custom hook.

*   **Login (`login` function):** Sends user credentials to `/accounts/login`. On successful login, the JWT token and user data are stored in `localStorage`.
*   **Registration (`register` function):** Sends user details to `/accounts/signup`. Triggers an email verification process.
*   **Email Verification (`verifyEmail` function):** Verifies the user's email using a token received via email.
*   **Forgot/Reset Password (`forgotPassword`, `resetPassword` functions):** Handles the password recovery process.
*   **Logout (`logout` function):** Clears the token and user data from `localStorage` and redirects to the login page.
*   **Google Sign-In (`googleSignIn` function):** Handles authentication via Google.

**Protected Routes:**
The `src/components/ProtectedRoute.jsx` component is used to wrap routes that require user authentication. It checks for the presence of a token in `localStorage` and redirects unauthenticated users to the login page.

## 6. Video Management

The `src/hooks/useVideo.js` custom hook encapsulates all logic related to video operations.

*   **Upload Video (`uploadVideo` function):** Sends video files and metadata (title, description) as `multipart/form-data` to the `/videos/` endpoint.
*   **Get All Videos (`getAllVideos` function):** Fetches a list of all videos uploaded by the authenticated user from `/videos`.
*   **Get Video by ID (`getVideoById` function):** Retrieves details of a specific video using its ID from `/videos/:id`.
*   **Update Video (`updateVideo` function):** Updates video details (thumbnail, title, description, video file) using a `PATCH` request to `/videos/:id`.
*   **Delete Video (`deleteVideo` function):** Deletes a video using its ID from `/videos/:id`.

Video playback is handled by the `src/components/VideoPlayer.jsx` component, which utilizes `src/lib/utils/hls.js` for HLS (HTTP Live Streaming) support.

## 7. Interactive Elements (CTAs/Surveys)

The application allows users to add interactive elements to their videos.

*   **Survey Popups:** Managed by `src/components/SurveyPopup.jsx` and `src/components/popups/EditSurveyPopup.jsx`. The `src/hooks/useFeedBackQuestion.js` hook likely handles the backend communication for survey data.
*   **CTAs (Call-to-Actions):** Managed by `src/components/ProductPopup.jsx` and `src/components/popups/EditCTAPopup.jsx`. The `src/hooks/useCTA.js` hook likely handles the backend communication for CTA data.
*   **Interval Editor:** The `src/components/IntervalEditor.jsx` component is likely used to define the start and end times for these interactive elements within a video.

## 8. Getting Started

To set up the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd xplore-buzz
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    This will start the Vite development server, usually on `http://localhost:5173`.

4.  **Environment Variables:**
    *   Check for a `.env.local` or similar file for any environment variables required for API keys or other configurations. If not present, you might need to create one based on documentation or by inspecting the code for `process.env` usages.

5.  **Backend API:**
    *   Ensure the backend API (`https://prompthkit.apprikart.com/api/v1/xplore`) is accessible. You do not need to run the backend locally for the frontend to function, as it's an external service.

This document should provide a solid foundation for any new developer joining the Xplore Buzz project. For more detailed understanding, it is recommended to explore the code within the mentioned files and components.
