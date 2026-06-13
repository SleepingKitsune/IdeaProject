import React, {
  type ChangeEvent,
  type FC,
  type SubmitEventHandler,
} from "react";
import type { EStatus, ICategory } from "./interfaces/IUser";

export interface Field {
  type: string;
  name: string;
  value: string;
  select: undefined | ICategory[] | string[];
  setVal: React.Dispatch<React.SetStateAction<string>>;
  onClick: React.MouseEventHandler<HTMLInputElement> | undefined;
  label: string;
  helpText: string;
}

interface FormProps {
  className:string;
  name: string;
  width: number;
  height: number;
  fields: Field[];
  submit: SubmitEventHandler<HTMLFormElement>;
}

const return_string_options = (x:string|ICategory, i:number):any => {
    if (typeof x != "string") {    
        return (
            <option key={i} value={x.id}>{x.category_name}</option>
        )
    }
    else if (typeof x == "string") {
        return (
            <option key={i} value={x}>{x}</option>
        )
    }
}
const ret_text_area = (value:string, 
                      setVal:React.Dispatch<React.SetStateAction<string>>, 
                      onClick:React.MouseEventHandler<HTMLTextAreaElement> | undefined, 
                      placeholder:string) => {
    const updateVal = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setVal(e.target.value);
    };
    return (
    <textarea
              value={value ?? ''}
              onChange={updateVal}
              onClick={onClick}
              placeholder={placeholder}
            />
  )
}

const Field: FC<Field> = ({ type, name, value, setVal, onClick, select, label, helpText }) => {
  const updateVal = (e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
  };
    if (onClick !== undefined) {
    return (
      <div>
        <label>{label}</label>
        {type == "textarea" ? 
        ret_text_area(value, setVal, undefined, helpText):  
        type != "select" && typeof select == "undefined" ? (
          <input
          name={`${name}`}
          type={`${type}`}
          value={value}
          onChange={updateVal}
          onClick={onClick}
          placeholder={helpText}
          />
        
        ) : (
          <select id={name} name={name} onChange={(e)=>setVal(e.target.value)}>
            {(Array.isArray(select)) &&
              select.map((x, i) => return_string_options(x, i))}
          </select>
        )}
      </div>
    );
  } else {
    return (
      <div>
        <label>{label}</label>
        {type != "select" && typeof value == "string" ? (
          <input
            name={`${name}`}
            type={`${type}`}
            value={value}
            onChange={updateVal}
            onClick={onClick}
            placeholder={helpText}
          />
        ) : (
          <select id={name} name={name} onChange={(e)=>setVal(e.target.value)}>
            {typeof select != "undefined" &&
              select.map((x, i) => return_string_options(x, i))}
          </select>
        )}
      </div>
    );
  }
};

const Form: FC<FormProps> = ({ className, name, width, height, fields, submit }) => {
  return (
    <div>
      <form
      className={className}
        onSubmit={submit}
        name={`${name}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {fields.map((x, i) => {
          return (
            <Field
              key={i}
              type={`${x.type}`}
              name={`${x.name}`}
              onClick={x.onClick}
              value={`${x.value}`}
              select={x.select}
              setVal={x.setVal}
              label={x.label}
              helpText={x.helpText}
            />
          );
        })}
      </form>
    </div>
  );
};

export default Form;
