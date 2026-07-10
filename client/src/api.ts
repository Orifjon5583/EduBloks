import axios from 'axios';
import { useAuthStore } from './store/auth';
const api = axios.create({ baseURL: '/api/v1' });
api.interceptors.request.use(c => { const t = useAuthStore.getState().accessToken; if(t) c.headers.Authorization = `Bearer ${t}`; return c; });
api.interceptors.response.use(r=>r, async err => {
  if(err.response?.status===401 && !err.config._retry) {
    err.config._retry=true;
    const rt = useAuthStore.getState().refreshToken;
    if(rt) { try { const {data} = await axios.post('/api/v1/auth/refresh',{refreshToken:rt}); useAuthStore.getState().setAccessToken(data.accessToken); err.config.headers.Authorization=`Bearer ${data.accessToken}`; return api(err.config); } catch{} }
    useAuthStore.getState().logout();
  }
  return Promise.reject(err);
});
export default api;
