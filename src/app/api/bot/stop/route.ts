import axios from "axios";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(req: Request, res: Response) {
  if (req.method === "POST") {
    const bearerToken = req.headers.get("Authorization")?.split(" ")[1];
    const config = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };

    const { mode } = await req.json();
    if (!mode) {
      return new Response(
        JSON.stringify({ message: "Mode must be provided" }),
        {
          status: 400,
        }
      );
    }

    try {
      const session = await getServerSession({ req, ...authOptions });
      if (!session) {
        return new Response(JSON.stringify({ message: "Not Authorized" }), {
          status: 401,
        });
      }
      const response = await axios.post(
        `${process.env.BASE_API_URL}/delete-bot`,
        {
          mode,
        },
        config
      );
      // console.log(response);
      if (response.status === 200) {
        return new Response(JSON.stringify(response.data), {
          status: 200,
        });
      } else {
        return new Response(JSON.stringify(response.data), {
          status: response.status,
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({ message: error }), {
        status: 500,
      });
    }
  } else {
    return new Response(JSON.stringify({ message: "Not Allowed" }), {
      status: 405,
    });
  }
}
