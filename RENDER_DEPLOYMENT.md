# Render Deployment Guide

Complete guide to deploy HelpBoard (frontend + backend + database) on Render.com

## Prerequisites

- GitHub repository with your code (✅ Already done)
- Render account (free at https://render.com)
- MySQL database will be hosted on Render

## Step-by-Step Deployment

### Option 1: Deploy with render.yaml (Recommended)

The `render.yaml` file contains all configuration for automatic deployment.

#### 1. Push render.yaml to GitHub
```bash
cd F:\Epics\HelpBoard
git add render.yaml
git commit -m "Add Render deployment configuration"
git push origin master
```

#### 2. Create Render Account & Link GitHub
1. Go to [https://render.com](https://render.com)
2. Click **Sign up** → Choose **GitHub**
3. Authorize Render to access your GitHub account
4. Click **New** → **Blueprint** (or **Web Service**)

#### 3. Deploy from Blueprint
1. Select your `The-HelpBoard` repository
2. Name the service: `helpboard`
3. Click **Create New Resources**
4. Render will auto-detect `render.yaml` and create:
   - Backend service (Docker)
   - Frontend service (Node.js)
   - MySQL database

### Option 2: Manual Deployment (If render.yaml doesn't work)

#### Deploy Backend

1. **Create Backend Service**
   - Click **New** → **Web Service**
   - Connect your GitHub repository
   - Choose `The-HelpBoard` repo
   
2. **Configure Backend**
   - **Name**: `helpboard-backend`
   - **Runtime**: `Docker`
   - **Root Directory**: (leave blank - uses Dockerfile in root)
   - **Build Command**: (auto-detected)
   - **Start Command**: (auto-detected)

3. **Add Environment Variables**
   Click **Environment** and add:
   
   ```
   SPRING_DATASOURCE_URL: jdbc:mysql://helpboard-mysql:3306/helpboarddb?useSSL=false&serverTimezone=UTC
   SPRING_DATASOURCE_USERNAME: [get from database service]
   SPRING_DATASOURCE_PASSWORD: [get from database service]
   JWT_SECRET: 6be8bd2f76a42943672db310bfaf65d4b328b557ea680b01fef7b40dfad34ead
   JWT_EXPIRATIONMS: 3600000
   SPRING_JPA_HIBERNATE_DDL_AUTO: update
   SERVER_PORT: 8080
   SPRING_CORS_ALLOWED_ORIGINS: https://helpboard-frontend-xxx.onrender.com
   ```

4. **Deploy** → Click **Create Web Service**

#### Deploy Database

1. **Create MySQL Database**
   - Click **New** → **MySQL**
   - **Name**: `helpboard-mysql`
   - **Database Name**: `helpboarddb`
   - **Region**: Same as backend
   - Click **Create Database**

2. **Get Connection Details**
   - Once created, copy the internal connection string
   - Use this in your backend environment variables

#### Deploy Frontend

1. **Create Frontend Service**
   - Click **New** → **Web Service**
   - Connect your GitHub repository
   
2. **Configure Frontend**
   - **Name**: `helpboard-frontend`
   - **Runtime**: `Node`
   - **Root Directory**: `helpboard-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

3. **Add Environment Variables**
   ```
   NEXT_PUBLIC_API_BASE_URL: https://helpboard-backend-xxx.onrender.com
   ```
   (Replace with your actual backend URL)

4. **Deploy** → Click **Create Web Service**

## Getting Your Service URLs

After deployment, Render will assign URLs:
- Backend: `https://helpboard-backend-xxx.onrender.com`
- Frontend: `https://helpboard-frontend-xxx.onrender.com`

## Update Environment Variables After Deployment

1. Once all services are deployed, update the frontend environment variable:
   - Go to **helpboard-frontend** service
   - Settings → Environment Variables
   - Update `NEXT_PUBLIC_API_BASE_URL` to: `https://helpboard-backend-xxx.onrender.com`
   - Click **Save** (this triggers a redeploy)

2. Similarly, update backend CORS if needed:
   - Go to **helpboard-backend** service
   - Settings → Environment Variables
   - Update `SPRING_CORS_ALLOWED_ORIGINS` to: `https://helpboard-frontend-xxx.onrender.com`
   - Click **Save**

## Enable CORS in Backend

Make sure your Spring Boot has CORS enabled. Add this configuration:

```java
// Add to your Spring configuration if not already present
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(
            System.getenv("SPRING_CORS_ALLOWED_ORIGINS")
                .split(",")
        ));
        config.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
```

## Database Initialization

- Render MySQL will create the database (`helpboarddb`)
- Hibernate will auto-create tables based on your JPA entities (via `spring.jpa.hibernate.ddl-auto=update`)

## Troubleshooting

### Backend Service Won't Start
- Check Build Logs in Render dashboard
- Ensure `Dockerfile` is in the root directory
- Verify Java version in Dockerfile (should be 17)

### Frontend Can't Connect to Backend
- Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Check backend service is running
- Look for CORS errors in browser console
- Ensure `SPRING_CORS_ALLOWED_ORIGINS` matches frontend URL

### Database Connection Issues
- Use the **Internal Connection String** in backend env vars (not external)
- Format: `jdbc:mysql://helpboard-mysql:3306/helpboarddb`
- Check database credentials in environment variables

### Services Keep Restarting
- Check memory usage (free tier has limits)
- Review logs for exceptions
- Ensure all required environment variables are set

## Free Tier Limits

Render's free tier includes:
- ✅ Services with 0.5 CPU, 512MB RAM (spins down after 15 mins of inactivity)
- ✅ PostgreSQL/MySQL database (backup every 7 days)
- ⚠️ Bandwidth: Fair use policy
- ⚠️ Services spin down automatically (may take 30 seconds to wake up)

## Upgrade to Paid Plan

For production with:
- Always-on services
- More RAM/CPU
- Better database backups
- Custom domain

Go to service Settings → Plan and upgrade.

## Next Steps

After successful deployment:
1. ✅ Test frontend at `https://helpboard-frontend-xxx.onrender.com`
2. ✅ Test backend API at `https://helpboard-backend-xxx.onrender.com/health`
3. ✅ Try registering a new user
4. ✅ Add items and make requests
5. ✅ Test real-time chat functionality

## Support

- Render Docs: https://render.com/docs
- Discord Support: https://discord.gg/render
