import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// Set the deletedAt setting
prisma.$use(async (params, next) => {
  if (params.model === "Package") {
    if (params.action == "delete") {
      // Delete queries
      // Change action to an update
      params.action = "update";
      params.args["data"] = { deletedAt: new Date() }; // Set deletedAt to current date
    }
    if (["findMany", "findFirst", "findUnique"].includes(params.action)) {
      if (params.args?.where?.deletedAt === undefined) {
        params.args.where = {
          ...params.args.where,
          deletedAt: null, // default filter
        };
      }
    }
  }
  return next(params);
});

export default prisma;
