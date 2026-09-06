export const demoMoments = [
  ['先算账，再谈复仇','别人重生先复仇，他为什么先算账？','重生后的第一件事不是热血宣言，而是盘点筹码、风险与收益。','普通主角先激动，先复仇，先立誓。','方源先评估资源，再决定情绪是否值得支付。','别人重生像买彩券，他重生像做风险评估。',9.6,10,'plus'],
  ['救人之前先问代价','救一个人，为什么要先给自己报价？','面对求助，主角把善意也放进了成本表。','普通主角先救人，再想后果。','方源先确认交换是否成立，再决定出手。','这不是冷血，这是把人情债也做成了资产负债表。',8.8,9,'normal'],
  ['机缘也要分期付款','天降机缘，他为什么先找退出通道？','众人争抢宝物时，他先看逃跑路线。','普通主角看见宝物就冲。','方源先算最坏结果，确认能撤才拿。','别人拿机缘靠运气，他拿机缘先买保险。',9.2,10,'over10'],
  ['兄弟也要讲契约','结义之前，为什么先把条件写清？','情义最浓时，反而把边界写得最细。','普通主角靠热血建立信任。','方源用可执行的规则降低背叛成本。','兄弟情深没问题，先把违约条款签一下。',8.4,8,'normal'],
  ['输一局，赢十年','明明能赢，他为什么主动认输？','一次退让换来更长的观察窗口。','普通主角必须当场打脸。','方源把面子留给别人，把未来留给自己。','打脸爽十秒，布局爽十年。',9.0,10,'plus']
].map(([title,hook,summary,normal,fangyuan,roast,index,daai,mode], n) => ({
  id: crypto.randomUUID(), book:'蛊真人（节目示例）',character:'方源',chapter:`第${n + 1}章`,sequence:n+1,title,hook,originalText:'【示例文本】这里是主播自行选择并有权使用的关键文本展示区域。正式使用时，请粘贴你自己的合法引用内容。',plotSummary:summary,conventionalTactic:normal,fangyuanTactic:fangyuan,roastText:roast,audienceQuestion:'如果是你，会先满足情绪，还是先评估风险？',scores:{antiTrope:index,rationality:index,selfInterest:index,ruthlessness:index,persistence:index,absurdity:index},fangyuanIndex:index,daaiIndex:daai,daaiDisplayMode:mode,tags:['反套路','理性','节目示例'],status:n===0?'live':'ready',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()
}));
