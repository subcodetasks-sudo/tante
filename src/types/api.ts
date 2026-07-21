export type ProductWeight = {
  id: number
  weight: string
  calories: string | null
  price: number
}

export type Product = {
  id: number
  name_ar: string
  name_en: string
  calories: number | string | null
  price: number | null
  weights?: ProductWeight[]
  image: string | null
  category_id?: number
  category?: {
    id: number
    name_ar: string
    name_en: string
  }
}

export type Category = {
  id: number
  name_ar: string
  name_en: string
  image: string | null
  products_count?: number
  sort_order?: number
}

export type MenuCategory = Category & {
  products: Product[]
}

export type Testimonial = {
  id: number
  name: string
  rating: number
  review: string
  image: string | null
  video: string | null
}

export type Branch = {
  id: number
  name: string
  address: string
  open_from: string
  open_to: string
}

export type BranchContent = {
  id: number
  title: string
  description: string
}

export type SocialLinks = {
  facebook: string | null
  instagram: string | null
  twitter: string | null
  youtube: string | null
  tiktok: string | null
  whatsapp: string | null
}

export type Settings = {
  id: number
  restaurant_name: string
  logo: string | null
  description: string | null
  social: SocialLinks
}

export type Hero = {
  id: number
  title: string
  description: string
  content: string
  button_1_name: string
  button_2_name: string
  video: string | null
}

export type About = {
  id: number
  title: string
  description: string
  content: string
  image: string | null
}

export type GalleryMediaType = "image" | "video"

export type GalleryItem = {
  id: number
  title: string
  type: GalleryMediaType
  image: string | null
  video_url: string | null
  sort_order: number
}

export type MostOrdered = {
  title: string
  description: string
  products: Product[]
}
