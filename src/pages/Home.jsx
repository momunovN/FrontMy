import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MovieCard from "../components/MovieCard";

const TMDB_API_KEY = "09d13e03c0c446ac654cd31df8281f63";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function Home() {
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [popRes, topRes] = await Promise.all([
          fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=ru-RU&page=1`),
          fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=ru-RU&page=1`),
        ]);

        const popData = await popRes.json();
        const topData = await topRes.json();

        const formatted = (items) =>
          items.map((m) => ({
            ...m,
            posterUrlPreview: m.poster_path ? `${IMAGE_BASE_URL}${m.poster_path}` : null,
            nameRu: m.title,
            ratingKinopoisk: m.vote_average,
            year: m.release_date?.split("-")[0] || "—",
          }));

        setPopular(formatted(popData.results));
        setTopRated(formatted(topData.results));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 5,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4, slidesToScroll: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 768,  settings: { slidesToShow: 2.4, slidesToScroll: 2, arrows: false } },
      { breakpoint: 480,  settings: { slidesToShow: 1.4, slidesToScroll: 1, arrows: false } },
    ],
  };

  if (loading) {
    return (
      <div className="container-centered py-20 text-center text-2xl sm:text-3xl">
        Загрузка фильмов...
      </div>
    );
  }

  return (
    <div className="container-centered py-8 sm:py-12">
      <section className="mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-6 sm:mb-10">
          Популярное сейчас
        </h2>
        <Slider {...sliderSettings} className="movie-slider">
          {popular.slice(0, 15).map((movie) => (
            <div key={movie.id} className="px-2 sm:px-3">
              <MovieCard movie={movie} size="small" />
            </div>
          ))}
        </Slider>
      </section>

      <section>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-6 sm:mb-10">
          Топ рейтинга
        </h2>
        <Slider {...sliderSettings} className="movie-slider">
          {topRated.slice(0, 15).map((movie) => (
            <div key={movie.id} className="px-2 sm:px-3">
              <MovieCard movie={movie} size="small" />
            </div>
          ))}
        </Slider>
      </section>
    </div>
  );
}