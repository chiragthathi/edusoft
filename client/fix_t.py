import os
import re

files_with_issues = ['src/App.tsx', 'src/components/home/HeroSection.tsx', 'src/components/layout/Navbar.tsx']

for file in files_with_issues:
    with open(file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    out = []
    t_count = 0
    in_hero = False
    
    for idx, line in enumerate(lines):
        if 'const { t } = useTranslation();' in line:
            t_count += 1
            # In HeroSection and Navbar, we only want the FIRST occurrence inside the main component
            if t_count > 1:
                continue # Skip extra ones we injected
                
        # For App.tsx, t_count might be 1 but unused. Let's just remove the first one if we are in ScrollReset
        # Actually wait, in App.tsx, it complained about line 43. 
        # Let's just remove all 'const { t } = useTranslation();' that we wrongly added to non-main components.
        
        out.append(line)
        
    with open(file, 'w', encoding='utf-8') as f:
        f.writelines(out)
