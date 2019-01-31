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
    },
    chapter: {
        queryAll: 'SELECT * FROM crm_chapter;',
        queryOne: 'SELECT * FROM crm_chapter where chapter_id = ?;',
        add: 'insert into crm_chapter(chapter_title, chapter_writer, chapter_content, cat_code) values ( ?, ?, ?, ?);',
        edit: 'UPDATE crm_chapter SET chapter_title= ?,chapter_writer= ?, chapter_content= ?, cat_code= ? WHERE chapter_id= ? '
    },
    
}

module.exports = sqlMap;