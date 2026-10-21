import{z}from"zod";export const collectionSchema=z.object({name:z.string().trim().min(1).max(80)});export const tagSchema=z.object({name:z.string().trim().min(1).max(40)});
