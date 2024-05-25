export interface ResponseData {
  code: number,
  message: string,
  ok: boolean
}

export interface TraderMark {
  id?: number,
  tmName: string,
  logoUrl: string
}

export type Records = TraderMark[]

export interface TradeMarkResponseData extends ResponseData{
  data: {
    records: Records,
    total: number,
    size: number,
    current: number,
    searchCount: boolean,
    pages: number
  }
}