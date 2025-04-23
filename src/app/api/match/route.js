import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Cat from '@/models/Cat';


export async function POST(request) {
  try {
    let answers;
    try {
      const body = await request.json();
      answers = body.answers;
    } catch (parseError) {
    
      return NextResponse.json(
        { success: false, message: '无法解析请求: ' + parseError.message },
        { status: 400 }
      );
    }
    

    const userTraits = Object.values(answers).flat();
  
    
    try {
      await dbConnect();

      const cats = await Cat.find({
        $or: [
            { "details.personality": { $in: userTraits } },
            { "details.color": { $in: userTraits } },
            { "details.markings": { $in: userTraits } },
            { "details.age": { $in: userTraits } }
          ]
      });
      
      if (cats.length > 0) {
        const matchedCats = cats.map(cat => {
            const matchScore = [
              ...cat.details.personality,
              cat.details.color,
              ...(Array.isArray(cat.details.markings) ? cat.details.markings : [cat.details.markings]),
              cat.details.age
            ].filter(trait => userTraits.includes(trait)).length;
        
          
          return {
            ...cat.toObject(),
            matchScore
          };
        });
        
        // 排序并返回结果
        matchedCats.sort((a, b) => b.matchScore - a.matchScore);
        const topMatches = matchedCats.slice(0, 10);

        const randomIndex = Math.floor(Math.random() * topMatches.length);
        const selectedCat = topMatches[randomIndex];
        
        return NextResponse.json({ success: true, data: [selectedCat] });
      } else {
        const allCats = await Cat.find({});
        
        if (allCats.length > 0) {
          // 随机选择一只猫咪
          const randomIndex = Math.floor(Math.random() * allCats.length);
          const randomCat = allCats[randomIndex];
          
          return NextResponse.json({ 
            success: true, 
            data: [{ ...randomCat.toObject(), matchScore: 1 }],
            message: '没有找到完全匹配的猫咪，返回随机猫咪'
          });
        } else {
          // 如果数据库中没有猫咪，返回错误
          return NextResponse.json(
            { success: false, message: '数据库中没有猫咪数据' },
            { status: 500 }
          );
        }
      }
    } catch (error) {
      
      return NextResponse.json(
        { success: false, message: '数据库错误: ' + error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unhandled error in API route:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误: ' + error.message },
      { status: 500 }
    );
  }
} 