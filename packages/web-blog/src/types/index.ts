export interface Article {
  id: number
  title: string
  excerpt: string
  image: string
  category: string
  date: string
  readTime: string
  comments: number
  author: {
    name: string
    avatar: string
  }
}

export interface Category {
  name: string
  count: number
  icon: string
  color: string
}
