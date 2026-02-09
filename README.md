# Deployment Guide for Shreya Vastralok

This guide provides step-by-step instructions to manually deploy the specialized WhatsApp-driven clothing catalog application using **Render**. We will deploy three components:
1.  **Database** (PostgreSQL)
2.  **Backend** (Node.js/Express)
3.  **Frontend** (React/Vite)

---

## Prerequisites
-   A [Render](https://render.com/) account.
-   The code pushed to your GitHub repository (as shown in your screenshot).
-   Cloudinary credentials (if you are using image uploads).

---

## Step 1: Set up the Database (Neon)

1.  Log in to your **[Neon Console](https://console.neon.tech/)**.
2.  Select your **Project** (or create a new one).
3.  Go to the **Dashboard** or **Connection Details**.
4.  Find your **Connection String** (Database URL).
    *   It usually looks like: `postgres://user:password@ep-shiny-glade-123456.us-east-1.aws.neon.tech/dbname?sslmode=require`
    *   **Important:** Make sure `sslmode=require` is included at the end.
5.  **Copy** this URL. You will need it in the next step to connect your backend.

---

## Step 2: Deploy the Backend (Web Service)

1.  Go to your **Render Dashboard**.
2.  Click **New +** and select **Web Service**.
3.  **Connect a repository**: Select your GitHub repo (`hasnain-jasiqlab/ShreyaVastralok` or similar).
4.  **Name**: `shreya-vastralok-backend`.
5.  **Region**: **Must be the same as your Database** (e.g., Singapore).
6.  **Branch**: `main`.
7.  **Root Directory**: `backend` (Important: This tells Render our backend code is in this folder).
8.  **Runtime**: **Node**.
9.  **Build Command**: `npm install`
10. **Start Command**: `node src/server.js`
11. **Instance Type**: **Free** (or paid).
12. **Environment Variables**:
    Scroll down to the "Environment Variables" section and add the following keys and values:

    | Key | Value |
    | :--- | :--- |
    | `DATABASE_URL` | Paste the **Neon Connection String** from Step 1. |
    | `PORT` | `10000` (Render's default port). |
    | `NODE_ENV` | `production` |
    | `JWT_SECRET` | A long, random string for security (e.g., `mysupersecretkey123`). |
    | `CLOUDINARY_CLOUD_NAME` | Your Cloudinary Cloud Name. |
    | `CLOUDINARY_API_KEY` | Your Cloudinary API Key. |
    | `CLOUDINARY_API_SECRET` | Your Cloudinary API Secret. |
    | `CORS_ORIGIN` | `*` (Initially allowed for all, update to Frontend URL later). |

13. Click **Create Web Service**.
14. **Wait** for the build to finish. Once it says "Live", copy the **Service URL** (e.g., `https://shreya-vastralok-backend.onrender.com`). You need this for the Frontend.

---

## Step 3: Deploy the Frontend (Static Site)

1.  Go to your **Render Dashboard**.
2.  Click **New +** and select **Static Site**.
3.  **Connect a repository**: Select the same GitHub repo again.
4.  **Name**: `shreya-vastralok-frontend`.
5.  **Branch**: `main`.
6.  **Root Directory**: `frontend`.
7.  **Build Command**: `npm install && npm run build`
8.  **Publish Directory**: `dist` (Vite builds to this folder by default).
9.  **Environment Variables**:
    Add the API URL from Step 2 so the frontend can talk to the backend.

    | Key | Value |
    | :--- | :--- |
    | `VITE_API_URL` | Paste the **Backend Service URL** from Step 2 (e.g., `https://...onrender.com`). |

10. **Redirects/Rewrites (Important for SPA)**:
    Since this is a Single Page Application (React), we need to tell Render to redirect all traffic to `index.html` so routing works.
    -   Go to the **Redirects/Rewrites** tab (or set it during creation if available).
    -   Add a new rule:
        -   **Source**: `/*`
        -   **Destination**: `/index.html`
        -   **Action**: `Rewrite`

11. Click **Create Static Site**.
12. **Wait** for the build to finish.

---

## Step 4: Final Configuration

1.  Once the Frontend is **Live**, copy its URL (e.g., `https://shreya-vastralok-frontend.onrender.com`).
2.  Go back to your **Backend Service** dashboard > **Environment Variables**.
3.  Update (or Add) the `CORS_ORIGIN` variable:
    -   **Key**: `CORS_ORIGIN`
    -   **Value**: Paste your **Frontend URL** (e.g., `https://shreya-vastralok-frontend.onrender.com`).
    *Note: Remove the trailing slash `/` if present.*

**Done!** Your application should now be fully deployed and accessible via the Frontend URL.
