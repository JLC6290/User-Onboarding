import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import axios from 'axios';

const formSchema = yup.object().shape({
    name: yup.string().required("Name is a required field."),
    email: yup
        .string()
        .email("Must be a valid email address.")
        .required("Must include email address."),
    password: yup.string().required("You must enter a password."),
    terms: yup.boolean().oneOf([true], "Please agree to terms of use."),
})

function Form() {

    const [buttonDisabled, setButtonDisabled] = useState(true);

    const [post, setPost] = useState([]);

    const [formState, setFormState] = useState({
        name: '',
        email: '',
        password: '',
        terms: '',
    })
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        terms: '',
    })


    useEffect(() => {
        formSchema.isValid(formState).then(valid => {
            setButtonDisabled(!valid);
        });
    }, [formState]);

    const formSubmit = e => {
        e.preventDefault();
        axios
            .post("https://reqres.in/api/users", formState)
            .then(result => {
                setPost(result.data);
                console.log("success", post);
                setFormState({
                    name: '',
                    email: '',
                    password: '',
                    terms: '',
                });
            })
            .catch(error => console.log("error" + error.response));
    }

    const validateChange = e => {
        yup
            .reach(formSchema, e.target.name)
            .validate(e.target.name === "terms" ? e.target.checked : e.target.value)
            .then(valud => {
                setErrors({
                    ...errors,
                    [e.target.name]: ""
                });
            })
            .catch(err => {
                setErrors({
                    ...errors,
                    [e.target.name]: err.errors[0]
                });
            });
    }

    const inputChange = e => {
        e.persist();
        const newFormData = {
            ...formState,
            [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
        };
        validateChange(e);
        setFormState(newFormData);
    };

    return (
        <div className="App">
            <form onSubmit={formSubmit}>
                <label htmlFor="name">
                    Name
            <input
                        type="text"
                        name="name"
                        value={formState.name}
                        onChange={inputChange}
                    />
                    {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
                </label>
                <label htmlFor="email">
                    Email
              <input
                        type="text"
                        name="email"
                        value={formState.email}
                        onChange={inputChange}
                    />
                    {errors.email.length > 0 ? <p className="error">{errors.email}</p> : null}
                </label>
                <label htmlFor="password">
                    Password
            <input
                        type="text"
                        name="password"
                        value={formState.password}
                        onChange={inputChange}
                    />
                    {errors.password.length > 0 ? <p className="error">{errors.password}</p> : null}
                </label>
                <label htmlFor="terms" className="terms">
                    <input
                        type="checkbox"
                        name="terms"
                        checked={formState.terms}
                        onChange={inputChange}
                    />
            Terms and Conditions
          </label>
                <pre>{JSON.stringify(post, null, 2)}</pre>
                <button disabled={buttonDisabled}>Submit</button>
            </form>
        </div>
    );
}

export default Form;