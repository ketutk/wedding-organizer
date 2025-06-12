import prisma from "@/lib/prisma"; // Adjust if your Prisma client is elsewhere
import { verifySession } from "@/app/_lib/session";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

// Enable edge function's request body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

    const search = searchParams.get("search") || "";
    const limit = 10; // Number of items per page
    const offset = (page - 1) * limit;

    const totalPackages = await prisma.package.count({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    const packages = (await prisma.package.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    })) as any[];

    const totalPages = Math.ceil(totalPackages / limit);
    packages.forEach((pkg) => {
      pkg.price = pkg.price.toString(); // Ensure price is a string
    });

    return NextResponse.json({
      success: true,
      data: {
        packages,
        page,
        total_pages: totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await verifySession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseInt(formData.get("price") as string);
    const imageFile = formData.get("image") as File;

    if (!name || !imageFile || typeof imageFile === "string") {
      return NextResponse.json({ error: "Name and image are required" }, { status: 400 });
    }

    // Generate a unique filename
    const fileExt = imageFile.name.split(".").pop();
    const filename = `${randomUUID()}.${fileExt}`;

    // Define local path
    const uploadDir = path.join(process.cwd(), "public", "images", "packages");
    const filePath = path.join(uploadDir, filename);

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await writeFile(filePath, buffer);

    const imageUrl = `/images/packages/${filename}`;

    // Save to database
    const newPackage = await prisma.package.create({
      data: {
        name,
        description,
        price,
        image: imageUrl,
      },
    });

    const responseData = {
      ...newPackage,
      price: newPackage.price.toString(), // Ensure price is a string
    };
    return NextResponse.json({ success: true, data: responseData });
  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
