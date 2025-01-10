import Axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_PATH
const service = Axios.create({
  baseURL,
  // 设置请求超时时间30s
  timeout: 30000,
});
service.defaults.headers["X-Requested-With"] = "XMLHttpRequest";
service.defaults.headers["Content-Type"] = "application/json;charset=UTF-8";
service.defaults.validateStatus = null;
export default service
