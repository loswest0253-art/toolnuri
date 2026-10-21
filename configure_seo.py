#!/usr/bin/env python3
"""SEO metadata and XML sitemap creator. Example: python configure_seo.py https://example.com
Run from project root. Requires only Python standard library.
"""
import sys, re, html, urllib.parse
from pathlib import Path
from datetime import date
import xml.etree.ElementTree as ET

root=Path(__file__).resolve().parent
if len(sys.argv)!=2:
    raise SystemExit('Usage: python configure_seo.py https://your-real-domain.com')
url=sys.argv[1].rstrip('/')
p=urllib.parse.urlparse(url)
if p.scheme!='https' or not p.netloc or p.path or p.query or p.fragment:
    raise SystemExit('Provide only an HTTPS domain, e.g. https://example.com')
for locale in ('ko','en'):
    for file in sorted((root/locale).rglob('index.html')):
        route='/'+str(file.relative_to(root).parent).replace('\\','/')+'/'
        other='/'+('en' if locale=='ko' else 'ko')+route[3:]
        content=file.read_text(encoding='utf8')
        # Existing alternates and previously generated canonical are replaced.
        content=re.sub(r'<link\b[^>]*\brel=["\'](?:alternate|canonical)["\'][^>]*>', '',content,flags=re.I)
        content=re.sub(r'<meta\b[^>]*\bproperty=["\']og:url["\'][^>]*>', '',content,flags=re.I)
        labels={'ko':('/ko'+route[3:] if locale=='en' else route),'en':('/en'+route[3:] if locale=='ko' else route)}
        tags=''.join(f'<link rel="alternate" hreflang="{lang}" href="{html.escape(url+target,quote=True)}"/>' for lang,target in labels.items())
        tags+=f'<link rel="canonical" href="{html.escape(url+route,quote=True)}"/>'
        tags+=f'<meta property="og:url" content="{html.escape(url+route,quote=True)}"/>'
        if '</head>' not in content.lower():raise ValueError(file)
        content=re.sub(r'</head>',tags+'</head>',content,count=1,flags=re.I)
        file.write_text(content,encoding='utf8')
# sitemap includes ONLY indexable localized pages
NS='http://www.sitemaps.org/schemas/sitemap/0.9'; ET.register_namespace('',NS)
root_xml=ET.Element('{%s}urlset'%NS)
for locale in ('ko','en'):
    for f in sorted((root/locale).rglob('index.html')):
        route='/'+str(f.relative_to(root).parent).replace('\\','/')+'/'
        el=ET.SubElement(root_xml,'{%s}url'%NS)
        ET.SubElement(el,'{%s}loc'%NS).text=url+route
ET.indent(root_xml,space='  ')
ET.ElementTree(root_xml).write(root/'sitemap.xml',encoding='utf-8',xml_declaration=True)
(root/'robots.txt').write_text(f'User-agent: *\nAllow: /\n\nSitemap: {url}/sitemap.xml\n',encoding='utf8')
print('SEO configured for',url,':',sum(1 for _ in (root/'ko').rglob('index.html'))*2,'localized pages')
