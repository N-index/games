import {addDoc, collection, getDocs, query,where} from 'firebase/firestore/lite';
import {db} from "./index";
const rateCollections = collection(db, 'rate');

function getRandomIntBetween(min,max){
    return  Math.floor(Math.random()*(max-min+1))+min;
}
function getRandomFloatBetween(min,max){
    return parseFloat((Math.random()*(max-min)+min).toFixed(2));
}
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function addRate(gameName, score=getRandomFloatBetween(0,5)){
    await addDoc(rateCollections,{
        game_name: gameName,
        user_id: getRandomIntBetween(2,5000),
        score: score,
        vote_time: randomDate(new Date(2012, 0, 1), new Date())
    })
}

async function getRates(gameName) {
    // const q = query(rateCollections,where('game_name','==',gameName));
    const q = query(rateCollections,where('game_name','==',gameName));
    const querySnapshot = await getDocs(q);
    console.log('in getRates');

    return querySnapshot.docs.map(doc => doc.data());

    // 获取 collection 的所有数据
    // const ratesDocs = await getDocs(rateCollections);
    // return ratesDocs.docs.map(doc => doc.data());
}
// async function getSquareScore(db){
//     const scoreCollection = collection(db, 'rate');
//     const scoreSnapshot = await getDocs(scoreCollection);
//     return scoreSnapshot.docs.map(doc => doc.data());
// }
// async function
export {addRate,getRates};