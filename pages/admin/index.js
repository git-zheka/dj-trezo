import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

const ADMIN_PASSWORD = 'trezo2024'

const TABS = [
  { id: 'hero',     label: '🏠 Головна' },
  { id: 'about',    label: '👤 Про мене' },
  { id: 'gallery',  label: '🖼️ Галерея' },
  { id: 'pkg0',     label: '📦 Базовий' },
  { id: 'pkg1',     label: '📦 Стандарт' },
  { id: 'pkg2',     label: '📦 Преміум' },
  { id: 'contact',  label: '📞 Контакти' },
]

function ImgUploadSlot({ label, value, onUpload }) {
  const inputRef = useRef()
  const [hovered, setHovered] = useState(false)

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onUpload(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div style={s.imgSlot}>
      <div style={s.imgLabel}>{label}</div>
      <div
        style={s.imgBox}
        onClick={() => inputRef.current.click()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title="Натисніть, щоб завантажити фото"
      >
        {value
          ? <img src={value} alt={label} style={s.imgPreview} />
          : <div style={s.imgPh}>Немає фото<br/><span style={{fontSize:'.7rem',opacity:.5}}>Натисніть щоб завантажити</span></div>
        }
        <div style={{...s.imgOverlay, opacity: hovered ? 1 : 0}}>
          <span style={s.imgOverlayText}>📷 Замінити фото</span>
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleFile} />
    </div>
  )
}

function Field({ label, value, onChange, multi, rows = 3 }) {
  return (
    <div style={s.field}>
      <label style={s.fieldLabel}>{label}</label>
      {multi
        ? <textarea style={s.textarea} rows={rows} value={value || ''} onChange={e => onChange(e.target.value)} />
        : <input style={s.input} type="text" value={value || ''} onChange={e => onChange(e.target.value)} />
      }
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed]       = useState(false)
  const [pass, setPass]           = useState('')
  const [passErr, setPassErr]     = useState(false)
  const [tab, setTab]             = useState('hero')
  const [content, setContent]     = useState(null)
  const [saving, setSaving]       = useState(false)
  const [savedMsg, setSavedMsg]   = useState('')
  const [uploading, setUploading] = useState({})

  useEffect(() => {
    if (authed) fetchContent()
  }, [authed])

  const fetchContent = async () => {
    const res = await fetch('/api/content')
    const data = await res.json()
    setContent(data)
  }

  const login = () => {
    if (pass === ADMIN_PASSWORD) { setAuthed(true); setPassErr(false) }
    else { setPassErr(true) }
  }

  // Deep update helper: set(obj, 'a.b.c', value)
  const set = (dotPath, value) => {
    setContent(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      const parts = dotPath.split('.')
      let node = next
      for (let i = 0; i < parts.length - 1; i++) node = node[parts[i]]
      node[parts[parts.length - 1]] = value
      return next
    })
  }

  const uploadImage = async (serverPath, base64data) => {
    setUploading(u => ({ ...u, [serverPath]: true }))
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath: serverPath, data: base64data })
    })
    const { url } = await res.json()
    setUploading(u => ({ ...u, [serverPath]: false }))
    return url
  }

  const save = async () => {
    setSaving(true)
    await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content)
    })
    setSaving(false)
    setSavedMsg('Збережено!')
    setTimeout(() => setSavedMsg(''), 2500)
  }

  /* ── PASSWORD SCREEN ── */
  if (!authed) {
    return (
      <div style={s.loginWrap}>
        <Head><title>DJ TREZO Admin</title></Head>
        <div style={s.loginBox}>
          <div style={s.loginLogo}>DJ <span style={{color:'#FF6B35'}}>TREZO</span></div>
          <div style={s.loginTitle}>Адміністратор</div>
          <input
            style={{...s.input, marginBottom:'1rem'}}
            type="password"
            placeholder="Пароль"
            value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
          />
          {passErr && <div style={{color:'#FF6B35',fontSize:'.8rem',marginBottom:'.8rem'}}>Невірний пароль</div>}
          <button style={s.btnSave} onClick={login}>Увійти</button>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div style={{...s.loginWrap, fontSize:'1rem', color:'#888'}}>
        Завантаження...
      </div>
    )
  }

  const { hero, about, gallery, packages: pkgs, cta, contact } = content

  /* ── TAB CONTENT ── */
  const renderTab = () => {
    switch (tab) {

      case 'hero': return (
        <div>
          <h2 style={s.tabTitle}>Головна секція</h2>
          <Field label="Підзаголовок героя" value={hero.sub} onChange={v => set('hero.sub', v)} />
          <Field label="Кнопка 1" value={hero.btn1} onChange={v => set('hero.btn1', v)} />
          <Field label="Кнопка 2" value={hero.btn2} onChange={v => set('hero.btn2', v)} />
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginTop:'.5rem'}}>
            <div>
              <Field label="Цифра статистики 1 (напр. 4+)" value={hero.stats[0]?.num} onChange={v => { const st=[...hero.stats]; st[0]={...st[0],num:v}; set('hero.stats',st) }} />
              <Field label="Підпис статистики 1" value={hero.stats[0]?.label} onChange={v => { const st=[...hero.stats]; st[0]={...st[0],label:v}; set('hero.stats',st) }} />
            </div>
            <div>
              <Field label="Цифра статистики 2 (напр. 200+)" value={hero.stats[1]?.num} onChange={v => { const st=[...hero.stats]; st[1]={...st[1],num:v}; set('hero.stats',st) }} />
              <Field label="Підпис статистики 2" value={hero.stats[1]?.label} onChange={v => { const st=[...hero.stats]; st[1]={...st[1],label:v}; set('hero.stats',st) }} />
            </div>
          </div>
          <div style={s.tip}>💡 Відео-фон замініть, поклавши новий файл у <code>public/video/hero.mp4</code></div>
        </div>
      )

      case 'about': return (
        <div>
          <h2 style={s.tabTitle}>Блок «Про мене»</h2>
          <Field label="Заголовок (текст в {дужках} — помаранчевий)" value={about.title} onChange={v => set('about.title', v)} />
          <Field label="Текст 1" value={about.text1} onChange={v => set('about.text1', v)} multi rows={4} />
          <Field label="Текст 2" value={about.text2} onChange={v => set('about.text2', v)} multi rows={3} />
          <Field label="Теги через кому (Весілля, Корпоративи, ...)" value={about.tags.join(', ')} onChange={v => set('about.tags', v.split(',').map(t => t.trim()))} />
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            <Field label="Бейдж — цифра (напр. 4+)" value={about.badge.num} onChange={v => set('about.badge.num', v)} />
            <Field label="Бейдж — підпис" value={about.badge.label} onChange={v => set('about.badge.label', v)} />
          </div>
          <ImgUploadSlot
            label="Фото DJ TREZO"
            value={about.photo ? about.photo + '?t=' + Date.now() : ''}
            onUpload={async (b64) => {
              const url = await uploadImage('images/packages/dj_trezo.jpg', b64)
              set('about.photo', url)
            }}
          />
        </div>
      )

      case 'gallery': return (
        <div>
          <h2 style={s.tabTitle}>Галерея</h2>
          <Field label="Заголовок (текст в {дужках} — помаранчевий)" value={gallery.title} onChange={v => set('gallery.title', v)} />
          <Field label="Підзаголовок" value={gallery.sub} onChange={v => set('gallery.sub', v)} />
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',margin:'1.8rem 0 1rem'}}>
            <span style={{color:'rgba(255,255,255,.5)',fontSize:'.78rem'}}>{(gallery.items||[]).length} елементів</span>
            <button
              style={{...s.btnSave, padding:'.45rem 1.2rem', fontSize:'.75rem'}}
              onClick={() => {
                const items = [...(gallery.items||[])]
                items.push({ type: 'image', src: '' })
                set('gallery.items', items)
              }}
            >+ Додати</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem'}}>
            {(gallery.items||[]).map((item, i) => (
              <div key={i} style={{position:'relative'}}>
                {/* Type toggle */}
                <div style={{display:'flex',gap:'.4rem',marginBottom:'.5rem'}}>
                  {['image','video'].map(t => (
                    <button key={t} style={{
                      padding:'.25rem .7rem', borderRadius:4, fontSize:'.65rem',
                      fontWeight:700, cursor:'pointer', border:'none',
                      background: item.type===t ? '#FF6B35' : '#2a2a2a',
                      color: item.type===t ? '#fff' : 'rgba(255,255,255,.4)',
                    }} onClick={() => {
                      const items=[...gallery.items]; items[i]={...items[i],type:t}; set('gallery.items',items)
                    }}>{t==='image'?'🖼 Фото':'🎬 Відео'}</button>
                  ))}
                  {/* Delete */}
                  <button style={{
                    marginLeft:'auto', padding:'.25rem .6rem', borderRadius:4,
                    fontSize:'.75rem', cursor:'pointer', border:'none',
                    background:'rgba(255,50,50,.15)', color:'#ff6b6b',
                  }} onClick={() => {
                    const items=[...gallery.items]; items.splice(i,1); set('gallery.items',items)
                  }}>✕</button>
                </div>

                {item.type === 'image' ? (
                  <ImgUploadSlot
                    label={`Фото ${i+1}`}
                    value={item.src ? item.src + '?t=' + Date.now() : ''}
                    onUpload={async (b64) => {
                      const url = await uploadImage(`images/gallery/foto${i+1}.jpg`, b64)
                      const items=[...gallery.items]; items[i]={...items[i],src:url}; set('gallery.items',items)
                    }}
                  />
                ) : (
                  <div style={s.field}>
                    <label style={s.fieldLabel}>URL відео (MP4)</label>
                    <input
                      style={s.input}
                      placeholder="/video/gallery/video1.mp4"
                      value={item.src||''}
                      onChange={e => {
                        const items=[...gallery.items]; items[i]={...items[i],src:e.target.value}; set('gallery.items',items)
                      }}
                    />
                    <label style={{...s.fieldLabel,marginTop:'.6rem'}}>Poster (прев'ю, необов'язково)</label>
                    <input
                      style={s.input}
                      placeholder="/images/gallery/video1-thumb.jpg"
                      value={item.poster||''}
                      onChange={e => {
                        const items=[...gallery.items]; items[i]={...items[i],poster:e.target.value}; set('gallery.items',items)
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )

      case 'pkg0':
      case 'pkg1':
      case 'pkg2': {
        const idx = parseInt(tab.replace('pkg', ''))
        const pkg = pkgs[idx]
        return (
          <div>
            <h2 style={s.tabTitle}>Комплект — {pkg.name}</h2>
            <Field label="Назва" value={pkg.name} onChange={v => { const p=[...pkgs]; p[idx]={...p[idx],name:v}; set('packages',p) }} />
            <Field label="Рівень (напр. Рівень 01)" value={pkg.tier} onChange={v => { const p=[...pkgs]; p[idx]={...p[idx],tier:v}; set('packages',p) }} />
            <Field label="Опис" value={pkg.desc} onChange={v => { const p=[...pkgs]; p[idx]={...p[idx],desc:v}; set('packages',p) }} multi rows={3} />
            <Field label="Характеристики (кожна з нового рядка)" value={pkg.features.join('\n')} onChange={v => { const p=[...pkgs]; p[idx]={...p[idx],features:v.split('\n').filter(Boolean)}; set('packages',p) }} multi rows={6} />
            <Field label="Ціна (напр. від 8 000 грн)" value={pkg.price} onChange={v => { const p=[...pkgs]; p[idx]={...p[idx],price:v}; set('packages',p) }} />
            <ImgUploadSlot
              label={`Фото комплекту`}
              value={pkg.photo ? pkg.photo + '?t=' + Date.now() : ''}
              onUpload={async (b64) => {
                const fname = `komplekt${idx+1}.jpg`
                const url = await uploadImage(`images/packages/${fname}`, b64)
                const p = [...pkgs]; p[idx] = { ...p[idx], photo: url }; set('packages', p)
              }}
            />
          </div>
        )
      }

      case 'contact': return (
        <div>
          <h2 style={s.tabTitle}>Контакти</h2>
          <Field label="Телефон" value={contact.phone} onChange={v => set('contact.phone', v)} />
          <Field label="Email" value={contact.email} onChange={v => set('contact.email', v)} />
          <Field label="Місто / географія" value={contact.location} onChange={v => set('contact.location', v)} />
          <div style={s.sep} />
          <h3 style={s.subTitle}>CTA блок</h3>
          <Field label="Мітка (маленький текст зверху)" value={cta.label} onChange={v => set('cta.label', v)} />
          <Field label="Заголовок" value={cta.heading} onChange={v => set('cta.heading', v)} />
          <Field label="Підзаголовок" value={cta.sub} onChange={v => set('cta.sub', v)} multi rows={3} />
        </div>
      )

      default: return null
    }
  }

  /* ── LAYOUT ── */
  return (
    <div style={s.wrap}>
      <Head>
        <title>DJ TREZO — Адмін</title>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap" rel="stylesheet" />
      </Head>

      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sidebarLogo}>DJ <span style={{color:'#FF6B35'}}>TREZO</span></div>
        <div style={{fontSize:'.65rem',color:'rgba(255,255,255,.3)',letterSpacing:'.15em',textTransform:'uppercase',marginBottom:'1.5rem'}}>Адмін-панель</div>
        {TABS.map(t => (
          <button
            key={t.id}
            style={{...s.tabBtn, ...(tab === t.id ? s.tabBtnActive : {})}}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
        <div style={{flex:1}} />
        <a href="/" target="_blank" style={s.previewBtn}>👁 Переглянути сайт</a>
        <button style={s.logoutBtn} onClick={() => setAuthed(false)}>Вийти</button>
      </aside>

      {/* Main content */}
      <main style={s.main}>
        <div style={s.content}>
          {renderTab()}
        </div>

        {/* Save bar */}
        <div style={s.saveBar}>
          {uploading && Object.values(uploading).some(Boolean) && (
            <span style={{color:'#FF9A5C',fontSize:'.8rem'}}>Завантаження фото...</span>
          )}
          {savedMsg && <span style={{color:'#4CAF50',fontWeight:700}}>{savedMsg}</span>}
          <div style={{flex:1}} />
          <button style={s.btnSave} onClick={save} disabled={saving}>
            {saving ? 'Збереження...' : '💾 Зберегти зміни'}
          </button>
        </div>
      </main>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Montserrat', sans-serif; background: #0e0e0e; }
        input, textarea, select { font-family: 'Montserrat', sans-serif; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1a1a1a; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      `}</style>
    </div>
  )
}

/* ── STYLES ── */
const s = {
  loginWrap: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', background: '#0a0a0a',
    fontFamily: "'Montserrat', sans-serif",
  },
  loginBox: {
    background: '#161616', borderRadius: 12, padding: '3rem 2.5rem',
    width: 340, display: 'flex', flexDirection: 'column', alignItems: 'stretch',
    border: '1px solid #2a2a2a',
  },
  loginLogo: {
    fontSize: '1.8rem', fontWeight: 900, letterSpacing: '.1em',
    color: '#fff', textAlign: 'center', marginBottom: '.4rem',
  },
  loginTitle: {
    color: 'rgba(255,255,255,.35)', fontSize: '.7rem', letterSpacing: '.2em',
    textTransform: 'uppercase', textAlign: 'center', marginBottom: '2rem',
  },
  wrap: {
    display: 'flex', minHeight: '100vh', background: '#0e0e0e',
    fontFamily: "'Montserrat', sans-serif",
  },
  sidebar: {
    width: 220, background: '#111', display: 'flex', flexDirection: 'column',
    padding: '1.8rem 1.2rem', position: 'fixed', top: 0, bottom: 0, left: 0,
    overflowY: 'auto', borderRight: '1px solid #222',
  },
  sidebarLogo: {
    fontSize: '1.3rem', fontWeight: 900, letterSpacing: '.1em',
    color: '#fff', marginBottom: '.5rem',
  },
  tabBtn: {
    width: '100%', textAlign: 'left', background: 'transparent',
    border: 'none', color: 'rgba(255,255,255,.5)', padding: '.7rem 1rem',
    borderRadius: 6, fontSize: '.78rem', fontWeight: 600, cursor: 'pointer',
    marginBottom: '.2rem', transition: 'all .2s',
  },
  tabBtnActive: {
    background: 'rgba(255,107,53,.15)', color: '#FF9A5C',
    borderLeft: '3px solid #FF6B35',
  },
  previewBtn: {
    display: 'block', textAlign: 'center', padding: '.6rem',
    background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.5)',
    borderRadius: 6, fontSize: '.75rem', fontWeight: 600, textDecoration: 'none',
    marginBottom: '.5rem', border: '1px solid #2a2a2a',
  },
  logoutBtn: {
    width: '100%', background: 'transparent', border: '1px solid #2a2a2a',
    color: 'rgba(255,255,255,.3)', padding: '.5rem', borderRadius: 6,
    fontSize: '.72rem', cursor: 'pointer',
  },
  main: {
    marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh',
  },
  content: {
    flex: 1, padding: '2.5rem 3rem', overflowY: 'auto', maxWidth: 800,
  },
  saveBar: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    padding: '1rem 3rem', background: '#111', borderTop: '1px solid #222',
    position: 'sticky', bottom: 0,
  },
  btnSave: {
    background: 'linear-gradient(135deg,#FF9A5C,#FF6B35,#E8520C)',
    color: '#fff', border: 'none', padding: '.7rem 2rem',
    borderRadius: 6, fontFamily: "'Montserrat',sans-serif",
    fontSize: '.82rem', fontWeight: 700, letterSpacing: '.06em',
    cursor: 'pointer', whiteSpace: 'nowrap',
  },
  tabTitle: {
    fontSize: '1.2rem', fontWeight: 800, color: '#fff',
    marginBottom: '1.8rem', paddingBottom: '.8rem',
    borderBottom: '1px solid #222',
  },
  subTitle: {
    fontSize: '1rem', fontWeight: 700, color: 'rgba(255,255,255,.6)',
    marginBottom: '1rem',
  },
  field: { marginBottom: '1.2rem' },
  fieldLabel: {
    display: 'block', fontSize: '.68rem', fontWeight: 700,
    letterSpacing: '.08em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,.4)', marginBottom: '.4rem',
  },
  input: {
    width: '100%', padding: '.65rem 1rem',
    background: '#1a1a1a', border: '1.5px solid #2a2a2a',
    borderRadius: 6, color: '#fff', fontSize: '.88rem',
    outline: 'none', transition: 'border-color .2s',
  },
  textarea: {
    width: '100%', padding: '.65rem 1rem',
    background: '#1a1a1a', border: '1.5px solid #2a2a2a',
    borderRadius: 6, color: '#fff', fontSize: '.88rem',
    outline: 'none', resize: 'vertical', lineHeight: 1.6,
  },
  sep: { borderTop: '1px solid #222', margin: '1.8rem 0' },
  tip: {
    marginTop: '1.5rem', padding: '.8rem 1rem',
    background: 'rgba(255,107,53,.08)', borderRadius: 6,
    borderLeft: '3px solid #FF6B35', color: 'rgba(255,255,255,.5)',
    fontSize: '.78rem', lineHeight: 1.6,
  },
  imgSlot: { marginBottom: '1.2rem' },
  imgLabel: {
    fontSize: '.68rem', fontWeight: 700, letterSpacing: '.08em',
    textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: '.4rem',
  },
  imgBox: {
    position: 'relative', width: '100%', maxWidth: 280,
    aspectRatio: '4/3', background: '#1a1a1a', borderRadius: 8,
    overflow: 'hidden', cursor: 'pointer', border: '1.5px solid #2a2a2a',
  },
  imgPreview: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  imgPh: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,.2)',
    fontSize: '.8rem', textAlign: 'center', lineHeight: 1.6,
  },
  imgOverlay: {
    position: 'absolute', inset: 0, background: 'rgba(0,0,0,.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    opacity: 0, transition: 'opacity .2s',
  },
  imgOverlayText: { color: '#fff', fontSize: '.8rem', fontWeight: 700 },
}

