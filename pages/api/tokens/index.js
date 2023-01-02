import tokenlist from "../../../components/constants/tokenlist";
import fs from "fs";

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(tokenlist);
  } else if (req.method === "POST") {
    const token = req.body;
    console.log("TOKEN", token);
    const newToken = {
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      address: token.address,
    };
    tokenlist.push(newToken);
    console.log("tokenlistAPI", tokenlist);
    fs.writeFileSync(
      "components/constants/tokenlist.json",
      JSON.stringify(tokenlist)
    );
    res.status(201).json({ newToken });
  }
}
