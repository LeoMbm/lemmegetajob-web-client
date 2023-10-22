import axios from "axios";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  if (req.method === "POST") {
    // bearerToken without Bearer
    const bearerToken = req.headers.get("Authorization")?.split(" ")[1];
    const config = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };

    try {
      const session = await getServerSession({ req, ...authOptions });
      if (!session) {
        return new Response(JSON.stringify({ message: "Not Authorized" }), {
          status: 401,
        });
      }

      const user = session?.token;
      const email = user?.email.replace(/[^a-zA-Z0-9]/g, "");
      const room_name = "candidate-" + email;
      console.log(room_name);
      const response = await axios.post(
        `${process.env.BASE_API_URL}/rooms`,
        {},
        config
      );
      console.log(response);

      if (response.status === 200) {
        let rooms = await prisma.rooms.findFirst({
          where: {
            user: {
              id: user.sub,
            },
          },
        });
        if (!rooms) {
          console.log("No rooms found");
          rooms = await prisma.rooms.create({
            data: {
              name: room_name,
              user: {
                connect: {
                  id: user.sub,
                },
              },
            },
          });
        }

        const body = {
          rooms: rooms,
          data: response.data,
        };
        return new Response(JSON.stringify(body), {
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

export async function DELETE(req: NextRequest, res: NextResponse) {
  if (req.method === "DELETE") {
    const bearerToken = req.headers.get("Authorization")?.split(" ")[1];
    const config = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };

    try {
      const session = await getServerSession({ req, ...authOptions });
      if (!session) {
        return new Response(JSON.stringify({ message: "Not Authorized" }), {
          status: 401,
        });
      }
      const roomId = req.nextUrl.searchParams.get("roomId");
      if (!roomId) {
        return new Response(JSON.stringify({ message: "No roomId" }), {
          status: 400,
        });
      }
      const data = await prisma.rooms.findUnique({
        where: {
          id: roomId,
        },
      });
      if (!data) {
        return new Response(JSON.stringify({ message: "Room not found" }), {
          status: 404,
        });
      }
      const response = await axios.delete(
        `${process.env.BASE_API_URL}/rooms/${data.name}`,
        config
      );
      if (response.status === 200) {
        await prisma.rooms.delete({
          where: {
            id: roomId,
          },
        });
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

export async function GET(req: NextRequest, res: NextResponse) {
  if (req.method === "GET") {
    const bearerToken = req.headers.get("Authorization")?.split(" ")[1];
    const config = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };

    try {
      const session = await getServerSession({ req, ...authOptions });
      if (!session) {
        return new Response(JSON.stringify({ message: "Not Authorized" }), {
          status: 401,
        });
      }
      const roomId = req.nextUrl.searchParams.get("roomId");
      if (!roomId) {
        return new Response(JSON.stringify({ message: "No roomId" }), {
          status: 400,
        });
      }
      const data = await prisma.rooms.findUnique({
        where: {
          id: roomId,
        },
      });
      if (!data) {
        return new Response(JSON.stringify({ message: "Room not found" }), {
          status: 404,
        });
      }
      const response = await axios.get(
        `${process.env.BASE_API_URL}/rooms/${data.name}`,
        config
      );
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
