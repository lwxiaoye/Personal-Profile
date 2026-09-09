"""Build the portfolio's selectable-text, one-page Chinese resume.

Requires reportlab. Run with Python 3; no network or application credentials.
Business figures were supplied by the candidate on 2026-09-09.
"""
from pathlib import Path
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
import os

ROOT = Path(__file__).resolve().parents[1]
FONT_DIR = Path(os.environ.get('RESUME_FONT_DIR', 'C:/Windows/Fonts'))
pdfmetrics.registerFont(TTFont('Chinese', str(FONT_DIR / 'msyh.ttc'), subfontIndex=0))
pdfmetrics.registerFont(TTFont('ChineseBold', str(FONT_DIR / 'msyhbd.ttc'), subfontIndex=0))
pdfmetrics.registerFontFamily('Chinese', normal='Chinese', bold='ChineseBold', italic='Chinese', boldItalic='ChineseBold')
INK = colors.HexColor('#202522')
MUTED = colors.HexColor('#57625b')
ACCENT = colors.HexColor('#a53425')
STYLES = {
    'name': ParagraphStyle('name', fontName='ChineseBold', fontSize=26, leading=32, textColor=INK),
    'role': ParagraphStyle('role', fontName='ChineseBold', fontSize=11, leading=18, textColor=ACCENT, alignment=2),
    'contact': ParagraphStyle('contact', fontName='Chinese', fontSize=8.7, leading=14, textColor=MUTED),
    'body': ParagraphStyle('body', fontName='Chinese', fontSize=9.1, leading=14.1, textColor=INK, wordWrap='CJK', spaceAfter=3),
    'bullet': ParagraphStyle('bullet', fontName='Chinese', fontSize=9.1, leading=14.1, textColor=INK, wordWrap='CJK', leftIndent=9, firstLineIndent=-9, spaceAfter=4),
    'section': ParagraphStyle('section', fontName='ChineseBold', fontSize=11.2, leading=17, textColor=ACCENT, spaceBefore=10, spaceAfter=5),
    'label': ParagraphStyle('label', fontName='ChineseBold', fontSize=10, leading=16, textColor=INK),
    'date': ParagraphStyle('date', fontName='Chinese', fontSize=8.6, leading=16, textColor=MUTED, alignment=2),
}
def p(text, style='body'):return Paragraph(text, STYLES[style])
WIDTH=A4[0]-68
def row(left,right):
    table=Table([[p(left,'label'),p(right,'date')]],colWidths=[WIDTH*.66,WIDTH*.34])
    table.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),2)]))
    return table
def bullet(text):return p('- '+text,'bullet')

story=[]
header=Table([[p('梁伟业','name'),p('AI 工程师 / Agent 应用开发<br/>2027 届 · 软件工程本科','role')]],colWidths=[WIDTH*.45,WIDTH*.55])
header.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'MIDDLE'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
story += [header,p('17823689449　 |　 lwxiaoye@163.com　 |　 重庆','contact'),
          p('作品集：<link href="https://lwxiaoye.top/">lwxiaoye.top</link>　 |　 GitHub：<link href="https://github.com/lwxiaoye">github.com/lwxiaoye</link>','contact'),Spacer(1,8),
          p('具备服装企业 AI 应用落地经验，覆盖 <b>ComfyUI 出图优化、Agent 编排、RAG 能力中枢与服务器部署</b>。服务 12 名美编，支撑日均约 200 张图的生成需求，推动典型 4K 出图耗时降低约 67%。')]

story += [p('实习经历','section'), row('重庆独小漾服装有限公司 · AI 工程师（实习）','2026.06.07 - 2026.09.09'),
    bullet('<b>AI 出图提效：</b>面向 12 名美编搭建并优化 ComfyUI 工作流与图像 API 调用链路，支撑团队日均约 200 张图的生成需求；在同显卡、4K 场景下，将典型单次出图耗时由约 <b>180 秒降至 60 秒</b>，耗时降低约 <b>67%</b>。'),
    bullet('<b>业务 Agent 建设：</b>从零搭建 LangGraph + FastAPI + React 服装业务工作台，串联自然语言意图路由、本地工作流与云端模型调用，实现素材上传、异步任务、资产归档、会话恢复和失败重试；沉淀 <b>39 份工作流与商品镜头模板配置</b>。'),
    bullet('<b>能力中枢建设：</b>构建独立能力网关，统一管理工具、Skills、连接器、内部数据与工作流 <b>5 类能力</b>；实现部门知识库混合检索、MCP 接入、技能审核与受控执行，将身份断言、风险确认、版本绑定和审计追踪纳入 Harness 调用链。'),
    bullet('<b>服务器与部署：</b>搭建公司服务器及 AI 应用运行环境，完成 Docker Compose 服务编排、ComfyUI 模型与节点配置、MySQL / Redis 数据持久化和内网访问，沉淀部署、维护及故障排查文档。')]

story += [p('代表项目','section'),
    row('CareerForge-AI · 高校学生就业辅助平台','2026.05.01 - 2026.06.04'),
    bullet('<b>负责 AI 面试官核心模块与简历助手关键链路：</b>实现简历驱动提问、逐轮追问、6 维评分及报告生成；将简历读取、局部更新、写前快照、撤销与 PDF 导出封装为受约束工具，完成前后端联调与模型异常兜底。'),
    row('多智能体客服 · LangGraph 工作流开发','2026.02.15 - 2026.04.29'),
    bullet('从零搭建“意图分类 - 条件路由 - 专业 Agent - SSE 回传”闭环；通过分类标签规范化处理多行、标点及中英文混排，提高路由稳定性；结合 Checkpoint 持久化与会话缓存实现上下文恢复。'),
    row('医疗领域 RAG · 检索与 Agent 工作流','2025.10.15 - 2025.12.29'),
    bullet('实现 Milvus 稠密 / 稀疏混合检索与 RRF 融合，构建查询改写、检索评估、联网补充及事实核验闭环；加入 Token 预算、摘要压缩与并行子查询，完成数据入库到检索生成的完整链路。')]

story += [p('技术能力','section'),
    p('<b>Agent 与 RAG：</b>LangGraph、LangChain、Function Calling、MCP、Skills、Harness；文档清洗与切块、Embedding、混合检索、重排与结果校验。'),
    p('<b>工程与部署：</b>Python、FastAPI、React、TypeScript、SSE、MySQL、Redis、Docker；ComfyUI 工作流编排、图像 API 集成及 Linux 服务部署。'),
    p('<b>AI 协同开发：</b>熟练使用 AI 编程工具进行需求拆解、代码实现、调试与迭代，结合版本管理、自动化测试和接口联调完成交付。'),
    p('教育与荣誉','section'),row('重庆工程学院 · 软件工程 · 全日制本科','2023.09 - 2027.06'),
    p('2025 年 NCDA 比赛三等奖；2025 年第四届网络文化节一等奖；2023-2026 年度学院第二课堂一等奖。')]

def decoration(canvas,doc):
    canvas.setStrokeColor(ACCENT);canvas.setLineWidth(2);canvas.line(34,A4[1]-25,A4[0]-34,A4[1]-25)
    canvas.setTitle('梁伟业 - AI 工程师 / Agent 应用开发')
    canvas.setAuthor('梁伟业')
output=ROOT/'public/梁伟业简历_Agent开发.pdf'
SimpleDocTemplate(str(output),pagesize=A4,leftMargin=34,rightMargin=34,topMargin=34,bottomMargin=28).build(story,onFirstPage=decoration,onLaterPages=decoration)
print(output)
