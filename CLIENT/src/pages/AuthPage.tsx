import React, { useState, type FC, type FormEvent } from "react";
import axios from "axios";
import type { Field } from "../components/Form";
import Form from "../components/Form";
import Cookie from "js-cookie"

interface IAuth {
    isloggedIn:React.Dispatch<React.SetStateAction<string>>
}

const AuthPage: FC<IAuth> = ({isloggedIn}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submit, setSubmit]= useState ("Авторизоватся");

    const sendRegVal = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await fetchVal()
    }
    const fetchVal = async() =>{
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
            }
        }

    const fields:Field[] = [
        {name:"email", type:"email", value:email, setVal:setEmail, onClick: ()=>{}},
        {name:"password", type:"password", value:password, setVal:setPassword, onClick: ()=>{}},
        {name:"submit_button", type:"submit", value:submit, setVal:setSubmit, onClick: undefined}
    ]

    return (
        <div>
        <Form name="auth" width={500} height={100} fields={fields} submit={sendRegVal}/>
    </div>
    )
}

export default AuthPage;