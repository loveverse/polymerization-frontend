export interface UpdExcerptReq {
  id: number
  content: string
}
export interface DelExcerptReq {
  id: number
}
export interface AddExcerptReq {
  content: string
  author: string
  flag: number
  date: Date
}
