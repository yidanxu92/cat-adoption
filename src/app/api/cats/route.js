import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Cat from '@/models/Cat';

export async function GET() {
  try {
    await dbConnect();
    
    // 获取所有猫咪数据
    const cats = await Cat.find({});
    
    return NextResponse.json({ success: true, data: cats });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 