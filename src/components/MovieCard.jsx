import { Link } from "react-router-dom";
import { Card, Icon, Text, Label, Flex } from "@gravity-ui/uikit";
import { Star, Calendar } from "@gravity-ui/icons";

export default function MovieCard({ movie, size = "medium" }) {
  const poster = movie.posterUrlPreview || 
    (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 
    "https://via.placeholder.com/300x450?text=Нет+постера");

  const title = movie.title || movie.nameRu || "Без названия";
  const year = movie.year || movie.release_date?.split("-")[0] || "—";
  const rating = movie.vote_average || movie.ratingKinopoisk;

  const isSmall = size === "small";

  return (
    <Link to={`/movie/${movie.id}`} className="block w-full h-full group">
      <Card 
        view="outlined" 
        theme="warning"
        className="h-full overflow-hidden rounded-2xl border border-gray-800 group-hover:border-[var(--primary)]/60 transition-all duration-300"
      >
        <div className="relative aspect-[2/3]">
          <img
            src={poster}
            alt={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 gradient-overlay pointer-events-none" />

          {rating > 0 && (
            <div className="absolute top-3 left-3 z-10">
              <Label 
                theme="warning" 
                size={isSmall ? "s" : "m"}
                className="!bg-[var(--primary)] !text-black !font-bold shadow-lg"
              >
                <Flex gap={1} className="items-center" align="center">
                  <Icon data={Star} size={isSmall ? 12 : 14} />
                  {rating.toFixed(1)}
                </Flex>
              </Label>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <Text 
              variant={isSmall ? "subheader-2" : "header-2"} 
              className="line-clamp-2 font-bold leading-tight mb-1.5"
            >
              {title}
            </Text>
            <Flex gap={2} align="center" className="text-sm opacity-80">
              <Icon data={Calendar} size={14} />
              <span>{year}</span>
            </Flex>
          </div>
        </div>
      </Card>
    </Link>
  );
}