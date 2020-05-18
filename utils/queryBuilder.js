class QueryBuilder {
    // options must contain select and where, both are arrays
    static build(options) {
        let sql = 'select ' + options.select.join(' ');

        if (options.where.length) {
            sql += ' where ';
            sql += options.where.join(' AND ');
        }
        sql += ';';

        return sql;
    }
}


module.exports = QueryBuilder;