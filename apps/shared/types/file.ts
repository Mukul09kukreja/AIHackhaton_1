export type FileCategory = 'Images' | 'Videos' | 'Documents' | 'ZIPs' | 'Code' | 'Screenshots' | 'Audio' | 'LargeUnused' | 'Others'

export interface FileEntity {
  path: string
  name: string
  extension: string
  sizeBytes: number
  category: FileCategory
}
