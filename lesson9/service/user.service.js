const { USER } = require('../dataBase');

module.exports = {
    getAll: async (query) => {
        const {
            perPage = 10,
            page = 1,
            sortBy = 'createdAt',
            order = 'asc',
            ...filtres
        } = query;

        const orderBy = order === 'asc' ? -1 : 1;

        const filterObject = {};

        // Object.keys(filtres).forEach((filterParam) => {
        //     switch (filterParam) {
        //         case: ""
        //     }
        // });

        const users = await USER
            .find(filterObject)
            .sort({ [sortBy]: orderBy })
            .limit(+perPage)
            .skip((page - 1) * perPage);

        return users;
    }
};
