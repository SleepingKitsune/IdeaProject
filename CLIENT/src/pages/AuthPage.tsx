import React, { useState, type FC, type FormEvent } from "react";
import axios from "axios";
import type { Field } from "../components/Form";
import Form from "../components/Form";
import Cookie from "js-cookie"
import '../styles/AuthPage.css'
import { useNavigate } from "react-router-dom";

interface IAuth {
    isloggedIn:React.Dispatch<React.SetStateAction<string>>
}

const AuthPage: FC<IAuth> = ({isloggedIn}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submit, setSubmit]= useState ("Авторизоватся");
    const navigate = useNavigate()

    const sendRegVal = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await fetchVal()
    }
    const fetchVal = async() =>{
        try{

            if (
                email.length != 0 ||
                password.length != 0
            )
            {
                const sendObj = {
                    email:email,
                    password:password
                }
                console.log(sendObj)
                const res = await axios.post(`http://localhost:3000/user/auth`, sendObj, {withCredentials:true});
                isloggedIn("1")
                navigate(`/profile`)
            }
        }
        catch(e)
        {
            console.log("error")
            alert("Некоретные данные")
        }
        }

    const fields:Field[] = [
        {name:"email", type:"email", value:email, setVal:setEmail, onClick: ()=>{}, select: undefined, label:"Почта", helpText:"Введите свою почту"},
        {name:"password", type:"password", value:password, setVal:setPassword, onClick: ()=>{}, select: undefined, label:"Пароль", helpText:"Введите свой пароль"},
        {
            name: "submit_button", type: "submit", value: submit, setVal: setSubmit, onClick: () => {

            },
            select: undefined,
            label: "",
            helpText: ""
        }
    ]
    return (
        <div className="page-container">
          <div className="createForm">
            <h2>Авторизация</h2>
            <Form
              name="auth"
              width={650}
              height={300}
              fields={fields}
              submit={sendRegVal}
              className={""}
            />
          </div>
        </div>
      );
}

export default AuthPage;