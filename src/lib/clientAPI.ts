import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import axios from 'axios';
import { getServerSession } from 'next-auth';

const session = async () => await getServerSession({...authOptions});
const authToken = session?.backendToken;


const clientAPI = axios.create({
    baseURL: process.env.BASE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
    },
});

export default clientAPI;