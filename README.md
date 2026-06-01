# HelpBoard - Neighborhood Sharing Platform
<img src="Screenshot 2025-11-09 100120.png" alt="Brand font">

A full-stack web application that enables neighbors to share, borrow, lend, and donate items within their community. Built with Next.js frontend and Spring Boot backend.

## 🌟 Features

### Core Functionality
- **Item Management**: Add, view, and manage items you want to share
- **Request System**: Request items from neighbors or approve/reject incoming requests
- **Real-time Chat**: Communicate with other users about item requests
- **User Authentication**: Secure login and registration system
- **Dashboard**: Personal dashboard to manage your items and requests

### Item Types
- **Borrow**: Items you can borrow from others
- **Lend**: Items you're willing to lend to others
- **Donate**: Items you want to give away

### Request Management
- **My Requests**: Track requests you've made to others
- **Requests Received**: Manage requests from other users
- **Status Updates**: Approve, reject, or track request status
- **Real-time Notifications**: Stay updated on request changes



## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14.2.16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Radix UI + Custom components
- **Forms**: React Hook Form + Zod validation
- **Real-time**: STOMP WebSocket client
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Database**: MySQL
- **ORM**: JPA/Hibernate
- **Security**: Spring Security + JWT
- **WebSocket**: STOMP messaging
- **Validation**: Jakarta Validation
- **Documentation**: OpenAPI/Swagger (planned)

## 📁 Project Structure

```
helpboard/
├── helpboard-frontend/          # Next.js frontend
│   ├── app/                     # App router pages
│   │   ├── dashboard/           # User dashboard
│   │   ├── items/[itemId]/      # Item detail pages
│   │   ├── chat/[requestId]/    # Chat pages
│   │   ├── login/               # Authentication pages
│   │   └── register/
│   ├── components/              # Reusable components
│   │   ├── forms/               # Form components
│   │   ├── ui/                  # UI component library
│   │   └── ...
│   ├── lib/                     # Utilities and API client
│   ├── store/                   # Zustand state management
│   └── styles/                  # Global styles
├── helpboard-backend/           # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/helpboard/backend/
│   │       ├── config/          # Configuration classes
│   │       ├── controller/      # REST controllers
│   │       ├── dto/             # Data Transfer Objects
│   │       ├── model/           # JPA entities
│   │       ├── repository/      # Data repositories
│   │       ├── service/         # Business logic
│   │       └── util/            # Utility classes
│   └── src/main/resources/
│       └── application.properties
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm/yarn/pnpm
- **Java** 17+
- **MySQL** 8.0+
- **Maven** 3.6+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd helpboard
   ```

2. **Backend Setup**
   ```bash
   cd helpboard-backend
   
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE helpboarddb;
   
   # Update application.properties with your database credentials
   # Edit: src/main/resources/application.properties
   
   # Run the backend
   mvn spring-boot:run
   ```
   Backend will be available at `http://localhost:8080`

3. **Frontend Setup**
   ```bash
   cd helpboard-frontend
   
   # Install dependencies
   npm install
   # or
   yarn install
   # or
   pnpm install
   
   # Start development server
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```
   Frontend will be available at `http://localhost:3000`

### Configuration

#### Backend Configuration
Update `helpboard-backend/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/helpboarddb?useSSL=false&serverTimezone=UTC
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT Configuration
jwt.secret=your-super-secret-jwt-key-replace-this-in-prod-with-a-strong-random-string-at-least-256bit
jwt.expirationMs=3600000

# Server Port
server.port=8080
```

#### Frontend Configuration
Update `helpboard-frontend/lib/api.ts` if needed:

```typescript
const API_BASE_URL = "http://localhost:8080" // Backend URL
```

## 📱 Usage

### For Users

1. **Register/Login**: Create an account or sign in
2. **Add Items**: Use the dashboard to add items you want to share
3. **Browse Items**: View available items from other users
4. **Make Requests**: Request items you're interested in
5. **Manage Requests**: Approve/reject requests for your items
6. **Chat**: Communicate with other users about requests

### For Developers

#### API Endpoints

**Authentication**
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

**Items**
- `GET /items` - Get all items
- `POST /items` - Create new item
- `GET /items/{id}` - Get item by ID
- `PUT /items/{id}` - Update item
- `DELETE /items/{id}` - Delete item

**Requests**
- `POST /items/{itemId}/request` - Create request for item
- `GET /users/{userId}/requests` - Get user requests
- `PATCH /requests/{id}/status` - Update request status

**Chat**
- `GET /requests/{id}/messages` - Get chat messages
- `POST /requests/{id}/messages` - Send message

#### WebSocket Endpoints
- `/topic/requests/{requestId}` - Chat messages
- `/app/requests/{requestId}/send` - Send message

## 🔧 Development

### Running Tests
```bash
# Backend tests
cd helpboard-backend
mvn test

# Frontend tests (if configured)
cd helpboard-frontend
npm test
```

### Building for Production
```bash
# Backend
cd helpboard-backend
mvn clean package
java -jar target/helpboard-backend-*.jar

# Frontend
cd helpboard-frontend
npm run build
npm start
```

### Code Style
- **Frontend**: ESLint + Prettier (configured)
- **Backend**: Follow Spring Boot conventions
- **Git**: Conventional commits recommended

## 🗄️ Database Schema

### Key Entities
- **User**: User accounts and profiles
- **Item**: Items available for sharing
- **Request**: Item requests between users
- **Message**: Chat messages for requests

### Relationships
- User → Items (One-to-Many)
- User → Requests (One-to-Many as requester)
- Item → Requests (One-to-Many)
- Request → Messages (One-to-Many)

## 🔒 Security

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: BCrypt password encryption
- **CORS Configuration**: Cross-origin request handling
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: JPA/Hibernate parameterized queries

## 🚀 Deployment

### Push to GitHub
```bash
# Navigate to project root
cd HelpBoard

# Add GitHub remote (if not already done)
git remote add origin https://github.com/YOUR_USERNAME/helpboard.git
git branch -M main

# Push to GitHub
git push -u origin main
```

### Backend Deployment
1. Build the JAR file: `mvn clean package`
2. Deploy to your preferred Java hosting platform (Azure, AWS, Heroku, etc.)
3. Configure environment variables:
   - `SPRING_DATASOURCE_URL`: Database connection string
   - `SPRING_DATASOURCE_USERNAME`: Database username
   - `SPRING_DATASOURCE_PASSWORD`: Database password
   - `JWT_SECRET`: JWT signing key
4. Set up MySQL database on your hosting platform
5. Update frontend `NEXT_PUBLIC_API_BASE_URL` to point to your deployed backend

### Frontend Deployment on Vercel

#### Option 1: Using GitHub (Recommended)
1. Push your code to GitHub (see above)
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **Add New** → **Project**
4. Select your `helpboard` repository
5. **Framework Preset**: Next.js (should auto-detect)
6. **Root Directory**: `helpboard-frontend`
7. **Environment Variables**: Add
   - `NEXT_PUBLIC_API_BASE_URL`: Your deployed backend URL (e.g., `https://your-backend.azurewebsites.net`)
8. Click **Deploy**

#### Option 2: Using Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd helpboard-frontend

# Deploy
vercel --prod
```

#### Environment Variables for Production
In Vercel dashboard → Settings → Environment Variables:
- **Key**: `NEXT_PUBLIC_API_BASE_URL`
- **Value**: `https://your-backend-url.com` (your deployed Java backend URL)

**Example:**
- Development: `http://localhost:8080`
- Production: `https://helpboard-api.azurewebsites.net`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- [ ] WebSocket connection may need reconnection logic
- [ ] Image upload functionality not yet implemented
- [ ] Email notifications not configured
- [ ] Search and filtering for items needs enhancement

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Image upload and management
- [ ] Advanced search and filtering
- [ ] Rating and review system
- [ ] Location-based item discovery
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Analytics and reporting

## ScreenShots
<img src="Screenshot 2025-11-07 015505.png" alt="ss1">
<img src="Screenshot 2025-11-07 015417.png" alt="ss2">
<img src="Screenshot 2025-11-07 015327.png" alt="ss3">
<img src="Screenshot 2025-11-07 015258.png" alt="ss4">
<img src="Screenshot 2025-11-07 015248.png" alt="ss5">

## SpringBoot Terminal Logs Screenshot
<img src="Screenshot 2025-11-07 020032.png" alt="spring logs">


## 📞 Support

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed description
3. Contact the development team

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Next.js team for the amazing React framework
- Radix UI for accessible component primitives
- Tailwind CSS for utility-first styling
- All contributors and testers (MY DEAREST AI COMPANIONS WHO HELPED ME DEBUG THE CODE FOR 5+ HOURS)

---

**Happy Sharing! 🎉**
