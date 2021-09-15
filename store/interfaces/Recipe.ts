
export interface Recipe {
  readonly _id?: string
  name: string
  slug: string
  short_description: string,
  avatar: Avatar[],
  video: {
    code: string
    site: VideoSite
  },
  steps: Step[],
  difficult_level: DifficultLevel
  ingredients: ngredient[],
  author: any
  execution_time: number,
  categories: string[],
  readonly created_at?: Date
  readonly updated_at?: Date
}

export type Avatar = {
  url?: string
}
export type ngredient = {
  name: string,
  weight: string,
  unit: String
}

export type Step = {
  content: string | null | undefined,
  photos: string[]
}

export const VideoSite = {
  Youtube: 'youtube' as const,
  vimeo: 'vimeo' as const,
  none: '' as const
};

export type VideoSite = typeof VideoSite[keyof typeof VideoSite];

export const DifficultLevel = {
  Hard: 'hard' as const,
  Normal: 'normal' as const,
  Easy: 'easy' as const
};

export type DifficultLevel = typeof DifficultLevel[keyof typeof DifficultLevel];