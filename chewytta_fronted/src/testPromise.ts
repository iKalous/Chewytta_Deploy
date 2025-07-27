// 测试Promise是否能被正确识别
const testPromise = (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Promise works!');
    }, 1000);
  });
};

async function testAsync() {
  const result = await testPromise();
  console.log(result);
}

testAsync();