import React, { useEffect, useState, type FC, type FormEvent } from "react";
import type { IIdea, IPecture } from "../components/interfaces/IIdea";
import Form, { type Field } from "../components/Form";
import { EStatus, type ICategory } from "../components/interfaces/IUser";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

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
    user:string
}
export interface IRes_Idea {
    data:IIdea_res
}

const EditIdeaPage = () => {
    const navigate = useNavigate();

    const [curId, setCurId] = useState<number>(0)
  const [name_idea, setNameIdea] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<number>(0);
  const [need_part, setNeedPart] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [submitText, setSubmitText] = useState("Изменить идею");

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchParams] = useSearchParams();

  const [file, setFile] = useState<Blob>(new Blob())
  useEffect(() => {
      const loadCategories = async () => {
            try {
                const get_category = async() => {
                    const res = await axios.get('http://localhost:3000/category/');
                    setCategories(res.data);
                }
                const id = searchParams.get('id'); 

                const get_idea = async() => {
                    const res:IRes_Idea = await axios.get(`http://localhost:3000/idea/${id}`)
                    setCurId(Number(id));
                    setNameIdea(res.data.name_idea)
                    setDesc(res.data.desc)
                    setCategory(res.data.category.id)
                    setNeedPart(res.data.need_part)
                    setStatus(res.data.status)
                }

                await get_category()
                await get_idea()
      } catch (e) {
        console.error("Не удалось загрузить категории", e);
        alert("Ошибка загрузки категорий. Проверьте консоль.");
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  const sendIdeaVal = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetchVal();
  };

  const fetchVal = async () => {
    if (name_idea.length !== 0 && desc.length !== 0) {
      const sendObj: IIdea = {
        name_idea,
        desc,
        category,
        need_part, 
        status
      };

      try {
        console.log('Отправляем объект:', sendObj);
        const res = await axios.put(`http://localhost:3000/idea/${curId}`, sendObj, {
          withCredentials: true,
        });
        console.log('Ответ сервера:', res.data);
        alert('Идея отредактирована!');
        navigate('/my-ideas');
      } catch (err: any) {
        console.error('Ошибка:', err.response?.data || err.message);
        alert('Ошибка при создании: ' + (err.response?.data || 'Сервер недоступен'));
      }
    }
  };

  const fields: Field[] = [
    { name: "name_idea", type: "text", value: name_idea, setVal: setNameIdea, onClick: () => {}, select: undefined, label:"Наименование идеи", helpText:"Название идеи"},
    { name: "desc", type: "textarea", value: desc, setVal: setDesc, onClick: () => {}, select: undefined, label:"Описание", helpText:"Опишите свою идею как можно подробнее"},
    
    { 
      name: "category",
      type: "select",
      value: "",
      select: categories,
      setVal: (val) => setCategory(Number(val)),
      onClick: undefined,
      label:"Категория",
      helpText:"Выберите категорию для идеи"
    },
    { 
      name: "status", 
      type: "select", 
      value: "",
      setVal: (val) => setStatus(val as any),
      select:[EStatus.serching, EStatus.in_progress, EStatus.complited],
      onClick: () => {},
      label:"Статус идеи",
      helpText:"Укажите, в каком состоянии находится ваша идея"
    },
    
    { 
      name: "need_part", 
      type: "checkbox", 
      value: "", 
      setVal: () => {}, 
      select:undefined,
      onClick: () => setNeedPart(!need_part),
      label:"Нужны ли участники для реализации?",
      helpText:""
    },
    { name: "submit_button", type: "submit", value: submitText, setVal: setSubmitText, onClick: undefined , select:undefined, label:"", helpText:""}
  ];

  if (isLoading) {
    return <div className="home-content" style={{textAlign: 'center', marginTop: '50px'}}>Загрузка категорий...</div>
  }

  const send_img = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData()
    formData.append("main_picture", file);

    axios.put(`http://localhost:3000/idea/${curId}/setMainPicture`, formData, {withCredentials:true})
    navigate('/my-ideas');
  }

  return (
    <div className="home-content" style={{ maxWidth: '1000px', margin: '75px auto' }}>
      <h1>Редактировать идею</h1>
      <Form 
        className="createForm"
        name="create-idea-form" 
        width={800} 
        height={750} 
        fields={fields} 
        submit={sendIdeaVal}
      />
      <form onSubmit={send_img}>
        <label htmlFor="file">Загрузить картинку</label> <br/>
        <input onChange={(e)=> {
            const fileE = e.target.files?.item(0); 
            if (fileE != null){
            setFile(fileE)
        }
            }} id='file' type="file"/><br/>
        <input value="Отправить" type="submit"/>
      </form>
    </div>
  );
}

export default EditIdeaPage;