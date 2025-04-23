import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    console.log('Testing database connection...');
    await dbConnect();
    
    // 列出所有集合
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log('Available collections:', collectionNames);
    
    // 尝试从 catsCollection 集合中获取一条记录
    let catSample = null;
    if (collectionNames.includes('catsCollection')) {
      catSample = await mongoose.connection.db.collection('catsCollection').findOne({});
      console.log('Sample cat from catsCollection:', catSample);
    } else if (collectionNames.includes('cats')) {
      catSample = await mongoose.connection.db.collection('cats').findOne({});
      console.log('Sample cat from cats:', catSample);
    }
    
    // 获取当前数据库名称
    const dbName = mongoose.connection.db.databaseName;
    console.log('Current database name:', dbName);
    
    return NextResponse.json({ 
      success: true, 
      database: dbName,
      collections: collectionNames,
      catSample
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { success: false, message: '数据库测试错误: ' + error.message },
      { status: 500 }
    );
  }
} 