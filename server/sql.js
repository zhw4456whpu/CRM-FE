// sql语句
var sqlMap = {
    // 用户
    user: {
        login: 'SELECT user_pwd FROM crm_user WHERE user_name = ?;',
        add: 'insert into crm_user(user_name, user_pwd) values ( ?, ?);'
    },
    category: {
        queryAll: 'SELECT * FROM crm_category;',
        add: 'insert into crm_category(cat_name, cat_code) values ( ?, ?);'
    }
}

module.exports = sqlMap;