import re

def fix_file(file, remove_regex):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    content = re.sub(remove_regex, '', content)
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('src/components/layout/Navbar.tsx', r'^\s*const { t } = useTranslation\(\);\n')
fix_file('src/components/home/HeroSection.tsx', r'^\s*const { t } = useTranslation\(\);\n')
fix_file('src/App.tsx', r'^\s*const { t } = useTranslation\(\);\n')

