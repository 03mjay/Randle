let INFINITE_LEADERBOARD = [];

export default function handler(req,res){
  if(req.method==='GET'){
    res.status(200).json(INFINITE_LEADERBOARD.sort((a,b)=>b.points-a.points).slice(0,10));
  } else if(req.method==='POST'){
    const {name,points,wordsCorrect} = req.body;
    if(name && typeof points==='number' && typeof wordsCorrect==='number'){
      INFINITE_LEADERBOARD.push({name,points,wordsCorrect});
      res.status(200).json({success:true});
    } else res.status(400).json({error:'Invalid data'});
  } else res.status(405).json({error:'Method not allowed'});
}
