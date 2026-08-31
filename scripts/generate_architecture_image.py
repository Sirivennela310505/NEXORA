import os
from PIL import Image, ImageDraw, ImageFont

def generate_architecture_diagram(output_path="public/nexora_architecture_diagram.png"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # 16:9 high-res canvas (1600 x 900)
    width, height = 1600, 900
    img = Image.new("RGB", (width, height), "#f8fafc")
    draw = ImageDraw.Draw(img)

    # Fonts
    try:
        font_title = ImageFont.truetype("arialbd.ttf", 32)
        font_sub = ImageFont.truetype("arial.ttf", 18)
        font_box_title = ImageFont.truetype("arialbd.ttf", 20)
        font_box_sub = ImageFont.truetype("arial.ttf", 15)
        font_tag = ImageFont.truetype("arialbd.ttf", 14)
    except Exception:
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_box_title = ImageFont.load_default()
        font_box_sub = ImageFont.load_default()
        font_tag = ImageFont.load_default()

    # Colors
    c_slate_900 = "#0f172a"
    c_slate_600 = "#475569"
    c_indigo = "#4f46e5"
    c_cyan = "#0284c7"
    c_emerald = "#0d9488"
    c_amber = "#d97706"
    c_card_bg = "#ffffff"
    c_card_border = "#cbd5e1"

    # Header
    draw.text((60, 40), "NEXORA SaaS — End-to-End System Architecture", fill=c_slate_900, font=font_title)
    draw.text((60, 85), "High-performance client-driven reactive framework with Topological DAGs & Gemini LLM reasoning", fill=c_slate_600, font=font_sub)

    # 4 Main Architectural Columns/Layers
    layers = [
        {
            "num": "LAYER 01",
            "title": "Client & Multimodal UI",
            "color": c_indigo,
            "items": [
                ("React 19 Core", "Concurrent rendering & single-page application"),
                ("TailwindCSS Glassmorphism", "Responsive executive design tokens & themes"),
                ("Web Speech API", "Voice requirement intake & speech-to-text"),
                ("Dynamic Tab Router", "Zero-latency view & state transitions")
            ]
        },
        {
            "num": "LAYER 02",
            "title": "NEXORA Adaptive Core",
            "color": c_cyan,
            "items": [
                ("Topological DAG Engine", "Graph traversal & prerequisite dependency trees"),
                ("Skill Gap Matrix", "Real-time mastery percentage vs benchmarks"),
                ("Next-Best-Action (NBA)", "Algorithmic single-task prioritization"),
                ("What-If Simulator", "Monte-Carlo study schedule pacing model")
            ]
        },
        {
            "num": "LAYER 03",
            "title": "AI & Intelligence Layer",
            "color": c_emerald,
            "items": [
                ("Google Gemini 1.5 Flash / 2.0", "Multi-turn reasoning & tailored tutoring"),
                ("Context Injection Pipeline", "Profile, active milestones & diagnostic state"),
                ("Structured JSON Parser", "Dynamic milestone & MCQ test generation"),
                ("Semantic Intent Fallback", "Offline intelligence for code & comparisons")
            ]
        },
        {
            "num": "LAYER 04",
            "title": "Storage, Export & Cloud",
            "color": c_amber,
            "items": [
                ("LocalStorage Session", "Zero-latency persistent offline caching"),
                ("Firebase Cloud Auth", "Optional multi-device sync & Google Sign-In"),
                ("jsPDF Engine", "Automated ATS resume & PDF generation"),
                ("Vercel Edge Network", "Global CDN continuous deployment")
            ]
        }
    ]

    col_w = 340
    gap = 40
    start_x = 60
    start_y = 150
    card_h = 680

    for idx, layer in enumerate(layers):
        x = start_x + idx * (col_w + gap)
        y = start_y

        # Column Outer Box
        draw.rounded_rectangle([x, y, x + col_w, y + card_h], radius=16, fill=c_card_bg, outline=c_card_border, width=2)

        # Header Pill & Line
        draw.rounded_rectangle([x + 20, y + 20, x + 120, y + 46], radius=8, fill="#f1f5f9", outline="#e2e8f0", width=1)
        draw.text((x + 30, y + 25), layer["num"], fill=layer["color"], font=font_tag)

        draw.text((x + 20, y + 60), layer["title"], fill=c_slate_900, font=font_box_title)
        draw.line([x + 20, y + 95, x + col_w - 20, y + 95], fill=layer["color"], width=3)

        # Item boxes inside column
        item_y = y + 115
        for item_title, item_sub in layer["items"]:
            draw.rounded_rectangle([x + 16, item_y, x + col_w - 16, item_y + 115], radius=10, fill="#f8fafc", outline="#e2e8f0", width=1)
            draw.text((x + 30, item_y + 16), item_title, fill=c_slate_900, font=font_box_title)
            
            # Simple text wrap for item_sub
            words = item_sub.split()
            line1, line2 = "", ""
            for w in words:
                if len(line1 + " " + w) < 32:
                    line1 += (" " if line1 else "") + w
                else:
                    line2 += (" " if line2 else "") + w

            draw.text((x + 30, item_y + 50), line1, fill=c_slate_600, font=font_box_sub)
            if line2:
                draw.text((x + 30, item_y + 74), line2, fill=c_slate_600, font=font_box_sub)

            item_y += 135

        # Connecting Arrow to next column
        if idx < len(layers) - 1:
            arrow_x = x + col_w + 10
            arrow_y = y + card_h // 2
            draw.line([arrow_x, arrow_y, arrow_x + 20, arrow_y], fill=c_indigo, width=3)
            draw.polygon([(arrow_x + 20, arrow_y - 6), (arrow_x + 28, arrow_y), (arrow_x + 20, arrow_y + 6)], fill=c_indigo)

    img.save(output_path, "PNG", quality=95)
    print(f"Architecture diagram generated: {output_path}")

if __name__ == "__main__":
    generate_architecture_diagram()
