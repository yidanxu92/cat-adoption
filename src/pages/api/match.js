import { connectToDatabase } from '../../utils/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { answers } = req.body;
    
    // 连接数据库
    const { db } = await connectToDatabase();
    
    // 构建查询条件
    const query = buildQueryFromAnswers(answers);
    
    // 获取匹配的猫咪
    let matchedCats = await db.collection('cats').find(query).toArray();
    
    // 如果没有完全匹配的猫咪，尝试放宽条件
    if (matchedCats.length === 0) {
      const relaxedQuery = buildRelaxedQuery(answers);
      matchedCats = await db.collection('cats').find(relaxedQuery).toArray();
    }
    
    // 计算每只猫的匹配分数，并考虑待养时间
    matchedCats = calculateMatchScores(matchedCats, answers);
    
    // 返回结果
    return res.status(200).json({
      success: true,
      data: matchedCats.slice(0, 3) // 返回前3个最匹配的猫咪
    });
    
  } catch (error) {
    console.error('Error in match API:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error finding matching cats',
      error: error.message
    });
  }
}

// 根据用户回答构建查询条件
function buildQueryFromAnswers(answers) {
  // 您现有的查询构建逻辑
  // ...
}

// 构建放宽条件的查询
function buildRelaxedQuery(answers) {
  // 放宽条件的查询逻辑
  // ...
}

// 计算匹配分数并考虑待养时间
function calculateMatchScores(cats, answers) {
  return cats.map(cat => {
    // 基础匹配分数计算
    let score = calculateBaseMatchScore(cat, answers);
    
    // 待养时间加权
    // 使用firstAddedAt字段计算猫咪在系统中的时间
    const firstAdded = new Date(cat.firstAddedAt || cat.createdAt || cat.updatedAt);
    const now = new Date();
    const daysInSystem = Math.floor((now - firstAdded) / (1000 * 60 * 60 * 24));
    
    // 待养时间权重 - 每30天增加10%的分数，最多增加50%
    const timeBonus = Math.min(0.5, daysInSystem / 30 * 0.1);
    
    // 应用时间权重
    const finalScore = score * (1 + timeBonus);
    
    return {
      ...cat,
      matchScore: finalScore,
      timeBonus: timeBonus
    };
  }).sort((a, b) => b.matchScore - a.matchScore); // 按分数降序排序
}

// 计算基础匹配分数
function calculateBaseMatchScore(cat, answers) {
  // 您现有的分数计算逻辑
  // ...
  
  // 示例实现
  let score = 0;
  
  // 遍历用户回答，计算匹配度
  Object.entries(answers).forEach(([questionName, answer]) => {
    // 根据不同问题类型计算分数
    // ...
  });
  
  return score;
} 