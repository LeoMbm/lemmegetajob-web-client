import axios from 'axios';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/options"
import { useRouter } from 'next/navigation'

export async function POST(req: Request, res: Response) {
  const session = await getServerSession({ req, ...authOptions })
  if (!session) {
    return new Response(JSON.stringify({ message: 'Not Authenticated', status: 401 }), {
      status: 401},
    );
  }
  if (req.method === 'POST') {
    try {
      const response = await axios.post(`${process.env.BASE_API_URL}/launch-bot/?candidate_username=leombm`);

      if (response.status === 200) {
        return new Response(JSON.stringify(response.data), {
          status: 200},
        );
      } else {
        return new Response(JSON.stringify(response.data), {
          status: response.status},
        );
      }
    } catch (error) {
      return new Response(JSON.stringify({ message: error }), {
        status: 500},
      );
    }
  } else {
    return new Response(JSON.stringify({ message: 'Not Allowed' }), {
      status: 405},
    );
  }
}
