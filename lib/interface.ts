export type Roles = "admin" | "moderator" | "user";

export interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string | null;
}
