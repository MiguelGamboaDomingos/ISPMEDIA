import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// create media mutation
export const createMedia = mutation({
  args: {
    mediaType: v.string(), // Adicionei um campo para especificar o tipo de mídia (audio ou video)
    mediaStorageId: v.id("_storage"), // ID de armazenamento da mídia (áudio ou vídeo)
    mediaUrl: v.string(), // URL da mídia (áudio ou vídeo)
    imageUrl: v.string(),
    imageStorageId: v.id("_storage"),
    mediaTitle: v.string(),
    mediaDescription: v.string(),
    voicePrompt: v.string(),
    imagePrompt: v.string(),
    voiceType: v.string(),
    views: v.number(),
    mediaDuration: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .collect();

    if (user.length === 0) {
      throw new ConvexError("User not found");
    }

    return await ctx.db.insert("medias", {
      
      mediaStorageId: args.mediaStorageId,
      mediaUrl: args.mediaUrl,
      imageUrl: args.imageUrl,
      imageStorageId: args.imageStorageId,
      mediaTitle: args.mediaTitle,
      mediaDescription: args.mediaDescription,
      voicePrompt: args.voicePrompt,
      imagePrompt: args.imagePrompt,
      voiceType: args.voiceType,
      views: args.views,
      mediaDuration: args.mediaDuration,
      mediaTtype: args.mediaType,
      user: user[0]._id,
      author: user[0].name,
      authorId: user[0].clerkId,
      authorImageUrl: user[0].imageUrl,
    });
  },
});

// this mutation is required to generate the url after uploading the file to the storage.
export const getUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// this query will get all the medias based on the voiceType of the media , which we are showing in the Similar Medias section.
export const getMediaByVoiceType = query({
  args: {
    mediaId: v.id("medias"),
  },
  handler: async (ctx, args) => {
    const media = await ctx.db.get(args.mediaId);

    return await ctx.db
      .query("medias")
      .filter((q) =>
        q.and(
          q.eq(q.field("voiceType"), media?.voiceType),
          q.neq(q.field("_id"), args.mediaId)
        )
      )
      .collect();
  },
});

// this query will get all the medias.
export const getAllMedias = query({
  handler: async (ctx) => {
    return await ctx.db.query("medias").order("desc").collect();
  },
});

// this query will get the media by the mediaId.
export const getMediaById = query({
  args: {
    mediaId: v.id("medias"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.mediaId);
  },
});

// this query will get the medias based on the views of the media , which we are showing in the Trending Medias section.
export const getTrendingMedias = query({
  handler: async (ctx) => {
    const medias = await ctx.db.query("medias").collect();

    return medias.sort((a, b) => b.views - a.views).slice(0, 8);
  },
});

// this query will get the media by the authorId.
export const getMediaByAuthorId = query({
  args: {
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    const medias = await ctx.db
      .query("medias")
      .filter((q) => q.eq(q.field("authorId"), args.authorId))
      .collect();

    const totalAudience = medias.reduce(
      (sum, media) => sum + media.views,
      0
    );

    return { medias, audience: totalAudience };
  },
});

// this query will get the media by the search query.
export const getMediaBySearch = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.search === "") {
      return await ctx.db.query("medias").order("desc").collect();
    }

    const authorSearch = await ctx.db
      .query("medias")
      .withSearchIndex("search_author", (q) => q.search("author", args.search))
      .take(10);

    if (authorSearch.length > 0) {
      return authorSearch;
    }

    const titleSearch = await ctx.db
      .query("medias")
      .withSearchIndex("search_title", (q) =>
        q.search("mediaTitle", args.search)
      )
      .take(10);

    if (titleSearch.length > 0) {
      return titleSearch;
    }

    return await ctx.db
      .query("medias")
      .withSearchIndex("search_body", (q) =>
        q.search("mediaDescription" || "mediaTitle", args.search)
      )
      .take(10);
  },
});

// this mutation will update the views of the media.
export const updateMediaViews = mutation({
  args: {
    mediaId: v.id("medias"),
  },
  handler: async (ctx, args) => {
    const media = await ctx.db.get(args.mediaId);

    if (!media) {
      throw new ConvexError("Media not found");
    }

    return await ctx.db.patch(args.mediaId, {
      views: media.views + 1,
    });
  },
});

// this mutation will delete the media.
export const deleteMedia = mutation({
  args: {
    mediaId: v.id("medias"),
    imageStorageId: v.id("_storage"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const media = await ctx.db.get(args.mediaId);

    if (!media) {
      throw new ConvexError("Media not found");
    }

    await ctx.storage.delete(args.imageStorageId);
    await ctx.storage.delete(args.storageId);
    return await ctx.db.delete(args.mediaId);
  },
});
