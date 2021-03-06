const { USER } = require('../dataBase');

module.exports = {
    getAll: async (query) => {
        const {
            perPage = 10,
            page = 1,
            sortBy = 'createdAt',
            order = 'asc',
            ...filters
        } = query;

        const orderBy = order === 'asc' ? -1 : 1;

        const filterObject = {};
        const ageFilter = {};

        Object.keys(filters).forEach((filterParam) => {
            switch (filterParam) {
                case 'userRole': {
                    filterObject.role = filters.userRole;

                    // const rolesArr = filtres.userRole.split(';');
                    // filterObject.role = { $in: rolesArr };
                    break;
                }
                case 'name': {
                    filterObject.name = { $regex: `^${filters.name}`, $options: 'gi' };
                    break;
                }
                case 'age.lte': {
                    Object.assign(ageFilter, { $lte: +filters['age.lte'] });
                    break;
                }
                case 'age.gte': {
                    Object.assign(ageFilter, { $gte: +filters['age.gte'] });
                    break;
                }
                default: {
                    filterObject[filterParam] = filters[filterParam];
                }
            }
        });

        if (Object.keys(ageFilter).length) {
            filterObject.age = ageFilter;
        }

        const users = await USER
            .find(filterObject)
            .sort({ [sortBy]: orderBy })
            .limit(+perPage)
            .skip((page - 1) * perPage);

        return users;
    }
};
