# DESIGN-QUALITY-REPORT — تاي لي · Thai Lee

موقع تعريفي فاخر (Arabic RTL، vanilla static) لمطعم تايلندي/آسيوي في جدة، بهوية «تايلندية جريئة» حمراء.

## Design Read
*Reading this as: premium restaurant landing for Jeddah diners, with a bold-modern Thai language, leaning toward vanilla HTML/CSS/JS + El Messiri/Reem Kufi display + Tajawal body + a bespoke SVG wok-fire/noodle hero.*
**Dials:** DESIGN_VARIANCE 7 / MOTION_INTENSITY 7 / VISUAL_DENSITY 3.

## 1) المهارات المُستدعاة وكيف استُخدمت
| المهارة | كيف طُبّقت |
|---|---|
| **ui-ux-pro-max** (`--design-system "thai asian restaurant bold red modern"`) | تبنّينا الـ palette (أحمر `#DC2626/#B91C1C` + ذهبي دافئ + كريمي)، نمط Vibrant & Block-based، تأثيرات (أقسام كبيرة 48px+، hover color/scale، 200–300ms). عدّلنا الذهبي (`--gold #D9A441`) والأحمر الغامق للنصوص لضمان AA. أبقينا توصية «Thai modern readable» لكن استخدمنا El Messiri/Reem Kufi/Tajawal العربية بدل Noto Thai (الموقع عربي بالكامل). |
| **design-taste-frontend** | Design Read معلن، anti-default discipline (لا AI-purple، لا 3 كروت متطابقة بلا إيقاع، لا Inter)، قفل لون واحد (أحمر) + شكل واحد (نظام radius موحّد) + ثيم واحد (داكن). hero ≤ 4 عناصر نصية، nav سطر واحد، **zero em-dashes**. صور حقيقية فقط. |
| **emil-design-eng** | منحنيات easing مخصّصة (`cubic-bezier(.23,1,.32,1)`)، مدد 150–300ms للميكرو، `scale(.97)` عند الضغط، لا `scale(0)` (النودلز تبدأ من dashoffset لا من العدم)، origin-aware، احترام reduced-motion، transform/opacity فقط. |
| **high-end-visual-design** | مساحات ماكرو (`py 64–110px`)، eyebrow pills، ظلال ملوّنة بدل أسود قاسٍ، CTA «button-in-button» (أيقونة داخل دائرة)، ken-burns سينمائي، nested media bezels. |

## 2) مخرجات design-system (palette/type)
- **Primary** `#DC2626` / **Brand** `#B91C1C` / **Deep** `#7F1D1D`
- **Gold accent** `#D9A441` / `#FCD34D` · **Cream** `#FBF5EE` · **Ink** `#140A0A`
- **عناوين**: El Messiri + Reem Kufi (Kufi للأزرار/الـ labels) · **النصوص**: Tajawal.

## 3) ⭐ الموشن التوقيعي — Wok-Fire / Noodle (كيف يعمل)
SVG واحد في الهيرو (`.wok-scene`) مبني من مجموعات absolutely-layered تتحرك بـ transform/opacity (+ stroke-dashoffset)، ≤ 3 مجموعات متحركة:
1. **اللهب (`.flames`)**: ثلاث طبقات (back/mid/core) بتدرّج `flameGrad` من برتقالي→ذهبي. كل طبقة لها `@keyframes flick` (scaleY/scaleX/translateY/rotate خفيف) بمدد مختلفة (1.7s/1.25s/0.9s) و delays سالبة → وميض عضوي غير متزامن، `transform-origin:center bottom` فيرقص اللهب من قاع الووك.
2. **النودلز (`.noodle` × 3)**: مسارات منحنية تُرسم عبر `stroke-dasharray/stroke-dashoffset` (`drawNoodle`) بـ stagger (0 / .18s / .34s)، ثم تدخل في تمايل لطيف دائم (`sway`) — كأنها تُرفع من الووك بتمايل.
3. **اللمسات**: حبيبات سمسم/بصل أخضر (`.fleck`) تصعد وتتلاشى (`rise`)، وبخار (`.steam`) ثلاثة خيوط تصعد بـ dashoffset متدرّج.
الووك نفسه ثابت (جسم + حافة ذهبية + مقبض + ظل).

**Fallback (`prefers-reduced-motion: reduce`)**: تتوقف كل حركات اللهب/النودلز/البخار/الحبيبات؛ النودلز تظهر مرسومة بالكامل (`stroke-dashoffset:0`)، اللهب ثابت بشفافية، البخار خفيف ثابت → **حالة نهائية مركّبة ساكنة** (ووك + نار + نودلز) بلا أي وميض. كذلك تُلغى ken-burns وكل الـ reveals (تظهر مباشرة).

**60fps**: transform/opacity + stroke-dashoffset حصراً؛ لا تحريك width/height/top/left.

### بوليش إضافي
ken-burns على `tl-4.jpg` خلف الهيرو · scroll-reveal (IntersectionObserver + fallback 2.5s) · hover zoom على كروت الأطباق والمعرض · تصغير الهيدر (`.shrink`) عند التمرير · CTA sheen (شريط ضوء يمر) · preloader ووك يطفو ينتهي `display:none` مع fallback 1.2s.

## 4) قرارات UX/UI الأساسية
- **هيرو split** (نص + فن الووك) لا centered، يتحوّل لعمود واحد على الجوال (فن الووك يصعد للأعلى، الصورة تخفت).
- **قائمة جوال ملء الشاشة** 100vw/100dvh خلفية معتمة صلبة، زر X واضح، روابط بـ staggered reveal، تركيز يُدار (focus trap بسيط + Esc + إعادة التركيز).
- **نموذج حجز/طلب**: label فوق الحقل، خطأ تحت الحقل، تحقّق عند الإرسال + مسح عند الكتابة، loading→summary→toast، يحفظ في localStorage، موسوم تجريبي.
- **lightbox** للمعرض (Esc/خلفية/زر تُغلق، تركيز يعود).

## 5) سبب الألوان/الخطوط
الأحمر هوية المطعم الفعلية (واجهته وديكوره أحمر صريح) فاتّخذناه لونًا واثقًا، مع تغميقه للنصوص (أبيض على `#DC2626`، أو نص فاتح على ink) لضمان التباين. الذهبي يضيف فخامة ودفء آسيوي، والكريمي يكسر القتامة في شريط الثقة. El Messiri عربي أنيق ذو طابع، Tajawal نظيف عالي القراءة على الجوال.

## 6) Accessibility
- التباين: أبيض/`#DC2626` ونص `--text-on-dark #F6EBE2` على `--ink #140A0A` و`--text-muted-dark #D8C3B6` (كلها ≥ 4.5:1)؛ على الكريمي استخدمنا `--text-on-light/#5C4039` و`--red-deep`.
- focus-visible (outline ذهبي 3px) على كل تفاعلي · skip-link · aria-labels لكل زر أيقونة · aria-modal/role=dialog للقائمة والـ lightbox · aria-live للـ toast والملخّص · تدرّج عناوين h1→h2→h3 بلا قفز · أيقونات SVG inline (لا emoji كأيقونات بنية) · أهداف لمس ≥ 44px · reduced-motion كامل.

## 7) iOS HIG / Touch
`min-h-[100dvh]` لا 100vh · safe scroll · أزرار pill ≥ 48px · ردّ ضغط `scale(.97)` خلال <160ms بلا إزاحة layout · select بـ inputmode/أنواع حقول دلالية (tel/date/time) لتشغيل الكيبورد الصحيح.

## 8) Impeccable / Taste (اختبار القبول §9)
فاخر؟ نعم — ووك سينمائي + ذهبي + مساحات تتنفّس. سعودي مناسب؟ نعم — عربي RTL محايد جندريًا (احجز/اطلب، لا احجزي/لكِ). يقنع خلال 3 ثوانٍ؟ الموشن + العنوان + الصورة فورًا. لا يشبه قالبًا؟ الموشن التوقيعي بصمة فريدة. تناسق؟ لون/شكل/ثيم مقفول، نظام مسافات 4/8، سلّم عناوين موحّد.

## نتائج الاختبار
22/22 Playwright (ديسكتوب + جوال): RTL، الهيرو، preloader، الموشن التوقيعي، التقييم الحقيقي، أطباق بلا أسعار، قائمة جوال ملء الشاشة، النموذج+localStorage، رابط الخرائط، لا تمرير أفقي عند 390px، lightbox.

## التحقّق من القواعد الصارمة
✅ RTL · ✅ نص محايد جندريًا · ✅ لا أسعار مخترعة (حسب القائمة) · ✅ كل `<img>` تشير لملف موجود + alt + أبعاد + lazy (غير الهيرو) · ✅ preloader ينتهي display:none + fallback · ✅ burger موجود + JS محروس · ✅ قائمة ملء الشاشة · ✅ scroll-reveal + fallback · ✅ موشن توقيعي مع reduced-motion fallback يُظهر الحالة النهائية · ✅ لا تمرير أفقي · ✅ لا node_modules/package.json · ✅ صور حقيقية فقط · ✅ بدون رقم مخترع (CTA = نموذج + خرائط + تابعنا).
