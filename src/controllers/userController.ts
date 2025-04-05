import type { Context } from "hono";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import { deleteCookie, setCookie } from "hono/cookie";

//signup
export const signup = async (c: Context) => {
  try {
    const { username, password } = await c.req.json();

    const exists = await prisma.user.findUnique({ where: { username } });
    if (exists) {
      return c.json({ success: false, message: "User already exists" }, 400);
    }

    if (!username || !password) {
      return c.json({ error: "Username and password are required" }, 400);
    }

    if (password.length < 8) {
      return c.json(
        { success: false, message: "Please enter a strong password" },
        400
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    return c.json({ message: "User created successfully" }, 201);
  } catch (error) {
    console.error("Error in signup:", error);
    return c.json({ error: "Internal server error" }, 400);
  }
};

//signin
export const signin = async (c: Context) => {
  try {
    const createToken = (id: string) => {
      return jwt.sign({ id }, process.env.JWT_SECRET as string);
    };
    const { username, password } = await c.req.json();
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return c.json({ error: "User not found" }, 400);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user.id);

      setCookie(c, "token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60,
        sameSite: "Strict",
        path: "/",
      });

      return c.json(
        {
          success: true,
          message: "signin successful",
          user: { id: user.id, username: user.username, token },
        },
        200
      );
    } else {
      return c.json({ error: "Invalid credentials" }, 400);
    }
  } catch (error) {
    console.error("Error in signin:", error);
    return c.json({ error: "Internal server error" }, 400);
  }
};

//signout
export const signout = async (c: Context) => {
  deleteCookie(c, "token");
  return c.json({ message: "signout successful" }, 200);
};
