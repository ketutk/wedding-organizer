import prisma from "@/lib/prisma"; // Adjust if your Prisma client is elsewhere
import { verifySession } from "@/app/_lib/session";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await verifySession();

    if (!session || session.role !== "Admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const search = searchParams.get("search") || "";
    const limit = 10; // Number of items per page
    const offset = (page - 1) * limit;

    const totalCompanies = await prisma.company.count({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    const companies = await prisma.company.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            feedbacks: true,
          },
        },
      },
      take: limit,
      skip: offset,
    });

    const totalPages = Math.ceil(totalCompanies / limit);

    return NextResponse.json({
      success: true,
      data: {
        companies,
        page,
        total_pages: totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
