import React, { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react'

const chapters = [
  { id: 'heritage', number: '01', label: 'Heritage' },
  { id: 'night', number: '02', label: 'Night' },
  { id: 'nature', number: '03', label: 'Nature' },
  { id: 'table', number: '04', label: 'Table' },
]

const seasons = [
  { en: 'Spring', ko: '봄', note: 'petal air' },
  { en: 'Summer', ko: '여름', note: 'monsoon green' },
  { en: 'Autumn', ko: '가을', note: 'copper light' },
  { en: 'Winter', ko: '겨울', note: 'snow silence' },
]

const ease = [0.22, 1, 0.36, 1]

function Reveal({ children, className = '', delay = 0, as = 'div', ...props }) {
  const reduceMotion = useReducedMotion()
  const Component = motion[as]

  return (
    <Component
      className={className}
      {...props}
      initial={reduceMotion ? false : { opacity: 0, y: 36 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </Component>
  )
}

function WordNote({ ko, romanized, children, light = false }) {
  return (
    <Reveal className={`word-note${light ? ' word-note--light' : ''}`}>
      <div className="word-note__word">
        <span lang="ko">{ko}</span>
        <span>{romanized}</span>
      </div>
      <p>{children}</p>
    </Reveal>
  )
}

function Header({ isScrolled, menuOpen, setMenuOpen }) {
  return (
    <header className={`site-header${isScrolled && !menuOpen ? ' site-header--scrolled' : ''}${menuOpen ? ' site-header--menu-open' : ''}`}>
      <a className="brand" href="#top" aria-label="Korea, back to top">
        <span className="brand__mark" aria-hidden="true" />
        <span>KOREA</span>
        <span className="brand__ko" lang="ko">한국</span>
      </a>

      <nav className="desktop-nav" aria-label="Main navigation">
        {chapters.map((chapter) => (
          <a key={chapter.id} href={`#${chapter.id}`}>
            {chapter.label}
          </a>
        ))}
      </nav>

      <button
        className="menu-button"
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
        <span>{menuOpen ? 'Close' : 'Menu'}</span>
      </button>
    </header>
  )
}

function MobileMenu({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          className="menu-overlay"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.7, ease }}
        >
          <nav aria-label="Mobile navigation">
            <p className="menu-overlay__eyebrow">Explore the layers</p>
            {chapters.map((chapter, index) => (
              <motion.a
                key={chapter.id}
                href={`#${chapter.id}`}
                onClick={onClose}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18 + index * 0.06 }}
              >
                <span>{chapter.number}</span>
                {chapter.label}
              </motion.a>
            ))}
          </nav>
          <div className="menu-overlay__footer">
            <span lang="ko">어서 오세요</span>
            <span>37.5665° N · 126.9780° E</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Hero() {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '38%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const intro = {
    hidden: { opacity: 0, y: 24 },
    show: (delay) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, delay, ease },
    }),
  }

  return (
    <section className="hero" id="top" ref={ref} aria-labelledby="hero-title">
      <motion.div
        className="hero__media"
        style={{ y: reduceMotion ? 0 : imageY }}
        initial={reduceMotion ? false : { scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease }}
      >
        <img
          src="/images/korea-hero.webp"
          alt="Blue-hour view over Seoul, where hanok rooftops meet the modern skyline and mountain ridges"
          fetchPriority="high"
        />
      </motion.div>
      <div className="hero__veil" />
      <motion.div
        className="hero__content"
        style={{ y: reduceMotion ? 0 : contentY, opacity: reduceMotion ? 1 : contentOpacity }}
      >
        <motion.p
          className="eyebrow hero__eyebrow"
          variants={intro}
          initial={reduceMotion ? false : 'hidden'}
          animate="show"
          custom={0.2}
        >
          대한민국 · Republic of Korea
        </motion.p>
        <div className="hero__title-lockup">
          <motion.span
            className="hero__ko"
            lang="ko"
            variants={intro}
            initial={reduceMotion ? false : 'hidden'}
            animate="show"
            custom={0.28}
          >
            한국
          </motion.span>
          <motion.h1
            id="hero-title"
            variants={intro}
            initial={reduceMotion ? false : 'hidden'}
            animate="show"
            custom={0.38}
          >
            Between stillness<br />and signal.
          </motion.h1>
        </div>
        <motion.div
          className="hero__bottom"
          variants={intro}
          initial={reduceMotion ? false : 'hidden'}
          animate="show"
          custom={0.56}
        >
          <p>A country moving at two speeds: centuries held with care, and the next idea already in motion.</p>
          <a className="hero__cta" href="#story">
            <span>Enter Korea</span>
            <ArrowDown size={18} strokeWidth={1.6} />
          </a>
        </motion.div>
      </motion.div>
      <div className="hero__index" aria-hidden="true">
        <span>37° N</span>
        <span>Land of morning calm — in motion</span>
        <span>126° E</span>
      </div>
    </section>
  )
}

function Intro() {
  return (
    <section className="intro paper" id="story" aria-labelledby="intro-title">
      <div className="section-shell intro__grid">
        <Reveal className="section-kicker">
          <span>Prelude</span>
          <span>한국을 읽는 법</span>
        </Reveal>
        <Reveal as="h2" className="intro__title" delay={0.08}>
          Korea is not a choice between old and new.
          <em id="intro-title"> It is the tension that makes both feel alive.</em>
        </Reveal>
        <Reveal className="intro__aside" delay={0.16}>
          <p>Look slowly. The country reveals itself in thresholds: a tiled roof against glass, temple bells beneath train lines, a recipe changed by every hand that makes it.</p>
          <span className="micro-label">Four movements · one rhythm</span>
        </Reveal>
      </div>
    </section>
  )
}

function Heritage() {
  const imageRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: imageRef, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  return (
    <section className="heritage paper" id="heritage" aria-labelledby="heritage-title">
      <div className="section-shell chapter-heading">
        <Reveal className="chapter-number">01 / 04</Reveal>
        <Reveal className="chapter-copy" delay={0.08}>
          <p className="eyebrow">Living heritage</p>
          <h2 id="heritage-title">Inherited,<br /><em>not frozen.</em></h2>
        </Reveal>
        <Reveal className="chapter-body" delay={0.16}>
          <p>Tradition here is not kept behind glass. It is worn, cooked, rebuilt, and passed from hand to hand—old forms finding new lives without losing their center.</p>
        </Reveal>
      </div>

      <div className="heritage__image" ref={imageRef}>
        <motion.img
          style={{ y: reduceMotion ? 0 : imageY }}
          src="/images/korea-heritage.webp"
          alt="A lone visitor crossing a quiet Korean palace courtyard framed by vermilion wooden gates"
          loading="lazy"
        />
        <span className="image-caption">Palace geometry · Seoul · 06:42</span>
      </div>

      <div className="section-shell heritage__footer">
        <WordNote ko="여백" romanized="yeobaek">
          The beauty and intention of open space—what is left unsaid gives form to what remains.
        </WordNote>
        <Reveal className="heritage__detail">
          <span>Palace geometry.</span>
          <span>Hanji texture.</span>
          <span>A modern silhouette cut from an ancient line.</span>
        </Reveal>
      </div>
    </section>
  )
}

function Night() {
  const moments = [
    ['19:10', 'The last train fills'],
    ['23:48', 'Basement sound rises'],
    ['02:16', 'Conversations continue'],
  ]

  return (
    <section className="night" id="night" aria-labelledby="night-title">
      <div className="night__grid section-shell">
        <div className="night__sticky">
          <Reveal className="chapter-number chapter-number--light">02 / 04</Reveal>
          <Reveal className="night__copy" delay={0.08}>
            <p className="eyebrow">After dark</p>
            <h2 id="night-title">The city<br />changes <em>frequency.</em></h2>
            <p className="night__body">At night, Seoul becomes a composition of river light, basement sound, late trains, and conversations that refuse to end.</p>
          </Reveal>
          <WordNote ko="밤" romanized="bam" light>
            Night—when the city reveals another version of itself.
          </WordNote>
        </div>

        <div className="night__visual-column">
          <Reveal className="night__image">
            <img
              src="/images/korea-night.webp"
              alt="Rain glistens in a narrow Seoul alley lit by warm restaurant windows at night"
              loading="lazy"
            />
            <div className="night__image-label">
              <span>Seoul</span>
              <span lang="ko">서울의 밤</span>
            </div>
          </Reveal>
          <div className="night__moments" aria-label="A Seoul night in three moments">
            {moments.map(([time, label], index) => (
              <Reveal className="night__moment" key={time} delay={index * 0.06}>
                <time>{time}</time>
                <span>{label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Nature() {
  const [activeSeason, setActiveSeason] = useState(0)
  const season = seasons[activeSeason]

  return (
    <section className="nature" id="nature" aria-labelledby="nature-title">
      <svg className="nature__contours" viewBox="0 0 1440 900" aria-hidden="true" preserveAspectRatio="none">
        <path d="M-80 682C95 512 213 736 380 566S667 385 812 526s284 74 420-71 229-68 325-167" />
        <path d="M-108 728C81 545 215 785 403 592s300-205 457-50 295 79 438-79 236-79 344-181" />
        <path d="M-143 777C64 578 216 838 429 620s318-222 486-52 307 84 459-88 247-89 369-198" />
      </svg>
      <div className="section-shell nature__content">
        <div className="nature__topline">
          <Reveal className="chapter-number chapter-number--light">03 / 04</Reveal>
          <Reveal className="nature__intro">
            <p className="eyebrow">Beyond the skyline</p>
            <p>Mountain ridges fold toward the sea. Pine forest softens into volcanic coast. Four seasons redraw the country.</p>
          </Reveal>
        </div>

        <div className="nature__hero-type">
          <Reveal as="h2" id="nature-title">
            A landscape<br />shaped in <em>layers.</em>
          </Reveal>
          <motion.div
            className="nature__season-word"
            key={season.ko}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            aria-live="polite"
          >
            <span lang="ko">{season.ko}</span>
            <small>{season.note}</small>
          </motion.div>
          <span className="nature__mountain" lang="ko" aria-hidden="true">산</span>
        </div>

        <div className="season-list" aria-label="The four seasons in Korea">
          {seasons.map((item, index) => (
            <button
              key={item.en}
              className={activeSeason === index ? 'is-active' : ''}
              onMouseEnter={() => setActiveSeason(index)}
              onFocus={() => setActiveSeason(index)}
              onClick={() => setActiveSeason(index)}
              type="button"
              aria-pressed={activeSeason === index}
            >
              <span>0{index + 1}</span>
              <strong>{item.en}</strong>
              <span lang="ko">{item.ko}</span>
              <ArrowUpRight size={18} strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function Table() {
  const principles = [
    ['시간', 'Time', 'Fermentation deepens what patience begins.'],
    ['불', 'Fire', 'Char, steam, and heat turn balance into appetite.'],
    ['손맛', 'Hand', 'The cook’s intuition becomes the final ingredient.'],
  ]

  return (
    <section className="table-section paper" id="table" aria-labelledby="table-title">
      <div className="section-shell table-section__topline">
        <Reveal className="chapter-number">04 / 04</Reveal>
        <Reveal className="section-kicker" delay={0.06}>
          <span>At the table</span>
          <span lang="ko">함께 먹는 마음</span>
        </Reveal>
      </div>
      <div className="table-section__grid">
        <Reveal className="table-section__image">
          <img
            src="/images/korea-table.webp"
            alt="A shared Korean table with steaming stew, rice, kimchi and banchan as two diners reach in"
            loading="lazy"
          />
          <span className="image-caption">Many textures · one conversation</span>
        </Reveal>
        <div className="table-section__copy">
          <Reveal>
            <p className="eyebrow">A living cuisine</p>
            <h2 id="table-title">Time is<br /><em>an ingredient.</em></h2>
            <p className="table-section__body">Korean food begins with balance, then deepens through fire, fermentation, and instinct. A meal arrives all at once—made to be shared, never merely observed.</p>
          </Reveal>
          <div className="principles">
            {principles.map(([ko, en, description], index) => (
              <Reveal className="principle" key={ko} delay={index * 0.05}>
                <span className="principle__ko" lang="ko">{ko}</span>
                <strong>{en}</strong>
                <p>{description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Closing() {
  return (
    <section className="closing" id="closing" aria-labelledby="closing-title">
      <div className="closing__orbit" aria-hidden="true">
        <span lang="ko">오</span>
      </div>
      <div className="section-shell closing__content">
        <Reveal className="closing__eyebrow">
          <span>Not one Korea, but many.</span>
          <span lang="ko">어서 오세요</span>
        </Reveal>
        <Reveal as="h2" id="closing-title" delay={0.08}>
          Come closer.<br /><em>The details change everything.</em>
        </Reveal>
        <Reveal className="closing__action" delay={0.16}>
          <p>From quiet courtyards to crowded streets, mountain paths to midnight tables.</p>
          <a href="#top">
            Return to the beginning
            <ArrowRight size={20} strokeWidth={1.5} />
          </a>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="brand brand--footer">
        <span className="brand__mark" aria-hidden="true" />
        <span>KOREA</span>
        <span className="brand__ko" lang="ko">한국</span>
      </div>
      <p>A visual passage through the Republic of Korea.</p>
      <a href="#top">Top <ArrowUpRight size={14} /></a>
    </footer>
  )
}

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 72)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <a className="skip-link" href="#story">Skip to content</a>
      <Header isScrolled={isScrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main>
        <Hero />
        <Intro />
        <Heritage />
        <Night />
        <Nature />
        <Table />
        <Closing />
      </main>
      <Footer />
    </>
  )
}
