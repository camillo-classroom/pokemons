export default class DaoException {
    constructor(message, type) {
        this.message = message;
        this.type = type ?? EXCEPTION_TYPE.Internal_server_error;
    }
}

export const EXCEPTION_TYPE = {
    Internal_server_error: 0,
    Not_found: 1
};
