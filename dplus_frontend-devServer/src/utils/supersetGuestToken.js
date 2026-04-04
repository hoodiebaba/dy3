import axios from "axios";
import { supersetGuestTokenUrl } from "./url";

/**
 * POST guest-token payload to configured backend (not the main `Api` axios instance —
 * no Bearer; URL may be a different host than `VITE_API_BASE_URL`).
 */
export async function requestSupersetGuestToken(payload) {
    const { data } = await axios.post(supersetGuestTokenUrl, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 45000,
        withCredentials: false,
    });
    const token = data?.token ?? data?.guest_token;
    if (!token) {
        throw new Error("Guest token missing in response");
    }
    return token;
}
