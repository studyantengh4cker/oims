"use server";

import prisma from "@/lib/db";

export const getOfficeUsers = async (office: string) => {
  try {
    const users = await prisma.account.findMany({ where: { office } });
    return users;
  } catch (error) {
    throw new Error("Failed Fetching");
  }
};

export const getAdmin = async (office: string) => {
  try {
    const users = await prisma.account.findFirst({
      where: { office, role: "ADMIN" },
    });
    return users;
  } catch (error) {
    throw new Error("Failed Fetching");
  }
};
