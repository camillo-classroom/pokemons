import { v4 as uuid } from "uuid";

const getId = () => {
    const random_uuid = uuid();
    return random_uuid;
}

export default getId;
