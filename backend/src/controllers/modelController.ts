import {Request, Response} from "express"
import { handleRequest } from "../services/modelService"
import { error } from "console";

export const Nice = async(req: Request, res: Response) => {
  const {request} = req.body;
  if (!request) {
    return res.status(400).json({
      error: "Missing request"
    });
  }
  try {
    const data = await handleRequest(request);
    return res.status(200).json({
      message: data
    })
  } catch (error) {
    return res.status(500).json({
      error: error
    })
    console.error(error);
  }
}