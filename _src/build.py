#!/usr/bin/env python3
"""
Gerador estático do site floriatan.com.br (somente biblioteca padrão do Python 3.8+).

Uso:
    python3 _src/build.py            # gera todas as páginas
    python3 _src/build.py --check    # gera e verifica links internos

Fontes:
    _src/data/site.json          textos da interface (menus, rótulos, metadados) em pt/en/es
    _src/data/cv.json            dados do currículo (prêmios, formação, experiência...)
    _src/data/publications.json  artigos e trabalhos em eventos (títulos no idioma original)
    _src/pages/<lang>/<page>.html  conteúdo de cada página; blocos de dados entram com {{bloco}}

Saída (HTML estático, servido pelo GitHub Pages):
    /<page>.html (pt), /en/<page>.html, /es/<page>.html, /404.html, /sitemap.xml
"""
import html, json, os, re, sys
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, '_src')
SITE_URL = 'https://floriatan.com.br'
LANGS = ['pt', 'en', 'es']
HTML_LANG = {'pt': 'pt-BR', 'en': 'en', 'es': 'es'}
OG_LOCALE = {'pt': 'pt_BR', 'en': 'en_US', 'es': 'es_ES'}
PREFIX = {'pt': '', 'en': '/en', 'es': '/es'}
GA_ID = 'G-0NDPRCLMYV'
BUILD_DATE = date.today()


def load(name):
    with open(os.path.join(SRC, 'data', name), encoding='utf-8') as f:
        return json.load(f)


S = load('site.json')
CV = load('cv.json')
PUB = load('publications.json')
esc = lambda s: html.escape(str(s), quote=True)


def T(key, lang):
    """Texto da interface. Chaves aninhadas com ponto: 'nav.home'."""
    node = S['ui']
    for k in key.split('.'):
        node = node[k]
    return node[lang] if isinstance(node, dict) and lang in node else node


def tr(v, lang):
    """Campo traduzível {pt,en,es} ou texto simples."""
    return v.get(lang, v.get('pt')) if isinstance(v, dict) else v


def url(page, lang):
    p = PREFIX[lang] + '/'
    return p if page == 'index' else p + page


def fmt_date(iso, lang):
    y, m, d = iso.split('-')
    if lang == 'en':
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
                  'September', 'October', 'November', 'December']
        return f'{months[int(m) - 1]} {int(d)}, {y}'
    return f'{d}/{m}/{y}'


def ext_link(href, text, cls=''):
    c = f' class="{cls}"' if cls else ''
    return f'<a href="{esc(href)}"{c} target="_blank" rel="noopener noreferrer">{text}<span class="visually-hidden"> {{NEWTAB}}</span></a>'


def icon(name, cls='icon'):
    return f'<svg class="{cls}" aria-hidden="true" focusable="false"><use href="/assets/icons/sprite.svg#{name}"></use></svg>'


# --------------------------------------------------------------------------------------
# Blocos de dados
# --------------------------------------------------------------------------------------

def authors_html(authors):
    out = []
    for a in authors:
        n = esc(a['name'])
        out.append(f'<strong class="me">{n}</strong>' if a['me'] else n)
    return '; '.join(out)


def doi_or_link(item, lang):
    if item.get('doi'):
        d = item['doi']
        return ext_link(f'https://doi.org/{d}', f'{icon("doi")}<span>DOI: {esc(d)}</span>', 'pub-link')
    if item.get('url'):
        return ext_link(item['url'], f'{icon("external")}<span>{T("pub.access", lang)}</span>', 'pub-link')
    return ''


def b_articles(lang, limit=None):
    arts = PUB['articles']
    if limit:
        return '<ol class="pub-list pub-list--compact">' + ''.join(article_item(a, lang, compact=True) for a in arts[:limit]) + '</ol>'
    years = []
    for a in arts:
        if a['year'] not in years:
            years.append(a['year'])
    parts = [f'''<div class="pub-tools" role="search">
  <label for="pub-filter" class="visually-hidden">{T("pub.filter_label", lang)}</label>
  <input type="search" id="pub-filter" class="pub-filter" placeholder="{T("pub.filter_placeholder", lang)}" autocomplete="off" data-pub-filter>
  <p class="pub-count" aria-live="polite" data-pub-count data-tpl="{esc(T("pub.count_tpl", lang))}">{T("pub.count_tpl", lang).replace("{n}", str(len(arts))).replace("{t}", str(len(arts)))}</p>
</div>''']
    n = len(arts)
    for y in years:
        items = [a for a in arts if a['year'] == y]
        parts.append(f'<section class="pub-year" data-pub-year aria-labelledby="y{y}"><h3 class="pub-year__title" id="y{y}">{y}</h3>')
        parts.append(f'<ol class="pub-list" reversed start="{n}">')
        for a in items:
            parts.append(article_item(a, lang))
        n -= len(items)
        parts.append('</ol></section>')
    parts.append(f'<p class="pub-empty" hidden data-pub-empty>{T("pub.empty", lang)}</p>')
    return '\n'.join(parts)


def article_item(a, lang, compact=False):
    vol = ''
    if a.get('volume'):
        vol = f', v. {esc(a["volume"])}'
        if a.get('pages'):
            vol += f', {esc(a["pages"])}'
    badge = f' <span class="badge badge--accent">{T("pub.accepted", lang)}</span>' if a.get('status') == 'accepted' else ''
    authors = '' if compact else f'<p class="pub-authors">{authors_html(a["authors"])}</p>'
    return f'''<li class="pub-item" data-pub-item>
  <p class="pub-title" lang="{a.get('lang', 'en')}">{a["title"]}</p>
  {authors}
  <p class="pub-meta"><cite>{esc(a["journal"])}</cite>{vol}, {a["year"]}{badge}</p>
  {doi_or_link(a, lang)}
</li>'''


def b_magazine(lang):
    out = ['<ol class="pub-list">']
    for a in PUB['magazine']:
        out.append(f'''<li class="pub-item"><p class="pub-title" lang="en">{a["title"]}</p>
<p class="pub-authors">{authors_html(a["authors"])}</p>
<p class="pub-meta"><cite>{esc(a["journal"])}</cite>, {a["year"]}</p>{doi_or_link(a, lang)}</li>''')
    out.append('</ol>')
    return '\n'.join(out)


def guess_lang(title):
    pt_markers = r'\b(de|da|do|em|para|por|na|no|uma|um|dos|das|com|e)\b|ção|ções|ã'
    return 'pt' if re.search(pt_markers, title) else 'en'


def event_list(items, lang):
    out = ['<ol class="pub-list">']
    for a in items:
        place = f', {esc(a["city"])}' if a.get('city') else ''
        out.append(f'''<li class="pub-item"><p class="pub-title" lang="{guess_lang(a["title"])}">{a["title"]}</p>
<p class="pub-authors">{authors_html(a["authors"])}</p>
<p class="pub-meta">{esc(a["event"])}{place}, {a["year"]}</p>{doi_or_link(a, lang)}</li>''')
    out.append('</ol>')
    return '\n'.join(out)


def accordion(title, count, body, open_=False):
    o = ' open' if open_ else ''
    return f'''<details class="accordion"{o}>
<summary><span>{title}</span><span class="badge">{count}</span></summary>
<div class="accordion-content">{body}</div>
</details>'''


def b_events_papers(lang):
    return '\n'.join([
        accordion(T('prod.events_full', lang), len(PUB['events_full']), event_list(PUB['events_full'], lang)),
        accordion(T('prod.events_expanded', lang), len(PUB['events_expanded']), event_list(PUB['events_expanded'], lang)),
        accordion(T('prod.events_abstract', lang), len(PUB['events_abstract']), event_list(PUB['events_abstract'], lang)),
    ])


def b_chapters(lang):
    out = ['<ol class="pub-list">']
    for c in CV['chapters']:
        ident = ''
        if c.get('doi'):
            ident = doi_or_link({'doi': c['doi']}, lang)
        elif c.get('url'):
            ident = doi_or_link({'url': c['url']}, lang)
        isbn = f' ISBN {esc(c["isbn"])}.' if c.get('isbn') else ''
        out.append(f'''<li class="pub-item"><p class="pub-title" lang="{guess_lang(c["title"])}">{c["title"]}</p>
<p class="pub-authors">{c["authors"]}</p>
<p class="pub-meta">{T("prod.in", lang)}: <cite>{esc(c["book"])}</cite>. {esc(c["place"])}: {esc(c["publisher"])}, {c["year"]}, p. {esc(c["pages"])}.{isbn}</p>{ident}</li>''')
    out.append('</ol>')
    return '\n'.join(out)


def simple_list(rows):
    return '<ul class="item-list">' + ''.join(f'<li>{r}</li>' for r in rows) + '</ul>'


def b_talks(lang):
    rows = []
    for t in CV['talks']:
        place = f', {esc(t["place"])}' if t.get('place') else ''
        rows.append(f'<span class="item-year">{t["year"]}</span><span><span lang="pt">{esc(t["title"])}</span><span class="item-sub">{esc(t["event"])}{place}</span></span>')
    return simple_list(rows)


def b_courses_taught(lang):
    rows = []
    for c in CV['courses_taught']:
        w = f' · {T("prod.with", lang)} {esc(c["with"])}' if c.get('with') else ''
        rows.append(f'<span class="item-year">{c["year"]}</span><span><span lang="pt">{esc(c["title"])}</span><span class="item-sub">{esc(tr(c["hours"], lang))}{w}</span></span>')
    return simple_list(rows)


def b_technical(lang):
    rows = []
    for t in CV['technical']:
        title = esc(t['title'])
        if t.get('url'):
            title = ext_link(t['url'], title, 'inline-link')
        rows.append(f'<span class="item-year">{t["year"]}</span><span><span lang="pt">{title}</span><span class="item-sub">{T("prod.kind_" + t["kind"], lang)} · {t["authors"]}</span></span>')
    return simple_list(rows)


def b_events_organized(lang):
    return simple_list([f'<span class="item-year">{e["year"]}</span><span lang="pt">{esc(e["title"])}</span>' for e in CV['events_organized']])


def b_events_attended(lang):
    rows = []
    for e in CV['events_attended']:
        p = f'<span class="item-sub">{T("prod.poster", lang)}: <span lang="{guess_lang(e["poster"])}">{esc(e["poster"])}</span></span>' if e.get('poster') else ''
        rows.append(f'<span class="item-year">{e["year"]}</span><span><span lang="pt">{esc(e["title"])}</span>{p}</span>')
    return accordion(T('prod.events_attended', lang), len(rows), simple_list(rows))


def b_supervisions(lang):
    rows = []
    for s in CV['supervisions']:
        rows.append(f'<span class="item-year">{s["year"]}</span><span><span class="item-main"><strong>{esc(s["student"])}</strong> — <span lang="pt">{s["title"]}</span></span><span class="item-sub">{T("exp.ic", lang)} · {esc(s["course"])} · {esc(s["funding"])}</span></span>')
    return simple_list(rows)


def b_committees(lang):
    rows = []
    for s in CV['committees']:
        rows.append(f'<span class="item-year">{s["year"]}</span><span><span class="item-main"><strong>{esc(s["candidate"])}</strong> — <span lang="pt">{s["title"]}</span></span><span class="item-sub">{T("exp.undergrad_thesis", lang)} · {esc(s["institution"])}</span></span>')
    return simple_list(rows)


def b_awards(lang):
    out = ['<ol class="award-list">']
    for a in CV['awards']:
        kind = T('awards.' + a['type'], lang)
        name = f'<span class="award-name" lang="{"en" if a["type"] == "paper" else "pt"}">{esc(a["name"])}</span>' if a.get('name') else ''
        out.append(f'''<li class="award">
  <span class="award-year">{a["year"]}</span>
  <div class="award-body">
    <p class="award-kind">{icon("award")}{kind}</p>
    {name}
    <p class="award-where" lang="{"en" if a["type"] == "paper" else "pt"}">{esc(a["where"])}</p>
  </div>
</li>''')
    out.append('</ol>')
    return '\n'.join(out)


def logo_img(name, alt=''):
    if not name:
        return f'<span class="tl-logo tl-logo--empty" aria-hidden="true">{icon("building")}</span>'
    return f'<img class="tl-logo" src="/assets/svg/{name}" alt="{esc(alt)}" width="96" height="60" loading="lazy">'


def b_education(lang):
    out = ['<ol class="tl">']
    for e in CV['education']:
        extra = []
        if e.get('thesis'):
            extra.append(f'<p class="tl-detail"><span class="tl-label">{T("bio.thesis", lang)}:</span> <span lang="pt">{e["thesis"]}</span></p>')
        if e.get('advisor'):
            co = f'; {T("bio.coadvisor", lang)}: {esc(e["coadvisor"])}' if e.get('coadvisor') else ''
            extra.append(f'<p class="tl-detail"><span class="tl-label">{T("bio.advisor", lang)}:</span> {esc(e["advisor"])}{co}</p>')
        if e.get('funding'):
            extra.append(f'<p class="tl-detail"><span class="tl-label">{T("bio.funding", lang)}:</span> {esc(e["funding"])}</p>')
        out.append(f'''<li class="tl-item">
  <div class="tl-head">{logo_img(e.get("logo"))}<div>
    <p class="tl-date">{esc(e["years"])}</p>
    <h3 class="tl-title">{esc(tr(e["degree"], lang))}</h3>
    <p class="tl-org">{esc(e["institution"])} · {esc(e["place"])}</p>
  </div></div>
  {"".join(extra)}
</li>''')
    out.append('</ol>')
    return '\n'.join(out)


def b_positions(lang):
    out = ['<ol class="tl">']
    for p in CV['positions']:
        cur = f' <span class="badge badge--accent">{T("exp.current", lang)}</span>' if p.get('current') else ''
        det = f'<p class="tl-detail">{esc(tr(p["detail"], lang))}</p>' if p.get('detail') else ''
        out.append(f'''<li class="tl-item{" tl-item--current" if p.get("current") else ""}">
  <div class="tl-head">{logo_img(p.get("logo"))}<div>
    <p class="tl-date">{esc(tr(p["years"], lang))}{cur}</p>
    <h3 class="tl-title">{esc(tr(p["role"], lang))}</h3>
    <p class="tl-org">{esc(p["institution"])} · {esc(p["place"])}</p>
  </div></div>
  {det}
</li>''')
    out.append('</ol>')
    return '\n'.join(out)


def b_complementary(lang):
    return simple_list([f'<span class="item-year">{c["year"]}</span><span><span lang="pt">{esc(c["title"])}</span><span class="item-sub">{esc(c["org"])} · {c["hours"]} h</span></span>' for c in CV['complementary']])


def b_research_lines(lang):
    return '<ul class="chip-list">' + ''.join(f'<li class="chip">{esc(tr(r, lang))}</li>' for r in CV['research_lines']) + '</ul>'


def b_areas(lang):
    return '<ul class="check-list">' + ''.join(f'<li>{esc(tr(r, lang))}</li>' for r in CV['areas']) + '</ul>'


def b_keywords(lang):
    return '<ul class="chip-list chip-list--soft">' + ''.join(f'<li class="chip" lang="en">{esc(k)}</li>' for k in CV['keywords']) + '</ul>'


def b_techniques(lang):
    return '<ul class="chip-list">' + ''.join(f'<li class="chip chip--mono">{esc(k)}</li>' for k in CV['techniques']) + '</ul>'


def b_projects(lang):
    out = ['<div class="card-grid card-grid--2">']
    for p in CV['projects']:
        status = T('exp.status_' + p['status'], lang)
        role = f'<span class="badge badge--accent">{T("exp.role_lead", lang)}</span>' if p['role'] == 'lead' else ''
        fund = f' · {T("bio.funding", lang)}: {esc(p["funding"])}' if p.get('funding') else ''
        out.append(f'''<article class="card project">
  <p class="project-meta"><span class="badge">{T("exp.kind_" + p["kind"], lang)}</span><span class="badge badge--{"ok" if p["status"] == "ongoing" else "muted"}">{status}</span>{role}</p>
  <h3 class="project-title" lang="pt">{esc(p["title"])}</h3>
  <p class="project-summary">{esc(tr(p["summary"], lang))}</p>
  <p class="project-foot">{esc(tr(p["years"], lang))}{fund}</p>
</article>''')
    out.append('</div>')
    return '\n'.join(out)


def b_reviewer(lang):
    out = ['<ul class="journal-grid">']
    for r in CV['reviewer']:
        name = ext_link(r['url'], esc(r['journal'])) if r.get('url') else esc(r['journal'])
        out.append(f'<li><span class="journal-name">{name}</span><span class="journal-since">{T("exp.since", lang)} {r["since"]}</span></li>')
    out.append('</ul>')
    return '\n'.join(out)


def b_memberships(lang):
    rows = [f'<span class="item-year">{m["since"]}</span><span><strong>{esc(m["name"])}</strong><span class="item-sub">{esc(tr(m["role"], lang))} · {T("exp.since", lang)} {m["since"]}</span></span>' for m in CV['memberships']]
    return simple_list(rows)


def b_metrics(lang):
    m = CV['metrics']
    out = ['<div class="metric-sources">']
    for s in m['sources']:
        note = ''
        if s.get('h_date'):
            note = f'<p class="metric-note">{T("metrics.h_date", lang).replace("{d}", fmt_date(s["h_date"], lang))}</p>'
        out.append(f'''<section class="metric-source" aria-labelledby="m-{s["id"]}">
  <h3 id="m-{s["id"]}" class="metric-source__title">{ext_link(s["url"], esc(s["label"]))} <span class="metric-owner">{esc(s["owner"])}</span></h3>
  <dl class="metrics-grid">
    <div class="metric-card"><dt class="metric-label">{T("metrics.docs", lang)}</dt><dd class="metric-number">{s["docs"]}</dd></div>
    <div class="metric-card"><dt class="metric-label">{T("metrics.citations", lang)}</dt><dd class="metric-number">{s["citations"]}</dd></div>
    <div class="metric-card metric-card--h"><dt class="metric-label">{T("metrics.h", lang)}</dt><dd class="metric-number">{s["h"]}</dd></div>
  </dl>
  {note}
</section>''')
    out.append('</div>')
    out.append(f'<p class="metrics-sources">{T("metrics.updated", lang)} <time datetime="{m["date"]}">{fmt_date(m["date"], lang)}</time>. {T("metrics.disclaimer", lang)}</p>')
    return '\n'.join(out)


def b_metrics_mini(lang):
    s = {x['id']: x for x in CV['metrics']['sources']}['scopus']
    items = [(len(PUB['articles']), T('home.stat_articles', lang)), (s['citations'], T('home.stat_citations', lang) + ' (Scopus)'),
             (s['h'], T('metrics.h', lang) + ' (Scopus)'), (len(CV['awards']), T('home.stat_awards', lang))]
    return '<dl class="stat-strip">' + ''.join(f'<div><dt>{esc(l)}</dt><dd>{n}</dd></div>' for n, l in items) + '</dl>'


def b_totals(lang):
    out = []
    for g in ['bib', 'tec', 'other']:
        rows = [t for t in CV['totals'] if t['group'] == g]
        out.append(f'<section class="totals-group"><h3>{T("metrics.group_" + g, lang)}</h3><dl class="totals">')
        out += [f'<div><dt>{esc(tr(t["label"], lang))}</dt><dd>{t["n"]}</dd></div>' for t in rows]
        out.append('</dl></section>')
    return '<div class="totals-wrap">' + '\n'.join(out) + '</div>'


def b_profiles(lang):
    out = ['<ul class="profile-links">']
    out.append(f'<li><a class="profile-link" href="{url("metricas", lang)}"><img src="/assets/icons/data.svg" alt="" width="32" height="32"><span>{T("nav.metrics", lang)}</span></a></li>')
    for p in CV['profiles']:
        out.append(f'<li>{ext_link(p["url"], f"""<img src="/assets/icons/{p["icon"]}" alt="" width="32" height="32"><span>{esc(p["label"])}</span>""", "profile-link")}</li>')
    out.append('</ul>')
    return '\n'.join(out)


def b_profiles_table(lang):
    out = ['<ul class="contact-list">']
    for p in CV['profiles']:
        out.append(f'<li><img src="/assets/icons/{p["icon"]}" alt="" width="24" height="24"><span><span class="contact-label">{esc(p["label"])}</span>{ext_link(p["url"], esc(p["handle"]), "inline-link")}</span></li>')
    out.append('</ul>')
    return '\n'.join(out)


def b_contact(lang):
    p = CV['person']
    addr = '<br>'.join(esc(x) for x in p['address'])
    return f'''<div class="card-grid card-grid--2">
  <section class="card contact-card" aria-labelledby="c-email">
    <h2 id="c-email" class="card-title">{icon("mail")}{T("contact.email", lang)}</h2>
    <p><a class="contact-email" href="mailto:{p["email"]}">{p["email"]}</a></p>
    <p class="text-muted">{T("contact.email_alt", lang)}: <a class="inline-link" href="mailto:{p["email_alt"]}">{p["email_alt"]}</a></p>
    <p><a class="btn" href="mailto:{p["email"]}">{icon("mail")}{T("contact.write", lang)}</a></p>
  </section>
  <section class="card contact-card" aria-labelledby="c-addr">
    <h2 id="c-addr" class="card-title">{icon("pin")}{T("contact.address", lang)}</h2>
    <address>{addr}</address>
  </section>
</div>'''


def b_latest(lang):
    return b_articles(lang, limit=3)


def b_current(lang):
    cur = CV['positions'][0]
    return f'<p class="current-pos">{logo_img(cur.get("logo"), cur["institution"])}<span><strong>{esc(tr(cur["role"], lang))}</strong><span>{esc(cur["institution"])} · {esc(cur["place"])}</span></span></p>'


def b_updated(lang):
    iso = BUILD_DATE.isoformat()
    return f'<time datetime="{iso}">{fmt_date(iso, lang)}</time>'


def b_counts(lang):
    return str(len(PUB['articles']))


BLOCKS = {name[2:]: fn for name, fn in globals().items() if name.startswith('b_') and callable(fn)}

# --------------------------------------------------------------------------------------
# Layout
# --------------------------------------------------------------------------------------

NAV = ['index', 'biografia', 'experiencia', 'publicacoes', 'producao', 'premiacoes', 'contato']
FOOTER = ['metricas', 'sobre', 'design', 'contato']


def head(page, lang, meta, langs_available, noindex=False):
    title = meta['title']
    full_title = title if page == 'index' else f'{title} · {CV["person"]["name"]}'
    desc = meta['description']
    canonical = SITE_URL + url(page, lang)
    alts = ''
    if not noindex:
        for l in langs_available:
            alts += f'\n  <link rel="alternate" hreflang="{HTML_LANG[l]}" href="{SITE_URL + url(page, l)}">'
        alts += f'\n  <link rel="alternate" hreflang="x-default" href="{SITE_URL + url(page, "pt")}">'
    og_alt = ''.join(f'\n  <meta property="og:locale:alternate" content="{OG_LOCALE[l]}">' for l in langs_available if l != lang)
    robots = '\n  <meta name="robots" content="noindex">' if noindex else ''
    ld = ''
    if page == 'index':
        person = {
            '@context': 'https://schema.org', '@type': 'Person', 'name': CV['person']['name'],
            'url': SITE_URL + url('index', lang), 'image': SITE_URL + '/assets/img/profile.webp',
            'jobTitle': tr(CV['person']['job'], lang),
            'affiliation': {'@type': 'CollegeOrUniversity', 'name': CV['person']['affiliation']},
            'alumniOf': [{'@type': 'CollegeOrUniversity', 'name': n} for n in
                         ['Universidade Federal do Paraná', 'Universidade Estadual de Santa Cruz', 'Instituto Federal Baiano']],
            'knowsAbout': ['Analytical chemistry', 'Sample preparation', 'Deep eutectic solvents', 'Chemometrics', 'Atomic spectrometry'],
            'sameAs': [p['url'] for p in CV['profiles']],
        }
        ld = '\n  <script type="application/ld+json">' + json.dumps(person, ensure_ascii=False) + '</script>'
    return f'''<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://www.googletagmanager.com; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com; style-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self' mailto:">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <title>{esc(full_title)}</title>
  <meta name="description" content="{esc(desc)}">
  <meta name="author" content="{CV["person"]["name"]}">{robots}
  <link rel="canonical" href="{canonical}">{alts}
  <meta property="og:type" content="{"profile" if page == "index" else "website"}">
  <meta property="og:site_name" content="{CV["person"]["name"]}">
  <meta property="og:title" content="{esc(full_title)}">
  <meta property="og:description" content="{esc(desc)}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:image" content="{SITE_URL}/assets/cover.png">
  <meta property="og:image:width" content="940">
  <meta property="og:image:height" content="540">
  <meta property="og:image:alt" content="{esc(T("meta.og_image_alt", lang))}">
  <meta property="og:locale" content="{OG_LOCALE[lang]}">{og_alt}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#5a729e" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#1a1f26" media="(prefers-color-scheme: dark)">
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
  <link rel="preload" href="/assets/fonts/roboto-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <script src="/js/theme-init.js"></script>
  <link rel="stylesheet" href="/css/global.css?v={BUILD_DATE.strftime("%Y%m%d")}">
  <link rel="stylesheet" href="/css/main.css?v={BUILD_DATE.strftime("%Y%m%d")}">
  <script src="/js/analytics.js" defer></script>{ld}
</head>'''


def header(page, lang, langs_available):
    links = []
    for p in NAV:
        cur = ' aria-current="page"' if p == page else ''
        links.append(f'<li><a href="{url(p, lang)}"{cur}>{T("nav." + S["nav_keys"][p], lang)}</a></li>')
    lang_items = []
    for l in LANGS:
        target = page if l in langs_available else 'index'
        cur = ' aria-current="true"' if l == lang else ''
        lang_items.append(
            f'<li><a href="{url(target, l)}" hreflang="{HTML_LANG[l]}" lang="{HTML_LANG[l]}"{cur} data-lang="{l}">'
            f'<span class="lang-code">{l.upper()}</span>{S["lang_names"][l]}</a></li>')
    return f'''<a class="skip-link" href="#main">{T("a11y.skip", lang)}</a>
<header class="site-header">
  <div class="container header-content">
    <a class="brand" href="{url("index", lang)}" aria-label="{esc(CV["person"]["name"])} — {T("nav.home", lang)}">
      <img src="/assets/logo.svg" alt="" class="logo-img" width="44" height="44">
      <span class="site-title">{CV["person"]["short_name"]}</span>
    </a>
    <nav class="site-nav" id="site-nav" aria-label="{T("a11y.main_nav", lang)}">
      <ul class="nav-content">{"".join(links)}</ul>
    </nav>
    <div class="header-right">
      <details class="lang-menu">
        <summary aria-label="{T("a11y.language", lang)}: {S["lang_names"][lang]}">{icon("globe")}<span>{lang.upper()}</span></summary>
        <ul class="lang-menu__list">{"".join(lang_items)}</ul>
      </details>
      <button type="button" class="icon-btn theme-toggle" data-theme-toggle aria-label="{T("a11y.theme", lang)}" aria-pressed="false" title="{T("a11y.theme", lang)}">{icon("moon", "icon icon-moon")}{icon("sun", "icon icon-sun")}</button>
      <button type="button" class="icon-btn menu-toggle" data-menu-toggle aria-controls="site-nav" aria-expanded="false" aria-label="{T("a11y.menu", lang)}">{icon("menu", "icon icon-menu")}{icon("close", "icon icon-close")}</button>
    </div>
  </div>
</header>'''


def footer(page, lang):
    links = ''.join(f'<li><a href="{url(p, lang)}">{T("nav." + S["nav_keys"][p], lang)}</a></li>' for p in FOOTER)
    links += f'<li><a href="/web/">{T("nav.tools", lang)}</a></li>'
    links += f'<li><button type="button" class="link-btn" data-consent-open>{T("consent.manage", lang)}</button></li>'
    profiles = ''.join(
        f'<li>{ext_link(p["url"], f"""<img src="/assets/icons/{p["icon"]}" alt="{esc(p["label"])}" width="22" height="22">""", "footer-profile")}</li>'
        for p in CV['profiles'])
    return f'''<footer class="site-footer">
  <div class="container footer-content">
    <div class="footer-left">
      <p>© <span data-year>{BUILD_DATE.year}</span> {CV["person"]["name"]}. {T("footer.rights", lang)}</p>
      <p class="footer-updated">{T("footer.updated", lang)}: {b_updated(lang)}</p>
    </div>
    <ul class="footer-profiles">{profiles}</ul>
    <nav aria-label="{T("a11y.footer_nav", lang)}"><ul class="footer-right">{links}</ul></nav>
  </div>
</footer>
<div class="consent" id="consent" role="region" aria-labelledby="consent-title" data-ga-id="{GA_ID}" hidden>
  <div class="container consent__inner">
    <div class="consent__text">
      <p id="consent-title" class="consent__title">{T("consent.title", lang)}</p>
      <p>{T("consent.text", lang)} <a class="inline-link" href="{url("sobre", lang)}#privacidade">{T("consent.more", lang)}</a></p>
    </div>
    <div class="consent__actions">
      <button type="button" class="btn btn-outline" data-consent="denied">{T("consent.reject", lang)}</button>
      <button type="button" class="btn" data-consent="granted">{T("consent.accept", lang)}</button>
    </div>
  </div>
</div>'''


def render_page(page, lang, meta, body, langs_available, extra_scripts=(), body_class='', noindex=False):
    scripts = ''.join(f'\n<script src="{s}" defer></script>' for s in ['/js/app.js', *extra_scripts])
    bc = f' class="{body_class}"' if body_class else ''
    out = f'''<!DOCTYPE html>
<html lang="{HTML_LANG[lang]}">
{head(page, lang, meta, langs_available, noindex)}
<body{bc}>
{header(page, lang, langs_available)}
<main id="main" tabindex="-1">
{body}
</main>
{footer(page, lang)}{scripts}
</body>
</html>
'''
    return out.replace('{NEWTAB}', T('a11y.new_tab', lang))


def parse_fragment(path):
    with open(path, encoding='utf-8') as f:
        raw = f.read()
    meta_raw, body = raw.split('\n---\n', 1)
    meta = {}
    for line in meta_raw.strip().splitlines():
        k, v = line.split(':', 1)
        meta[k.strip()] = v.strip()
    return meta, body


def fill(body, lang):
    def rep(m):
        name = m.group(1)
        if name.startswith('t:'):
            return T(name[2:], lang)
        if name.startswith('url:'):
            return url(name[4:], lang)
        if name not in BLOCKS:
            raise KeyError(f'Bloco desconhecido: {name}')
        return BLOCKS[name](lang)
    return re.sub(r'\{\{\s*([\w:.\-]+)\s*\}\}', rep, body)


def write(path, content):
    full = os.path.join(ROOT, path.lstrip('/'))
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(content)


def build():
    pages_dir = os.path.join(SRC, 'pages')
    available = {}
    for lang in LANGS:
        d = os.path.join(pages_dir, lang)
        for fn in sorted(os.listdir(d)):
            if fn.endswith('.html'):
                available.setdefault(fn[:-5], []).append(lang)
    generated = []
    for page, langs in available.items():
        langs = [l for l in LANGS if l in langs]
        for lang in langs:
            meta, body = parse_fragment(os.path.join(pages_dir, lang, page + '.html'))
            extra = [s for s in meta.get('scripts', '').split() if s]
            content = render_page(page, lang, meta, fill(body, lang), langs, extra, meta.get('body_class', ''),
                                  noindex=page == '404')
            out = (PREFIX[lang] + '/' + page + '.html').lstrip('/')
            write(out, content)
            generated.append((page, lang, langs))
    # sitemap
    sm = ['<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for page, lang, langs in generated:
        if page == '404':
            continue
        sm.append(f'  <url>\n    <loc>{SITE_URL + url(page, lang)}</loc>\n    <lastmod>{BUILD_DATE.isoformat()}</lastmod>')
        for l in langs:
            sm.append(f'    <xhtml:link rel="alternate" hreflang="{HTML_LANG[l]}" href="{SITE_URL + url(page, l)}"/>')
        sm.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{SITE_URL + url(page, "pt")}"/>')
        sm.append('  </url>')
    sm.append('</urlset>\n')
    write('sitemap.xml', '\n'.join(sm))
    print(f'{len(generated)} páginas geradas + sitemap.xml')
    return generated


def check_links():
    """Verifica links e recursos internos (href/src começando com /) em todo HTML publicado."""
    bad = []
    for dirpath, dirnames, files in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if not d.startswith(('_', '.', 'node_modules'))]
        for fn in files:
            if not fn.endswith('.html'):
                continue
            path = os.path.join(dirpath, fn)
            txt = open(path, encoding='utf-8').read()
            for ref in re.findall(r'(?:href|src)="(/[^"#?]*)', txt):
                if ref.startswith('//') or ref.startswith('/web'):
                    continue
                target = os.path.join(ROOT, ref.lstrip('/'))
                ok = (os.path.isfile(target) or os.path.isfile(target + '.html') or
                      os.path.isfile(os.path.join(target, 'index.html')))
                if not ok:
                    bad.append(f'{os.path.relpath(path, ROOT)} -> {ref}')
            for ref in re.findall(r'href="#([^"]+)"', txt):
                if f'id="{ref}"' not in txt:
                    bad.append(f'{os.path.relpath(path, ROOT)} -> #{ref} (âncora inexistente)')
    print('\n'.join(bad) if bad else 'Links internos: OK')
    return not bad


if __name__ == '__main__':
    build()
    if '--check' in sys.argv:
        sys.exit(0 if check_links() else 1)
