export const evaluationCharts = [
  {
    "src": "/showcase/metrics/overview.png",
    "title": "核心指标总览",
    "note": "各项来自不同样本集，不能理解为时间趋势；回答项为草稿自动规则判分，场景项为接口与路由检查，恢复项未实际重启服务。"
  },
  {
    "src": "/showcase/metrics/hit5.png",
    "title": "Hit@5 检索命中",
    "note": "自然题 140/150，分层题 534/650。管理员按知识空间检索后合并结果，以金标文档是否出现在 Top 5 中判定。"
  },
  {
    "src": "/showcase/metrics/answer.png",
    "title": "草稿与引用代理评测",
    "note": "原图中的“回答正确率 / 引用支持率”为自动代理指标：检索摘要草稿满足规则，且引用包含金标文档。未进行人工语义正确性与引用支持性验收。"
  },
  {
    "src": "/showcase/metrics/e2e.png",
    "title": "分场景脚本评测",
    "note": "原图标为“端到端任务成功率”；脚本按知识命中、接口响应和路由关键词判定。改款 15/15 不代表 15 张成品通过业务验收，门店分析为 9/15。"
  },
  {
    "src": "/showcase/metrics/tools.png",
    "title": "工具调用",
    "note": "参数校验 22/24，执行 18/23；重试前后结果相同。样本量较小，按本次跑批范围解读。"
  },
  {
    "src": "/showcase/metrics/acl.png",
    "title": "权限边界评测",
    "note": "非法请求拦截 v1 为 2/52，v2 为 2/67。合法请求无误拦不能抵消非法请求拦截不足；管理员通道与身份口径仍需核验。"
  },
  {
    "src": "/showcase/metrics/recovery.png",
    "title": "故障恢复用例",
    "note": "恢复或终止用例通过 11/13，另有 5 项跳过；未实际重启服务。无重复执行、产物保全为受限报告字段，不代表完整故障场景已验证。"
  },
  {
    "src": "/showcase/metrics/latency.png",
    "title": "检索延迟",
    "note": "400 题检索 P50 为 246 ms，P95 为 51,266 ms；该批次存在明显长尾，不是完整回答耗时。"
  }
];
