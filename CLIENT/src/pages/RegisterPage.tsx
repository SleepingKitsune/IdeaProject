import React, { useState, type FormEvent } from "react";
import axios from "axios";
import type { Field } from "../components/Form";
import Form from "../components/Form";
import type IUser from "../components/interfaces/IUser"
import '../styles/RegisterPage.css'


const RegisterPage = () => {
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submit, setSubmit]= useState ("Зарегистрироваться");

    const sendRegVal = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await fetchVal()
    }
    const fetchVal = async() =>{
        if (
            nickname.length != 0 ||
            email.length != 0 ||
            password.length != 0
        )
        {
            const sendObj:IUser = {
                nickname:nickname,
                email:email,
                password:password
            }
            console.log(sendObj)
            const res = await axios.post(`http://localhost:3000/user/registration`, sendObj);
            console.log(res)
            }
        }

    const fields:Field[] = [
        {
            name: "name", type: "text", value: nickname, setVal: setNickname, onClick: () => { },
            select: undefined,
            label: "Никнейм",
            helpText: ""
        },
        {
            name: "email", type: "email", value: email, setVal: setEmail, onClick: () => { },
            select: undefined,
            label: "Почта",
            helpText: ""
        },
        {
            name: "password", type: "password", value: password, setVal: setPassword, onClick: () => { },
            select: undefined,
            label: "Пароль",
            helpText: ""
        },
        {
            name: "submit_button", type: "submit", value: submit, setVal: setSubmit, onClick: undefined,
            select: undefined,
            label: "",
            helpText: ""
        }
    ]

    return (
        <div className="page-container">
          <div className="createForm">
            <h2>Регистрация</h2>
            <Form
              name="auth"
              width={650}
              height={350}
              fields={fields}
              submit={sendRegVal}
              className={""}
            />
          </div>
        </div>
      );
}

export default RegisterPage;