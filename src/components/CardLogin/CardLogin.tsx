import Button from '../Button/Button';
import { useForm } from 'react-hook-form';
import './CardLogin.css';
import { getAuthData, requestBackendLogin, saveAuthData } from '../../util/requests';
import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import { getTokenData } from '../../util/auth';


type FormData = {
    username: string;
    password: string;
}

export default function CardLogin() {

    const { setAuthContextData } = useContext(AuthContext);

    const [hasError, setHasError] = useState(false);

    const { register, handleSubmit, formState : { errors} } = useForm<FormData>();

    const history = useHistory();

    const onSubimit = (formData : FormData) => {
        requestBackendLogin(formData)
        .then(response => {
            saveAuthData(response.data);
            setHasError(false);
            setAuthContextData({
                authenticated: true,
                tokenData: getTokenData(),
            })
            history.push('/movies');

        })
        .catch(error => {
            setHasError(true);
        });
    };

    return (
        <div className="card-login-container">
                <div className="card-login-title">
                    <h1>login</h1>
                </div>
                   { hasError && (
                   <div className="alert alert-danger">
                        Erro ao tentar autenticar o usuário
                    </div>
                    )}
                <form onSubmit={handleSubmit(onSubimit)} >
                    <div className="card-login-input">
                        <input 
                        {...register("username", {
                            required: 'Campo obrigatório',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'E-mail invalido'
                              }
                        })}
                        className={`form-control base-input ${errors.username ? 'is-invalid' : ''}`}
                         type="text" 
                         placeholder='Email' 
                         name='username' 
                         />
                    </div>
                    <div className="invalid-feedback primary d-block">{errors.username?.message}</div>
                    <div className="card-login-input ">
                        <input 
                        {...register("password", {
                            required: 'Campo obrigatório' 
                        })}
                        className={`form-control base-input ${errors.password ? 'is-invalid' : ''}`}
                        type="password" 
                        placeholder='Senha'
                        name='password' 
                        />
                    </div>
                    <div className="invalid-feedback d-block">{errors.password?.message}</div>

                        <Button text="fazer login"/>
                </form>
        </div>
    )
}