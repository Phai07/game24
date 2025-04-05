import type { Context, Next } from "hono";
import jwt from "jsonwebtoken";

const authUser = async (c: Context, next: Next) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return c.json(
      { success: false, message: "Not Authorized, login again" },
      401
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    c.set("user", decoded.id);

    await next();
  } catch (error: any) {
    console.error("JWT verify error:", error);
    return c.json({ success: false, message: error.message }, 401);
  }
};

export default authUser;
