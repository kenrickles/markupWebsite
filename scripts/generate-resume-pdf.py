"""Render a public resume from JSON exported from the profile TypeScript modules.
Requires reportlab. Refresh after profile changes; see README.
"""
import json, sys
from html import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
pdfmetrics.registerFont(TTFont('ResumeSans','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('ResumeSansBold','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))

data = json.load(open(sys.argv[1]))
output = sys.argv[2]
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='Name',fontName='ResumeSansBold',fontSize=25,leading=30,textColor=colors.HexColor('#182936'),spaceAfter=8))
styles.add(ParagraphStyle(name='SectionTitle',fontName='ResumeSansBold',fontSize=12,leading=17,textColor=colors.HexColor('#23566e'),spaceBefore=14,spaceAfter=7))
styles.add(ParagraphStyle(name='RoleTitle',fontName='ResumeSansBold',fontSize=10,leading=14,spaceBefore=7,spaceAfter=3))
styles.add(ParagraphStyle(name='Detail',fontName='ResumeSans',fontSize=8.5,leading=12,textColor=colors.HexColor('#64717b'),spaceAfter=6))
styles.add(ParagraphStyle(name='Copy',fontName='ResumeSans',fontSize=8.5,leading=12,spaceAfter=5))
styles.add(ParagraphStyle(name='Item',fontName='ResumeSans',fontSize=8.5,leading=12,leftIndent=10,firstLineIndent=-8,spaceAfter=4))
def text(value):
    return escape(value.replace('—','-').replace('–','-').replace('’',"'").replace('“','"').replace('”','"'))
def p(value,style='Copy'): return Paragraph(text(value),styles[style])
def item(value): return Paragraph('&#8226; '+text(value),styles['Item'])
story=[p('Kenrick Tan','Name'),p('Protocol Engineer at Galaxy Digital | Singapore','Copy'),
Paragraph('<link href="mailto:kenrickles@gmail.com">kenrickles@gmail.com</link> | <link href="https://github.com/kenrickles">github.com/kenrickles</link> | <link href="https://linkedin.com/in/kenrick-tan">LinkedIn</link>',styles['Detail']),
p(data['recoveredHome']['subtitle'],'Copy'),p('Experience','SectionTitle')]
for job in data['experiences']:
    story.append(KeepTogether([p(job['role']+' | '+job['company'],'RoleTitle'),p(job['timeframe']+' | '+job['location'],'Detail')]+[item(h) for h in job['highlights']]))
story.append(p('Education','SectionTitle'))
for e in data['education']:
    story.append(KeepTogether([p(e['school'],'RoleTitle'),p(e['program'],'Copy'),p(e['timeframe']+' | '+e['location'],'Detail')]+[p(h) for h in e['highlights']]))
story.append(p('Certifications','SectionTitle'))
for c in data['certifications']:
    story.append(KeepTogether([p(c['title'],'RoleTitle'),p(c['organization']+' | '+c['timeframe'],'Detail')]))
story.append(p('Recognition','SectionTitle'))
for r in data['recoveredRecognition']:
    story.append(KeepTogether([p(r['title'],'RoleTitle'),p(r['organization']+' | '+r['timeframe'],'Detail')]+[item(h) for h in r['highlights']]))
def footer(canvas, doc):
    canvas.setFont('ResumeSans',8); canvas.setFillColor(colors.HexColor('#8a969d'))
    canvas.drawString(42,27,'Kenrick Tan | kenrickles.com')
    canvas.drawRightString(A4[0]-42,27,str(doc.page))
SimpleDocTemplate(output,pagesize=A4,rightMargin=42,leftMargin=42,topMargin=38,bottomMargin=45,title='Kenrick Tan - Resume',author='Kenrick Tan').build(story,onFirstPage=footer,onLaterPages=footer)
