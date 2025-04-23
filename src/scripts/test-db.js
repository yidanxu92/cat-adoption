// 这个文件不会被 Next.js 使用，只是用来测试数据库连接
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://新用户名:新密码@cats.t6yk37x.mongodb.net/?retryWrites=true&w=majority&appName=cats';

async function testConnection() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    
    console.log('Connected to MongoDB successfully');
    
    // 列出所有集合
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // 断开连接
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

testConnection(); 