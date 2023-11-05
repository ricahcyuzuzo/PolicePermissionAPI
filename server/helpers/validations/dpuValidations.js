import Hapi from '@hapi/joi';

export const validatAddOfficer = (user) => {
    const schema = Hapi.object().keys({
        name: Hapi.string().required(),
        code: Hapi.string().required(),
        email: Hapi.string().email().required(),
    })

    return schema.validate(user);
}
