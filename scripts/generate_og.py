# -*- coding: utf-8 -*-
"""生成全站 OG 分享卡片图（1200x630）。

用法：npm run og  （实际调用本脚本）
产物：public/og-default.png + public/og-<game>.png（新增游戏后重跑即可）
"""
import os

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public")
os.makedirs(OUT, exist_ok=True)

FONT_BOLD = r"C:\Windows\Fonts\msyhbd.ttc"
FONT_REG = r"C:\Windows\Fonts\msyh.ttc"

W, H = 1200, 630

# 品牌色：暗夜蓝底 + 血月红点缀（呼应首发三款游戏的黑暗奇幻/武侠气质）
BG_TOP = (24, 24, 27)      # stone-900
BG_BOT = (9, 9, 11)        # stone-950
ACCENT = (220, 38, 38)     # red-600
MUTED = (168, 162, 158)    # stone-400
WHITE = (250, 250, 249)    # stone-50


def base_canvas():
    img = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(img)
    for y in range(H):
        t = y / H
        c = tuple(int(BG_TOP[i] + (BG_BOT[i] - BG_TOP[i]) * t) for i in range(3))
        d.line([(0, y), (W, y)], fill=c)
    # 右上角装饰：血月
    d.ellipse([W - 320, -140, W - 40, 140], fill=(60, 18, 18))
    d.ellipse([W - 300, -120, W - 60, 120], fill=ACCENT)
    # 左侧红色竖条
    d.rectangle([0, 0, 14, H], fill=ACCENT)
    return img, d


def f(path, size):
    return ImageFont.truetype(path, size)


def draw_brand(img, d, title, subtitle):
    d.text((80, 96), "KING", font=f(FONT_BOLD, 56), fill=ACCENT)
    d.text((80, 170), "攻略", font=f(FONT_BOLD, 120), fill=WHITE)
    d.text((80, 330), title, font=f(FONT_BOLD, 64), fill=WHITE)
    if subtitle:
        d.text((80, 430), subtitle, font=f(FONT_REG, 34), fill=MUTED)
    d.text((80, H - 92), "kinggonglue.cn  ·  深度图文游戏攻略", font=f(FONT_REG, 30), fill=MUTED)
    return img


# 1. 品牌默认卡
img, d = base_canvas()
draw_brand(img, d, "深度游戏攻略 · 互动工具", "全流程 / Boss 打法 / Build 配装 / 结局规划")
img.save(os.path.join(OUT, "og-default.png"), optimize=True)
print("og-default.png")

# 2. 三款游戏卡
games = [
    ("dawnwalker", "黎明行者之血", "全流程 · 全 7 结局 · 30 天规划 · Build 配装"),
    ("endfield", "明日方舟：终末地", "新手开荒 · Tier List · 基建产线 · 每日清单"),
    ("phantom-blade-zero", "影之刃零", "Boss 拆解 · 武器流派 · 杀气系统 · 探索奇遇"),
]
for slug, name, sub in games:
    img, d = base_canvas()
    d.text((80, 96), "KING攻略", font=f(FONT_BOLD, 44), fill=MUTED)
    d.text((80, 190), name, font=f(FONT_BOLD, 104), fill=WHITE)
    d.text((80, 360), "游戏攻略全集", font=f(FONT_BOLD, 54), fill=ACCENT)
    d.text((80, 450), sub, font=f(FONT_REG, 32), fill=MUTED)
    d.text((80, H - 92), "kinggonglue.cn  ·  深度图文游戏攻略", font=f(FONT_REG, 30), fill=MUTED)
    img.save(os.path.join(OUT, f"og-{slug}.png"), optimize=True)
    print(f"og-{slug}.png")

# 3. PWA/favicon 图标（暗底圆角方 + 红色 K）
def make_icon(size, out):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=size // 5, fill=BG_TOP)
    # 血月点缀
    r = size * 0.16
    d.ellipse([size - r * 2.2, size * 0.06, size - r * 0.2, size * 0.06 + r * 2], fill=ACCENT)
    k = f(FONT_BOLD, int(size * 0.56))
    bbox = d.textbbox((0, 0), "K", font=k)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((size - tw) / 2 - bbox[0], (size - th) / 2 - bbox[1] + size * 0.02), "K", font=k, fill=WHITE)
    img.save(os.path.join(OUT, out))
    print(out)

make_icon(192, "icon-192.png")
make_icon(512, "icon-512.png")

print("done")
