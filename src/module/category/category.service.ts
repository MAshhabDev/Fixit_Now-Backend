import { prisma } from "../../lib/prisma";

const createCategory = async (payload: any) => {
  const { name, description } = payload;

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
