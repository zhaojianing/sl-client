import axios from 'axios';
import qs from 'qs';
// 创建axios实例
const service = axios.create({
  timeout: 30000, // 请求超时时间
});

// 统一使用 resful 风格 统一beego架构设计
export function get(url: string, params = {}) {
//   params.t = new Date().getTime(); //get方法加一个时间参数,解决ie下可能缓存问题.
  return service({
    url,
    method: 'get',
    headers: {
    },
    params,
  });
}


// 封装post请求
export function post(url: string | undefined, data = {}) {
  // 默认配置
  const sendObject = {
    url,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(data),
  };
  return service(sendObject);
}

// 封装put方法
export function put(url: string | undefined, data = {}) {
  return service({
    url,
    method: 'put',
    headers: {
      // 'Content-Type': 'application/json;charset=UTF-8',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(data),
  });
}
// 删除方法
export function deletes(url: string | undefined) {
  return service({
    url,
    method: 'delete',
    headers: {},
  });
}

// export 实例
export {
  service,
};
