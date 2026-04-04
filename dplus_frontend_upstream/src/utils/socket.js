import io from 'socket.io-client';
import { baseUrl } from './url';

// const socket = io(baseUrl);

const socket = () => {
    io.connect(baseUrl, {
        transports: ['websocket', 'polling'],
    })
}
export default socket;