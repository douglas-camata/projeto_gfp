import React, { useState, useEffect, useContext } from 'react';
import { UsuarioContext } from '../UsuarioContext'
import { useNavigate } from 'react-router-dom';

export default function Principal() {
    const { dadosUsuario, setDadosUsuario, carregando } = useContext(UsuarioContext);

    const [usuario, setUsuario] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (!dadosUsuario && !carregando) {
            navigate('/login');
        }
    }, [dadosUsuario, carregando, navigate]);

    const botaoLogout = () => {
        try {
            localStorage.removeItem('UsuarioLogado');
            setDadosUsuario(null);
            navigate('/');
        } catch (error) {
            console.error('Erro ao deslogar:', error);
        }
    };

    return (
        <div>
            <div style={{
                display: 'flex', flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center'
            }}>
                <p>Usuário: {dadosUsuario?.nome}</p>
                <button onClick={botaoLogout}>Sair</button>
            </div>
            <div style={{ padding: '20px' }}>
                <h2>Principal</h2>
            </div>
        </div>
    );
}