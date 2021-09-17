const { CAR } = require('../dataBase');

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
                case 'model': {
                    filterObject.model = { $regex: `^${filters.model}`, $options: 'gi' };
                    break;
                }
                case 'year.lte': {
                    Object.assign(ageFilter, { $lte: filters['year.lte'] });
                    break;
                }
                case 'year.gte': {
                    Object.assign(ageFilter, { $gte: filters['year.gte'] });
                    break;
                }
                default: {
                    filterObject[filterParam] = filters[filterParam];
                }
            }
        });

        if (Object.keys(ageFilter).length) {
            filterObject.year = ageFilter;
        }

        const users = await CAR
            .find(filterObject)
            .sort({ [sortBy]: orderBy })
            .limit(+perPage)
            .skip((page - 1) * perPage);

        return users;
    }
};
