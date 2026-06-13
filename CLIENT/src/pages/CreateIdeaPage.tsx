
import React, { useState, useEffect, type FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import type { Field } from '../components/Form';
import { EStatus, type ICategory } from '../components/interfaces/IUser';
import '../styles/CreateIdeaPage.css'

interface IIdea {
  name_idea: string;
  desc: string;
  category: number;
  need_part: boolean;
  status: EStatus.serching;
}
const CreateIdeaPage = () => {
  const navigate = useNavigate();

  const [name_idea, setNameIdea] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<number>(0);
  const [need_part, setNeedPart] = useState<boolean>(false);
  const [status, setStatus] = useState<string>(EStatus.serching);
  const [submitText, setSubmitText] = useState("Создать идею");

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await axios.get('http://localhost:3000/category/');
        setCategories(res.data);
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
        const res = await axios.post('http://localhost:3000/idea', sendObj, {
          withCredentials: true,
        });
        console.log('Ответ сервера:', res.data);
        alert('Идея создана!');
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

  return (
    <div className="home-content" style={{ maxWidth: '1000px', margin: '75px auto' }}>
      <h1>Создать новую идею</h1>
      <Form 
        className="createForm"
        name="create-idea-form" 
        width={800} 
        height={750} 
        fields={fields} 
        submit={sendIdeaVal}
      />
    </div>
  );
};

export default CreateIdeaPage;

