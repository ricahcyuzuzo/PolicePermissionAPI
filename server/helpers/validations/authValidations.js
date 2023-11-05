import Hapi from '@hapi/joi';

export const validateAuth = (user) => {
    const schema = Hapi.object().keys({
        code: Hapi.string().required(),
        password: Hapi.string().required(),
    })

    return schema.validate(user);
} 
