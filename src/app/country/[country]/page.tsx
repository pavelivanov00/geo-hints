
import { Metadata } from "next";


export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const countryName = params.country;
  return {
    title: `${countryName} - Geo Hints`,
    description: `Hints and details for ${countryName}`,
  };
}

export async function getCountryInfo(country: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/country/${country}`);

  if (!response.ok) {
    throw new Error('Failed to fetch country info');
  }

  return response.json();
}

interface Props {
  params: {
    country: string;
  };
}

const CountryPage = async ({ params }: Props) => {
  const country = params.country;
  const countryInfo = await getCountryInfo(country);

  return (
    <div>
      {countryInfo.length > 0 && <h1>{countryInfo[0].country}</h1>}
      {countryInfo.map((entry: any, index: number) =>
        entry.type === "image" ? (
          <img key={index} src={entry.hint} alt={`${entry.country} hint`} />
        ) : (
          <p key={index}>{entry.hint}</p>
        )
      )}
    </div>
  );
};

export default CountryPage;
