

import pg from "pg"
const { Pool } = pg


async function TestConnection(){
    try{
        const result = await pool.query("insert into spider_news_url_data_source  (url,title,introduction,news_time,news_from) values ($1,$2,$3,$4,$5)",
            ["1","2","3","4","33"])
        console.log(result.rows[0])
    }catch (e) {
        console.error('Unable to connect to the database:', e)
    }
}
TestConnection().then()
