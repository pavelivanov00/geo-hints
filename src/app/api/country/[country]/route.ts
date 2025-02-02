import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function GET(req: NextRequest, context: any) {
  try {
    const { params } = context;
    const countryName = decodeURIComponent(params.country);

    const client = await clientPromise;
    const db = client.db("geo-hints");
    const countriesCollection = db.collection("hints");

    const countryInfo = await countriesCollection.find({ country: countryName }).toArray();

    if (!countryInfo || countryInfo.length === 0) {
      return NextResponse.json(
        { message: `No hints added yet for this country` },
        { status: 404 }
      );
    }

    return NextResponse.json(countryInfo);
  } catch (error) {
    console.error("Error fetching country info:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}