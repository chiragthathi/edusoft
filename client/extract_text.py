import os
import re
import json
import codecs

directories = ['src/pages', 'src/components/layout', 'src/components/home', 'src/components/portfolio', 'src']
files_to_check = []

for d in directories:
    if os.path.exists(d):
        for f in os.listdir(d):
            if f.endswith('.tsx'):
                files_to_check.append(os.path.join(d, f))

out_data = {}

for file in files_to_check:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    jsx_texts = re.findall(r'>([^<>{}\n]*[a-zA-Z][^<>{}\n]*)<', content)
    jsx_texts = [t.strip() for t in jsx_texts if t.strip() and not t.strip().startswith('t(') and not t.strip().startswith('return ')]
    
    aria_labels = re.findall(r'aria-label=(["\'])(.*?)\1', content)
    placeholders = re.findall(r'placeholder=(["\'])(.*?)\1', content)
    alts = re.findall(r'alt=(["\'])(.*?)\1', content)
    titles = re.findall(r'title=(["\'])(.*?)\1', content)
    
    def filter_texts(texts):
        res = []
        for t in texts:
            val = t[1] if isinstance(t, tuple) else t
            if re.search(r'[a-zA-Z]{2,}', val) and not val.startswith('t('):
                res.append(val)
        return set(res)

    all_texts = set(filter_texts(jsx_texts)) | filter_texts(aria_labels) | filter_texts(placeholders) | filter_texts(alts) | filter_texts(titles)
    
    if all_texts:
        out_data[file] = list(all_texts)

with codecs.open('missing_strings.json', 'w', encoding='utf-8') as f:
    json.dump(out_data, f, indent=2, ensure_ascii=False)

