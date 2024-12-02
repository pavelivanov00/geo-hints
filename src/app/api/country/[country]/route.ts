import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export async function GET(req: Request) {
  if (!req.url) {
    return NextResponse.json({ message: 'Invalid request URL' }, { status: 400 });
  }

  const url = new URL(req.url);
  const country = url.pathname.split('/').pop();

  if (!country) {
    return NextResponse.json({ message: 'Country not found in URL' }, { status: 404 });
  }

  const client = await clientPromise;
  const db = client.db('geo-hints');
  const countriesCollection = db.collection('hints');

  const countryCursor = countriesCollection.find({ country: country });

  const countryInfo = await countryCursor.toArray();

  if (countryInfo.length === 0) {
    return NextResponse.json({ message: 'Country not found' }, { status: 404 });
  }

  return NextResponse.json(countryInfo);
}
