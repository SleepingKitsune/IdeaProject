import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"
import type { ICategory, IRes_user } from "../components/interfaces/IUser";
import { setLike, type IIdea_res } from "./DetailIdeaPage";
import '../styles/UserProfile.css'

const Profile = () => {
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState<IRes_user>()
    const [Ideas, setIdeas] = useState<IIdea_res[]>()
    const [categories, setCategories] = useState<ICategory[]>()
    const navigate = useNavigate()
    const id = searchParams.get("id")

    const handleEditProfileClick = () => {
        if (user) {
            navigate(`/edit-profile?id=${user.data.id}`);
        }
    };
        
    useEffect(()=>{
        const getIdeas = async(userId:number) => {
            try {
                const res = await axios.get(`http://localhost:3000/idea/getall/forUserNonAuth/${userId}`)
                setIdeas(res.data)
                
            } catch(e) {
                console.log(e)
                alert(e)
            }
        }
        const getCategories = async() => {
            try {
                const res = await axios.get("http://localhost:3000/category")
                setCategories(res.data)
            } catch(e) {
                console.log(e)
                alert(e);
            }
        }
        const getUser = async() => {
            try {
                if (id == null)
                {
                    const user = await axios.get("http://localhost:3000/user/getAuthInfo", {withCredentials:true})
                    
                    const res = await axios.get(`http://localhost:3000/user/${user.data.id}`);
                    setUser(res)
                    getIdeas(Number(user.data.id))
                    return
                }

                const res = await axios.get(`http://localhost:3000/user/${id}`);
                setUser(res)
                getIdeas(Number(id))
            } catch(e){
                console.log(e)
                alert(e);
            }
        }
        getUser()
        getCategories();
    },[])
return (
    <div className="userProfile-page-container">
        <div className="userProfile-profile-block">
            <section className="userProfile-author-info">
                {user?.data.avatar && (
                    <img src={`http://localhost:3000/static/${user.data.avatar}`} alt={user.data.nickname} />
                )}
                <h2>{user?.data.nickname}</h2>
                <p className="role">{user?.data.role}</p>
                
                <p className="bio">{user?.data.aboutMe}</p>
                {id == null?
                <button
                className="userProfile-button"
                onClick={()=>handleEditProfileClick()}
                >Редактировать</button>
            :<div></div>
            }
            </section>
            <section className="userProfile-ideas-section">
                {Ideas?.map((x) => {
                    const date = new Date(x.date_create);
                    const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
                    
                    return (
                        <article key={x.id} className="userProfile-idea-card">
                            {x.main_picture && (
                                <img src={`http://localhost:3000/static/${x.main_picture}`} alt={x.name_idea} />
                            )}
                            <div className="userProfile-idea-content">
                                <h3 className="userProfile-idea-title">{x.name_idea}</h3>
                                
                                <div className="userProfile-idea-meta">
                                    Категория: {x.category.category_name} | Дата создания: {formattedDate}
                                </div>
                                <p className="userProfile-idea-desc">{x.desc}</p>
                                <div className="button-group">
                                    <form onSubmit={(event)=>setLike(event, x.id)}>
                                        <input type="submit" value="Like"/>
                                    </form>
                                    <button onClick={()=>navigate(`/DetailIdea?id=${x.id}`)}>Детали</button>
                                </div>
                            </div>
                        </article>
                    )
                })}
            </section>
        </div>
    </div>
);
}
export default Profile;
