"""Gera core.js (feriados + desenhos das ovelhas) a partir do index.html do calendário,
para a extensão usar exatamente os mesmos desenhos. Rode de novo depois de mudar o index.html:
    python3 build.py
"""
import pathlib, re
here = pathlib.Path(__file__).resolve().parent
src = (here.parent / 'index.html').read_text(encoding='utf-8')
script = src[src.index('<script>') + len('<script>'):]

def between(start, end):
    i = script.index(start); j = script.index(end, i)
    return script[i:j].rstrip() + '\n'

parts = [
    between('const pad = ', 'const ls = '),
    between('function easter(', '/* =========================================================\n   Ícones'),
    between('const ART_DEFS = ', 'const TYPE_SCENE = '),
]
out = '/* Gerado por build.py a partir de ../index.html — não edite à mão. */\n' + '\n'.join(parts)
(here / 'core.js').write_text(out, encoding='utf-8')
print(f'core.js: {len(out.splitlines())} linhas')
