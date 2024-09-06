import { Router } from "express";
import { EXCEPTION_TYPE } from "../daos/DaoException.mjs";
import daos from '../daos/sqlite/index.mjs';
//import daos from '../daos/vetor/index.mjs';

const router = Router();

router.get('/api/pokemons', (request, response) => {
    const dao = daos.pokemon();
    dao.selecionarTodos(
        (dados) => response.send(dados), 
        (erro) => response.status(500).send(erro.message)
    );
});

router.get('/api/pokemons/:id', (request, response) => {
    const { id } = request.params;
    const dao = daos.pokemon();
    dao.selecionarPorId(
        id,
        (dado) => {
            response.send(dado);
        }, 
        (erro) => {
            if (erro.type === EXCEPTION_TYPE.Not_found) {
                response.status(404).send(erro.message)
            } else {
                response.status(500).send(erro.message)
            }
        }
    );
});

router.delete('/api/pokemons/:id', (request, response) => {
    const { id } = request.params;
    const dao = daos.pokemon();
    dao.excluir(
        id,
        () => {
            response.send();
        }, 
        (erro) => {
            if (erro.type === EXCEPTION_TYPE.Not_found) {
                response.status(404).send(erro.message)
            } else {
                response.status(500).send(erro.message)
            }
        }
    );
});

router.post('/api/pokemons', (request, response) => {
    const body = request.body;
   
    if (!body || !body.content) {
        return response.status(400).json({
            error: 'content missing'
        });
    }
 
    const obj = body.content;

    const dao = daos.pokemon();
    
    dao.inserir(obj, 
        () => {
            const objRet = {
                content: obj,
                important: Boolean(body.important) || false,
                id: obj.id,
            };
            response.json(objRet);
        }, 
        (erro) => response.status(500).send(erro.message)
    );
});

router.put('/api/pokemons/:id', (request, response) => {
    const body = request.body;
   
    if (!body || !body.content) {
      return response.status(400).json({
          error: 'content missing'
      });
    }
    const obj = body.content;
    const {id} = request.params;
    if (id !== obj.id) {
        response.status(400).send('Id na rota difere do id do objeto.');
        return;
    }

    const dao = daos.pokemon();
    
    dao.alterar(obj, 
        () => response.status(204).send(),
        (erro) => {
            if (erro.type === EXCEPTION_TYPE.Not_found) {
                response.status(404).send(erro.message);        
            } else {
                response.status(500).send(erro.message);
            }
        }
    );
});

export default router;
