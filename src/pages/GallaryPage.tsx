import DomeGallery from '@/components/DomeGallery'

const galleryImages = [
  {
    src: '/about-us.jpg',
    alt: 'أجواء مطعم طنط',
  },
  {
    src: '/bowel-of-meat.png',
    alt: 'طبق اللحم',
  },
  {
    src: '/bowel-of-molokheya.png',
    alt: 'طبق الملوخية',
  },
  {
    src: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=800&auto=format&fit=crop',
    alt: 'لفائف الشاورما المميزة',
  },
  {
    src: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=800&auto=format&fit=crop',
    alt: 'المقبلات والغموس الطازج',
  },
  {
    src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
    alt: 'أجواء طنط الدافئة',
  },
  {
    src: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800&auto=format&fit=crop',
    alt: 'كنافة نابلسية بالجبن الفاخر',
  },
  {
    src: 'https://images.unsplash.com/photo-1547058886-af77992d478c?q=80&w=800&auto=format&fit=crop',
    alt: 'فلافل مقرمشة بالسمسم',
  },
  {
    src: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop',
    alt: 'فناجين القهوة بالهيل',
  },
]

export default function GallaryPage() {
  return (
    <div className="-mt-[5.25rem] h-dvh w-full md:-mt-[6rem]">
      <DomeGallery
        images={galleryImages}
        overlayBlurColor="#2e472a"
        grayscale={false}
        fit={0.9}
        minRadius={900}
        segments={40}
        openedImageWidth="min(580px, calc(100vw - 2rem))"
        openedImageBorderRadius="16px"
        openedImageHeight="min(580px, calc(100dvh - 8rem))"
        autoRotate
        autoRotateSpeed={6}
      />
    </div>
  )
}
