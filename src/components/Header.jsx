import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import { Button, TextInput, Icon, Avatar, Tooltip } from "@gravity-ui/uikit";
import { Magnifier, Ticket, Filmstrip, PersonFill, ArrowRightFromSquare } from "@gravity-ui/icons";

export default function Header() {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="bg-[#0a0a0a] border-b border-gray-800/70 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container-centered flex items-center justify-between py-3 sm:py-4">
        
        {/* Логотип */}
        <Link 
          to="/" 
          className="text-3xl sm:text-4xl font-black text-[var(--primary)] tracking-tight hover:opacity-90 transition"
        >
          NEWKINO
        </Link>

        {/* Поиск */}
        <div className="hidden md:flex flex-1 max-w-xl mx-6 lg:mx-10">
          <form onSubmit={handleSearch} className="w-full relative">
            <TextInput
              size="xl"
              placeholder="Поиск фильмов..."
              value={searchQuery}
              onUpdate={setSearchQuery}
              hasClear
              leftContent={<Icon data={Magnifier} size={18} className="text-gray-500" />}
              className="!bg-[#111] !border-gray-700 focus:!border-[var(--primary)] focus:!ring-[var(--primary)]/30"
            />
          </form>
        </div>

        {/* Мобильная иконка поиска */}
        <Link to="/search" className="md:hidden p-2 -mr-2">
          <Icon data={Magnifier} size={24} className="text-gray-300" />
        </Link>

        {/* Навигация и авторизация */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Tooltip content="Каталог">
            <Link to="/movies" className="hidden sm:flex items-center gap-2 text-gray-300 hover:text-white transition">
              <Icon data={Filmstrip} size={20} />
              <span className="text-sm font-medium">Фильмы</span>
            </Link>
          </Tooltip>

          {user ? (
            <div className="flex items-center gap-3 sm:gap-5">
              <Link 
                to="/history" 
                className="flex items-center gap-2 text-gray-300 hover:text-[var(--primary)] transition"
              >
                <Icon data={Ticket} size={20} />
                <span className="hidden sm:inline text-sm font-medium">Билеты</span>
              </Link>

              <div className="flex items-center gap-2 sm:gap-3">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="avatar" 
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-[var(--primary)]/60"
                    onError={(e) => e.target.src = "https://via.placeholder.com/36?text=?"}
                  />
                ) : (
                  <Avatar 
                    icon={PersonFill} 
                    size="m" 
                    className="bg-gray-700 border-2 border-[var(--primary)]/60"
                  />
                )}
                <div className="hidden sm:block">
                  <div className="text-sm font-medium leading-tight">
                    {user.displayName || user.email?.split('@')[0]}
                  </div>
                  {user.provider === 'yandex' && (
                    <div className="text-xs text-[var(--primary)]">Яндекс</div>
                  )}
                </div>
              </div>

              <Button 
                view="outlined" 
                size="s" 
                onClick={logout}
                className="!border-gray-600 hover:!border-red-600/70 hover:!text-red-400"
              >
                <Icon data={ArrowRightFromSquare} size={16} />
                <span className="hidden sm:inline ml-1.5">Выйти</span>
              </Button>
            </div>
          ) : (
            <Button 
              view="action" 
              size="l" 
              onClick={() => setShowModal(true)}
              className="!bg-[var(--primary)] !text-black hover:!bg-[var(--primary-dark)] !font-bold"
            >
              Войти
            </Button>
          )}
        </div>
      </div>

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </header>
  );
}