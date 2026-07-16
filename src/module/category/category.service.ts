import { prisma } from "../../lib/prisma";
import type { ICreateCategory } from "./category.interface";

const createCategory = async (payload: ICreateCategory) => {
  const { name, description } = payload;

  if (!name || !description) {
    throw new Error("Name and description are required!");
  }

  // Check if a category with the same name already exists (case-insensitive)
  const categoryExists = await prisma.category.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });

  if (categoryExists) {
    throw new Error("Category with this name already exists!");
  }

  const result = await prisma.category.create({
    data: {
      name,
      description,
    },
  });

  return result;
};

const getAllCategory = async () => {
  const result = await prisma.category.findMany();

  return result;
};

const getAllCategories = async (isActive: boolean) => {
  const result = await prisma.category.findMany({
    where: {
      isActive
    },
  });

  return result;
};

export const categoryService = {
  createCategory,
  getAllCategory,
  getAllCategories,
};
