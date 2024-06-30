import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  medias: defineTable({
    user: v.id('users'),
    mediaTitle: v.string(),
    mediaDescription: v.string(),
    mediaUrl: v.optional(v.string()),
    mediaStorageId: v.optional(v.id('_storage')),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id('_storage')),
    author: v.string(),
    authorId: v.string(),
    authorImageUrl: v.string(),
    voicePrompt: v.string(),
    imagePrompt: v.optional(v.string()),
    voiceType: v.string(),
    mediaDuration: v.number(),
    views: v.number(),
    mediaTtype: v.string(),
  })
    .searchIndex('search_author', { searchField: 'author' })
    .searchIndex('search_title', { searchField: 'mediaTitle' })
    .searchIndex('search_body', { searchField: 'mediaDescription' }),
  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    name: v.string(),
    isActive: v.boolean(),
    isAdmin: v.boolean(),
  })
});
