import { Link } from "react-router-dom"
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6"
import { useSiteStore } from "@/store/siteStore"
import { SiteLogo } from "@/components/SiteLogo"

function resolveSocialHref(
  platform: "whatsapp" | "default",
  value: string | null | undefined,
) {
  if (!value) return null
  if (platform !== "whatsapp") return value
  if (value.startsWith("http")) return value
  const digits = value.replace(/\D/g, "")
  return digits ? `https://wa.me/${digits}` : null
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
  const settings = useSiteStore((s) => s.settings)

  const social = settings?.social
  const socialLinks = [
    {
      href: resolveSocialHref("default", social?.facebook),
      label: "فيسبوك",
      icon: FaFacebookF,
    },
    {
      href: resolveSocialHref("default", social?.instagram),
      label: "انستغرام",
      icon: FaInstagram,
    },
    {
      href: resolveSocialHref("default", social?.twitter),
      label: "تويتر",
      icon: FaXTwitter,
    },
    {
      href: resolveSocialHref("default", social?.youtube),
      label: "يوتيوب",
      icon: FaYoutube,
    },
    {
      href: resolveSocialHref("default", social?.tiktok),
      label: "تيك توك",
      icon: FaTiktok,
    },
    {
      href: resolveSocialHref("whatsapp", social?.whatsapp),
      label: "واتساب",
      icon: FaWhatsapp,
    },
  ].filter((link) => Boolean(link.href))

  return (
    <footer className="mt-auto border-t border-tant-gold/25 px-4 py-12 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
        <div className="space-y-4">
          <Link to="/" viewTransition={true} aria-label="الصفحة الرئيسية — تنت">
            <SiteLogo
              src={settings?.logo}
              alt={settings?.restaurant_name ?? "تنت"}
              className="h-12 w-auto object-contain"
            />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-tant-muted">
            {settings?.description ??
              "أكل الشارع العربي ببهارات التراث وعناية عصرية."}
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

        <div className="space-y-4">
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
          {socialLinks.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href!}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-tant-cream/80 transition-colors hover:text-tant-gold"
                  aria-label={label}
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-6xl text-center text-xs text-tant-muted md:text-start">
        © جميع الحقوق محفوظة {new Date().getFullYear()}{" "}
        {settings?.restaurant_name ?? "تنت"}.
      </p>
    </footer>
  )
}
