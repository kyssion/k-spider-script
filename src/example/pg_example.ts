import * as  sequelize from 'sequelize'
const sl = new sequelize.Sequelize("postgresql://spider:Javarustc++11.@39.100.86.193:5432/k_script_spider")

async function TestConnection(){
    try{
        await sl.authenticate();
        console.log()
    }catch (e) {
        console.error('Unable to connect to the database:', e)
    }
}