# Opens every story and docs page in the built Storybook, reports JS errors and axe violations.
import json, sys, urllib.request
from playwright.sync_api import sync_playwright
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:6007'
AXE = open('node_modules/axe-core/axe.min.js').read()
idx = json.load(urllib.request.urlopen(BASE + '/index.json'))['entries']
problems, viol = [], {}
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1280, 'height': 900})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    for sid, e in idx.items():
        errs.clear()
        mode = 'docs' if e['type'] == 'docs' else 'story'
        pg.goto(f"{BASE}/iframe.html?id={sid}&viewMode={mode}"); pg.wait_for_timeout(1500 if mode == 'docs' else 700)
        txt = pg.evaluate("document.querySelector(mode === 'docs' ? '#storybook-docs' : '#storybook-root')?.innerText.length || 0".replace('mode', repr(mode)))
        if txt < 5: problems.append(f'{sid}: looks empty')
        if errs: problems.append(f'{sid}: {errs[0][:160]}')
        if mode == 'story':
            pg.add_script_tag(content=AXE)
            r = pg.evaluate("axe.run('#storybook-root',{runOnly:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}).then(r=>r.violations.map(v=>[v.id,v.impact,v.nodes.length]))")
            for vid, imp, n in r: viol.setdefault(vid, []).append((sid, imp, n))
    b.close()
print(f'{len(idx)} entries checked')
print('PROBLEMS:', *problems, sep='\n  ') if problems else print('No empty pages or JS errors')
for vid, rows in viol.items(): print(f'axe {vid} ({rows[0][1]}): {len(rows)} stories, e.g. {[r[0] for r in rows[:4]]}')
