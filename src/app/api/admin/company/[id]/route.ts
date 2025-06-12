import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust if your Prisma client is elsewhere
import { verifySession } from "@/app/_lib/session";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await verifySession();

    if (!session || session.role !== "Admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const company = await prisma.company.findUnique({
      where: {
        id,
      },
      include: {
        questionnaires: {
          where: {
            isActive: true,
          },
          include: {
            _count: {
              select: {
                feedbacks: {
                  where: {
                    sentiment: "Positive",
                  },
                },
              },
            },
          },
        },
        owner: true,
        _count: {
          select: {
            feedbacks: true,
          },
        },
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const feedbacks = await prisma.feedback.groupBy({
      by: ["sentiment"],
      where: {
        companyId: company.id,
      },
      _count: {
        sentiment: true,
      },
    });

    company.owner.password = "";

    return NextResponse.json({
      success: true,
      data: {
        company,
        feedbacks,
      },
    });
  } catch (error) {
    console.error("Error fetching questionnaires:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
