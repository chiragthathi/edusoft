import os
import json
import codecs

translations = {
  "app": {
    "page_not_found": { "en": "Page not found", "ja": "ページが見つかりません", "fr": "Page non trouvée", "zh": "页面未找到", "ko": "페이지를 찾을 수 없습니다" },
    "return_home": { "en": "Return Home", "ja": "ホームに戻る", "fr": "Retour à l'accueil", "zh": "返回首页", "ko": "홈으로 돌아가기" }
  },
  "about_page": {
    "facility_alt": { "en": "EduSoft Healthcare facility and operations", "ja": "EduSoft Healthcareの施設と業務", "fr": "Installations et opérations d'EduSoft Healthcare", "zh": "EduSoft Healthcare 设施与运营", "ko": "EduSoft Healthcare 시설 및 운영" }
  },
  "careers_page": {
    "search_jobs_aria": { "en": "Search jobs", "ja": "求人検索", "fr": "Rechercher des emplois", "zh": "搜索职位", "ko": "채용 검색" },
    "filter_dept_aria": { "en": "Filter by department", "ja": "部署で絞り込む", "fr": "Filtrer par département", "zh": "按部门筛选", "ko": "부서별 필터링" },
    "posted_on": { "en": "Posted", "ja": "投稿日", "fr": "Publié", "zh": "发布于", "ko": "게시됨" }
  },
  "portfolio_page": {
    "search_products_aria": { "en": "Search products", "ja": "製品検索", "fr": "Rechercher des produits", "zh": "搜索产品", "ko": "제품 검색" },
    "clear_search_aria": { "en": "Clear search", "ja": "検索をクリア", "fr": "Effacer la recherche", "zh": "清除搜索", "ko": "검색 지우기" },
    "filter_category_aria": { "en": "Filter by category", "ja": "カテゴリで絞り込む", "fr": "Filtrer par catégorie", "zh": "按分类筛选", "ko": "카테고리별 필터링" },
    "view_details_aria": { "en": "View details for", "ja": "詳細を見る", "fr": "Voir les détails pour", "zh": "查看详情", "ko": "세부 정보 보기" }
  },
  "product_detail": {
    "not_found": { "en": "Product Not Found", "ja": "製品が見つかりません", "fr": "Produit non trouvé", "zh": "产品未找到", "ko": "제품을 찾을 수 없습니다" },
    "back_to_portfolio": { "en": "Back to Portfolio", "ja": "ポートフォリオに戻る", "fr": "Retour au portfolio", "zh": "返回作品集", "ko": "포트폴리오로 돌아가기" },
    "interested": { "en": "Interested in this product?", "ja": "この製品に興味がありますか？", "fr": "Intéressé par ce produit ?", "zh": "对这个产品感兴趣？", "ko": "이 제품에 관심이 있으신가요?" },
    "contact_sales": { "en": "Contact our sales team for pricing, availability, and clinical consultations.", "ja": "価格、在庫状況、および臨床相談については、営業チームにお問い合わせください。", "fr": "Contactez notre équipe commerciale pour les prix, la disponibilité et les consultations cliniques.", "zh": "联系我们的销售团队了解定价、可用性和临床咨询。", "ko": "가격, 재고 및 임상 상담은 영업 팀에 문의하세요." },
    "breadcrumb_aria": { "en": "Breadcrumb", "ja": "パンくずリスト", "fr": "Fil d'Ariane", "zh": "面包屑导航", "ko": "브레드크럼" },
    "home": { "en": "Home", "ja": "ホーム", "fr": "Accueil", "zh": "首页", "ko": "홈" },
    "portfolio": { "en": "Portfolio", "ja": "ポートフォリオ", "fr": "Portfolio", "zh": "作品集", "ko": "포트폴리오" }
  },
  "support_page": {
    "search_faqs_placeholder": { "en": "Search FAQs", "ja": "FAQを検索", "fr": "Rechercher dans les FAQ", "zh": "搜索常见问题", "ko": "FAQ 검색" }
  },
  "news_article": {
    "not_found": { "en": "Article Not Found", "ja": "記事が見つかりません", "fr": "Article non trouvé", "zh": "文章未找到", "ko": "기사를 찾을 수 없습니다" },
    "back_to_news": { "en": "Back to News", "ja": "ニュースに戻る", "fr": "Retour aux actualités", "zh": "返回新闻", "ko": "뉴스로 돌아가기" },
    "share_x": { "en": "Share on X (Twitter)", "ja": "X (Twitter) で共有", "fr": "Partager sur X (Twitter)", "zh": "在 X (Twitter) 上分享", "ko": "X (Twitter)에 공유" },
    "share_linkedin": { "en": "Share on LinkedIn", "ja": "LinkedIn で共有", "fr": "Partager sur LinkedIn", "zh": "在 LinkedIn 上分享", "ko": "LinkedIn에 공유" }
  },
  "news_page": {
    "filter_category_aria": { "en": "Filter by category", "ja": "カテゴリで絞り込む", "fr": "Filtrer par catégorie", "zh": "按分类筛选", "ko": "카테고리별 필터링" },
    "no_articles": { "en": "No articles found in this category.", "ja": "このカテゴリには記事がありません。", "fr": "Aucun article trouvé dans cette catégorie.", "zh": "该分类下没有文章。", "ko": "이 카테고리에서 기사를 찾을 수 없습니다." },
    "published": { "en": "Published", "ja": "公開日", "fr": "Publié", "zh": "发布时间", "ko": "게시일" },
    "min_read": { "en": "min read", "ja": "分で読める", "fr": "min de lecture", "zh": "分钟阅读", "ko": "분 소요" }
  },
  "navbar": {
    "linkedin_aria": { "en": "LinkedIn", "ja": "LinkedIn", "fr": "LinkedIn", "zh": "LinkedIn", "ko": "LinkedIn" },
    "twitter_aria": { "en": "Twitter/X", "ja": "Twitter/X", "fr": "Twitter/X", "zh": "Twitter/X", "ko": "Twitter/X" },
    "home_aria": { "en": "EduSoft Healthcare - Home", "ja": "EduSoft Healthcare - ホーム", "fr": "EduSoft Healthcare - Accueil", "zh": "EduSoft Healthcare - 首页", "ko": "EduSoft Healthcare - 홈" },
    "main_nav_aria": { "en": "Main navigation", "ja": "メインナビゲーション", "fr": "Navigation principale", "zh": "主导航", "ko": "메인 내비게이션" },
    "mobile_nav_aria": { "en": "Mobile navigation", "ja": "モバイルナビゲーション", "fr": "Navigation mobile", "zh": "移动导航", "ko": "모바일 내비게이션" },
    "select_lang_aria": { "en": "Select language", "ja": "言語を選択", "fr": "Choisir la langue", "zh": "选择语言", "ko": "언어 선택" },
    "close_menu_aria": { "en": "Close menu", "ja": "メニューを閉じる", "fr": "Fermer le menu", "zh": "关闭菜单", "ko": "메뉴 닫기" },
    "mobile_menu_aria": { "en": "Mobile navigation menu", "ja": "モバイルナビゲーションメニュー", "fr": "Menu de navigation mobile", "zh": "移动导航菜单", "ko": "모바일 내비게이션 메뉴" }
  },
  "footer": {
    "home_aria": { "en": "EduSoft Healthcare - Home", "ja": "EduSoft Healthcare - ホーム", "fr": "EduSoft Healthcare - Accueil", "zh": "EduSoft Healthcare - 首页", "ko": "EduSoft Healthcare - 홈" }
  },
  "about_section": {
    "certified": { "en": "Certified", "ja": "認定", "fr": "Certifié", "zh": "认证", "ko": "인증됨" },
    "iso": { "en": "ISO", "ja": "ISO", "fr": "ISO", "zh": "ISO", "ko": "ISO" },
    "img_alt": { "en": "EduSoft Healthcare clinical team reviewing medical imaging results", "ja": "医療画像結果をレビューするEduSoft Healthcareの臨床チーム", "fr": "L'équipe clinique d'EduSoft Healthcare examine les résultats d'imagerie médicale", "zh": "EduSoft Healthcare临床团队正在审查医学成像结果", "ko": "의료 영상 결과를 검토하는 EduSoft Healthcare 임상 팀" }
  },
  "hero": {
    "slideshow_aria": { "en": "Hero slideshow", "ja": "ヒーロースライドショー", "fr": "Diaporama principal", "zh": "英雄轮播", "ko": "히어로 슬라이드쇼" },
    "drag_hint": { "en": "← drag →", "ja": "← ドラッグ →", "fr": "← glisser →", "zh": "← 拖动 →", "ko": "← 드래그 →" },
    "live_imaging": { "en": "LIVE • MEDICAL IMAGING", "ja": "ライブ • 医療画像", "fr": "EN DIRECT • IMAGERIE MÉDICALE", "zh": "实时 • 医学影像", "ko": "라이브 • 의료 영상" },
    "precision_solutions": { "en": "Precision solutions for", "ja": "精密ソリューション", "fr": "Solutions de précision pour", "zh": "精准解决方案，适用于", "ko": "정밀 솔루션" }
  }
}

locales_dir = 'src/i18n/locales'
langs = ['en', 'ja', 'fr', 'zh', 'ko']

for lang in langs:
    path = os.path.join(locales_dir, f'{lang}.json')
    if os.path.exists(path):
        with codecs.open(path, 'r', encoding='utf-8-sig') as f:
            data = json.load(f)
        
        for section, keys in translations.items():
            if section not in data:
                data[section] = {}
            for k, val in keys.items():
                data[section][k] = val[lang]
            
        with codecs.open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

print("Locales updated.")
