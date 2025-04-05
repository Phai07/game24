import prisma from "../config/db.js";
import type { Context } from "hono";

type Operation = "+" | "-" | "*" | "/";
type Expression = { expr: string; value: number };

export async function solveGame24(c: Context) {
  const { numbers } = await c.req.json();
  if (
    !Array.isArray(numbers) ||
    numbers.length !== 4 ||
    !numbers.every((n) => typeof n === "number")
  ) {
    return c.json(
      { error: "Invalid input. Expected array of 4 numbers." },
      400
    );
  }

  const cached = await prisma.answer.findFirst({
    where: { numbers: { equals: numbers } },
  });

  if (cached) {
    return c.json({ cached: true, solutions: cached.solutions });
  }

  const solutions = solve24(numbers);

  const created = await prisma.answer.create({
    data: { numbers, solutions },
  });

  return c.json({ cached: false, solutions: created.solutions });
}

function solve24(numbers: number[]): string[] {
  const solutions: Set<string> = new Set();
  const precision = 1e-6;

  function calculate(current: number[], expressions: string[]): void {
    if (current.length === 1 && Math.abs(current[0] - 24) < precision) {
      solutions.add(expressions[0]);
      return;
    }

    for (let i = 0; i < current.length; i++) {
      for (let j = 0; j < current.length; j++) {
        if (i === j) continue;

        const restNums = current.filter((_, idx) => idx !== i && idx !== j);
        const restExpr = expressions.filter((_, idx) => idx !== i && idx !== j);

        for (const op of ["+", "-", "*", "/"] as Operation[]) {
          if ((op === "+" || op === "*") && i > j) continue;
          if (op === "/" && current[j] === 0) continue;

          let newVal: number;
          let newExpr: string;

          switch (op) {
            case "+":
              newVal = current[i] + current[j];
              newExpr = `(${expressions[i]}+${expressions[j]})`;
              break;
            case "-":
              newVal = current[i] - current[j];
              newExpr = `(${expressions[i]}-${expressions[j]})`;
              break;
            case "*":
              newVal = current[i] * current[j];
              newExpr = `(${expressions[i]}*${expressions[j]})`;
              break;
            case "/":
              newVal = current[i] / current[j];
              newExpr = `(${expressions[i]}/${expressions[j]})`;
              break;
          }

          calculate([newVal, ...restNums], [newExpr, ...restExpr]);
        }
      }
    }
  }

  calculate(numbers, numbers.map(String));
  return Array.from(solutions);
}

export const getAllAnswers = async (c: Context) => {
  const answers = await prisma.answer.findMany();
  return c.json(answers);
};
export const getAnswerById = async (c: Context) => {
  const id = c.req.param("id");
  const answer = await prisma.answer.findUnique({
    where: { id },
  });
  if (!answer) {
    return c.json({ error: "Answer not found" }, 404);
  }
  return c.json(answer);
};
export const updateAnswer = async (c: Context) => {
  const id = c.req.param("id");
  const { solutions } = await c.req.json();
  const answer = await prisma.answer.update({
    where: { id },
    data: { solutions },
  });
  return c.json({ message: "Answer updated successfully", answer });
};
export const deleteAnswer = async (c: Context) => {
  const id = c.req.param("id");
  await prisma.answer.delete({ where: { id } });
  return c.json({ message: "Answer deleted successfully" });
};
