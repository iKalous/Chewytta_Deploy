/**
 * 显示提示信息
 * @param message 提示内容
 * @param type 提示类型，默认'info'
 * @param duration 持续时间，默认2000ms
 */
export const showToast = (
  message: string,
  type: 'info' | 'success' | 'error' | 'warning' = 'info',
  duration: number = 2000
): void => {
  // 创建toast元素
  const toast = document.createElement('div');
  toast.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md text-white z-50 transition-opacity duration-300 ${getToastClass(type)}`;
  toast.textContent = message;

  // 添加到文档
  document.body.appendChild(toast);

  // 显示toast
  setTimeout(() => {
    toast.style.opacity = '1';
  }, 10);

  // 自动关闭
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, duration);
};

/**
 * 获取toast样式类
 * @param type 提示类型
 * @returns 样式类名
 */
const getToastClass = (type: string): string => {
  switch (type) {
    case 'success':
      return 'bg-green-500';
    case 'error':
      return 'bg-red-500';
    case 'warning':
      return 'bg-yellow-500';
    default:
      return 'bg-blue-500';
  }
};
