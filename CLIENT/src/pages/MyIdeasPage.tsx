import axios from "axios";
import React, { useEffect, useState } from "react";
import type { IIdea } from "../components/interfaces/IIdea";
import { NavLink } from "react-router-dom";
import type { IIdea_res } from "./EditIdeaPage";
import '../styles/MyIdeaPage.css';

interface MyIdeasState {
  ideas: IIdea[] | null;
  isLoading: boolean;
  error: string | null;
}

const delete_idea = async(id:number, value:number, set:React.Dispatch<React.SetStateAction<number>>) => {
  try {
    await axios.delete(`http://localhost:3000/idea/${id}`, {
      withCredentials: true,
    });
    set(value+1);
  } catch (err) {
    alert("Ошибка при удалении.");
  }
}

const MyIdeasPage = () => {
  const [state, setState] = useState<MyIdeasState>({
    ideas: null,
    isLoading: true,
    error: null,
  });

  const [updateeffect, setupdateeffect] = useState<number>(0)

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await axios.get("http://localhost:3000/idea/getall/forUser", {
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
          error: "Не удалось загрузить список идей. Попробуйте обновить страницу.",
        });
      }
    };

    fetchIdeas();
  }, [updateeffect]);

  if (state.isLoading) {
    return <p>Загрузка ваших идей...</p>;
  }

  if (state.error) {
    return <p className="text-danger">{state.error}</p>;
  }

  if (!state.ideas || state.ideas.length === 0) {
    return (
      <div className="ideas-container">
        <p>У вас пока нет идей. Создайте первую!</p>
      </div>
    );
  }

  return (
    <div className="ideas-container">
      {state.ideas.map((e) => {
        const date = new Date(e.date_create);
        const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;

        return (
          <div key={e.id} className="idea-card">
            {/* Проверка на наличие картинки */}
            {e.main_picture && (
              <img src={`http://localhost:3000/static/${e.main_picture}`} alt={e.name_idea} />
            )}
            <div className="idea-content">
              <h3 className="idea-title">{e.name_idea}</h3>
              <div className="idea-meta">
                Категория ID: {e.category} | Дата создания: {formattedDate}
              </div>
              <p className="idea-desc">{e.desc}</p>
              <p>Лайки {e.likes}</p>
              <div className="idea-actions">
                <button
                  className="btn btn-delete"
                  onClick={()=>delete_idea(e.id, updateeffect, setupdateeffect)}
                >
                  Удалить
                </button>
                <NavLink to={`/EditIdea?id=${e.id}`} className="btn btn-edit">
                  Редактировать
                </NavLink>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyIdeasPage;