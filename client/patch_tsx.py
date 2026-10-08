import os
import re
import codecs

replacements = {
    "src/App.tsx": [
        ("Page not found", "{t('app.page_not_found')}"),
        ("Return Home", "{t('app.return_home')}")
    ],
    "src/pages/AboutPage.tsx": [
        ('alt="EduSoft Healthcare facility and operations"', 'alt={t(\'about_page.facility_alt\')}')
    ],
    "src/pages/CareersPage.tsx": [
        ('aria-label="Search jobs"', 'aria-label={t(\'careers_page.search_jobs_aria\')}'),
        ('aria-label="Filter by department"', 'aria-label={t(\'careers_page.filter_dept_aria\')}'),
        ('Posted {formatDate(job.posted)}', '{t(\'careers_page.posted_on\')} {formatDate(job.posted)}')
    ],
    "src/pages/PortfolioPage.tsx": [
        ('aria-label="Search products"', 'aria-label={t(\'portfolio_page.search_products_aria\')}'),
        ('aria-label="Clear search"', 'aria-label={t(\'portfolio_page.clear_search_aria\')}'),
        ('aria-label="Filter by category"', 'aria-label={t(\'portfolio_page.filter_category_aria\')}')
    ],
    "src/components/portfolio/ProductCard.tsx": [
        ('aria-label={View details for }', 'aria-label={${t(\'portfolio_page.view_details_aria\')} }')
    ],
    "src/pages/ProductDetailPage.tsx": [
        ('Product Not Found', '{t(\'product_detail.not_found\')}'),
        ('Back to Portfolio', '{t(\'product_detail.back_to_portfolio\')}'),
        ('Interested in this product?', '{t(\'product_detail.interested\')}'),
        ('Contact our sales team for pricing, availability, and clinical consultations.', '{t(\'product_detail.contact_sales\')}'),
        ('aria-label="Breadcrumb"', 'aria-label={t(\'product_detail.breadcrumb_aria\')}'),
        ('>Home<', '>{t(\'product_detail.home\')}<'),
        ('>Portfolio<', '>{t(\'product_detail.portfolio\')}<')
    ],
    "src/pages/SupportPage.tsx": [
        ('placeholder="Search FAQs"', 'placeholder={t(\'support_page.search_faqs_placeholder\')}')
    ],
    "src/pages/NewsArticlePage.tsx": [
        ('Article Not Found', '{t(\'news_article.not_found\')}'),
        ('Back to News', '{t(\'news_article.back_to_news\')}'),
        ('Share on X (Twitter)', '{t(\'news_article.share_x\')}'),
        ('Share on LinkedIn', '{t(\'news_article.share_linkedin\')}')
    ],
    "src/pages/NewsPage.tsx": [
        ('aria-label="Filter by category"', 'aria-label={t(\'news_page.filter_category_aria\')}'),
        ('No articles found in this category.', '{t(\'news_page.no_articles\')}'),
        ('>Published ', '>{t(\'news_page.published\')} '),
        (' min read<', ' {t(\'news_page.min_read\')}<')
    ],
    "src/components/layout/Navbar.tsx": [
        ('aria-label="LinkedIn"', 'aria-label={t(\'navbar.linkedin_aria\')}'),
        ('aria-label="Twitter/X"', 'aria-label={t(\'navbar.twitter_aria\')}'),
        ('aria-label="EduSoft Healthcare - Home"', 'aria-label={t(\'navbar.home_aria\')}'),
        ('aria-label="Main navigation"', 'aria-label={t(\'navbar.main_nav_aria\')}'),
        ('aria-label="Mobile navigation"', 'aria-label={t(\'navbar.mobile_nav_aria\')}'),
        ('aria-label="Select language"', 'aria-label={t(\'navbar.select_lang_aria\')}'),
        ('aria-label="Close menu"', 'aria-label={t(\'navbar.close_menu_aria\')}'),
        ('aria-label="Mobile navigation menu"', 'aria-label={t(\'navbar.mobile_menu_aria\')}')
    ],
    "src/components/layout/Footer.tsx": [
        ('aria-label="EduSoft Healthcare - Home"', 'aria-label={t(\'footer.home_aria\')}')
    ],
    "src/components/home/AboutSection.tsx": [
        ('>Certified<', '>{t(\'about_section.certified\')}<'),
        ('>ISO<', '>{t(\'about_section.iso\')}<'),
        ('alt="EduSoft Healthcare clinical team reviewing medical imaging results"', 'alt={t(\'about_section.img_alt\')}')
    ],
    "src/components/home/HeroSection.tsx": [
        ('aria-label="Hero slideshow"', 'aria-label={t(\'hero.slideshow_aria\')}'),
        ('← drag →', '{t(\'hero.drag_hint\')}'),
        ('LIVE • MEDICAL IMAGING', '{t(\'hero.live_imaging\')}'),
        ('Precision solutions for', '{t(\'hero.precision_solutions\')}')
    ]
}

for file, changes in replacements.items():
    if not os.path.exists(file):
        continue
        
    with codecs.open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Check if useTranslation is missing
    needs_t = False
    for old, new in changes:
        if old in content:
            needs_t = True
            content = content.replace(old, new)
            
    if needs_t:
        if 'useTranslation' not in content:
            # simple inject at top
            content = "import { useTranslation } from 'react-i18next';\n" + content
            
        # check if const { t } = useTranslation(); is inside the component
        if 'const { t } = useTranslation()' not in content:
            # find first function or const component
            content = re.sub(r'(export default function \w+\(.*?\)\s*{)', r'\1\n  const { t } = useTranslation();', content, count=1)
            content = re.sub(r'(const \w+ = \(.*?\).*?=>\s*{)', r'\1\n  const { t } = useTranslation();', content, count=1)
            
    with codecs.open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("TSX files patched.")
