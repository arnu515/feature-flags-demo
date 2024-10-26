// import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export type Post = {
  id: string;
  content: string;
  parent_id: string;
  user_id: string;
  is_comment: boolean;
  created_at: Date;
};

export type User = {
  id: string;
  username: string;
  password: string;
  created_at: Date;
};

export const sql = postgres(process.env.DATABASE_URL!);

export default sql;
