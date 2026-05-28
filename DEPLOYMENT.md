# MERN Stack Business Website - Deployment Guide

This document contains step-by-step instructions for configuring, pushing, and deploying the application.

---

## 1. Local Configuration

### Backend Environment (`backend/.env`)
Ensure your environment variables are configured correctly for local testing:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/business_website
JWT_SECRET=supersecuresecretkeychangeinproduction
JWT_EXPIRE=30d

# Cloudinary (Optional - Fallbacks to local folder uploads if blank)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Mail Settings (Optional - Fallbacks to console log if blank)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
ADMIN_EMAIL=admin@yourcompany.com
```

### Running Locally
To launch both servers simultaneously on a local workspace:

1. **Start the Backend server**:
   ```bash
   cd backend
   npm run seed   # Seeds default admin account and sample items
   npm run dev    # Launches server on http://localhost:5000
   ```
   *Default Admin login details:*
   - **Username**: `admin`
   - **Password**: `adminpassword123`

2. **Start the Frontend development server**:
   ```bash
   cd frontend
   npm run dev    # Launches Vite server on http://localhost:5173
   ```

---

## 2. Production Database Setup (MongoDB Atlas)

1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster (Shared Tier is free).
3. Under **Database Access**, create a user with a secure password.
4. Under **Network Access**, click **Add IP Address** and select **Allow Access from Anywhere (0.0.0.0/0)** (required for host platforms like Render).
5. Click **Connect** &rarr; **Connect your application** and copy the Connection String.
6. Replace `password` inside the URI with your database user password and save it for hosting backend variables.

---

## 3. Backend Deployment (Render or Railway)

### Deploying to Render
1. Sign in to [Render](https://render.com).
2. Create a new **Web Service** and connect your GitHub repository.
3. Configure the following fields:
   - **Root Directory**: `backend` (or leave empty if monorepo configuration is managed via commands)
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Expand the **Environment Variables** section and add:
   - `MONGO_URI` (your MongoDB Atlas connection string)
   - `JWT_SECRET` (generate a secure random key)
   - `PORT` = `5000`
   - `NODE_ENV` = `production`
   - `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`
   - `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS`
   - `ADMIN_EMAIL`
5. Deploy the service. Take note of the generated Render Web Service URL (e.g. `https://your-backend.onrender.com`).

---

## 4. Frontend Deployment (Vercel)

### Preparation
Open `frontend/src/services/api.js` and change the `API_BASE_URL` to point to your live backend Render URL:
```javascript
const API_BASE_URL = 'https://your-backend.onrender.com/api';
```
*(Optionally configure it to read dynamically from environment variables)*

### Deploying to Vercel
1. Install Vercel CLI globally or use the Vercel dashboard:
   - Go to [Vercel Dashboard](https://vercel.com).
   - Click **Add New** &rarr; **Project**.
2. Connect your Git repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. Vercel will host your website and provide a public URL (e.g., `https://yourcompany.vercel.app`).

---

## 5. Domain Configuration Guide

To bind a custom domain (e.g., `www.yourcompany.com`) purchased from Namecheap, GoDaddy, or Google Domains:

### Mapping Domain to Vercel (Frontend)
1. In Vercel Dashboard, go to your deployed project &rarr; **Settings** &rarr; **Domains**.
2. Type your domain name (e.g., `yourcompany.com`) and click **Add**.
3. Vercel will prompt you to add DNS records at your domain registrar:
   - **A Record**: Point `@` to `76.76.21.21`
   - **CNAME Record**: Point `www` to `cname.vercel-dns.com`
4. Go to your registrar control panel (Namecheap/GoDaddy), open **Advanced DNS**, add these records, and wait 5-30 minutes for DNS propagation.

---

## 6. GitHub Push Commands

To initialize git and push the source code to a remote GitHub repository:

```bash
# Initialize local repository
git init

# Add all files to staging area
git add .

# Create initial commit
git commit -m "Initial commit - Modern MERN Stack Business Website"

# Rename default branch to main
git branch -M main

# Add remote repository URL
git remote add origin https://github.com/your-username/your-repo-name.git

# Push changes to GitHub
git push -u origin main
```
