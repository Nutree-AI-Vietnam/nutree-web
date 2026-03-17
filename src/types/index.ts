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

