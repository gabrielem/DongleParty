import { withAuth } from "@/middlewares/middleware";

async function handler(req: any, res: any) {
  try {
    return res.status(200).json({result: true});
  } catch (error) {
    console.error('Error in get Property Handler:', error);
    return res.status(500).json({ error });
  }
}

export default withAuth(handler)