# InfinityEra Hosting Backend

Complete backend solution for Telegram bot hosting platform.

## Features

- ✅ User Authentication (JWT)
- ✅ Bot Management (Upload, Start, Stop, Delete)
- ✅ Payment Integration
- ✅ Admin Dashboard
- ✅ Real-time Bot Logs
- ✅ File Upload Support
- ✅ Role-based Access Control

## Tech Stack

- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Multer** - File Uploads
- **bcryptjs** - Password Hashing

## Installation

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env` with your configurations:
- MongoDB connection string
- JWT secret key
- Payment gateway credentials

### 3. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update MONGO_URI in .env

### 4. Create Upload Directory

```bash
mkdir uploads
```

### 5. Start Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Bot Management

- `POST /api/bots/create` - Upload bot (with file)
- `GET /api/bots` - Get all user bots
- `GET /api/bots/:id` - Get specific bot
- `POST /api/bots/:id/start` - Start bot
- `POST /api/bots/:id/stop` - Stop bot
- `DELETE /api/bots/:id` - Delete bot
- `GET /api/bots/:id/logs` - Get bot logs

### Payments

- `POST /api/payments/create` - Create payment
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments` - Get payment history

### Admin

- `GET /api/admin/users` - Get all users
- `GET /api/admin/bots` - Get all bots
- `GET /api/admin/stats` - Get dashboard stats

## Usage Examples

### Register User

```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john',
    email: 'john@example.com',
    password: 'password123'
  })
})
```

### Upload Bot

```javascript
const formData = new FormData();
formData.append('botName', 'My Bot');
formData.append('botToken', 'YOUR_BOT_TOKEN');
formData.append('botFile', fileInput.files[0]);

fetch('http://localhost:5000/api/bots/create', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: formData
})
```

### Start Bot

```javascript
fetch('http://localhost:5000/api/bots/BOT_ID/start', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
})
```

## Project Structure

```
infinityera-backend/
├── server.js           # Main server file
├── package.json        # Dependencies
├── .env               # Environment variables
├── .env.example       # Example env file
├── uploads/           # Bot files directory
└── README.md          # Documentation
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- File upload validation
- Role-based access control
- CORS protection

## Production Deployment

### Using PM2

```bash
npm install -g pm2
pm2 start server.js --name infinityera
pm2 save
pm2 startup
```

### Environment Setup

1. Set NODE_ENV=production
2. Use strong JWT_SECRET
3. Enable HTTPS
4. Setup MongoDB with authentication
5. Configure firewall rules

## Database Schema

### Users
- username, email, password
- role (user/admin)
- plan (free/basic/premium/enterprise)
- credits

### Bots
- userId, botName, botToken
- botFile path
- status (stopped/running/error)
- logs array

### Payments
- userId, amount, plan
- status, transactionId
- createdAt

## Additional Features to Implement

- [ ] Email notifications
- [ ] Bot auto-restart on crash
- [ ] Resource usage monitoring
- [ ] Rate limiting
- [ ] Webhook support
- [ ] Bot templates
- [ ] Analytics dashboard
- [ ] Two-factor authentication

## Support

For issues and questions, create an issue in the repository.

## License

ISC
