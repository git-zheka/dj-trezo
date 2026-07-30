import { useEffect, useState } from 'react'
import Head from 'next/head'
import fs from 'fs'
import path from 'path'

function GalleryMasonry({ gallery }) {
  const [hovered, setHovered] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const items = gallery.items || []
  const MOBILE_LIMIT = 3

  return (
    <section id="collage">
      <div className="collage-header fade-in">
        <span className="section-tag">{gallery.tag}</span>
        <h2 className="section-title"><T text={gallery.title} /></h2>
        <p className="section-sub">{gallery.sub}</p>
      </div>
      <div className="masonry-grid">
        {items.map((item, i) => {
          const isHov = hovered === i
          const isOth = hovered !== null && hovered !== i
          const hiddenOnMobile = !showAll && i >= MOBILE_LIMIT
          return (
            <div
              key={i}
              className={`masonry-item${hiddenOnMobile ? ' gallery-hidden-mobile' : ''}`}
              style={{
                transform: isHov ? 'scale(1.05)' : isOth ? 'scale(0.96)' : 'scale(1)',
                zIndex: isHov ? 10 : 1,
                transition: isHov
                  ? 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)'
                  : 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="masonry-inner">
                {item.type === 'video' ? (
                  <>
                    <video
                      src={item.src}
                      poster={item.poster || ''}
                      muted loop playsInline
                      onMouseEnter={e => e.currentTarget.play()}
                      onMouseLeave={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0 }}
                    />
                    <div className="masonry-video-badge">▶ Відео</div>
                  </>
                ) : (
                  <img
                    src={item.src}
                    alt={`Фото ${i + 1}`}
                    onError={e => { e.currentTarget.closest('.masonry-item').style.display = 'none' }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
      {!showAll && items.length > MOBILE_LIMIT && (
        <div className="gallery-more-wrap">
          <button className="gallery-more-btn" onClick={() => setShowAll(true)}>
            Показати ще {items.length - MOBILE_LIMIT} фото/відео
          </button>
        </div>
      )}
    </section>
  )
}

function T({ text }) {
  if (!text) return null
  const parts = text.split(/\{([^}]+)\}/)
  return parts.map((part, i) =>
    i % 2 === 1 ? <span key={i} className="em">{part}</span> : part
  )
}

const SERVICES = [
  { name: 'Точно в строк', d: <><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></> },
  { name: 'Жива музика',  d: <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></> },
  { name: 'Світлове шоу', d: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/> },
  { name: 'Мікрофон',     d: <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></> },
  { name: 'Відеомепінг',  d: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></> },
  { name: 'Ведучий',      d: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
]

export default function Home({ c }) {
  const { hero, about, gallery, packages: pkgs, cta, contact } = c

  useEffect(() => {
    const nav = document.getElementById('nav')
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 60)
    window.addEventListener('scroll', onScroll)


    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
      })
    }, { threshold: 0.12 })
    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el))

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <Head>
        <title>DJ TREZO — Діджей на весілля та корпоративи у Львові</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="DJ TREZO — професійний діджей у Львові. Весілля, корпоративи, дні народження та клубні вечірки. 4+ роки досвіду, 200+ подій. Замовити: +38 (098) 108-03-26" />
        <meta name="keywords" content="діджей Львів, DJ Львів, діджей на весілля Львів, DJ на весілля, діджей на корпоратив, замовити діджея Львів, DJ TREZO, диджей Львів" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="DJ TREZO" />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="canonical" href="https://dj-trezo.top" />

        {/* Open Graph — для Facebook, Viber, Telegram */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dj-trezo.top" />
        <meta property="og:title" content="DJ TREZO — Діджей на весілля та корпоративи у Львові" />
        <meta property="og:description" content="Професійний діджей у Львові. Весілля, корпоративи, клубні вечірки. 4+ роки досвіду, 200+ подій. Гарантована якість звуку." />
        <meta property="og:image" content="https://dj-trezo.top/images/packages/dj_trezo.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="uk_UA" />
        <meta property="og:site_name" content="DJ TREZO" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DJ TREZO — Діджей на весілля та корпоративи у Львові" />
        <meta name="twitter:description" content="Професійний діджей у Львові. Весілля, корпоративи, клубні вечірки." />
        <meta name="twitter:image" content="https://dj-trezo.top/images/packages/dj_trezo.jpg" />

        {/* JSON-LD — структуровані дані для Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "LocalBusiness",
                "@id": "https://dj-trezo.top/#business",
                "name": "DJ TREZO",
                "description": "Професійний діджей у Львові на весілля, корпоративи, дні народження та клубні вечірки",
                "url": "https://dj-trezo.top",
                "telephone": "+380981080326",
                "email": "zhekapapik67@gmail.com",
                "image": "https://dj-trezo.top/images/packages/dj_trezo.jpg",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Львів",
                  "addressRegion": "Львівська область",
                  "addressCountry": "UA"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": 49.8397,
                  "longitude": 24.0297
                },
                "areaServed": {
                  "@type": "Country",
                  "name": "Україна"
                },
                "priceRange": "$$",
                "openingHoursSpecification": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
                  "opens": "09:00",
                  "closes": "23:00"
                },
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": "DJ-послуги",
                  "itemListElement": [
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "DJ на весілля", "description": "Музичне оформлення весілля у Львові та по всій Україні" } },
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "DJ на корпоратив", "description": "Музична програма для корпоративних заходів" } },
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "DJ на день народження", "description": "Вечірка з живим діджеєм" } }
                  ]
                }
              },
              {
                "@type": "WebSite",
                "@id": "https://dj-trezo.top/#website",
                "url": "https://dj-trezo.top",
                "name": "DJ TREZO",
                "description": "Офіційний сайт DJ TREZO — діджея з Львова",
                "inLanguage": "uk-UA"
              }
            ]
          })}}
        />
      </Head>

      {/* ═══ NAV ═══ */}
      <nav id="nav">
        <a href="#hero" className="nav-logo">DJ <span>TREZO</span></a>
        <ul className="nav-links">
          <li><a href="#about">Про мене</a></li>
          <li><a href="#collage">Галерея</a></li>
          <li><a href="#packages">Комплекти</a></li>
          <li><a href="#contact">Контакти</a></li>
        </ul>
        <a href="#contact" className="nav-cta">Замовити</a>
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="hero">
        <div className="hero-bg-anim" />
        <video className="hero-video" id="heroVideo" autoPlay muted loop playsInline>
          <source src="https://pub-8f58fc23b37a4f16b316abc09c870688.r2.dev/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-name">DJ <span className="accent">TREZO</span></h1>
          <p className="hero-sub">{hero.sub}</p>
          <div className="hero-actions">
            <a href="#packages" className="btn-primary">{hero.btn1}</a>
            <a href="#contact" className="btn-ghost">{hero.btn2}</a>
          </div>
          <div className="stats-bar fade-in">
            {hero.stats.map((s, i) => (
              <div key={i} className="stat-item">
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <div id="about">
        <div className="about-photo-wrap fade-in">
          <div className="about-photo-frame">
            <img
              src={about.photo}
              alt="DJ TREZO"
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
          </div>
          <div className="about-badge">
            <strong>{about.badge.num}</strong>
            <span>{about.badge.label}</span>
          </div>
        </div>

        <div className="about-text fade-in">
          <span className="section-tag">{about.tag}</span>
          <h2 className="section-title" style={{ fontSize: 'clamp(1.3rem,2.2vw,1.8rem)' }}>
            <T text={about.title} />
          </h2>
          <p className="section-sub">{about.text1}</p>
          <p className="section-sub" style={{ marginTop: '1rem' }}>{about.text2}</p>
          <div className="about-tags">
            {about.tags.map((tag, i) => (
              <span key={i} className="about-tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ GALLERY ═══ */}
      <GalleryMasonry gallery={gallery} />

      {/* ═══ PACKAGES ═══ */}
      <section id="packages">
        <div className="packages-header fade-in">
          <span className="section-tag">Комплекти апаратури</span>
          <h2 className="section-title">Обери свій <span className="em">формат</span></h2>
          <p className="section-sub">Три рівні оснащення для будь-якого масштабу події</p>
        </div>
        <div className="packages-grid">
          {pkgs.map((pkg, i) => (
            <div key={i} className={`pkg-card fade-in${pkg.featured ? ' featured' : ''}`}>
              {pkg.featured && <div className="pkg-featured-badge">Популярний</div>}
              <div className="pkg-photo">
                {pkg.photo
                  ? <img src={pkg.photo} alt={pkg.name} onError={e => e.currentTarget.style.display = 'none'} />
                  : <div className="pkg-photo-ph">{pkg.name}</div>
                }
              </div>
              <div className="pkg-body">
                <div className="pkg-tier">{pkg.tier}</div>
                <div className="pkg-name">{pkg.name}</div>
                <p className="pkg-desc">{pkg.desc}</p>
                <ul className="pkg-features">
                  {pkg.features.map((f, j) => <li key={j}>{f}</li>)}
                </ul>
                <div className="pkg-price">{pkg.price} <span>/ захід</span></div>
                <a href="#contact" className={`pkg-btn ${pkg.featured ? 'pkg-btn-fill' : 'pkg-btn-outline'}`}>
                  Замовити
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ EXTRAS ═══ */}
      <section id="extras">
        <div className="extras-header fade-in">
          <span className="section-tag">Додатково</span>
          <h2 className="section-title" style={{ color: 'var(--white)' }}>
            Що можна <span className="em">додати</span>
          </h2>
        </div>
        <div className="extras-grid">
          {[
            { icon: '🎤', name: 'Ведучий', desc: 'Професійний MC для вашої події' },
            { icon: '🎙️', name: 'Мікрофон', desc: 'Бездротовий мікрофон для гостей' },
            { icon: '📺', name: 'Телевізор', desc: 'LED-екран для слайдшоу або фото' },
          ].map((item, i) => (
            <div key={i} className="extra-card fade-in">
              <div className="extra-icon">{item.icon}</div>
              <div className="extra-name">{item.name}</div>
              <div className="extra-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA BAND ═══ */}
      <section id="cta-band">
        <p className="cta-label fade-in">{cta.label}</p>
        <h2 className="cta-heading fade-in">{cta.heading}</h2>
        <p className="cta-sub fade-in">{cta.sub}</p>
        <div className="cta-actions fade-in">
          <a href="#contact" className="btn-primary">Написати зараз</a>
          <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`} className="btn-ghost">📞 Подзвонити</a>
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact">
        <div className="contact-wrap">
          <div className="contact-info">
            <span className="section-tag">{contact.tag}</span>
            <h2 className="section-title"><T text={contact.title} /></h2>
            <p className="section-sub">{contact.sub}</p>
            <div style={{ marginTop: '2rem' }}>
              <div className="contact-detail">
                <div className="contact-detail-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.81 19.79 19.79 0 01.1 2.18 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.23 7.84a16 16 0 006.07 6.07l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
                  </svg>
                </div>
                <div className="contact-detail-text">
                  <strong>Телефон</strong>
                  <span>{contact.phone}</span>
                </div>
              </div>
              <div className="contact-detail">
                <div className="contact-detail-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div className="contact-detail-text">
                  <strong>Географія</strong>
                  <span>{contact.location}</span>
                </div>
              </div>
              <div className="contact-detail">
                <div className="contact-detail-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div className="contact-detail-text">
                  <strong>Email</strong>
                  <span>{contact.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form fade-in">
            <div className="form-row">
              <div className="form-group">
                <label>Ваше імʼя</label>
                <input type="text" placeholder="Іван Іваненко" />
              </div>
              <div className="form-group">
                <label>Телефон</label>
                <input type="tel" placeholder="+38 (0__)" />
              </div>
            </div>
            <div className="form-group">
              <label>Тип події</label>
              <select>
                <option value="">Оберіть тип події</option>
                <option>Весілля</option>
                <option>Корпоратив</option>
                <option>День народження</option>
                <option>Клубна вечірка</option>
                <option>Фестиваль</option>
                <option>Інше</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Дата події</label>
                <input type="date" />
              </div>
              <div className="form-group">
                <label>Комплект</label>
                <select>
                  <option value="">Оберіть комплект</option>
                  <option>Базовий</option>
                  <option>Стандарт</option>
                  <option>Преміум</option>
                  <option>Не визначився</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Повідомлення</label>
              <textarea placeholder="Розкажіть про вашу подію: місце, кількість гостей, особливі побажання..." />
            </div>
            <button className="form-submit" type="button">Відправити заявку</button>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer>
        <a href="#hero" className="footer-logo">DJ <span>TREZO</span></a>
        <ul className="footer-links">
          <li><a href="#about">Про мене</a></li>
          <li><a href="#collage">Галерея</a></li>
          <li><a href="#packages">Комплекти</a></li>
          <li><a href="#contact">Контакти</a></li>
        </ul>
        <div className="footer-copy">© 2025 DJ TREZO. Всі права захищені.</div>
      </footer>
    </>
  )
}

export async function getStaticProps() {
  const contentPath = path.join(process.cwd(), 'data', 'content.json')
  const raw = fs.readFileSync(contentPath, 'utf-8')
  const c = JSON.parse(raw)
  return { props: { c } }
}
