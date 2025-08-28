let DAILY_LEADERBOARD = [];

export default function handler(req,res){
  if(req.method==='GET'){
    res.status(200).json(DAILY_LEADERBOARD.sort((a,b)=>b.timeLeft-a.timeLeft).slice(0,10));
  } else if(req.method==='POST'){
    const {name,timeLeft} = req.body;
    if(name && typeof timeLeft==='number'){
      DAILY_LEADERBOARD.push({name,timeLeft});
      res.status(200).json({success:true});
    } else res.status(400).json({error:'Invalid data'});
  } else res.status(405).json({error:'Method not allowed'});
}
