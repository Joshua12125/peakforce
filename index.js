const https = require("https");
const http = require("http");

const SAFE_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="robots" content="noindex, nofollow"/>
  <meta name="googlebot" content="noindex, nofollow"/>
  <title>PeakForce Labs | Premium Research Compounds</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#07090F;
      --bg2:#0A0D18;
      --bg3:#0E1220;
      --surface:rgba(255,255,255,0.04);
      --surface2:rgba(255,255,255,0.07);
      --border:rgba(255,255,255,0.07);
      --border2:rgba(255,255,255,0.12);
      --white:#FFFFFF;
      --off:rgba(255,255,255,0.88);
      --muted:rgba(255,255,255,0.45);
      --faint:rgba(255,255,255,0.22);
      --blue1:#1B3A6B;
      --blue2:#1A3360;
      --blue-glow:rgba(43,143,212,0.2);
      --blue3:rgba(43,143,212,0.08);
      --accent:#2B8FD4;
      --accent2:#1E7BBE;
      --accent-glow:rgba(43,143,212,0.22);
    }
    html{scroll-behavior:smooth}
    body{background:var(--bg);color:var(--off);font-family:'Plus Jakarta Sans',sans-serif;font-size:16px;line-height:1.65;-webkit-font-smoothing:antialiased;overflow-x:hidden}
    a{text-decoration:none;color:inherit}
    img{display:block;max-width:100%}

    /* ANN BAR */
    .ann{
      background:linear-gradient(90deg,var(--blue1),var(--accent));color:rgba(255,255,255,0.9);
      padding:10px 16px;
      font-family:'JetBrains Mono',monospace;
      font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;
      display:flex;align-items:center;justify-content:center;
      gap:24px;white-space:nowrap;overflow:hidden;position:relative;
    }

    .ann-track{
      display:inline-flex;align-items:center;gap:20px;
      white-space:nowrap;
      animation:ann-scroll 24s linear infinite;
      padding: 0 20px;
    }
    .ann-item{flex-shrink:0}
    .ann-sep{opacity:0.4;flex-shrink:0}
    @keyframes ann-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    .ann .sep{opacity:0.4}
    

    /* NAV */
    .nav{
      position:sticky;top:0;z-index:200;
      background:rgba(7,9,15,0.6);
      backdrop-filter:blur(40px) saturate(180%);
      -webkit-backdrop-filter:blur(40px) saturate(180%);
      border-bottom:1px solid var(--border);
      padding:0 6vw;
      display:flex;align-items:center;justify-content:space-between;
      height:68px;
      box-shadow:0 1px 0 rgba(255,255,255,0.04),0 4px 24px rgba(0,0,0,0.4);
    }
    .nav-logo{display:flex;align-items:center;gap:10px}
    .nav-brand{display:flex;align-items:center;}
    .nav-brand-name{font-size:17px;font-weight:800;color:var(--white);letter-spacing:-0.02em;}
    .nav-brand-accent{color:var(--accent);}
    .nav-links{display:flex;gap:24px;list-style:none;align-items:center}
    .nav-links a{font-size:12px;font-weight:500;color:var(--muted);letter-spacing:0.02em;transition:color 0.2s}
    .nav-links a:hover{color:var(--white)}
    .nav-cta{
      display:inline-flex;align-items:center;gap:8px;
      background:linear-gradient(135deg,var(--accent),var(--blue1));color:var(--white);
      font-size:12px;font-weight:700;letter-spacing:0.05em;
      padding:9px 20px;border-radius:100px;
      transition:opacity 0.2s,transform 0.15s,box-shadow 0.2s;
      box-shadow:0 0 24px var(--accent-glow);
    }
    .nav-cta:hover{opacity:0.9;transform:translateY(-1px);box-shadow:0 4px 32px var(--accent-glow)}
    .nav-mobile-cta{display:none;background:linear-gradient(135deg,var(--accent),var(--blue1));color:var(--white);padding:8px 16px;font-size:11px;font-weight:700;border-radius:100px}

    /* HERO */
    .hero{
      min-height:100vh;
      display:flex;flex-direction:column;justify-content:center;
      padding:100px 6vw 80px;
      position:relative;overflow:hidden;
    }
    .hero-mesh{
      position:absolute;inset:0;pointer-events:none;
      background:
        radial-gradient(ellipse 60% 50% at 80% 10%,rgba(43,143,212,0.14) 0%,transparent 55%),
        radial-gradient(ellipse 50% 60% at 5% 85%,rgba(27,58,107,0.2) 0%,transparent 55%),
        radial-gradient(ellipse 40% 40% at 50% 50%,rgba(43,143,212,0.06) 0%,transparent 65%);
    }
    .orb{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none}
    .orb-1{width:500px;height:500px;background:radial-gradient(circle,rgba(43,143,212,0.16),transparent 70%);top:-120px;right:-80px;animation:orb-float 16s ease-in-out infinite}
    .orb-2{width:350px;height:350px;background:radial-gradient(circle,rgba(27,58,107,0.25),transparent 70%);bottom:-80px;left:8%;animation:orb-float 12s ease-in-out infinite reverse}
    @keyframes orb-float{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(25px,-35px) scale(1.05)}66%{transform:translate(-20px,20px) scale(0.95)}}
    .hero-grid{position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);background-size:64px 64px;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent)}
    .hero-inner{position:relative;z-index:1;width:100%}

    .hero-pill{
      display:inline-flex;align-items:center;gap:10px;
      background:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.2);
      border-radius:100px;padding:8px 18px 8px 10px;
      margin-bottom:32px;width:fit-content;
      backdrop-filter:blur(12px);
      animation:fade-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s both;
    }
    .hero-pill-dot{width:7px;height:7px;border-radius:50%;background:var(--accent);box-shadow:0 0 10px var(--accent);animation:pulse 2s ease-in-out infinite}
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.7)}}
    .hero-pill-text{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:var(--accent)}

    .hero-h{
      font-size:clamp(56px,9vw,130px);
      font-weight:800;line-height:0.92;
      letter-spacing:-0.04em;color:var(--white);
      margin-bottom:32px;width:100%;
      animation:fade-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s both;
    }
    .hero-h .accent{
      background:linear-gradient(135deg,#5BADE8 0%,#2B8FD4 60%,#1B3A6B 100%);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    }
    .hero-h .ghost{-webkit-text-stroke:1.5px rgba(255,255,255,0.15);-webkit-text-fill-color:transparent}

    .hero-sub{font-size:18px;color:var(--muted);line-height:1.8;max-width:100%;font-weight:300;margin-bottom:48px;animation:fade-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.35s both}

    .hero-btns{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:60px;animation:fade-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.45s both}
    .btn-primary{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--accent),var(--blue1));color:var(--white);font-size:13px;font-weight:700;letter-spacing:0.05em;padding:15px 32px;border-radius:100px;transition:opacity 0.2s,transform 0.2s,box-shadow 0.2s;box-shadow:0 0 40px var(--accent-glow)}
    .btn-primary:hover{opacity:0.9;transform:translateY(-2px);box-shadow:0 8px 48px var(--accent-glow)}
    .btn-ghost{display:inline-flex;align-items:center;gap:8px;background:var(--surface);color:var(--off);font-size:13px;font-weight:500;padding:15px 28px;border-radius:100px;border:1px solid var(--border2);backdrop-filter:blur(16px);transition:background 0.2s,border-color 0.2s}
    .btn-ghost:hover{background:var(--surface2);border-color:rgba(255,255,255,0.18)}

    .hero-stats{
      display:grid;grid-template-columns:repeat(4,1fr);
      width:100%;max-width:860px;
      background:var(--surface);backdrop-filter:blur(24px);border:1px solid var(--border2);
      border-radius:20px;overflow:hidden;
      box-shadow:inset 0 1px 0 rgba(255,255,255,0.07),0 8px 32px rgba(0,0,0,0.3);
      animation:fade-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.55s both;
    }
    .hstat{padding:20px 24px;border-right:1px solid var(--border);text-align:center}
    .hstat:last-child{border-right:none}
    .hstat-n{font-family:'JetBrains Mono',monospace;font-size:24px;font-weight:500;background:linear-gradient(135deg,#5BADE8,var(--accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;margin-bottom:5px}
    .hstat-l{font-size:9px;color:var(--faint);letter-spacing:0.12em;text-transform:uppercase;font-family:'JetBrains Mono',monospace}

    @keyframes fade-up{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}

    /* MARQUEE */
    .marquee-wrap{border-top:1px solid var(--border);border-bottom:1px solid var(--border);overflow:hidden;padding:12px 0;position:relative;background:var(--bg2)}
    .marquee-wrap::before,.marquee-wrap::after{content:"";position:absolute;top:0;bottom:0;width:100px;z-index:2;pointer-events:none}
    .marquee-wrap::before{left:0;background:linear-gradient(to right,var(--bg2),transparent)}
    .marquee-wrap::after{right:0;background:linear-gradient(to left,var(--bg2),transparent)}
    .marquee-track{display:inline-flex;animation:mq 30s linear infinite;white-space:nowrap}
    .mq-item{display:inline-flex;align-items:center;gap:10px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:var(--faint);padding:0 36px}
    .mq-dot{width:3px;height:3px;border-radius:50%;background:var(--accent);flex-shrink:0}
    @keyframes mq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

    /* SHARED */
    .section{padding:100px 6vw}
    .s-border{border-top:1px solid var(--border)}
    .s-dark2{background:var(--bg2)}
    .eyebrow{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:var(--accent);margin-bottom:16px;display:flex;align-items:center;gap:10px}
    .eyebrow::before{content:"";width:16px;height:1px;background:var(--accent)}
    .sh{font-size:clamp(28px,4vw,54px);font-weight:800;line-height:1.05;letter-spacing:-0.03em;color:var(--white);margin-bottom:18px}
    .sh em{font-style:normal;background:linear-gradient(135deg,#2B8FD4,#1B3A6B);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .sl{font-size:15px;color:var(--muted);line-height:1.82;max-width:580px;font-weight:300}

    /* STANDARDS */
    .std-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:56px}
    .std-card{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:36px 28px;position:relative;overflow:hidden;transition:border-color 0.3s,background 0.3s,transform 0.3s;backdrop-filter:blur(12px)}
    .std-card::before{content:"";position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--accent),transparent);opacity:0;transition:opacity 0.3s}
    .std-card:hover{border-color:rgba(249,115,22,0.25);background:var(--surface2);transform:translateY(-4px)}
    .std-card:hover::before{opacity:1}
    .std-num{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--accent);letter-spacing:0.14em;margin-bottom:16px;opacity:0.6}
    .std-ico{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,rgba(249,115,22,0.15),rgba(249,115,22,0.05));border:1px solid rgba(249,115,22,0.2);display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:18px}
    .std-title{font-size:17px;font-weight:700;color:var(--white);margin-bottom:10px;line-height:1.2}
    .std-body{font-size:13px;color:var(--muted);line-height:1.75;font-weight:300}

    /* STAT STRIP */
    .stat-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);margin-top:12px;border-radius:20px;overflow:hidden}
    .stat-cell{background:var(--surface);padding:32px 24px;text-align:center;transition:background 0.2s;backdrop-filter:blur(8px)}
    .stat-cell:hover{background:var(--surface2)}
    .stat-n{font-family:'JetBrains Mono',monospace;font-size:34px;font-weight:500;line-height:1;margin-bottom:8px;background:linear-gradient(135deg,var(--accent),#5BADE8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
    .stat-l{font-size:10px;color:var(--faint);letter-spacing:0.12em;text-transform:uppercase;font-family:'JetBrains Mono',monospace}

    /* QUALITY */
    .qual-layout{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:start;margin-top:56px}
    .qual-list{display:flex;flex-direction:column}
    .qual-item{display:flex;gap:18px;padding:26px 0;border-bottom:1px solid var(--border)}
    .qual-item:first-child{border-top:1px solid var(--border)}
    .qual-item:hover .qual-n{background:var(--accent);color:#000;border-color:var(--accent);box-shadow:0 0 16px var(--accent-glow)}
    .qual-n{width:36px;height:36px;flex-shrink:0;border:1px solid var(--border2);border-radius:10px;font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--faint);display:flex;align-items:center;justify-content:center;margin-top:2px;transition:all 0.25s}
    .qual-title{font-size:15px;font-weight:700;color:var(--white);margin-bottom:6px;letter-spacing:-0.01em}
    .qual-body{font-size:13px;color:var(--muted);line-height:1.75;font-weight:300}

    .coa-panel{position:sticky;top:90px}
    .coa-box{background:var(--surface);border:1px solid var(--border2);border-radius:20px;overflow:hidden;backdrop-filter:blur(20px);box-shadow:inset 0 1px 0 rgba(255,255,255,0.07),0 24px 64px rgba(0,0,0,0.4)}
    .coa-head{background:linear-gradient(135deg,var(--blue1),var(--accent));color:var(--white);padding:16px 24px;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;display:flex;align-items:center;gap:8px}
    .coa-row{display:flex;justify-content:space-between;align-items:center;padding:13px 24px;border-bottom:1px solid var(--border);font-size:13px}
    .coa-row:last-child{border-bottom:none}
    .coa-lbl{color:var(--muted);font-size:12px}
    .coa-val{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--accent);letter-spacing:0.06em;font-weight:500}
    .coa-note{padding:16px 24px;font-size:12px;color:var(--faint);line-height:1.7;font-weight:300;border-top:1px solid var(--border)}

    /* REVIEWS */
    .testi-bento{display:grid;grid-template-columns:repeat(12,1fr);gap:12px;margin-top:56px}
    .tc{border-radius:20px;padding:30px 26px;position:relative;overflow:hidden;border:1px solid var(--border);transition:border-color 0.3s,transform 0.3s,background 0.3s;background:var(--surface);backdrop-filter:blur(14px)}
    .tc:hover{transform:translateY(-4px);border-color:rgba(249,115,22,0.2);background:var(--surface2)}
    .tc-a{grid-column:span 5;background:linear-gradient(135deg,rgba(27,58,107,0.5),rgba(43,143,212,0.15))}
    .tc-b{grid-column:span 7}
    .tc-c{grid-column:span 4}
    .tc-d{grid-column:span 4;background:linear-gradient(135deg,rgba(27,58,107,0.4),rgba(43,143,212,0.1))}
    .tc-e{grid-column:span 4}
    .tc-f{grid-column:span 12;background:linear-gradient(135deg,rgba(27,58,107,0.5),rgba(43,143,212,0.15));display:flex;align-items:center;gap:40px;padding:36px 44px}
    .tc-quote{font-size:72px;line-height:0.8;font-weight:800;color:var(--accent);flex-shrink:0;opacity:0.4}
    .tc-stars{display:flex;gap:3px;margin-bottom:14px}
    .tc-star{width:7px;height:7px;border-radius:50%;background:var(--accent)}
    .tc-body{font-size:14px;line-height:1.75;color:var(--muted);margin-bottom:20px;font-weight:300}
    .tc-footer{display:flex;align-items:center;gap:10px}
    .tc-av{width:32px;height:32px;border-radius:50%;background:var(--accent-glow);border:1px solid rgba(249,115,22,0.3);display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--accent);flex-shrink:0}
    .tc-name{font-size:12px;font-weight:600;color:var(--white)}
    .tc-role{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:var(--faint);margin-top:2px}
    .tc-f-body{flex:1;font-size:16px;line-height:1.72;color:rgba(255,255,255,0.7);font-weight:300}
    .tc-f-right{flex:0 0 160px;text-align:right}
    .tc-f-name{font-size:12px;font-weight:600;color:var(--white)}
    .tc-f-role{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:var(--faint);margin-top:3px}
    .tc-badge{display:inline-flex;align-items:center;gap:5px;margin-top:12px;background:var(--blue3);border:1px solid rgba(249,115,22,0.2);padding:4px 12px;border-radius:100px;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent)}

    /* FAQ */
    .faq-layout{display:grid;grid-template-columns:280px 1fr;gap:72px;align-items:start;margin-top:56px}
    .faq-left p{font-size:14px;color:var(--muted);line-height:1.82;font-weight:300;margin-top:14px}
    .faq-contact{margin-top:28px;padding:24px;background:var(--surface);border:1px solid var(--border2);border-radius:16px;backdrop-filter:blur(16px)}
    .fc-l{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent);margin-bottom:3px}
    .fc-v{font-size:13px;font-weight:500;color:var(--white);margin-bottom:12px}
    .fc-v:last-child{margin-bottom:0}
    .faq-list{display:flex;flex-direction:column;gap:8px}
    .faq-item{background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;transition:border-color 0.2s;backdrop-filter:blur(12px)}
    .faq-item.open{border-color:rgba(249,115,22,0.3)}
    .faq-q{padding:19px 22px;font-size:14px;font-weight:500;color:var(--off);cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:14px;user-select:none}
    .faq-q:hover{color:var(--white)}
    .faq-chev{font-size:13px;color:var(--faint);transition:transform 0.3s,color 0.2s;flex-shrink:0}
    .faq-item.open .faq-chev{transform:rotate(180deg);color:var(--accent)}
    .faq-a{display:none;padding:0 22px 18px;font-size:13px;color:var(--muted);line-height:1.82;font-weight:300}
    .faq-item.open .faq-a{display:block}

    /* CTA */
    .cta-band{padding:100px 6vw;text-align:center;position:relative;overflow:hidden;background:var(--bg2)}
    .cta-band::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 60% 80% at 50% 50%,rgba(43,143,212,0.1) 0%,transparent 65%);pointer-events:none}
    .cta-band h2{font-size:clamp(32px,4.5vw,62px);font-weight:800;color:var(--white);letter-spacing:-0.03em;line-height:1.06;margin-bottom:14px;position:relative;z-index:1}
    .cta-band h2 span{background:linear-gradient(135deg,#2B8FD4,#1B3A6B);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .cta-band p{font-size:15px;color:var(--muted);margin-bottom:36px;font-weight:300;position:relative;z-index:1}
    .cta-btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;position:relative;z-index:1}

    /* FOOTER */
    footer{background:var(--bg);padding:72px 6vw 28px;border-top:1px solid var(--border)}
    .footer-top{display:flex;align-items:center;gap:12px;margin-bottom:52px}
    .footer-line{flex:1;height:1px;background:linear-gradient(to right,rgba(43,143,212,0.4),transparent)}
    .footer-line-r{flex:1;height:1px;background:linear-gradient(to left,rgba(43,143,212,0.4),transparent)}
    .footer-tag{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:var(--accent)}
    .footer-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:48px;margin-bottom:48px}
    .footer-brand-name{font-size:16px;font-weight:800;color:var(--white);letter-spacing:-0.02em;margin-bottom:14px}
    .footer-brand-name span{color:var(--accent)}
    .footer-tagline{font-size:13px;color:rgba(255,255,255,0.65);line-height:1.7;font-weight:300;margin-bottom:10px;}
    .footer-col h4{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:var(--white);margin-bottom:18px;}
    .footer-col ul{list-style:none;display:flex;flex-direction:column;gap:10px}
    .footer-col ul a{font-size:13px;color:rgba(255,255,255,0.6);transition:color 0.2s;font-weight:300;}
    .footer-col ul a:hover{color:var(--accent);opacity:1}
    .footer-div{border:none;border-top:1px solid var(--border);margin-bottom:22px}
    .footer-bottom{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:14px}
    .footer-legal{font-size:11px;color:rgba(255,255,255,0.4);line-height:1.65;max-width:620px;font-weight:300;}
    .footer-copy{font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(255,255,255,0.4);letter-spacing:0.06em;white-space:nowrap}

    /* ANIMATIONS */
    .reveal{opacity:0;transform:translateY(28px);transition:opacity 0.75s cubic-bezier(0.22,1,0.36,1),transform 0.75s cubic-bezier(0.22,1,0.36,1)}
    .reveal.visible{opacity:1;transform:translateY(0)}
    .rd1{transition-delay:0.08s}.rd2{transition-delay:0.16s}.rd3{transition-delay:0.24s}.rd4{transition-delay:0.32s}.rd5{transition-delay:0.40s}

    /* RESPONSIVE */
    @media(max-width:1100px){
      .std-grid{grid-template-columns:1fr 1fr}
      .stat-strip{grid-template-columns:1fr 1fr}
      .qual-layout{grid-template-columns:1fr;gap:48px}
      .coa-panel{position:static}
      .faq-layout{grid-template-columns:1fr;gap:40px}
      .footer-grid{grid-template-columns:1fr 1fr}
      .testi-bento{grid-template-columns:1fr 1fr}
      .tc-a,.tc-b,.tc-c,.tc-d,.tc-e,.tc-f{grid-column:span 1}
      .tc-f{flex-direction:column;gap:20px;padding:28px}
      .tc-f-right{text-align:left}
    }
    @media(max-width:860px){
      .nav-links{display:none}
      .nav-mobile-cta{display:block}
      .std-grid,.testi-bento{grid-template-columns:1fr}
    }
    @media(max-width:600px){
      .hero{padding:72px 5vw 56px}
      .section{padding:72px 5vw}
      .hero-stats{grid-template-columns:1fr 1fr}
      .hstat:nth-child(2){border-right:none}
      .hstat:nth-child(3){border-top:1px solid var(--border)}
      .hstat:nth-child(4){border-top:1px solid var(--border)}
      .footer-grid{grid-template-columns:1fr;gap:32px}
      .stat-strip{grid-template-columns:1fr 1fr}
    }
    @media(prefers-reduced-motion:reduce){.reveal{transition:none}.orb{animation:none}.marquee-track{animation:none}.ann::after{animation:none}}
  </style>
</head>
<body>

<!-- ANN BAR -->
<div class="ann">
  <div class="ann-track">
    <span class="ann-item">&#x1F9EA; Six independent tests per batch &mdash; purity, identity, endotoxins, sterility &amp; more</span>
    <span class="ann-sep">&#x2022;</span>
    <span class="ann-item">&#x1F1FA;&#x1F1F8; US-only shipping &mdash; fast &amp; tracked</span>
    <span class="ann-sep">&#x2022;</span>
    <span class="ann-item">&#x1F4C4; COA on every batch</span>
    <span class="ann-sep">&#x2022;</span>
    <span class="ann-item">&#x1F9EA; Six independent tests per batch &mdash; purity, identity, endotoxins, sterility &amp; more</span>
    <span class="ann-sep">&#x2022;</span>
    <span class="ann-item">&#x1F1FA;&#x1F1F8; US-only shipping &mdash; fast &amp; tracked</span>
    <span class="ann-sep">&#x2022;</span>
    <span class="ann-item">&#x1F4C4; COA on every batch</span>
    <span class="ann-sep">&#x2022;</span>
  </div>
</div>

<!-- NAV -->
<nav class="nav">
  <div class="nav-brand">
    <span class="nav-brand-name">Peak<span class="nav-brand-accent">Force</span> Labs</span>
  </div>
  <ul class="nav-links">
    <li><a href="#standards">Standards</a></li>
    <li><a href="#quality">Quality</a></li>
    <li><a href="#reviews">Reviews</a></li>
    <li><a href="#faq">FAQ</a></li>
    <li></li>
  </ul>
  
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-mesh"></div>
  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>
  <div class="hero-grid"></div>
  <div class="hero-inner">
    <div class="hero-pill"><div class="hero-pill-dot"></div><div class="hero-pill-text">Premium Research Compounds &mdash; USA</div></div>
    <h1 class="hero-h">
      <span class="accent">Research-grade.</span><br>
      Six-point tested.<br>
      <span class="ghost">Uncompromising.</span>
    </h1>
    <p class="hero-sub">Premium research peptides and compounds synthesized, assayed, and documented to a single standard. Six independent tests. Certificate of Analysis on every batch. For research use only.</p>
    
    <div class="hero-stats">
      <div class="hstat"><div class="hstat-n">6</div><div class="hstat-l">Tests per batch</div></div>
      <div class="hstat"><div class="hstat-n">99%+</div><div class="hstat-l">Purity standard</div></div>
      <div class="hstat"><div class="hstat-n">COA</div><div class="hstat-l">Every lot</div></div>
      <div class="hstat"><div class="hstat-n">USA</div><div class="hstat-l">Domestic shipping</div></div>
    </div>
  </div>
</section>

<!-- MARQUEE -->
<div class="marquee-wrap">
  <div class="marquee-track">
    <span class="mq-item">Six Independent Tests<span class="mq-dot"></span></span>
    <span class="mq-item">Identity &amp; Purity<span class="mq-dot"></span></span>
    <span class="mq-item">Endotoxin Testing<span class="mq-dot"></span></span>
    <span class="mq-item">Sterility Verified<span class="mq-dot"></span></span>
    <span class="mq-item">Heavy Metals Screened<span class="mq-dot"></span></span>
    <span class="mq-item">COA Every Batch<span class="mq-dot"></span></span>
    <span class="mq-item">99%+ Purity<span class="mq-dot"></span></span>
    <span class="mq-item">USA Domestic Shipping<span class="mq-dot"></span></span>
    <span class="mq-item">Research Use Only<span class="mq-dot"></span></span>
    <span class="mq-item">Six Independent Tests<span class="mq-dot"></span></span>
    <span class="mq-item">Identity &amp; Purity<span class="mq-dot"></span></span>
    <span class="mq-item">Endotoxin Testing<span class="mq-dot"></span></span>
    <span class="mq-item">Sterility Verified<span class="mq-dot"></span></span>
    <span class="mq-item">Heavy Metals Screened<span class="mq-dot"></span></span>
    <span class="mq-item">COA Every Batch<span class="mq-dot"></span></span>
    <span class="mq-item">99%+ Purity<span class="mq-dot"></span></span>
    <span class="mq-item">USA Domestic Shipping<span class="mq-dot"></span></span>
    <span class="mq-item">Research Use Only<span class="mq-dot"></span></span>
  </div>
</div>

<!-- STANDARDS -->
<section class="section s-border" id="standards">
  <div class="eyebrow">Research Standards</div>
  <h2 class="sh reveal">Six tests. Every batch.<br><em>Zero exceptions.</em></h2>
  <p class="sl">Every batch is evaluated for identity, purity, net content, endotoxins, sterility, and heavy metals. Not some batches — every single one.</p>

  <div class="std-grid">
    <div class="std-card reveal rd1">
      <div class="std-num">01</div>
      <div class="std-ico">&#x1F50D;</div>
      <div class="std-title">Identity Verification</div>
      <p class="std-body">LC-MS/MS analysis confirms the compound is exactly what the label states. No substitution, no mislabeling, no ambiguity — verified identity on every lot.</p>
    </div>
    <div class="std-card reveal rd2">
      <div class="std-num">02</div>
      <div class="std-ico">&#x1F9EA;</div>
      <div class="std-title">Purity Assessment</div>
      <p class="std-body">HPLC chromatography measures exact purity — typically exceeding 99%. Exact results are published in the batch-specific COA, not averaged or estimated.</p>
    </div>
    <div class="std-card reveal rd3">
      <div class="std-num">03</div>
      <div class="std-ico">&#x2696;&#xFE0F;</div>
      <div class="std-title">Net Content</div>
      <p class="std-body">Precise gravimetric and volumetric confirmation that each vial contains exactly what the label states. Critical for reproducible research protocols.</p>
    </div>
    <div class="std-card reveal rd4">
      <div class="std-num">04</div>
      <div class="std-ico">&#x1F6AB;</div>
      <div class="std-title">Endotoxin Testing</div>
      <p class="std-body">LAL (Limulus Amebocyte Lysate) testing screens for bacterial endotoxins. A standard often skipped by competitors — not by PeakForce Labs.</p>
    </div>
    <div class="std-card reveal rd5">
      <div class="std-num">05</div>
      <div class="std-ico">&#x1F9B2;</div>
      <div class="std-title">Sterility</div>
      <p class="std-body">Microbiological sterility testing confirms the absence of viable microbial contamination — a standard rarely applied at this category of research supply.</p>
    </div>
    <div class="std-card reveal rd1">
      <div class="std-num">06</div>
      <div class="std-ico">&#x26A0;&#xFE0F;</div>
      <div class="std-title">Heavy Metals Screen</div>
      <p class="std-body">ICP-MS analysis screens for toxic elemental impurities including lead, arsenic, mercury, and cadmium. The sixth test that separates rigorous from adequate.</p>
    </div>
  </div>

  <div class="stat-strip reveal" style="margin-top:12px;">
    <div class="stat-cell"><div class="stat-n">6</div><div class="stat-l">Independent tests per batch</div></div>
    <div class="stat-cell"><div class="stat-n">99%+</div><div class="stat-l">Purity standard</div></div>
    <div class="stat-cell"><div class="stat-n">100%</div><div class="stat-l">Batches with COA</div></div>
    <div class="stat-cell"><div class="stat-n">0</div><div class="stat-l">Therapeutic claims</div></div>
  </div>
</section>

<!-- QUALITY -->
<section class="section s-border s-dark2" id="quality">
  <div class="eyebrow">Quality Process</div>
  <h2 class="sh reveal">Documented from<br><em>synthesis to dispatch.</em></h2>
  <p class="sl">Every step of our supply chain is documented, traceable, and verifiable. From sourcing through independent testing to COA publication — nothing is assumed.</p>

  <div class="qual-layout">
    <div class="qual-list">
      <div class="qual-item reveal rd1">
        <div class="qual-n">01</div>
        <div><div class="qual-title">Sourcing &amp; Synthesis</div><p class="qual-body">Research compounds are sourced from verified synthesis partners with documented quality management systems. Full chain-of-custody traceability from synthesis to our facility.</p></div>
      </div>
      <div class="qual-item reveal rd2">
        <div class="qual-n">02</div>
        <div><div class="qual-title">Six-Point Independent Testing</div><p class="qual-body">Every batch is submitted to accredited US laboratories for the full six-test panel: identity, purity, net content, endotoxins, sterility, and heavy metals. Results are not edited or cherry-picked.</p></div>
      </div>
      <div class="qual-item reveal rd3">
        <div class="qual-n">03</div>
        <div><div class="qual-title">COA Publication</div><p class="qual-body">Certificates of Analysis are published on the product page and available for download before and after purchase. Lot numbers map directly to corresponding COA records on file.</p></div>
      </div>
      <div class="qual-item reveal rd4">
        <div class="qual-n">04</div>
        <div><div class="qual-title">Research-Use Labeling</div><p class="qual-body">All materials are clearly labeled for research use only. No medical, therapeutic, or health claims are made at any stage — on product pages, in documentation, or in marketing.</p></div>
      </div>
      <div class="qual-item reveal rd5">
        <div class="qual-n">05</div>
        <div><div class="qual-title">USA Dispatch</div><p class="qual-body">Orders ship domestically from our US facility. Fast, tracked shipping only. No international orders — consistent with our commitment to responsible, verifiable supply chains.</p></div>
      </div>
    </div>

    <div class="coa-panel reveal rd2">
      <div class="coa-box">
        <div class="coa-head">&#x1F4CB; Six-Point Test Panel</div>
        <div class="coa-row"><span class="coa-lbl">Identity</span><span class="coa-val">LC-MS/MS</span></div>
        <div class="coa-row"><span class="coa-lbl">Purity</span><span class="coa-val">HPLC &ge;99%</span></div>
        <div class="coa-row"><span class="coa-lbl">Net Content</span><span class="coa-val">Gravimetric</span></div>
        <div class="coa-row"><span class="coa-lbl">Endotoxins</span><span class="coa-val">LAL Testing</span></div>
        <div class="coa-row"><span class="coa-lbl">Sterility</span><span class="coa-val">Microbiological</span></div>
        <div class="coa-row"><span class="coa-lbl">Heavy Metals</span><span class="coa-val">ICP-MS</span></div>
        <div class="coa-row"><span class="coa-lbl">Lab Type</span><span class="coa-val">Accredited US Labs</span></div>
        <div class="coa-note">Certificates available on every product page. Download by lot number before or after purchase.</div>
      </div>
      <div style="margin-top:12px;">
        
      </div>
    </div>
  </div>
</section>

<!-- REVIEWS -->
<section class="section s-border" id="reviews">
  <div class="eyebrow">Researcher Feedback</div>
  <h2 class="sh reveal">Trusted by<br><em>serious researchers.</em></h2>
  <p class="sl">Verified feedback from researchers who rely on PeakForce Labs for documentation quality, compound integrity, and service consistency.</p>

  <div class="testi-bento">
    <div class="tc tc-a reveal rd1">
      <div class="tc-stars"><span class="tc-star"></span><span class="tc-star"></span><span class="tc-star"></span><span class="tc-star"></span><span class="tc-star"></span></div>
      <p class="tc-body">"Great product, great pricing, lab tested with COA, and fast shipping. I will most definitely be a repeat customer. The six-test panel is genuinely impressive."</p>
      <div class="tc-footer"><div class="tc-av">ZK</div><div><div class="tc-name">Zack K.</div><div class="tc-role">Verified Researcher</div></div></div>
    </div>
    <div class="tc tc-b reveal rd2">
      <div class="tc-stars"><span class="tc-star"></span><span class="tc-star"></span><span class="tc-star"></span><span class="tc-star"></span><span class="tc-star"></span></div>
      <p class="tc-body">"I've placed a couple of orders and what has impressed me most is that they answer emails immediately — it's a real person. Products are high quality with COAs on the website and shipping is very fast."</p>
      <div class="tc-footer"><div class="tc-av">JM</div><div><div class="tc-name">Jennifer M.</div><div class="tc-role">Research Lab Customer</div></div></div>
    </div>
    <div class="tc tc-c reveal rd3">
      <div class="tc-stars"><span class="tc-star"></span><span class="tc-star"></span><span class="tc-star"></span><span class="tc-star"></span><span class="tc-star"></span></div>
      <p class="tc-body">"Shipping was quick. Product is accurate as described. Definitely will be a repeat customer. The COA matched every specification."</p>
      <div class="tc-footer"><div class="tc-av">AM</div><div><div class="tc-name">Amanda R.</div><div class="tc-role">Independent Researcher</div></div></div>
    </div>
    <div class="tc tc-d reveal rd4">
      <div class="tc-stars"><span class="tc-star"></span><span class="tc-star"></span><span class="tc-star"></span><span class="tc-star"></span><span class="tc-star"></span></div>
      <p class="tc-body">"Easy to order, quick delivery, and the documentation is exactly what you need for serious research. Nothing is hidden, everything is on the COA."</p>
      <div class="tc-footer"><div class="tc-av">WB</div><div><div class="tc-name">William B.</div><div class="tc-role">Lab Researcher</div></div></div>
    </div>
    <div class="tc tc-e reveal rd5">
      <div class="tc-stars"><span class="tc-star"></span><span class="tc-star"></span><span class="tc-star"></span><span class="tc-star"></span><span class="tc-star"></span></div>
      <p class="tc-body">"Support team understands the material and responds with substance, not templates. Rare for this category. PeakForce is my go-to source for documented research compounds."</p>
      <div class="tc-footer"><div class="tc-av">LV</div><div><div class="tc-name">Leyvina V.</div><div class="tc-role">Research Affiliate</div></div></div>
    </div>
    <div class="tc tc-f reveal">
      <div class="tc-quote">&ldquo;</div>
      <div class="tc-f-body">Amazon-fast shipping, real people answering emails, COAs on the website, and quality that actually holds up in our lab's own verification. I am a customer for life. This is why we do what we do.</div>
      <div class="tc-f-right">
        <div class="tc-stars" style="justify-content:flex-end;"><span class="tc-star"></span><span class="tc-star"></span><span class="tc-star"></span><span class="tc-star"></span><span class="tc-star"></span></div>
        <div class="tc-f-name">Brooke R.</div>
        <div class="tc-f-role">Verified Customer</div>
        <div class="tc-badge">&#x2713; Verified Purchase</div>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="section s-border s-dark2" id="faq">
  <div class="eyebrow">FAQ</div>
  <h2 class="sh reveal">Common<br><em>questions.</em></h2>
  <div class="faq-layout">
    <div class="faq-left reveal">
      <p>Everything you need to know about our testing standards, COAs, ordering, and compliance approach.</p>
      <div class="faq-contact">
        <div class="fc-l">Website</div>
        <div class="fc-v">peakforcelabs.com</div>
        <div class="fc-l">Support</div>
        <div class="fc-v">Responds within 1 business day</div>
        <div class="fc-l">Shipping</div>
        <div class="fc-v" style="margin-bottom:0;">USA only &mdash; fast &amp; tracked</div>
      </div>
    </div>
    <div class="faq-list reveal rd2">
      <div class="faq-item">
        <div class="faq-q" onclick="toggleFaq(this)"><span>What six tests does every batch undergo?</span><span class="faq-chev">&#9662;</span></div>
        <div class="faq-a">Every batch is tested for: (1) Identity via LC-MS/MS, (2) Purity via HPLC, (3) Net content via gravimetric analysis, (4) Endotoxins via LAL testing, (5) Sterility via microbiological testing, and (6) Heavy metals via ICP-MS. All results are published in the batch-specific Certificate of Analysis.</div>
      </div>
      <div class="faq-item">
        <div class="faq-q" onclick="toggleFaq(this)"><span>Where can I find the Certificate of Analysis?</span><span class="faq-chev">&#9662;</span></div>
        <div class="faq-a">Every product page includes a downloadable COA specific to the current batch. COAs are also accessible via our dedicated COA library. If you cannot locate the COA for your lot number, contact our support team directly with your batch number.</div>
      </div>
      <div class="faq-item">
        <div class="faq-q" onclick="toggleFaq(this)"><span>Are these products for human use?</span><span class="faq-chev">&#9662;</span></div>
        <div class="faq-a">No. All products sold by PeakForce Labs are for laboratory and in-vitro research purposes only. They are not approved by the FDA for human or animal use and must not be used for consumption, treatment, or diagnostic purposes. Purchasers must be at least 18 years of age and legally able to purchase research materials in their jurisdiction.</div>
      </div>
      <div class="faq-item">
        <div class="faq-q" onclick="toggleFaq(this)"><span>Do you ship internationally?</span><span class="faq-chev">&#9662;</span></div>
        <div class="faq-a">No. PeakForce Labs ships within the United States only. This is a deliberate compliance decision. All orders are dispatched from our US facility with full tracking.</div>
      </div>
      <div class="faq-item">
        <div class="faq-q" onclick="toggleFaq(this)"><span>Can you provide medical or dosing guidance?</span><span class="faq-chev">&#9662;</span></div>
        <div class="faq-a">No. For compliance reasons, we cannot provide medical, dosing, or usage advice of any kind. Our support team is available to assist with product specifications, handling, COA documentation, and general order inquiries only.</div>
      </div>
      <div class="faq-item">
        <div class="faq-q" onclick="toggleFaq(this)"><span>What is your purity standard?</span><span class="faq-chev">&#9662;</span></div>
        <div class="faq-a">Our peptides are manufactured to high purity standards, typically exceeding 99%. Exact purity levels for each batch are confirmed by HPLC and listed in the corresponding COA. We do not publish averaged or estimated purity — only actual batch-specific results.</div>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<div class="cta-band">
  <h2>Six tests. Every batch.<br><span>Zero compromise.</span></h2>
  <p>Premium research compounds. Independent lab verified. USA domestic shipping. For research use only.</p>
  
</div>

<!-- FOOTER -->
<footer>
  <div class="footer-top">
    <div class="footer-line"></div>
    <div class="footer-tag">PeakForce Labs</div>
    <div class="footer-line-r"></div>
  </div>
  <div class="footer-grid">
    <div>
      <img src="data:image/png;base64,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" alt="PeakForce Labs" style="height:48px;width:auto;object-fit:contain;display:block;margin-bottom:16px;"/>
      <p class="footer-tagline">Premium research peptides and compounds. Six-point tested. COA on every batch. US domestic shipping only.</p>
    </div>
    <div class="footer-col">
      <h4>Research</h4>
      <ul>
        <li><a href="#">Shop All Compounds</a></li>
        <li><a href="#">COA Library</a></li>
        <li><a href="#">Testing Standards</a></li>
        <li><a href="#">Research Blog</a></li>
        <li><a href="#">FAQ</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Legal</h4>
      <ul>
        <li><a href="#">Terms &amp; Conditions</a></li>
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Shipping Policy</a></li>
        <li><a href="#">Research-Use Disclaimer</a></li>
        <li><a href="#">Contact Support</a></li>
      </ul>
    </div>
  </div>
  <hr class="footer-div"/>
  <div class="footer-bottom">
    <p class="footer-legal">All products sold by PeakForce Labs are intended solely for in-vitro laboratory research use. They are not approved by the FDA for human, veterinary, or cosmetic use and must not be used for consumption, treatment, or diagnostic purposes. Purchasers must be at least 18 years of age and legally able to purchase research materials in their jurisdiction.</p>
    <div class="footer-copy">&copy; 2026 PeakForce Labs. All rights reserved.</div>
  </div>
</footer>

<script>
  function toggleFaq(el) {
    var item = el.parentElement;
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(function(i) { i.classList.remove('open'); });
    if (!isOpen) item.classList.add('open');
  }
  (function() {
    var els = document.querySelectorAll('.reveal');
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    els.forEach(function(el) { obs.observe(el); });
  })();
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', function() {
    var current = '';
    sections.forEach(function(s) { if (window.scrollY >= s.offsetTop - 90) current = s.id; });
    navLinks.forEach(function(a) { a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : ''; });
  });
</script>
</body>
</html>
`;

const TS_ID  = "900661405756971";
const TS_TOK = "3885d2d93d";
const TS_URL = "http://198.211.101.164/v2/logic/cloaker";

function getHeaders(req) {
  const headers = {};
  // Mirror $_SERVER variables
  headers["HTTP_USER_AGENT"]  = req.headers["user-agent"] || "";
  headers["HTTP_REFERER"]     = req.headers["referer"] || "";
  headers["HTTP_ACCEPT_LANGUAGE"] = req.headers["accept-language"] || "";
  headers["REMOTE_ADDR"]      = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "";
  headers["REQUEST_URI"]      = req.url || "/";
  headers["HTTP_HOST"]        = req.headers["host"] || "";
  headers["HTTPS"]            = "on";
  headers["TS-BHDNR-74191"]   = TS_ID;
  headers["TS-BHDNR-74194"]   = TS_TOK;
  return headers;
}

function tsRequest(payload) {
  return new Promise((resolve) => {
    const body = new URLSearchParams({ headers: payload }).toString();
    const req = http.request(TS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(body),
        "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36"
      }
    }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { resolve(null); }
      });
    });
    req.on("error", () => resolve(null));
    req.setTimeout(4000, () => { req.destroy(); resolve(null); });
    req.write(body);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  // TrafficShield ping check
  if (req.query && req.query["TS-BHDNR-84848"] !== undefined) {
    res.status(200).send(TS_TOK);
    return;
  }

  const headers   = getHeaders(req);
  const payload   = Buffer.from(JSON.stringify(headers)).toString("base64");
  const response  = await tsRequest(payload);

  if (response && response.zrc && response.zrc.length > 0) {
    // Bot/reviewer — show what TrafficShield says
    const content = Buffer.from(response.zrc, "base64").toString("utf8");
    res.status(200).send(content);
  } else if (response && response.url) {
    // Redirect
    res.redirect(parseInt(response.http_code) || 302, response.url);
  } else {
    // Fallback or real visitor — show safe page
    res.status(200).setHeader("Content-Type", "text/html").send(SAFE_PAGE);
  }
};
