import bcrypt from 'bcrypt';
import {prisma} from '@/lib/db';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    const {email, first_name, last_name, password, phone, position} = await req.json();
    console.log(email, first_name, last_name, password, phone, position);
    
    if (!first_name || !first_name || !email || !password || !phone) {
        return new NextResponse(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    if (password.length < 6) {
        return new NextResponse(JSON.stringify({ error: 'Password must be at least 6 characters long' }), { status: 400 });
    }

    const exist = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (exist) {
        return new NextResponse(JSON.stringify({ error: 'User already exists' }), { status: 400 });
    }
   
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            first_name,
            last_name,
            password: hashedPassword,
            current_position: position
        }
    });
    console.log(user);
    return new NextResponse(JSON.stringify({ user }), { status: 200 });

}