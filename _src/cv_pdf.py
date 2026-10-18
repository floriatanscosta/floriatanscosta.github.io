#!/usr/bin/env python3
"""
Gera o currículo em PDF (pt, en, es) a partir dos mesmos dados do site.

Uso:
    python3 _src/cv_pdf.py          # gera os três PDFs
    (também é chamado automaticamente por build.py, se a biblioteca estiver instalada)

Requisito: ReportLab  ->  pip install reportlab
Fontes:    _src/fonts/Roboto-*.ttf (Roboto, licença SIL Open Font License — ver OFL.txt)
Saída:     /assets/cv/floriatan-costa-cv-<idioma>.pdf

Regras: sem foto; títulos de trabalhos, periódicos, eventos e instituições no idioma original;
rodapé com a data de geração e a data da última atualização dos dados (_src/data/).
"""
import os, re, subprocess, sys
from datetime import date

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build  # noqa: E402  (reaproveita dados, textos e funções do gerador do site)

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.platypus import (CondPageBreak, KeepTogether, Paragraph, SimpleDocTemplate, Spacer, Table,
                                TableStyle)

CV, PUB, S, T, tr = build.CV, build.PUB, build.S, build.T, build.tr
OUT_DIR = os.path.join(build.ROOT, 'assets', 'cv')
FONT_DIR = os.path.join(build.SRC, 'fonts')
SITE = 'floriatan.com.br'

# Cores da identidade visual (página Design)
NAVY = colors.HexColor('#3f5682')
SLATE = colors.HexColor('#5a729e')
TEAL = colors.HexColor('#1c7d9a')
TEXT = colors.HexColor('#3d4350')
MUTED = colors.HexColor('#5f6675')
RULE = colors.HexColor('#d5dbe6')

# --------------------------------------------------------------------------------------
# Textos próprios do PDF (os demais vêm de site.json)
# --------------------------------------------------------------------------------------
L = {
    'profile': {'pt': 'Perfil', 'en': 'Profile', 'es': 'Perfil'},
    'areas': {'pt': 'Áreas de atuação', 'en': 'Fields', 'es': 'Áreas de actuación'},
    'lines': {'pt': 'Linhas de pesquisa', 'en': 'Research lines', 'es': 'Líneas de investigación'},
    'keywords': {'pt': 'Palavras-chave', 'en': 'Keywords', 'es': 'Palabras clave'},
    'techniques': {'pt': 'Técnicas', 'en': 'Techniques', 'es': 'Técnicas'},
    'education': {'pt': 'Formação acadêmica', 'en': 'Education', 'es': 'Formación académica'},
    'positions': {'pt': 'Experiência profissional', 'en': 'Professional experience', 'es': 'Experiencia profesional'},
    'awards': {'pt': 'Prêmios e títulos', 'en': 'Awards and honours', 'es': 'Premios y distinciones'},
    'metrics': {'pt': 'Métricas de citação', 'en': 'Citation metrics', 'es': 'Métricas de citas'},
    'database': {'pt': 'Base', 'en': 'Database', 'es': 'Base'},
    'articles': {'pt': 'Artigos completos em periódicos', 'en': 'Journal articles', 'es': 'Artículos en revistas'},
    'magazine': {'pt': 'Artigos em revista de divulgação', 'en': 'Articles in trade magazines', 'es': 'Artículos en revistas de divulgación'},
    'chapters': {'pt': 'Capítulos de livro', 'en': 'Book chapters', 'es': 'Capítulos de libro'},
    'projects': {'pt': 'Projetos', 'en': 'Projects', 'es': 'Proyectos'},
    'reviewer': {'pt': 'Revisor de periódicos', 'en': 'Journal reviewer', 'es': 'Revisor de revistas'},
    'supervisions': {'pt': 'Orientações de iniciação científica', 'en': 'Undergraduate research supervision', 'es': 'Dirección de iniciación científica'},
    'committees': {'pt': 'Bancas de TCC', 'en': 'Undergraduate thesis committees', 'es': 'Tribunales de TFG'},
    'talks': {'pt': 'Palestras', 'en': 'Talks', 'es': 'Conferencias'},
    'courses': {'pt': 'Cursos ministrados', 'en': 'Courses taught', 'es': 'Cursos impartidos'},
    'technical': {'pt': 'Produção técnica', 'en': 'Technical output', 'es': 'Producción técnica'},
    'organized': {'pt': 'Organização de eventos', 'en': 'Event organisation', 'es': 'Organización de eventos'},
    'complementary': {'pt': 'Formação complementar', 'en': 'Additional training', 'es': 'Formación complementaria'},
    'memberships': {'pt': 'Sociedades e redes científicas', 'en': 'Scientific societies and networks', 'es': 'Sociedades y redes científicas'},
    'student': {'pt': 'Estudante', 'en': 'Student', 'es': 'Estudiante'},
    'generated': {'pt': 'Gerado em {d}', 'en': 'Generated on {d}', 'es': 'Generado el {d}'},
    'content': {'pt': 'conteúdo atualizado em {d}', 'en': 'content updated on {d}', 'es': 'contenido actualizado el {d}'},
    'page': {'pt': 'Página {n} de {t}', 'en': 'Page {n} of {t}', 'es': 'Página {n} de {t}'},
    'title': {'pt': 'Currículo', 'en': 'Curriculum Vitae', 'es': 'Currículum'},
    'note': {'pt': 'Títulos de trabalhos, periódicos, eventos e instituições no idioma original.',
             'en': 'Titles of works, journals, events and institutions are kept in their original language.',
             'es': 'Los títulos de trabajos, revistas, eventos e instituciones se mantienen en su idioma original.'},
}
t = lambda key, lang: L[key][lang]


# --------------------------------------------------------------------------------------
# Datas
# --------------------------------------------------------------------------------------
def content_date():
    """Data da última alteração dos dados do currículo (cv.json e publications.json): último commit (ou hoje, se houver
    alterações ainda não registradas no git). Sem git, usa a data de modificação dos arquivos."""
    data_dir = os.path.join(build.SRC, 'data')
    files = [os.path.join(data_dir, f) for f in ('cv.json', 'publications.json')]
    try:
        dirty = subprocess.run(['git', 'status', '--porcelain', '--', *files], cwd=build.ROOT,
                               capture_output=True, text=True, check=True).stdout.strip()
        if dirty:
            return date.today().isoformat()
        last = subprocess.run(['git', 'log', '-1', '--format=%cs', '--', *files], cwd=build.ROOT,
                              capture_output=True, text=True, check=True).stdout.strip()
        if last:
            return last
    except (OSError, subprocess.CalledProcessError):
        pass
    newest = max(os.path.getmtime(f) for f in files)
    return date.fromtimestamp(newest).isoformat()


# --------------------------------------------------------------------------------------
# Fontes e estilos
# --------------------------------------------------------------------------------------
def register_fonts():
    for name in ['Regular', 'Bold', 'Black', 'Italic', 'BoldItalic']:
        pdfmetrics.registerFont(TTFont(f'Roboto-{name}', os.path.join(FONT_DIR, f'Roboto-{name}.ttf')))
    pdfmetrics.registerFontFamily('Roboto', normal='Roboto-Regular', bold='Roboto-Bold',
                                  italic='Roboto-Italic', boldItalic='Roboto-BoldItalic')


def styles():
    base = dict(fontName='Roboto-Regular', textColor=TEXT, fontSize=9.2, leading=12.6, alignment=TA_LEFT)
    st = {
        'body': ParagraphStyle('body', **base),
        'small': ParagraphStyle('small', **{**base, 'fontSize': 8.2, 'leading': 11, 'textColor': MUTED}),
        'year': ParagraphStyle('year', **{**base, 'fontName': 'Roboto-Bold', 'textColor': SLATE, 'fontSize': 8.6}),
        'name': ParagraphStyle('name', **{**base, 'fontName': 'Roboto-Black', 'fontSize': 24, 'leading': 28, 'textColor': NAVY}),
        'role': ParagraphStyle('role', **{**base, 'fontName': 'Roboto-Bold', 'fontSize': 11.5, 'leading': 15, 'textColor': TEAL}),
        'contact': ParagraphStyle('contact', **{**base, 'fontSize': 8.6, 'leading': 12.5, 'textColor': MUTED}),
        'h2': ParagraphStyle('h2', **{**base, 'fontName': 'Roboto-Bold', 'fontSize': 10.5, 'leading': 13, 'textColor': NAVY,
                                      'spaceBefore': 0, 'spaceAfter': 0}),
        'h3': ParagraphStyle('h3', **{**base, 'fontName': 'Roboto-Bold', 'fontSize': 9.2, 'textColor': SLATE}),
    }
    return st


def x(text):
    """Escapa texto para o ReportLab, preservando o itálico (<i>) usado em nomes científicos."""
    s = str(text).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    return re.sub(r'&lt;(/?)i&gt;', r'<\1i>', s)


def link(href, text=None):
    return f'<link href="{x(href)}" color="#1c7d9a">{x(text or href)}</link>'


# --------------------------------------------------------------------------------------
# Blocos de layout
# --------------------------------------------------------------------------------------
class Doc:
    def __init__(self, lang):
        self.lang = lang
        self.st = styles()
        self.flow = []

    def section(self, title, count=None):
        label = x(title.upper()) + (f'  <font color="#5f6675" size="8.4">({count})</font>' if count else '')
        head = Table([[Paragraph(label, self.st['h2'])]], colWidths=[None])
        head.setStyle(TableStyle([
            ('LINEBELOW', (0, 0), (-1, -1), 0.8, RULE),
            ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        self.flow += [CondPageBreak(28 * mm), Spacer(1, 7 * mm), head, Spacer(1, 3 * mm)]

    def sub(self, title):
        self.flow += [CondPageBreak(18 * mm), Spacer(1, 2 * mm), Paragraph(x(title), self.st['h3']), Spacer(1, 1.5 * mm)]

    def rows(self, items):
        """items: lista de (rótulo à esquerda, html à direita)."""
        for left, right in items:
            tb = Table([[Paragraph(x(left), self.st['year']), Paragraph(right, self.st['body'])]],
                       colWidths=[29 * mm, None])
            tb.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 4.2),
                ('RIGHTPADDING', (0, 0), (0, -1), 8),
            ]))
            self.flow.append(tb)

    def para(self, html, style='body', space=2):
        self.flow += [Paragraph(html, self.st[style]), Spacer(1, space * mm)]


# --------------------------------------------------------------------------------------
# Conteúdo
# --------------------------------------------------------------------------------------
def build_story(lang):
    d = Doc(lang)
    st = d.st
    p = CV['person']

    # Cabeçalho (sem foto)
    d.para(x(p['name']), 'name', 1)
    d.para(f'{x(tr(p["job"], lang))} · {x(p["affiliation"])}', 'role', 2.5)
    prof = {q['id']: q for q in CV['profiles']}
    contact = [link('mailto:' + p['email'], p['email']), link('https://' + SITE, SITE)]
    if 'orcid' in prof:
        contact.append('ORCID ' + link(prof['orcid']['url'], prof['orcid']['handle']))
    if 'lattes' in prof:
        contact.append('Lattes ' + link(prof['lattes']['url'], prof['lattes']['url'].split('//')[-1]))
    d.para('  ·  '.join(contact), 'contact', 0.8)
    d.para(x(', '.join(p['address'])), 'contact', 1)

    # Perfil
    d.section(t('profile', lang))
    d.rows([
        (t('areas', lang), '<br/>'.join(x(tr(a, lang)) for a in CV['areas'])),
        (t('lines', lang), '<br/>'.join(x(tr(a, lang)) for a in CV['research_lines'])),
        (t('keywords', lang), x(' · '.join(CV['keywords']))),
        (t('techniques', lang), x(' · '.join(CV['techniques']))),
    ])

    # Formação
    d.section(t('education', lang))
    rows = []
    for e in CV['education']:
        h = f'<b>{x(tr(e["degree"], lang))}</b> — {x(e["institution"])}, {x(e["place"])}'
        if e.get('thesis'):
            h += f'<br/><font color="#5f6675">{x(T("bio.thesis", lang))}:</font> {x(e["thesis"])}'
        if e.get('advisor'):
            co = f'; {x(T("bio.coadvisor", lang))}: {x(e["coadvisor"])}' if e.get('coadvisor') else ''
            h += f'<br/><font color="#5f6675">{x(T("bio.advisor", lang))}:</font> {x(e["advisor"])}{co}'
        if e.get('funding'):
            h += f'<br/><font color="#5f6675">{x(T("bio.funding", lang))}:</font> {x(e["funding"])}'
        rows.append((e['years'], h))
    d.rows(rows)

    # Experiência
    d.section(t('positions', lang))
    rows = []
    for e in CV['positions']:
        h = f'<b>{x(tr(e["role"], lang))}</b> — {x(e["institution"])}, {x(e["place"])}'
        if e.get('detail'):
            h += f'<br/><font color="#5f6675">{x(tr(e["detail"], lang))}</font>'
        rows.append((tr(e['years'], lang), h))
    d.rows(rows)

    # Prêmios
    d.section(t('awards', lang), len(CV['awards']))
    rows = []
    for a in CV['awards']:
        h = f'<b>{x(T("awards." + a["type"], lang))}</b>'
        if a.get('name'):
            h += f' — {x(a["name"])}'
        h += f'<br/><font color="#5f6675">{x(a["where"])}</font>'
        rows.append((str(a['year']), h))
    d.rows(rows)

    # Métricas
    m = CV['metrics']
    d.section(t('metrics', lang))
    data = [[t('database', lang), T('metrics.docs', lang), T('metrics.citations', lang), T('metrics.h', lang)]]
    data += [[s['label'], str(s['docs']), str(s['citations']), str(s['h'])] for s in m['sources']]
    tb = Table([[Paragraph(x(c), st['body']) for c in r] for r in data], colWidths=[60 * mm, 30 * mm, 30 * mm, 30 * mm], hAlign='LEFT')
    tb.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, 0), 'Roboto-Bold'),
        ('LINEBELOW', (0, 0), (-1, 0), 0.6, RULE), ('LINEBELOW', (0, -1), (-1, -1), 0.6, RULE),
        ('LEFTPADDING', (0, 0), (-1, -1), 0), ('TOPPADDING', (0, 0), (-1, -1), 2), ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ]))
    d.flow.append(tb)
    d.para(f'{x(T("metrics.updated", lang))} {build.fmt_date(m["date"], lang)}. {x(T("metrics.disclaimer", lang))}', 'small', 0)

    # Publicações
    arts = sorted(PUB['articles'], key=lambda a: -a['year'])  # estável: mantém a ordem do JSON dentro do ano
    d.section(t('articles', lang), len(arts))
    rows = []
    for a in arts:
        h = f'{x(a["title"])}. <i>{x(a["journal"])}</i>.'
        if a.get('doi'):
            h += ' DOI: ' + link('https://doi.org/' + a['doi'], a['doi'])
        elif a.get('url'):
            h += ' ' + link(a['url'])
        if a.get('status') == 'accepted':
            h += f' <font color="#1c7d9a"><b>[{x(T("pub.accepted", lang))}]</b></font>'
        rows.append((str(a['year']), h))
    d.rows(rows)

    if PUB.get('magazine'):
        d.section(t('magazine', lang), len(PUB['magazine']))
        d.rows([(str(a['year']), f'{x(a["title"])}. <i>{x(a["journal"])}</i>.' + (' ' + link(a['url']) if a.get('url') else ''))
                for a in PUB['magazine']])

    if CV.get('chapters'):
        d.section(t('chapters', lang), len(CV['chapters']))
        rows = []
        for c in CV['chapters']:
            h = f'{x(c["title"])}. {x(T("prod.in", lang))}: <i>{x(c["book"])}</i>. {x(c["place"])}: {x(c["publisher"])}'
            h += f', p. {x(c["pages"])}' if c.get('pages') else ''
            h += f'. ISBN {x(c["isbn"])}' if c.get('isbn') else ''
            rows.append((str(c['year']), h + '.'))
        d.rows(rows)

    for key in ['events_full', 'events_expanded', 'events_abstract']:
        items = PUB.get(key) or []
        if not items:
            continue
        d.section(T('prod.' + key, lang), len(items))
        d.rows([(str(e['year']), f'{x(e["title"])}. <i>{x(e["event"])}</i>' + (f', {x(e["city"])}' if e.get('city') else '') + '.')
                for e in items])

    # Projetos
    d.section(t('projects', lang), len(CV['projects']))
    rows = []
    for pr in CV['projects']:
        meta = [T('exp.kind_' + pr['kind'], lang), T('exp.status_' + pr['status'], lang)]
        if pr.get('role') == 'lead':
            meta.append(T('exp.role_lead', lang))
        if pr.get('funding'):
            meta.append(pr['funding'])
        rows.append((tr(pr['years'], lang), f'<b>{x(pr["title"])}</b><br/><font color="#5f6675">{x(" · ".join(meta))}</font>'))
    d.rows(rows)

    # Revisor
    d.section(t('reviewer', lang), len(CV['reviewer']))
    d.para(x(' · '.join(r['journal'] for r in CV['reviewer'])))

    # Orientações e bancas
    if CV.get('supervisions'):
        d.section(t('supervisions', lang), len(CV['supervisions']))
        d.rows([(str(s['year']), f'<b>{x(s["student"])}</b> — {x(s["title"])}<br/><font color="#5f6675">{x(s["course"])}'
                 + (f' · {x(s["funding"])}' if s.get('funding') else '') + '</font>') for s in CV['supervisions']])
    if CV.get('committees'):
        d.section(t('committees', lang), len(CV['committees']))
        d.rows([(str(s['year']), f'<b>{x(s["candidate"])}</b> — {x(s["title"])}<br/><font color="#5f6675">{x(s["institution"])}</font>')
                for s in CV['committees']])

    # Palestras, cursos, produção técnica, eventos organizados
    if CV.get('talks'):
        d.section(t('talks', lang), len(CV['talks']))
        d.rows([(str(s['year']), f'{x(s["title"])}. <i>{x(s["event"])}</i>' + (f', {x(s["place"])}' if s.get('place') else '') + '.')
                for s in CV['talks']])
    if CV.get('courses_taught'):
        d.section(t('courses', lang), len(CV['courses_taught']))
        d.rows([(str(s['year']), f'{x(s["title"])}' + (f' ({x(s["hours"])})' if s.get('hours') else '')
                 + (f' — {x(T("prod.with", lang))} {x(s["with"])}' if s.get('with') else '') + '.') for s in CV['courses_taught']])
    if CV.get('technical'):
        d.section(t('technical', lang), len(CV['technical']))
        d.rows([(str(s['year']), f'{x(T("prod.kind_" + s["kind"], lang))}: {x(s["title"])}' + (f'. {link(s["url"])}' if s.get('url') else ''))
                for s in CV['technical']])
    if CV.get('events_organized'):
        d.section(t('organized', lang), len(CV['events_organized']))
        d.rows([(str(s['year']), x(s['title'])) for s in CV['events_organized']])

    # Formação complementar, participação em eventos, sociedades
    if CV.get('complementary'):
        d.section(t('complementary', lang), len(CV['complementary']))
        d.rows([(str(s['year']), f'{x(s["title"])} — {x(s["org"])}' + (f' ({s["hours"]} h)' if s.get('hours') else '')) for s in CV['complementary']])
    if CV.get('events_attended'):
        d.section(T('prod.events_attended', lang), len(CV['events_attended']))
        d.rows([(str(s['year']), x(s['title'])) for s in CV['events_attended']])
    if CV.get('memberships'):
        d.section(t('memberships', lang), len(CV['memberships']))
        d.rows([(f'{T("exp.since", lang)} {s["since"]}', f'{x(s["name"])} — {x(tr(s["role"], lang))}') for s in CV['memberships']])

    d.flow += [Spacer(1, 6 * mm), Paragraph(x(t('note', lang)), st['small'])]
    return d.flow


# --------------------------------------------------------------------------------------
# Página e rodapé
# --------------------------------------------------------------------------------------
def make_canvas(lang, generated, updated):
    class NumberedCanvas(rl_canvas.Canvas):
        """Desenha o rodapé depois de conhecer o total de páginas ("Página X de Y")."""
        def __init__(self, *a, **k):
            super().__init__(*a, **k)
            self._saved = []

        def showPage(self):
            self._saved.append(dict(self.__dict__))
            self._startPage()

        def save(self):
            total = len(self._saved)
            for state in self._saved:
                self.__dict__.update(state)
                self.footer(total)
                super().showPage()
            super().save()

        def footer(self, total):
            w, _ = A4
            self.setStrokeColor(RULE)
            self.setLineWidth(0.6)
            self.line(18 * mm, 14 * mm, w - 18 * mm, 14 * mm)
            self.setFont('Roboto-Regular', 7.6)
            self.setFillColor(MUTED)
            left = (t('generated', lang).format(d=build.fmt_date(generated, lang)) + ' · '
                    + t('content', lang).format(d=build.fmt_date(updated, lang)))
            self.drawString(18 * mm, 9.5 * mm, left)
            self.drawRightString(w - 18 * mm, 9.5 * mm,
                                 f'{SITE}  ·  ' + t('page', lang).format(n=self._pageNumber, t=total))
    return NumberedCanvas


def generate(lang, generated, updated):
    os.makedirs(OUT_DIR, exist_ok=True)
    path = os.path.join(OUT_DIR, f'floriatan-costa-cv-{lang}.pdf')
    name = CV['person']['name']
    doc = SimpleDocTemplate(path, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=16 * mm,
                            bottomMargin=20 * mm, title=f'{name} — {t("title", lang)}', author=name,
                            subject=t('title', lang), creator=SITE, lang=build.HTML_LANG[lang])
    doc.build(build_story(lang), canvasmaker=make_canvas(lang, generated, updated))
    return path


def main():
    from reportlab import rl_config
    rl_config.invariant = 1  # PDF idêntico para os mesmos dados e a mesma data (evita alterações à toa no git)
    register_fonts()
    generated = build.BUILD_DATE.isoformat()
    updated = content_date()
    for lang in build.LANGS:
        path = generate(lang, generated, updated)
        print(f'PDF: {os.path.relpath(path, build.ROOT)} ({os.path.getsize(path) // 1024} KB)')


if __name__ == '__main__':
    main()
