export const keys = ['antiTrope','rationality','selfInterest','ruthlessness','persistence','absurdity'];
export const labels = {antiTrope:'反套路',rationality:'理性',selfInterest:'利己',ruthlessness:'狠人',persistence:'坚持',absurdity:'离谱'};
export const calculateFangyuanIndex = scores => Number((keys.reduce((sum, key) => sum + Number(scores[key] || 0), 0) / 6).toFixed(1));
export const grade = score => score >= 10 ? '魔尊登临' : score >= 9 ? '魔威震世' : score >= 7 ? '谋局无双' : score >= 5 ? '锋芒毕露' : score >= 3 ? '破局在即' : '蛰伏蓄势';
