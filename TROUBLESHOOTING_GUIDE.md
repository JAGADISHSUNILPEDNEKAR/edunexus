# EduNexus Troubleshooting Guide

## Quick Fix Checklist

### 1. Check MongoDB Connection

**Is MongoDB running?**

```bash
# For local MongoDB
mongod

# Check if it's running (Mac/Linux)
ps aux | grep mongod

# Check if it's running (Windows)
tasklist | findstr mongod
```

**Test MongoDB connection:**

```bash
# Connect to MongoDB shell
mongosh

# Or older version
mongo

# Should show: "Connected to MongoDB"
```

### 2. Verify Environment Variables

**Server (.env file in `/server` folder):**

```env
NODE_ENV=development
PORT=5000

# CRITICAL: Must match your MongoDB setup
MONGO_URI=mongodb://localhost:27017/edunexus

# CRITICAL: Can be any random string for development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

BCRYPT_SALT_ROUNDS=10

# Client URL for CORS
CLIENT_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5
```

**Client (.env file in `/client` folder):**

```env
# CRITICAL: Must match where your backend is running
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Installation Steps

**Backend:**

```bash
cd server
npm install
```

**Frontend:**

```bash
cd client
npm install
```

### 4. Seed the Database

```bash
cd server
npm run seed
```

**Expected output:**
```
✅ MongoDB Connected successfully
✅ Cleared existing data
✅ Admin created
✅ Instructor created
✅ Student 1 created
✅ Student 2 created
✅ Course created
...
```

### 5. Start the Application

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

**Expected output:**
```
✅ MongoDB Connected: localhost
📊 Database Name: edunexus
✅ Socket.io initialized
🚀 Server running in development mode on port 5000
```

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
```

**Expected output:**
```
VITE ready in XXX ms
Local:   http://localhost:5173/
```

## Common Issues & Solutions

### Issue 1: "Failed to connect to MongoDB"

**Symptoms:**
```
❌ MongoDB Connection Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**

1. **Start MongoDB:**
   ```bash
   # Mac with Homebrew
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   # Start MongoDB as a service from Services app
   # Or run: mongod
   ```

2. **Check MongoDB is running:**
   ```bash
   mongosh
   # or
   mongo
   ```

3. **Use MongoDB Atlas (cloud):**
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get connection string
   - Update `MONGO_URI` in `server/.env`:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/edunexus?retryWrites=true&w=majority
   ```

### Issue 2: "Login fails" / "Network Error"

**Symptoms:**
- Login button doesn't work
- Console shows: `Network Error` or `ERR_CONNECTION_REFUSED`

**Solutions:**

1. **Check backend is running:**
   ```bash
   # Should respond with JSON
   curl http://localhost:5000/health
   ```

2. **Check CORS settings:**
   - Backend console should show: `✅ Server running on port 5000`
   - No CORS errors in browser console

3. **Verify API URL:**
   - Open browser console (F12)
   - Check: `localStorage.getItem('VITE_API_URL')`
   - Should be: `http://localhost:5000/api`

4. **Test API directly:**
   ```bash
   # Should return error (no credentials)
   curl http://localhost:5000/api/auth/me
   
   # Should work
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"student1@edunexus.com","password":"Student@123"}'
   ```

### Issue 3: "Courses not loading"

**Symptoms:**
- Empty course list
- Loading spinner forever
- Console error: `Cannot read properties of undefined`

**Solutions:**

1. **Seed the database:**
   ```bash
   cd server
   npm run seed
   ```

2. **Check API response:**
   ```bash
   curl http://localhost:5000/api/courses
   ```

3. **Clear browser cache:**
   - Open DevTools (F12)
   - Right-click Refresh → Empty Cache and Hard Reload

4. **Check browser console:**
   - Look for API errors
   - Note the exact error message

### Issue 4: "Registration not working"

**Symptoms:**
- Form submits but nothing happens
- Error: "User already exists"
- Validation errors

**Solutions:**

1. **Check if email already exists:**
   ```bash
   # Connect to MongoDB
   mongosh edunexus
   
   # Check users
   db.users.find({ email: "your-email@example.com" })
   
   # If exists, use different email or delete:
   db.users.deleteOne({ email: "your-email@example.com" })
   ```

2. **Clear existing data:**
   ```bash
   cd server
   npm run seed
   ```

3. **Check password requirements:**
   - Minimum 6 characters
   - Valid email format

### Issue 5: Port Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

1. **Find and kill process:**
   ```bash
   # Mac/Linux
   lsof -ti:5000 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

2. **Use different port:**
   - Update `server/.env`: `PORT=5001`
   - Update `client/.env`: `VITE_API_URL=http://localhost:5001/api`

## Debug Mode

### Enable Detailed Logging

**Backend (`server/index.js`):**
```javascript
// Already added in fixed version
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
```

**Frontend (Browser Console):**
```javascript
// Check API configuration
console.log(import.meta.env)

// Check current user
console.log(localStorage.getItem('token'))
```

### Test Individual Components

**Test Backend:**
```bash
# Health check
curl http://localhost:5000/health

# Test auth
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student1@edunexus.com","password":"Student@123"}'

# Test courses
curl http://localhost:5000/api/courses
```

**Test Frontend:**
1. Open browser to http://localhost:5173
2. Open DevTools (F12)
3. Go to Network tab
4. Try to login
5. Check request/response

## Nuclear Option (Complete Reset)

If nothing works, try a complete reset:

```bash
# 1. Stop all servers (Ctrl+C in terminals)

# 2. Clear database
mongosh edunexus
db.dropDatabase()
exit

# 3. Remove node_modules and reinstall
cd server
rm -rf node_modules package-lock.json
npm install

cd ../client
rm -rf node_modules package-lock.json
npm install

# 4. Seed database
cd ../server
npm run seed

# 5. Clear browser data
# - Open browser
# - Press F12
# - Application tab → Clear storage → Clear site data

# 6. Start fresh
# Terminal 1:
cd server
npm run dev

# Terminal 2:
cd client
npm run dev

# 7. Open http://localhost:5173
```

## Getting Help

If you're still stuck:

1. **Check browser console** (F12 → Console tab)
2. **Check server logs** (Terminal running backend)
3. **Copy error messages** exactly as they appear
4. **Note what you were doing** when the error occurred

**Provide this info when asking for help:**
- Operating System
- Node.js version (`node --version`)
- MongoDB version (`mongod --version`)
- Exact error messages
- Screenshot of browser console
- Screenshot of server terminal