import axios from 'axios';

export async function POST(req: Request, res: Response) {
  if (req.method === 'POST') {
    try {
      // Faites une requête vers votre backend FastAPI ici
      const response = await axios.post(`${process.env.BASE_API_URL}/delete-bot/?name=scraping-deployment&namespace=candidate-leombm`);

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
