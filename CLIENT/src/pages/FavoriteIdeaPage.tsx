import React, { useEffect, useState, type FormEvent } from "react";
import type { IIdea } from "../components/interfaces/IIdea";
import type { IIdea_res } from "./EditIdeaPage";
import axios from "axios";
import { setLike } from "./DetailIdeaPage";
import '../styles/FavoriteIdea.css'

const FavoriteIdeaPage = () => {
const [state, setState] = useState<AllIdeasState>({
    ideas: null,
    isLoading: true,
    error: null,
  });
interface AllIdeasState {
  ideas: IIdea[] | null;
  isLoading: boolean;
  error: string | null;
}

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await axios.get("http://localhost:3000/like", {
          withCredentials: true,
        });

        if (response.data && response.data.length > 0) {
          const formattedIdeas = response.data.map((e: IIdea_res) => ({
            id: e.id,
            category: e.category.id,
            name_idea: e.name_idea,
            desc: e.desc,
            pictures: e.pictures,
            main_picture: e.main_picture,
            date_create: e.date_create,
            likes: e.likes,
            status: e.status,
            need_part: e.need_part,
          }));
          setState({ ideas: formattedIdeas, isLoading: false, error: null });
        } else {
          setState({ ideas: [], isLoading: false, error: null });
        }
      } catch (err) {
        console.error("Ошибка при загрузке идей:", err);
        setState({
          ideas: null,
          isLoading: false,
          error:
            "Не удалось загрузить список идей. Возможно, сервер недоступен или возникла ошибка.",
        });
      }
    };

    fetchIdeas();
  }, []);

  if (state.isLoading) {
    return <p>Загрузка всех идей...</p>;
  }

  if (state.error) {
    return <p className="text-danger">{state.error}</p>;
  }

  if (!state.ideas || state.ideas.length === 0) {
    return (
      <div className="all-ideas-container">
        <p>В базе данных пока нет ни одной идеи.</p>
      </div>
    );
  }

  return (
    <div className="favoriteIdeaPage-container">
        {/* Заголовок секции */}
        <h1 className="favoriteIdeaPage-title">Избранное</h1>
        
        {/* Контейнер-сетка для карточек */}
        <div className="favoriteIdeaPage-grid">
            {state.ideas.map((e) => {
                const date = new Date(e.date_create);
                const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;

                return (
                    <article key={e.id} className="favoriteIdeaPage-card">
                        {e.main_picture && (
                            <img src={`http://localhost:3000/static/${e.main_picture}`} alt={e.name_idea} />
                        )}
                        <div className="favoriteIdeaPage-content">
                            <h3 className="favoriteIdeaPage-title-text">{e.name_idea}</h3>
                            
                            <div className="favoriteIdeaPage-meta">
                                Категория ID: {e.category} | Дата создания: {formattedDate}
                            </div>

                            <p className="favoriteIdeaPage-desc">{e.desc}</p>

                            <div className="favoriteIdeaPage-button-group">
                                <form onSubmit={(event)=>setLike(event, e.id)}>
                                    <button type="submit" className="favoriteIdeaPage-like-btn">
                                        👍 Лайк ({e.likes})
                                    </button>
                                </form>
                                {/* Можно добавить кнопку перехода к идее, если нужно */}
                            </div>
                        </div>
                    </article>
                )
            })}
        </div>
    </div>
  );
}

export default FavoriteIdeaPage;