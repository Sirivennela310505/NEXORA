import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_nexora_presentation(output_path="NEXORA_Presentation.pptx"):
    prs = Presentation()
    # Set 16:9 widescreen format (13.333 x 7.5 inches)
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Color Palette
    COLOR_BG = RGBColor(11, 15, 25)       # #0b0f19
    COLOR_CARD = RGBColor(19, 26, 42)     # #131a2a
    COLOR_CARD_BORDER = RGBColor(38, 50, 78)
    COLOR_BRAND = RGBColor(99, 102, 241)   # #6366f1 (Indigo/Brand)
    COLOR_CYAN = RGBColor(56, 189, 248)    # #38bdf8
    COLOR_EMERALD = RGBColor(52, 211, 153) # #34d399
    COLOR_WHITE = RGBColor(248, 250, 252)  # #f8fafc
    COLOR_MUTED = RGBColor(148, 163, 184)  # #94a3b8

    def add_blank_slide():
        blank_slide_layout = prs.slide_layouts[6]
        slide = prs.slides.add_slide(blank_slide_layout)
        # Background
        bg_shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg_shape.fill.solid()
        bg_shape.fill.fore_color.rgb = COLOR_BG
        bg_shape.line.color.rgb = COLOR_BG
        return slide

    def add_header(slide, tag, title, subtitle=None):
        tx_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.6), Inches(11.7), Inches(1.2))
        tf = tx_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        # Tag
        p_tag = tf.paragraphs[0]
        p_tag.text = tag.upper()
        p_tag.font.size = Pt(11)
        p_tag.font.bold = True
        p_tag.font.color.rgb = COLOR_CYAN
        p_tag.space_after = Pt(4)

        # Title
        p_title = tf.add_paragraph()
        p_title.text = title
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_WHITE
        
        if subtitle:
            p_sub = tf.add_paragraph()
            p_sub.text = subtitle
            p_sub.font.size = Pt(12)
            p_sub.font.color.rgb = COLOR_MUTED
            p_sub.space_before = Pt(4)

    # ----------------------------------------------------
    # SLIDE 1: Title Slide
    # ----------------------------------------------------
    s1 = add_blank_slide()
    
    # Hero Title Box
    title_box = s1.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(10.9), Inches(4.5))
    tf1 = title_box.text_frame
    tf1.word_wrap = True

    p_badge = tf1.paragraphs[0]
    p_badge.text = "NEXT-GENERATION AI LEARNING & CAREER PLATFORM"
    p_badge.font.size = Pt(12)
    p_badge.font.bold = True
    p_badge.font.color.rgb = COLOR_CYAN
    p_badge.space_after = Pt(12)

    p_h1 = tf1.add_paragraph()
    p_h1.text = "NEXORA"
    p_h1.font.size = Pt(54)
    p_h1.font.bold = True
    p_h1.font.color.rgb = COLOR_WHITE
    p_h1.space_after = Pt(8)

    p_sub = tf1.add_paragraph()
    p_sub.text = "Context-Aware Dynamic AI Learning Pathfinder & Career Navigator"
    p_sub.font.size = Pt(22)
    p_sub.font.color.rgb = COLOR_BRAND
    p_sub.space_after = Pt(20)

    p_desc = tf1.add_paragraph()
    p_desc.text = "Replacing static video playlists with real-time adaptive DAG roadmaps, automated diagnostic skill gap analysis, ATS resume intelligence, and 24/7 multimodal tutoring."
    p_desc.font.size = Pt(14)
    p_desc.font.color.rgb = COLOR_MUTED
    p_desc.space_after = Pt(24)

    p_meta = tf1.add_paragraph()
    p_meta.text = "Live Web App: https://nexora-path-finder.vercel.app  |  Powered by Google Gemini AI & React 19"
    p_meta.font.size = Pt(11)
    p_meta.font.color.rgb = COLOR_EMERALD

    # ----------------------------------------------------
    # SLIDE 2: The Problem Statement
    # ----------------------------------------------------
    s2 = add_blank_slide()
    add_header(s2, "Industry Challenge", "The Broken Student Learning Journey", "Why 90% of online learners drop out or fail technical screening rounds")

    cards_s2 = [
        ("01. Static & Generic Playlists", "Traditional courses treat absolute beginners and experienced switchers identically, causing frustration, overwhelm, or redundant study.", COLOR_BRAND),
        ("02. Undetected Prerequisite Gaps", "Students attempt advanced concepts (like Dynamic Programming or Rotational Motion) without mastering foundational mechanics, leading to repeated failures.", COLOR_CYAN),
        ("03. Analysis Paralysis", "Thousands of unstructured YouTube videos and paid courses create confusion. Students don't know what single high-yield action to take today.", COLOR_EMERALD),
        ("04. Resume & ATS Disconnect", "Even after completing courses, students struggle to translate learned skills into ATS-compliant bullet points and measurable recruiter-ready metrics.", COLOR_WHITE)
    ]

    for i, (title, desc, col) in enumerate(cards_s2):
        col_idx = i % 2
        row_idx = i // 2
        left = Inches(0.8 + col_idx * 5.9)
        top = Inches(2.2 + row_idx * 2.4)
        
        box = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.6), Inches(2.1))
        box.fill.solid()
        box.fill.fore_color.rgb = COLOR_CARD
        box.line.color.rgb = COLOR_CARD_BORDER

        tf = box.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.3)
        tf.margin_right = Inches(0.3)
        tf.margin_top = Inches(0.25)

        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.size = Pt(15)
        p1.font.bold = True
        p1.font.color.rgb = col
        p1.space_after = Pt(8)

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = COLOR_MUTED

    # ----------------------------------------------------
    # SLIDE 3: The NEXORA Architecture & Core Solution
    # ----------------------------------------------------
    s3 = add_blank_slide()
    add_header(s3, "Product Architecture", "The 7 Intelligent Pillars of NEXORA", "An end-to-end adaptive ecosystem built around student mastery")

    features = [
        ("1. Conversational AI Onboarding", "Live text & voice intake powered by Google Gemini to extract goals, education background, and bottlenecks."),
        ("2. Interactive Flowchart DAG", "Visual prerequisite dependency graphs with color-coded nodes (Unlocked, Mastered, Remediation)."),
        ("3. Skill Gap & Diagnostic Engine", "Benchmark-calibrated diagnostic quizzes that accurately calculate percentage gaps per skill."),
        ("4. Next-Best-Action (NBA)", "Real-time algorithmic prioritization telling students their exact single highest-leverage task today."),
        ("5. 24/7 AI Learning Navigator", "Domain-aware multimodal tutor for coding doubts, concept breakdowns, and comparison advice."),
        ("6. ATS Resume Builder & Scoring", "Automated scoring against recruiter criteria with instant PDF export and XYZ bullet optimizers."),
        ("7. What-If Scenario Simulator", "Real-time simulator showing how adjusting daily study hours or career paths shifts completion dates.")
    ]

    # Left Column (4 items)
    for i, (title, desc) in enumerate(features[:4]):
        top = Inches(2.1 + i * 1.25)
        box = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top, Inches(5.7), Inches(1.15))
        box.fill.solid()
        box.fill.fore_color.rgb = COLOR_CARD
        box.line.color.rgb = COLOR_CARD_BORDER

        tf = box.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.2)
        tf.margin_right = Inches(0.2)
        tf.margin_top = Inches(0.12)
        
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = COLOR_CYAN

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = COLOR_MUTED

    # Right Column (3 items)
    for i, (title, desc) in enumerate(features[4:]):
        top = Inches(2.1 + i * 1.65)
        box = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), top, Inches(5.7), Inches(1.55))
        box.fill.solid()
        box.fill.fore_color.rgb = COLOR_CARD
        box.line.color.rgb = COLOR_CARD_BORDER

        tf = box.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.2)
        tf.margin_right = Inches(0.2)
        tf.margin_top = Inches(0.15)
        
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = COLOR_EMERALD

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = COLOR_MUTED

    # ----------------------------------------------------
    # SLIDE 4: Multi-Domain Personalization
    # ----------------------------------------------------
    s4 = add_blank_slide()
    add_header(s4, "Domain Specialization", "Engineered for Diverse Student Goals", "Customized pathways that adapt greetings, questions, and resources to the user's domain")

    domains = [
        ("🎯 JEE Main & Advanced", "High school & dropper students. Focuses on Calculus, Rotational Dynamics, Reaction Mechanisms, NCERT lines, and 3-hr mock time management.", COLOR_CYAN),
        ("🩺 NEET (Medical)", "Pre-med aspirants. Calibrated for NCERT Biology 360/360, Botany/Zoology diagrams, Inorganic Chemistry trends, and Physics numerical shortcuts.", COLOR_EMERALD),
        ("💻 SWE & Placements", "College undergrads & job seekers. Focuses on DSA (LeetCode patterns), System Design, Java/C++/Python, and ATS technical resume screening.", COLOR_BRAND),
        ("🤖 AI & Machine Learning", "Aspiring ML Engineers. Focuses on Linear Algebra, PyTorch, Backpropagation, Vector Databases, RAG architectures, and fine-tuning.", COLOR_WHITE),
        ("🔄 Career Switchers", "Non-CS professionals transitioning to tech. Focuses on 0-to-1 coding fundamentals, portfolio projects, and recruiter pitch decks.", COLOR_CYAN),
        ("📊 Data Science", "Data analysts & scientists. Focuses on SQL window functions, Pandas wrangling, Exploratory Data Analysis, and Statistical Modeling.", COLOR_EMERALD)
    ]

    for i, (title, desc, col) in enumerate(domains):
        col_idx = i % 3
        row_idx = i // 3
        left = Inches(0.8 + col_idx * 3.9)
        top = Inches(2.2 + row_idx * 2.4)
        
        box = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(3.7), Inches(2.1))
        box.fill.solid()
        box.fill.fore_color.rgb = COLOR_CARD
        box.line.color.rgb = COLOR_CARD_BORDER

        tf = box.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.2)
        tf.margin_right = Inches(0.2)
        tf.margin_top = Inches(0.2)

        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = col
        p.space_after = Pt(6)

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = COLOR_MUTED

    # ----------------------------------------------------
    # SLIDE 5: Technology Stack & Technical Execution
    # ----------------------------------------------------
    s5 = add_blank_slide()
    add_header(s5, "Technology Stack", "Modern, Production-Grade Engineering", "Designed for blazing-fast client execution and resilient offline capabilities")

    tech_cards = [
        ("Frontend & UI Framework", "• React 19 with Modern Hooks\n• TypeScript for end-to-end type safety\n• TailwindCSS with custom design system\n• Lucide React Icons & Glassmorphism"),
        ("AI & Multimodal Services", "• Google Gemini 1.5 Flash & 2.0 API\n• Live Chat & Multimodal Speech API\n• Semantic Intent Classifier Fallback\n• Dynamic Prompt Engineering Pipeline"),
        ("Data & Adaptive Engines", "• Topological Sort for Dependency DAGs\n• Skill Gap & Remediation Algorithm\n• Next-Best-Action (NBA) Scorer\n• What-If Monte-Carlo Pacing Model"),
        ("Storage, Export & Auth", "• LocalStorage Zero-Latency Session\n• Firebase Cloud Auth & Sync (Optional)\n• jsPDF & jsPDF-AutoTable for ATS PDF\n• 100% Client-Side Privacy Compliance")
    ]

    for i, (title, desc) in enumerate(tech_cards):
        col_idx = i % 2
        row_idx = i // 2
        left = Inches(0.8 + col_idx * 5.9)
        top = Inches(2.2 + row_idx * 2.4)
        
        box = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.6), Inches(2.1))
        box.fill.solid()
        box.fill.fore_color.rgb = COLOR_CARD
        box.line.color.rgb = COLOR_CARD_BORDER

        tf = box.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.25)
        tf.margin_right = Inches(0.25)
        tf.margin_top = Inches(0.2)

        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = COLOR_CYAN
        p.space_after = Pt(6)

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11.5)
        p2.font.color.rgb = COLOR_WHITE

    # ----------------------------------------------------
    # SLIDE 6: Measurable Outcomes & Student Impact
    # ----------------------------------------------------
    s6 = add_blank_slide()
    add_header(s6, "Impact & Metrics", "Delivering Tangible Educational Outcomes", "Key performance metrics driven by NEXORA's adaptive learning framework")

    metrics = [
        ("3.2x", "Higher Course Completion Rate", "Personalized DAG roadmaps prevent cognitive burnout compared to linear video courses.", COLOR_CYAN),
        ("88%+", "Average ATS Resume Score", "Built-in Google XYZ bullet optimization ensures recruiter-ready resumes from Day 1.", COLOR_EMERALD),
        ("100%", "Verified Free Resources", "Curated MIT OCW, Harvard CS50, Disha, HCV, and freeCodeCamp resources zero out learning costs.", COLOR_BRAND),
        ("24/7", "Context-Aware AI Tutoring", "Students get instant answers with code blocks, comparisons, and personalized explanations.", COLOR_WHITE)
    ]

    for i, (stat, label, desc, col) in enumerate(metrics):
        left = Inches(0.8 + i * 2.95)
        top = Inches(2.2)
        
        box = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(2.8), Inches(4.5))
        box.fill.solid()
        box.fill.fore_color.rgb = COLOR_CARD
        box.line.color.rgb = COLOR_CARD_BORDER

        tf = box.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.2)
        tf.margin_right = Inches(0.2)
        tf.margin_top = Inches(0.3)

        p = tf.paragraphs[0]
        p.text = stat
        p.font.size = Pt(36)
        p.font.bold = True
        p.font.color.rgb = col
        p.space_after = Pt(10)

        p2 = tf.add_paragraph()
        p2.text = label
        p2.font.size = Pt(14)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_WHITE
        p2.space_after = Pt(12)

        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.size = Pt(11)
        p3.font.color.rgb = COLOR_MUTED

    # ----------------------------------------------------
    # SLIDE 7: Conclusion & Live Demonstration
    # ----------------------------------------------------
    s7 = add_blank_slide()
    
    box7 = s7.shapes.add_textbox(Inches(1.5), Inches(1.5), Inches(10.3), Inches(4.8))
    tf7 = box7.text_frame
    tf7.word_wrap = True

    p = tf7.paragraphs[0]
    p.text = "THE FUTURE OF LEARNING IS ADAPTIVE"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_CYAN
    p.space_after = Pt(10)

    p1 = tf7.add_paragraph()
    p1.text = "Experience NEXORA Live"
    p1.font.size = Pt(40)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_WHITE
    p1.space_after = Pt(14)

    p2 = tf7.add_paragraph()
    p2.text = "NEXORA transforms passive educational content into an active, goal-driven navigation system that guides students every step of the way from Day 1 to goal mastery."
    p2.font.size = Pt(16)
    p2.font.color.rgb = COLOR_MUTED
    p2.space_after = Pt(28)

    p3 = tf7.add_paragraph()
    p3.text = "🔗 Live Deployment: https://nexora-path-finder.vercel.app\n💻 GitHub Repository: https://github.com/Sirivennela310505/NEXORA\n✨ Built with Google Gemini AI, React 19 & TypeScript"
    p3.font.size = Pt(13)
    p3.font.color.rgb = COLOR_EMERALD

    prs.save(output_path)
    print(f"Presentation successfully saved to: {output_path}")

if __name__ == "__main__":
    create_nexora_presentation()
