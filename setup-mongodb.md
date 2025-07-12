# MongoDB Setup Guide

## Option 1: Local MongoDB Installation

### Step 1: Download MongoDB Community Server
1. Go to: https://www.mongodb.com/try/download/community
2. Select "Windows" and "msi" package
3. Download and install

### Step 2: Start MongoDB Service
After installation, run these commands in PowerShell as Administrator:

```powershell
# Create data directory
mkdir C:\data\db

# Start MongoDB service
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath="C:\data\db"
```

### Step 3: Verify Connection
The server should now connect to `mongodb://localhost:27017/ecommerce`

## Option 2: MongoDB Atlas (Cloud Database)

### Step 1: Create Atlas Account
1. Go to: https://www.mongodb.com/atlas
2. Create free account
3. Create new cluster (free tier)

### Step 2: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace the MONGODB_URI in server/.env

### Step 3: Update .env File
Replace the MONGODB_URI with your Atlas connection string.

## Option 3: MongoDB Compass (Includes Local MongoDB)

1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Install and run
3. It will automatically start a local MongoDB instance

## Testing the Connection

After setting up MongoDB, restart your server:

```bash
npm run dev
```

You should see: "MongoDB connected successfully" 