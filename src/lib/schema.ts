import {
  boolean,
  pgTable,
  text,
  timestamp,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const posts = pgTable("posts", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  parentId: text("parent_id").references((): AnyPgColumn => posts.id),
  userId: text("user_id").references(() => users.id),
  // treat comments as posts itself.
  isComment: boolean("is_comment").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const likes = pgTable("likes", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  postId: text("post_id").references(() => posts.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
