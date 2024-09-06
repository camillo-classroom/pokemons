import DaoException, {EXCEPTION_TYPE} from "../DaoException.mjs";
import getId from "../../utils/getId.mjs";

export default class TreinadorDAO {
    constructor(db) {
        this._db = db;
    }

    inserir(obj, sucesso, erro) {
        obj.id = getId();
        const sql = 'INSERT INTO treinador(id, nome) VALUES (?, ?)';
        this._db.run(sql, [obj.id, obj.nome], function(err) {
            if (err) {
                erro(new DaoException('Erro interno do servidor'));
            } else {
                sucesso();
            }
        });
    }

    alterar(obj, sucesso, erro) {
        const sql = 'UPDATE treinador SET nome = ? WHERE id = ?';
        this._db.run(sql, [obj.nome, obj.id], function(err) {
            if (err) {
                erro(new DaoException('Erro interno do servidor'));
            } else if (this.changes === 0) {
                erro(new DaoException('Treinador não encontrado', EXCEPTION_TYPE.Not_found));
            } else {
                sucesso();
            }
        });
    }

    excluir(id, sucesso, erro) {
        this.selecionarPorId(
            id, 
            () => {
                this._db.run('DELETE FROM treinador WHERE id = ?', [id], function(err) {
                    if (err) {
                        erro(new DaoException('Erro interno do servidor'));
                    } else {
                        sucesso();
                    }
                });
            }, 
            err => erro(err)
        );
    }

    selecionarTodos(sucesso, erro) {
        this._db.all('SELECT * FROM treinador ORDER BY nome', (err, rows) => {
            if (err) {
                erro(new DaoException('Erro interno do servidor'));
            } else {
                sucesso(rows);
            }
        });
    }

    selecionarPorId(id, sucesso, erro) {
        this._db.get('SELECT * FROM treinador WHERE id = ?', [id], (err, row) => {            
            if (err) {
                erro('Erro interno do servidor.')
            } else if (!row) {
                erro(new DaoException('Treinador não encontrado.', EXCEPTION_TYPE.Not_found));
            } else {
                sucesso(row);
            }
        });
    }
}