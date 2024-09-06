import DaoException, {EXCEPTION_TYPE} from "../DaoException.mjs";
import getId from "../../utils/getId.mjs";

export default class PokemonDAO {
    constructor(db) {
        this._db = db;
    }

    inserir(obj, sucesso, erro) {
        obj.id = getId();
        const sql = 'INSERT INTO pokemon(id, nome, tipo) VALUES (?, ?, ?)';
        this._db.run(sql, [obj.id, obj.nome, obj.tipo], function(err) {
            if (err) {
                erro(new DaoException('Erro interno do servidor'));
            } else {
                sucesso();
            }
        });
    }

    alterar(obj, sucesso, erro) {
        const sql = 'UPDATE pokemon SET nome = ?, tipo = ? WHERE id = ?';
        this._db.run(sql, [obj.nome, obj.tipo, obj.id], function(err) {
            if (err) {
                erro(new DaoException('Erro interno do servidor'));
            } else if (this.changes === 0) {
                erro(new DaoException('Pokemon não encontrado', EXCEPTION_TYPE.Not_found));
            } else {
                sucesso();
            }
        });
    }

    excluir(id, sucesso, erro) {
        this.selecionarPorId(
            id, 
            () => {
                this._db.run('DELETE FROM pokemon WHERE id = ?', [id], function(err) {
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
        this._db.all('SELECT * FROM pokemon ORDER BY nome', (err, rows) => {
            if (err) {
                erro(new DaoException('Erro interno do servidor'));
            } else {
                sucesso(rows);
            }
        });
    }

    selecionarPorId(id, sucesso, erro) {
        this._db.get('SELECT * FROM pokemon WHERE id = ?', [id], (err, row) => {            
            if (err) {
                erro('Erro interno do servidor.')
            } else if (!row) {
                erro(new DaoException('Pokemon não encontrado.', EXCEPTION_TYPE.Not_found));
            } else {
                sucesso(row);
            }
        });
    }
}