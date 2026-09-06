export const keys = ['antiTrope','rationality','selfInterest','ruthlessness','persistence','absurdity'];
export const labels = {antiTrope:'反套路',rationality:'理性',selfInterest:'利己',ruthlessness:'狠人',persistence:'坚持',absurdity:'离谱'};
export const calculateFangyuanIndex = scores => Number((keys.reduce((sum, key) => sum + Number(scores[key] || 0), 0) / 6).toFixed(1));
export const grade = score => score >= 10 ? '方源爆表' : score >= 9 ? '方源时刻' : score >= 7 ? '高浓度方源' : score >= 5 ? '明显方源' : score >= 3 ? '有点方源' : '普通';
