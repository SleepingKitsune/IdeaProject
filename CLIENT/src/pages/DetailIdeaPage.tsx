import React, { useEffect, useState, type FormEvent } from "react";
import type { ICategory, IIdea, IPecture } from "../components/interfaces/IIdea";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import '../styles/DetailPage.css'

interface AllIdeasState {
  ideas: IRes_Idea;
  isLoading: boolean;
  error: string | null;
}

interface IUser {
  id: number,
  nickname: string
}

export interface IIdea_res {
    id: number
    category: ICategory
    name_idea: string
    desc: string
    pictures: IPecture[]
    main_picture: string
    date_create: string
    likes: number
    status: string
    need_part: boolean
    user:IUser
}
export interface IRes_Idea {
    data:IIdea_res
}

export const setLike = (e: FormEvent<HTMLFormElement>, id: number) => {
  e.preventDefault();
  axios.post(`http://localhost:3000/like`, {idIdea:id}, {withCredentials:true})
}

interface category_res {
  data: ICategory
}

const DetailIdeaPage = () => {
    const [searchParams] = useSearchParams();
    const [category, setCategoryes] = useState<ICategory[]>();
    const navigate = useNavigate();
  const [state, setState] = useState<AllIdeasState>({
    ideas: {} as IRes_Idea,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const id = searchParams.get('id'); 
        const response:IRes_Idea = await axios.get(`http://localhost:3000/idea/${id}`, {
          withCredentials: true,
        });

        const category:category_res = await axios.get("http://localhost:3000/category")
        setCategoryes(category.data)
        if (response.data) {

          setState({ ideas: response, isLoading: false, error: null });
        } else {
          setState({ ideas: {} as IRes_Idea, isLoading: false, error: null });
        }
      } catch (err) {
        console.error("Ошибка при загрузке идей:", err);
        setState({
          ideas: {} as IRes_Idea,
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

  if (!state.ideas) {
    return (
      <div className="all-ideas-container">
        <p>В базе данных пока нет ни одной идеи.</p>
      </div>
    );
  }
  const date = new Date(state.ideas.data.date_create);
  const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;

  return (
    <div className="detail-wrapper">
      <div key={state.ideas.data.id} className="detail-idea-card">
        {state.ideas.data.main_picture && (
          <img
            src={`http://localhost:3000/static/${state.ideas.data.main_picture}`}
            alt={state.ideas.data.name_idea}
            className="detail-idea-image"
          />
        )}
        <div className="detail-idea-content">
          <h3 className="detail-idea-title">{state.ideas.data.name_idea}</h3>
          <div className="detail-idea-meta">
            Категория: {category?.find((x) => x.id === state.ideas.data.category.id)?.category_name} | Дата создания: {formattedDate}
          </div>
          <p className="detail-idea-desc">{state.ideas.data.desc}</p>
          <p>Статус {state.ideas.data.status}</p>
          <p>Нужны ли люди на проекте?: {state.ideas.data.need_part ? " Да" : " Нет"}</p>
          <p onClick={() => { navigate(`/profile?id=${state.ideas.data.user.id}`) }}>Автор: {state.ideas.data.user.nickname}</p>
          <p>Лайки: {state.ideas.data.likes}</p>
          <form onSubmit={(event) => setLike(event, state.ideas.data.id)}>
            <input type="submit" value="Like" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default DetailIdeaPage;