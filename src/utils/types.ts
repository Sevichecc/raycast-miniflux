export interface Preferences {
  baseUrl: string;
  apiKey: string;
  searchLimit?: number;
  feedLimit?: number;
  entryStarred?: boolean;
}

export interface State {
  isLoading: boolean;
  error?: MinifluxApiError;
  origin?: OriginArticle;
  entries?: MinifluxEntry[];
  total?: number;
}

export interface MinifluxApiError {
  code: string;
  error_message: string;
}

export interface MinifluxEntries {
  total: number,
  entries: MinifluxEntry[]
}

export type EntryStatus = "read" | "unread" | "removed"

export interface MinifluxEntry {
  id: number;
  user_id: number;
  feed_id: number;
  status: EntryStatus;
  hash: string;
  title: string;
  url: string;
  comments_url?: string;
  published_at: string;
  created_at: string;
  changed_at?: string;
  content: string;
  author: string;
  share_code?: string;
  starred: boolean;
  reading_time: number;
  enclosures?: null;
  feed: Feed;
  tags?: string[];
}

export interface Feed {
  id: number;
  user_id: number;
  feed_url: string;
  site_url: string;
  title: string;
  checked_at: string;
  next_check_at?: string;
  etag_header?: string;
  last_modified_header?: string;
  parsing_error_message?: string;
  parsing_error_count?: number;
  scraper_rules?: string;
  rewrite_rules?: string;
  crawler?: boolean;
  blocklist_rules?: string;
  keeplist_rules?: string;
  urlrewrite_rules?: string;
  user_agent?: string;
  cookie?: string;
  username?: string;
  password?: string;
  disabled?: boolean;
  ignore_http_cache?: boolean;
  allow_self_signed_certificates?: boolean;
  fetch_via_proxy?: boolean;
  category: Category;
  icon?: Icon;
  hide_globally?: boolean;
}

export interface Category {
  id: number;
  title: string;
  user_id: number;
  hide_globally?: boolean;
}

export interface Icon {
  feed_id: number;
  icon_id: number;
}

export interface IconData {
  id: number;
  mime_type: string;
  data: string;
}
export interface OriginArticle {
  content: string
}