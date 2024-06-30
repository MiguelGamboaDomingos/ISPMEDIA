import { ConvexError, v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const getUserById = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    return user;
  },
});

export const getTopUserByMediaCount = query({
  args: {},
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();

    const userData = await Promise.all(
      users.map(async (u) => {
        const medias = await ctx.db
          .query("medias")
          .filter((q) => q.eq(q.field("authorId"), u.clerkId))
          .collect();

        const sortedMedias = medias.sort((a, b) => b.views - a.views);

        return {
          ...u,
          totalMedias: medias.length,
          media: sortedMedias.map((m) => ({
            mediaTitle: m.mediaTitle,
            mediaId: m._id,
          })),
        };
      })
    );

    return userData.sort((a, b) => b.totalMedias - a.totalMedias);
  },
});

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    name: v.string(),
    isActive: v.boolean(),
    isAdmin: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      imageUrl: args.imageUrl,
      name: args.name,
      isActive: args.isActive,
      isAdmin: args.isAdmin,
    });
  },
});

export const updateUser = internalMutation({
  args: {
    clerkId: v.string(),
    imageUrl: v.string(),
    email: v.string(),
    isActive: v.boolean(),
    isAdmin: v.boolean(),
  },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      imageUrl: args.imageUrl,
      email: args.email,
      isActive: args.isActive,
      isAdmin: args.isAdmin,
    });

    const medias = await ctx.db
      .query("medias")
      .filter((q) => q.eq(q.field("authorId"), args.clerkId))
      .collect();

    await Promise.all(
      medias.map(async (m) => {
        await ctx.db.patch(m._id, {
          authorImageUrl: args.imageUrl,
        });
      })
    );
  },
});

export const deleteUser = internalMutation({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.delete(user._id);
  },
});
