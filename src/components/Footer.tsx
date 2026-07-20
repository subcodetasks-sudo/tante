import { Link } from "react-router-dom"

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.5l.5-3H14V9z" />
    </svg>
  )
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 4.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm5.2-.9a1.1 1.1 0 1 0 1.1 1.1 1.1 1.1 0 0 0-1.1-1.1zM12 9.5A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5z" />
    </svg>
  )
}

function IconTwitter({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.9 3H21l-6.4 7.3L22 21h-5.5l-4.3-5.6L7.2 21H5l6.9-7.8L2.5 3h5.6l3.9 5.1L18.9 3zm-1.9 16.2h1.5L7.1 4.7H5.5l11.5 14.5z" />
    </svg>
  )
}

const aboutLinks = [
  { label: "قصتنا", to: "/#about" },
  { label: "القائمة", to: "/menu" },
  { label: "الفروع", to: "/#locations" },
]

const contactLinks = [
  { label: "تواصل معنا", to: "/#locations" },
  { label: "الآراء", to: "/#feedback" },
]

export function Footer() {
  return (
    <footer className="mt-auto border-t border-tant-gold/25 px-4 py-12 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_1fr_1fr_1.4fr]">
        <div className="space-y-4">
          <Link to="/" viewTransition={true} aria-label="الصفحة الرئيسية — تنت">
            <img
              src="/logo.webp"
              alt="تنت"
              className="h-12 w-auto object-contain"
            />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-tant-muted">
            أكل الشارع العربي ببهارات التراث وعناية عصرية.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg text-tant-gold">من نحن</h3>
          <ul className="space-y-2">
            {aboutLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  viewTransition={true}
                  className="text-sm text-tant-cream/80 transition-colors hover:text-tant-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg text-tant-gold">تواصل</h3>
          <ul className="space-y-2">
            {contactLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  viewTransition={true}
                  className="text-sm text-tant-cream/80 transition-colors hover:text-tant-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 pt-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-tant-gold transition-colors hover:text-tant-gold-soft"
            >
              <IconFacebook className="size-4" />
              فيسبوك
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-tant-gold transition-colors hover:text-tant-gold-soft"
            >
              <IconInstagram className="size-4" />
              انستغرام
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-tant-gold transition-colors hover:text-tant-gold-soft"
            >
              <IconTwitter className="size-4" />
              تويتر
            </a>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-6xl text-center text-xs text-tant-muted md:text-start">
        © جميع الحقوق محفوظة {new Date().getFullYear()} تنت.
      </p>
    </footer>
  )
}
