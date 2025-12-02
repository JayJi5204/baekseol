export function calculateTotalPointWithDetails(
  questionCnt: number,
  maxResponse: number,
  reward: number
): {
  total: number;
  fee: number;
  pointPerQuestion: number;
  pointPerResponse: number;
} {
  if (questionCnt <= 0 || maxResponse <= 0 || reward < 0) {
    return { total: 0, fee: 0, pointPerQuestion: 0, pointPerResponse: 0 };
  }

  const DEFAULT_PRICE_FOR_SURVEY = 3000;

  let pointPerQuestion: number;
  if (questionCnt <= 10) pointPerQuestion = 1.0;
  else if (questionCnt <= 30) pointPerQuestion = 1.3;
  else if (questionCnt <= 60) pointPerQuestion = 1.6;
  else if (questionCnt <= 100) pointPerQuestion = 1.8;
  else pointPerQuestion = 2.0;

  let pointPerResponse: number;
  if (maxResponse <= 10) pointPerResponse = 1.0;
  else if (maxResponse <= 100) pointPerResponse = 1.3;
  else if (maxResponse <= 500) pointPerResponse = 1.6;
  else if (maxResponse <= 1000) pointPerResponse = 1.8;
  else pointPerResponse = 2.0;

  const fee = Math.round(
    pointPerQuestion * pointPerResponse * DEFAULT_PRICE_FOR_SURVEY
  );
  const total = Math.round(maxResponse * reward + fee);

  return { total, fee, pointPerQuestion, pointPerResponse };
}
