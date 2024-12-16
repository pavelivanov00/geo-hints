import { Metadata } from "next";
import "./styles.css";
import GoBackButton from './GoBackButton';

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const countryName = decodeURIComponent(params.country);
  return {
    title: `${countryName} - Geo Hints`,
    description: `Hints and details for ${countryName}`,
  };
}

export async function getCountryInfo(country: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/country/${country}`);

  if (!response.ok) {
    const errorData = await response.json();
    return { status: response.status, message: errorData.message };
  }

  return response.json();
}

interface Props {
  params: {
    country: string;
  };
}

function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const CountryPage = async ({ params }: Props) => {
  const country = decodeURIComponent(params.country);
  const countryName = capitalizeFirstLetter(country);

  const countryInfo = await getCountryInfo(country);

  if (countryInfo.status === 404) {
    console.log(countryInfo)
    return (
      <div className="mainContainer center">
        <div className="flexbox">
          <GoBackButton />
          <h1 className="countryName">{countryName}</h1>
        </div>
        <p className="marginTop fontSize20">{countryInfo.message}</p>
      </div>
    );
  }

  return (
    <div className="mainContainer center">
      {countryInfo.length > 0 &&
        <div className="flexbox">
          <GoBackButton />
          <h1 className="countryName">
            {capitalizeFirstLetter(countryInfo[0].country)}
          </h1>
        </div>
      }

      {
        countryInfo.map((entry: any, index: number) =>
          entry.type === "image" ? (
            <img className="marginTop smallerSize" key={index} src={entry.hint} alt={`${entry.country} hint`} />
          ) : (
            <p key={index} className="marginTop">{entry.hint}</p>
          )
        )
      }
    </div>
  );
};

export default CountryPage;
