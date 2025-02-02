import { Metadata } from "next";
import "./styles.css";
import GoBackButton from "./GoBackButton";

export async function generateMetadata({ params }: any): Promise<Metadata> {
    const countryName = decodeURIComponent(params.country);
    return {
        title: `${countryName} - Geo Hints`,
        description: `Hints and details for ${countryName}`,
    };
}

type CountryHint = {
    country: string;
    hint: string;
    type: "image" | "text";
    description?: string;
}

function capitalizeFirstLetter(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

async function getCountryInfo(country: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/country/${country}`);

    if (!response.ok) {
        const errorData = await response.json();
        return { status: response.status, message: errorData.message };
    }

    return response.json();
}

const CountryPage = async ({ params }: any) => {
    if (!params?.country) {
        return (
            <div className="mainContainer center">
                <p>Error: Missing country parameter.</p>
            </div>
        );
    }

    const country = decodeURIComponent(params.country);
    const countryName = capitalizeFirstLetter(country);

    try {
        const countryInfo = await getCountryInfo(country);

        if (countryInfo.status === 404) {
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
                {countryInfo.length > 0 && (
                    <div className="flexbox">
                        <GoBackButton />
                        <h1 className="countryName">
                            {capitalizeFirstLetter(countryInfo[0].country)}
                        </h1>
                    </div>
                )}

                {countryInfo.map((entry: CountryHint, index: number) =>
                    entry.type === "image" ? (
                        <div key={index} className="hintsWrapper">
                            <div className="hintFlexbox marginTop">
                                <img
                                    className="image"
                                    src={entry.hint}
                                    alt={`${entry.country} hint`}
                                />
                                <div className="imageDescription">{entry.description}</div>
                            </div>
                        </div>
                    ) : (
                        <p key={index} className="marginTop">{entry.hint}</p>
                    )
                )}
            </div>
        );
    } catch (error) {
        console.error("Failed to fetch country data:", error);

        return (
            <div className="mainContainer center">
                <div className="flexbox">
                    <GoBackButton />
                    <h1 className="countryName">{countryName}</h1>
                </div>
                <p className="marginTop fontSize20">An error occurred while fetching the data.</p>
            </div>
        );
    }
};

export default CountryPage;

