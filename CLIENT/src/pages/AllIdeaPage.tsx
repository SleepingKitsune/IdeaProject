import React, { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { ICategory, IIdea } from "../components/interfaces/IIdea";
import type { IIdea_res } from "./EditIdeaPage";
import axios from "axios";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import '../styles/AllIdeaPage.css';

interface AllIdeasState {
  ideas: IIdea[] | null;
  isLoading: boolean;
  error: string | null;
}

const setLike = (e: FormEvent<HTMLFormElement>, id: number) => {
  e.preventDefault();
  axios.post(`http://localhost:3000/like`, {idIdea:id}, {withCredentials:true})
}

interface category_res {
  data: ICategory
}

const AllIdeaPage = () => {
  const navigate = useNavigate();
  const [category, setCategoryes] = useState<ICategory[]>();
  const [ideas, setIdeas] = useState<IIdea_res[]>();
  const [find_fild, set_find_fild] = useState<string>("")
  const [find_category_fild, set_find_category_find] = useState<number | null>(null);
  const [state, setState] = useState<AllIdeasState>({
    ideas: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await axios.get("http://localhost:3000/idea", {
          withCredentials: true,
        });

        const category:category_res = await axios.get("http://localhost:3000/category")
        setCategoryes(category.data)
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
            user: e.user
          }));
          setState({ ideas: formattedIdeas, isLoading: false, error: null });
        } else {
          setState({ ideas: [], isLoading: false, error: null });
        }
        setIdeas(response.data)
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

  function find_for_text(e: ChangeEvent<HTMLInputElement>):any{
    const cur_val = e.target.value
    set_find_fild(e.target.value);
    if (ideas == undefined)
      return;
    let update_list
      if (find_category_fild == null) {
        update_list = ideas.map((x)=>{
          if (x == undefined)
            return
          if ((x.name_idea.includes(cur_val?cur_val:"") || x.desc.includes(cur_val?cur_val:"")))
            return x
        })
      }
      else {
        console.log(123)
        update_list = ideas.map((x)=>{
          if (x == undefined)
            return
          if ((x.name_idea.includes(cur_val?cur_val:"") || x.desc.includes(cur_val?cur_val:"")) && x.category.id == find_category_fild)
            return x
        })
      }
      update_list = update_list.filter((x)=>x != undefined)
    if (update_list == undefined)
      return;
    setState({ideas:update_list, isLoading: false, error: null })
  }

  function find_for_category(e: ChangeEvent<HTMLSelectElement>):any{
    set_find_category_find(e.target.value == "null" ? null : Number(e.target.value));
    let find_idea
    if (state.ideas == null)
      return
    console.log(find_fild)
    if (e.target.value == "null") {
      if (find_fild == "") {
        find_idea = ideas;
        setState({ideas:find_idea, isLoading: false, error: null })
        return
      }
      find_idea = ideas?.map((x)=>{
        if (x == undefined)
          return
        if ((x.name_idea.includes(find_fild?find_fild:"") || x.desc.includes(find_fild?find_fild:"")))
          return x
      })
      find_idea = find_idea?.filter((x)=>x != undefined)
    }
    else{
      if (find_fild == "") {
        find_idea = ideas?.map((x)=>{
          if (x == undefined)
            return
          if (x.category.id == Number(e.target.value))
            return x
        })
        find_idea = find_idea?.filter((x)=>x != undefined)
        setState({ideas:find_idea, isLoading: false, error: null })
        return
      }
      find_idea = ideas?.map((x)=>{
        if (x.category.id == Number(e.target.value) && (x.name_idea.includes(find_fild?find_fild:"") || x.desc.includes(find_fild?find_fild:"")))
          return x
      })
    }
    setState({ideas:find_idea, isLoading: false, error: null })
  }

  return (
<div className="page-wrapper">
    <div className="sidebar">
        <div className="sidebar-card">
            <h3 className="sidebar-title">Фильтры</h3>
            <div className="search-container">
                <div className="search-wrapper">
                    <span className="search-icon">🔍</span> 
                    <input onChange={(e)=>find_for_text(e)} type="text" placeholder="Поиск по содержимому..." />
                </div>
            </div>
            <form>
                <label>Поиск по категории</label>
                <select onChange={(e)=>find_for_category(e)}>
                    <option value={"null"}>Пустая ячейка</option>
                    {category?.map((x) => (
                        <option key={x.id} value={x.id}>{x.category_name}</option>
                    ))}
                </select>
            </form>
        </div>
    </div>
    <main className="main-content">
        <div className="all-ideas-container">
            {state.ideas.map((e) => {
                if (!e) return null;
                const date = new Date(e.date_create);
                const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;

                return (
                    <div key={e.id} className="idea-card" onClick={()=>navigate(`/DetailIdea?id=${e.id}`)}>
                        {e.main_picture && (
                            <img src={`http://localhost:3000/static/${e.main_picture}`} alt={e.name_idea} />
                        )}
                        <div className="idea-content">
                            <h3 className="idea-title">{e.name_idea}</h3>
                            <div className="idea-meta">
                                Категория: {category?.find(x => x.id == e.category)?.category_name} | Дата создания: {formattedDate}
                            </div>
                            <p className="idea-desc">{e.desc}</p>
                            <p>Статус: {e.status}</p>
                            <p>Нужны ли люди на проекте?: {e.need_part ? " Да" : " Нет"}</p>
                            <p>Автор: {e.user}</p>
                            <p>Лайки: {e.likes}</p>
                            <form onSubmit={(event) => setLike(event, e.id)}>
                                <button type="submit" style={{background: 'none', border: 'none', cursor: 'pointer'}}>
                                </button>
                            </form>
                        </div>
                    </div>
                );
            })}
        </div>
    </main>
</div>
  );
};
export default AllIdeaPage;