// src/app/country/[country]/page.tsx

import { Metadata } from "next";

// This defines metadata dynamically
export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> { 
  const countryName = params.country; // `params` is fine to use here; it's awaited automatically for metadata
  return {
    title: `${countryName} - Geo Hints`,
    description: `Hints and details for ${countryName}`,
  };
}

interface Props {
  params: {
    country: string;
  };
}

const CountryPage = async ({ params }: Props) => {
  const country = params.country; // `params` here is already resolved by Next.js
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/country/${country}`);

  if (!response.ok) {
    return <div>Error: Country not found</div>;
  }

  const countryInfo = await response.json();

  return (
    <div>
      <h1>{countryInfo.country}</h1>
      <p>{countryInfo.hint}</p>
    </div>
  );
};

export default CountryPage;
