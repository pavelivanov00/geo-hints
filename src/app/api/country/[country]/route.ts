import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export async function GET(req: Request, context: { params: { country: string } }) {
  const { params } = context;

  const country = await params.country;

  if (!country) {
    return NextResponse.json({ message: 'Country parameter is missing' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('geo-hints');
    const countriesCollection = db.collection('hints');

    const countryInfo = await countriesCollection.findOne({ country });

    if (!countryInfo) {
      return NextResponse.json({ message: 'Country not found' }, { status: 404 });
    }

    return NextResponse.json(countryInfo);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: 'Internal Server Error', error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: 'Internal Server Error', error: 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
