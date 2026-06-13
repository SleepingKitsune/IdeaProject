import axios from "axios";
import type { IIdea } from "../components/interfaces/IIdea";
import { useEffect, useState } from "react";
import '../styles/Profile.css'

interface ILike {
    id: number
}

interface IUserInfo {
    id: number,
    nickname: string,
    email: string,
    role: string,
    likes: ILike,
    ideas: IIdea,
    avatar: string,
    aboutMe: string,
}

const EditProfilePage = () => {
    const [userInfo, setUserInfo] = useState<IUserInfo>();

    const [nick, setNic] = useState<string>("");
    const [email, setemail] = useState<string>("");
    const [dis, setDis] = useState<string>("");
    const [oldPass, setOldPass] = useState<string>("");
    const [pass, setpass] = useState<string>("");
    const [repPass, setRepPass] = useState<string>("");
    const [ava, setAva] = useState<Blob>(new Blob());

    useEffect(()=>{
        const getInfo = async() =>{
            const user = await axios.get("http://localhost:3000/user/getAuthInfo", {withCredentials:true});
            setUserInfo(user.data)
            setNic(user.data.nickname);
            setDis(user.data.aboutMe);
        }
        getInfo();
    },[])

    const updateNickOrDis = async(e: React.SubmitEvent<HTMLFormElement>) => {
        try{

            const res = await axios.put("http://localhost:3000/user/updateUser", {nickname:nick, aboutMe: dis}, {withCredentials:true})
            
        } catch(e){
            console.log(e)
            alert(e)
        }
    }

    const updatePass = async(e: React.SubmitEvent<HTMLFormElement>) => {

        if (pass == repPass){
            try{
                const res = await axios.put("http://localhost:3000/user/updatePassword", {oldPassword:oldPass, newPassword:pass}, {withCredentials:true})
            } catch(e) {
                console.log(e)
                alert(e)
            }
        }
        else{
            alert("Пароль не совподает")
        }
    }

    const updateEmail = async(e: React.SubmitEvent<HTMLFormElement>) => {
        try{

            const res = await axios.put("http://localhost:3000/user/updateEmail", {email:email}, {withCredentials:true})
        } catch(e) {
            console.log(e)
            alert(e)
        }
    }

    const updateAva = async(e: React.SubmitEvent<HTMLFormElement>) => {
        try{
            const formData = new FormData()
            formData.append("ava", ava)
            const res = await axios.put("http://localhost:3000/user/updateAvatar", formData, {withCredentials:true})
        }
        catch(e){
            console.log(e)
            alert(e)
        }
    }
    return (
        <div className="profile-container">
          <div className="profile-card">
            <img src={`http://localhost:3000/static/${userInfo?.avatar}`} className="profile-avatar" alt="Аватар" />
            
            {/* Имя и описание */}
            <div className="section-block">
              <h2 className="section-title">Сменить имя и описание</h2>
              <form className="profile-form" onSubmit={(e) => updateNickOrDis(e)}>
                <label className="form-label">Ник</label>
                <input type="text" className="form-input" value={nick} onChange={(e)=> setNic(e.target.value)} />
                
                <label className="form-label">Описание</label>
                <input type="text" className="form-input" value={dis} onChange={(e)=> setDis(e.target.value)} />
                
                <button type="submit" className="form-button">Изменить имя и описание</button>
              </form>
            </div>
      
            {/* Почта */}
            <div className="section-block">
              <h2 className="section-title">Сменить почту</h2>
              <form className="profile-form" onSubmit={(e) => updateEmail(e)}>
                <label className="form-label">Почта</label>
                <input type="text" className="form-input" onChange={(e)=> setemail(e.target.value)} />
                <button type="submit" className="form-button">Изменить почту</button>
              </form>
            </div>
      
            {/* Пароль */}
            <div className="section-block">
              <h2 className="section-title">Сменить пароль</h2>
              <form className="profile-form" onSubmit={(e) => updatePass(e)}>
                <label className="form-label">Старый пароль</label>
                <input type="password" className="form-input" onChange={(e)=> setOldPass(e.target.value)} />
                
                <label className="form-label">Новый пароль</label>
                <input type="password" className="form-input" onChange={(e)=> setpass(e.target.value)} />
                
                <label className="form-label">Подтвердите пароль</label>
                <input type="password" className="form-input" onChange={(e)=> setRepPass(e.target.value)} />
                
                <button type="submit" className="form-button">Изменить пароль</button>
              </form>
            </div>
      
            {/* Аватар */}
            <div className="section-block">
              <h2 className="section-title">Сменить аватар</h2>
              <form className="profile-form" onSubmit={(e) => updateAva(e)}>
                <label className="form-label">Новый аватар</label>
                <input type="file" className="form-input" onChange={(e)=> {
                  const file = e.target.files?.item(0);
                  if (!file) return;
                  setAva(file);
                }} />
                <button type="submit" className="form-button">Изменить аватар</button>
              </form>
            </div>
          </div>
        </div>
      );
}

export default EditProfilePage;