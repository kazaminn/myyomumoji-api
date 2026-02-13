import { z } from "zod";

export const hexColorSchema = z
  .string()
  .regex(
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
    "有効なHEXカラー（#RGB または #RRGGBB）を指定してください"
  );
