export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  screenshotPlaceholder?: string;
}

export interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

export type LinkIconType = 'globe' | 'apple' | 'facebook' | 'tiktok';

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: LinkIconType;
  description?: string;
  isAppStore?: boolean;
}

