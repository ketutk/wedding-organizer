import { NextResponse } from "next/server";
import path from "path";
import { randomUUID } from "crypto";
import { unlink, writeFile } from "fs/promises";
import { verifySession } from "@/app/_lib/session";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await verifySession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseInt(formData.get("price") as string);
    const imageFile = formData.get("image") as File | null;

    if (!id) {
      return NextResponse.json({ error: "Package ID is required" }, { status: 400 });
    }

    // Fetch existing package
    const existingPackage = await prisma.package.findUnique({
      where: { id },
    });

    if (!existingPackage) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    let imageUrl = existingPackage.image;

    if (imageFile && typeof imageFile !== "string") {
      // Delete old image
      if (existingPackage.image) {
        const oldImagePath = path.join(process.cwd(), "public", existingPackage.image);
        try {
          await unlink(oldImagePath);
        } catch (err) {
          console.warn("Failed to delete old image:", err);
        }
      }

      // Save new image
      const fileExt = imageFile.name.split(".").pop();
      const filename = `${randomUUID()}.${fileExt}`;
      const uploadDir = path.join(process.cwd(), "public", "images", "packages");
      const filePath = path.join(uploadDir, filename);

      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await writeFile(filePath, buffer);
      imageUrl = `/images/packages/${filename}`;
    }

    // Update the package
    const updatedPackage = await prisma.package.update({
      where: { id },
      data: {
        name,
        description,
        price,
        image: imageUrl,
      },
    });

    const responseData = {
      ...updatedPackage,
      price: updatedPackage.price.toString(),
    };

    return NextResponse.json({ success: true, data: responseData });
  } catch (error) {
    console.error("Error updating package:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Optional: Validate UUID format
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Delete the package
    await prisma.package.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Package deleted successfully" });
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 });
  }
}
