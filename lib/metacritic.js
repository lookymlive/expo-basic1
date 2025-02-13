export async function getLatestGames() {
  const LATEST_GAMES =
    "https://api.rawg.io/api/games?key=1bd91da0ae9a4f058a191e34acc45622&ordering=-metacritic&dates=1958-01-01,2024-12-31&page_size=24";

  try {
    console.log(`Fetching latest games from: ${LATEST_GAMES}`);
    const rawData = await fetch(LATEST_GAMES);
    if (!rawData.ok) {
      throw new Error(`HTTP error! status: ${rawData.status}`);
    }
    const json = await rawData.json();

    const { results } = json;

    console.log(`Fetched ${results.length} games`);

    return results.map((item) => {
      const { name, slug, released, background_image, metacritic, description_raw } = item;

      return {
        description: description_raw,
        releaseDate: released,
        score: metacritic,
        slug,
        title: name,
        image: background_image,
      };
    });
  } catch (error) {
    console.error("Failed to fetch latest games:", error);
    throw error;
  }
}

export async function getGameDetails(slug) {
  const GAME_DETAILS = `https://api.rawg.io/api/games/${slug}?key=1bd91da0ae9a4f058a191e34acc45622`;

  try {
    console.log(`Fetching game details for slug: ${slug} from: ${GAME_DETAILS}`);
    const rawData = await fetch(GAME_DETAILS);
    if (!rawData.ok) {
      throw new Error(`HTTP error! status: ${rawData.status}`);
    }
    const json = await rawData.json();

    const { name, description_raw, metacritic, background_image, reviews_text_count } = json;

    console.log(`Fetched details for game: ${name}`);

    // get the reviews
    const reviews = Array(reviews_text_count).fill({
      quote: "Review not available",
      score: metacritic,
      date: "",
      publicationName: "",
      author: "",
    });

    return {
      img: background_image,
      title: name,
      slug,
      description: description_raw,
      score: metacritic,
      reviews,
    };
  } catch (error) {
    console.error(`Failed to fetch game details for slug ${slug}:`, error);
    throw error;
  }
}
